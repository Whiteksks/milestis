import { createHash } from "crypto";
import { FieldValue, type Firestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions/v2";
import type { PublishInput } from "./types";
import type { ProjectMode } from "../projectInterface";

// ─── Errors ───────────────────────────────────────────────────────────────────

export class PublishValidationError extends Error {
	constructor(
		public readonly code: "INVALID_SLUG" | "SLUG_TAKEN" | "MISSING_ACCESS_TOKEN",
		message: string,
	) {
		super(message);
	}
}

const SLUG_REGEX = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;

export interface PreparedPublishInput {
	slug: string;
	accessToken?: string;
	hashedToken?: string;
}

export async function preparePublishInput(
	db: Firestore,
	projectId: string,
	mode: ProjectMode,
	input: Pick<PublishInput, "slug" | "accessToken">,
): Promise<PreparedPublishInput> {
	const { slug, accessToken } = input;

	if (!slug || slug.length < 3 || slug.length > 63 || !SLUG_REGEX.test(slug)) {
		throw new PublishValidationError(
			"INVALID_SLUG",
			"slug must be 3–63 lowercase alphanumeric characters or hyphens.",
		);
	}

	const existing = await db
		.collection("published_projects")
		.where("slug", "==", slug)
		.where("mode", "==", mode)
		.limit(2)
		.get();
	const takenByOther = existing.docs.some((doc) => doc.id !== projectId);
	if (takenByOther) {
		throw new PublishValidationError("SLUG_TAKEN", "This slug is already taken.");
	}

	let hashedToken: string | undefined;
	if (mode === "photobook") {
		if (!accessToken) {
			throw new PublishValidationError(
				"MISSING_ACCESS_TOKEN",
				"accessToken is required for photobook projects.",
			);
		}
		hashedToken = createHash("sha256").update(accessToken).digest("hex");
	}

	return {
		slug,
		...(accessToken ? { accessToken } : {}),
		...(hashedToken ? { hashedToken } : {}),
	};
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Validates the publish payload, writes the published_projects document, and
 * updates the project document (isPublished, slug, token).
 *
 * The content snapshot MUST already use public Storage URLs (post-migration).
 *
 * Throws PublishValidationError for business-logic failures (invalid slug,
 * slug taken, missing token). Other errors propagate as-is.
 */
export async function applyPublish(
	db: Firestore,
	projectId: string,
	uid: string,
	mode: ProjectMode,
	prepared: PreparedPublishInput,
	contentSnapshot: {
		theme: Record<string, unknown> | null;
		content: Record<string, unknown> | null;
	},
	projectName: string,
): Promise<void> {
	const { slug, accessToken, hashedToken } = prepared;

	const batch = db.batch();

	const publishedData: Record<string, unknown> = {
		ownerId: uid,
		slug,
		name: projectName,
		mode,
		isPublished: true,
		theme: contentSnapshot.theme,
		content: contentSnapshot.content,
		publishedAt: FieldValue.serverTimestamp(),
	};
	if (hashedToken) publishedData.accessToken = hashedToken;
	batch.set(db.collection("published_projects").doc(projectId), publishedData);

	const projectUpdate: Record<string, unknown> = {
		isPublished: true,
		publishedSlug: slug,
		updatedAt: FieldValue.serverTimestamp(),
	};
	// Store the plaintext token so the dashboard can reconstruct the share URL.
	// The projects collection is owner-restricted; this does not expose the token publicly.
	if (accessToken) projectUpdate.publishedAccessToken = accessToken;
	batch.update(db.collection("projects").doc(projectId), projectUpdate);

	await batch.commit();
	logger.info(`[publish] Project ${projectId} published with slug "${slug}".`);
}
