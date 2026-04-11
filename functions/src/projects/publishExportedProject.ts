import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { getAuth } from "firebase-admin/auth";
import { db } from "../lib/firebaseAdmin";
import { applyPublish, PublishValidationError } from "./export/publish";
import type { ExportPublishInput } from "./export/types";

/**
 * Publishes an already-exported project without re-exporting.
 *
 * Requirements:
 *   - The project must have isExported: true (export must have run at least once)
 *   - The published_projects document (ghost entry) must already exist
 *   - The project must not already be published (isPublished !== true)
 *
 * The content snapshot in published_projects (written during export) already
 * contains public Storage URLs, so no migration is needed here.
 *
 * POST /publishExportedProject
 * Body: { projectId: string; slug: string; accessToken?: string }
 * Auth: Bearer <idToken>
 */

const ERROR = {
	METHOD_NOT_ALLOWED:       "METHOD_NOT_ALLOWED",
	UNAUTHORIZED:             "UNAUTHORIZED",
	INVALID_OR_EXPIRED_TOKEN: "INVALID_OR_EXPIRED_TOKEN",
	INVALID_PAYLOAD:          "INVALID_PAYLOAD",
	NOT_FOUND:                "NOT_FOUND",
	FORBIDDEN:                "FORBIDDEN",
	NOT_EXPORTED:             "NOT_EXPORTED",
	ALREADY_PUBLISHED:        "ALREADY_PUBLISHED",
	INVALID_SLUG:             "INVALID_SLUG",
	SLUG_TAKEN:               "SLUG_TAKEN",
	PUBLISH_VALIDATION:       "PUBLISH_VALIDATION",
	INTERNAL_SERVER_ERROR:    "INTERNAL_SERVER_ERROR",
} as const;

export const publishExportedProject = onRequest(
	{
		concurrency: 20,
		timeoutSeconds: 60,
		maxInstances: 10,
		cors: [/localhost/, /milestis\.com$/, /milestis\.app$/, /milestis\.site$/, /\.hosted\.app$/],
	},
	async (req, res) => {
		// ── Method guard ──────────────────────────────────────────────────
		if (req.method !== "POST") {
			res.status(405).json({ error: ERROR.METHOD_NOT_ALLOWED });
			return;
		}

		// ── Auth ──────────────────────────────────────────────────────────
		const authHeader = req.headers.authorization;
		if (!authHeader?.startsWith("Bearer ")) {
			res.status(401).json({ error: ERROR.UNAUTHORIZED });
			return;
		}
		let uid: string;
		try {
			const decoded = await getAuth().verifyIdToken(authHeader.split("Bearer ")[1]);
			uid = decoded.uid;
		} catch {
			res.status(401).json({ error: ERROR.INVALID_OR_EXPIRED_TOKEN });
			return;
		}

		// ── Payload ───────────────────────────────────────────────────────
		const { projectId, slug, accessToken } = req.body as Record<string, unknown>;
		if (typeof projectId !== "string" || !projectId.trim()) {
			res.status(400).json({ error: ERROR.INVALID_PAYLOAD, message: "projectId is required." });
			return;
		}
		if (typeof slug !== "string" || !slug.trim()) {
			res.status(400).json({ error: ERROR.INVALID_PAYLOAD, message: "slug is required." });
			return;
		}

		// ── Load project ──────────────────────────────────────────────────
		const projectRef = db.collection("projects").doc(projectId);
		const projectSnap = await projectRef.get();

		if (!projectSnap.exists) {
			res.status(404).json({ error: ERROR.NOT_FOUND });
			return;
		}
		const projectData = projectSnap.data()!;

		if (projectData.ownerId !== uid) {
			res.status(403).json({ error: ERROR.FORBIDDEN });
			return;
		}

		// ── Guards ────────────────────────────────────────────────────────
		if (projectData.status !== "archived") {
			res.status(400).json({
				error: ERROR.NOT_EXPORTED,
				message: "Export the project before publishing.",
			});
			return;
		}
		// Portfolio uses the single-step exportProject flow (export + publish atomically).
		// This endpoint is exclusively for the two-step photobook flow.
		if (projectData.mode === "portfolio") {
			res.status(400).json({
				error: ERROR.INVALID_PAYLOAD,
				message: "Portfolio projects cannot be published via this endpoint. Use exportProject with a publish payload.",
			});
			return;
		}
		if (projectData.isPublished) {
			res.status(409).json({
				error: ERROR.ALREADY_PUBLISHED,
				message: "Project is already published. Unpublish first to change the slug.",
			});
			return;
		}

		// ── Load ghost content snapshot ───────────────────────────────────
		const ghostSnap = await db.collection("published_projects").doc(projectId).get();
		if (!ghostSnap.exists) {
			res.status(404).json({
				error: ERROR.NOT_FOUND,
				message: "No export snapshot found. Please re-export the project.",
			});
			return;
		}
		const ghostData = ghostSnap.data()!;
		const contentSnapshot = {
			theme: ghostData.theme ?? null,
			content: ghostData.content ?? null,
		};

		// ── Publish ───────────────────────────────────────────────────────
		const publishInput: ExportPublishInput = {
			slug: slug.trim().toLowerCase(),
			...(typeof accessToken === "string" ? { accessToken } : {}),
		};

		try {
			await applyPublish(
				db,
				projectId,
				uid,
				projectData.mode,
				publishInput,
				contentSnapshot,
				projectData.name,
			);
		} catch (err) {
			if (err instanceof PublishValidationError) {
				res.status(409).json({
					error: err.code === "SLUG_TAKEN" ? ERROR.SLUG_TAKEN : ERROR.PUBLISH_VALIDATION,
					message: err.message,
				});
				return;
			}
			throw err;
		}

		logger.info(`[publishExportedProject] Project ${projectId} published as "${slug}" by ${uid}.`);
		res.status(200).json({ ok: true, publishedSlug: publishInput.slug });
	},
);
