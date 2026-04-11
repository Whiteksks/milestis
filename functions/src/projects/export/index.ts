import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";
import { randomBytes } from "crypto";

import { db } from "../../lib/firebaseAdmin";
import { processTransaction, TransactionEngineError } from "../../transactions/engine";
import { migrateProjectMedia, deletePrivateProjectMedia } from "./migrate";
import { renderExport } from "./renderer";
import { applyPublish, writeGhostEntry, PublishValidationError } from "./publish";
import { type ExportInput, type ExportOutput } from "./types";
import { getModeConfig } from "./mode-config";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SLUG_REGEX = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;

const ERROR = {
	METHOD_NOT_ALLOWED: "METHOD_NOT_ALLOWED",
	UNAUTHORIZED: "UNAUTHORIZED",
	INVALID_OR_EXPIRED_TOKEN: "INVALID_OR_EXPIRED_TOKEN",
	INVALID_PAYLOAD: "INVALID_PAYLOAD",
	NOT_FOUND: "NOT_FOUND",
	FORBIDDEN: "FORBIDDEN",
	PROJECT_NOT_ACTIVE: "PROJECT_NOT_ACTIVE",
	NO_CONTENT: "NO_CONTENT",
	INSUFFICIENT_CREDITS: "INSUFFICIENT_CREDITS",
	INVALID_SLUG: "INVALID_SLUG",
	SLUG_TAKEN: "SLUG_TAKEN",
	PUBLISH_VALIDATION: "PUBLISH_VALIDATION",
	INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
} as const;

function makeDownloadUrl(bucketName: string, filePath: string, token: string): string {
	const encoded = filePath.split("/").map(encodeURIComponent).join("%2F");
	return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encoded}?alt=media&token=${token}`;
}

async function uploadRenderedFile(
	filePath: string,
	buffer: Buffer,
	mimeType: string,
	downloadName: string,
): Promise<string> {
	const bucket = getStorage().bucket();
	const file = bucket.file(filePath);
	await file.save(buffer, {
		metadata: {
			contentType: mimeType,
			contentDisposition: `attachment; filename="${downloadName}"`,
		},
	});
	const token = randomBytes(16).toString("hex");
	await file.setMetadata({ metadata: { firebaseStorageDownloadTokens: token } });
	return makeDownloadUrl(bucket.name, filePath, token);
}

// ─── Cloud Function ───────────────────────────────────────────────────────────

/**
 * Exports a project and optionally publishes it in one atomic operation.
 *
 * Flow:
 *  1.  Auth + payload validation
 *  2.  Load project (ownership + status check)
 *  3.  Load editor content
 *  4.  Balance check (>= EXPORT_COST_CREDITS)
 *  5.  Migrate media: users/{uid}/projects/{id}/* → public/{id}/*
 *  6.  Update Firestore images collection with new public URLs
 *  7.  Update content doc with new public URLs  (editor keeps working)
 *  8.  Render export file via renderer (PDF stub / ZIP stub)
 *  9.  Upload rendered file to public/{id}/exports/{exportId}.{ext}
 *  10. (Optional) Publish: write published_projects doc + set isPublished
 *  11. Delete original private files (frees user quota)
 *  12. Write export record + update project document
 *  13. Deduct credits via processTransaction
 *
 * POST /exportProject
 * Body: ExportInput
 * Auth: Bearer <idToken>
 */
export const exportProject = onRequest(
	{
		concurrency: 3,
		timeoutSeconds: 540, // 9 min — rendering large photobooks takes time
		memory: "1GiB",
		maxInstances: 5,
		cors: [/localhost/, /milestis\.com$/, /milestis\.app$/, /milestis\.site$/, /\.hosted\.app$/],
	},
	async (req, res) => {
		// ── 1. Method guard ─────────────────────────────────────────────────
		if (req.method !== "POST") {
			res.status(405).json({ error: ERROR.METHOD_NOT_ALLOWED });
			return;
		}

		// ── Auth ────────────────────────────────────────────────────────────
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

		// ── Payload ─────────────────────────────────────────────────────────
		const body = req.body as Partial<ExportInput>;
		const { projectId, publish } = body;

		if (typeof projectId !== "string" || !projectId.trim()) {
			res.status(400).json({ error: ERROR.INVALID_PAYLOAD, message: "projectId is required." });
			return;
		}

		if (publish !== undefined) {
			if (
				typeof publish.slug !== "string" ||
				publish.slug.length < 3 ||
				publish.slug.length > 63 ||
				!SLUG_REGEX.test(publish.slug)
			) {
				res.status(400).json({ error: ERROR.INVALID_SLUG, message: "Invalid slug format." });
				return;
			}
		}

		// ── 2. Load project ──────────────────────────────────────────────────
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
		if (projectData.status !== "active" && projectData.status !== "archived") {
			res.status(400).json({
				error: ERROR.PROJECT_NOT_ACTIVE,
				message: "Only active or archived projects can be exported.",
			});
			return;
		}

		// ── Mode config ────────────────────────────────────────────────
		const modeConfig = getModeConfig(projectData.mode);

		// Validate that publish payload is present when required by this mode.
		if (modeConfig.requiresPublish && !publish) {
			res.status(400).json({
				error: ERROR.INVALID_PAYLOAD,
				message: `${modeConfig.label} projects must include a publish payload.`,
			});
			return;
		}

		// ── 3. Load content ──────────────────────────────────────────────────
		const contentRef = projectRef.collection("data").doc("content");
		const contentSnap = await contentRef.get();

		if (!contentSnap.exists) {
			res.status(400).json({
				error: ERROR.NO_CONTENT,
				message: "Save the project at least once before exporting.",
			});
			return;
		}
		const editorData = contentSnap.data()!;

		// ── 4. Balance check ─────────────────────────────────────────────────
		const userRef = db.collection("users").doc(uid);
		const userSnap = await userRef.get();

		if (!userSnap.exists) {
			res.status(404).json({ error: ERROR.NOT_FOUND, message: "User not found." });
			return;
		}
		const _userData = userSnap.data() as Record<string, Record<string, unknown>> | undefined;
		const totalBalance: number = typeof _userData?.balance?.total === "number" ? _userData.balance.total : 0;
		if (totalBalance < modeConfig.creditCost) {
			res.status(402).json({
				error: ERROR.INSUFFICIENT_CREDITS,
				required: modeConfig.creditCost,
				available: totalBalance,
			});
			return;
		}

		// ── Version / export ID ──────────────────────────────────────────────
		const prevVersion: number =
			typeof projectData.exportVersion === "number" ? projectData.exportVersion : 0;
		const newVersionNumber = prevVersion + 1;
		// Use a Firestore auto-ID (no document created, ID is random and unique).
		const exportId = db.collection("_").doc().id;

		// Capture the previous export so we can delete it once the new one succeeds.
		const previousExportId: string | undefined =
			typeof projectData.lastExportId === "string" ? projectData.lastExportId : undefined;

		try {
			const rawJson = JSON.stringify(editorData);

			// ── 5. Migrate media: private → public ───────────────────────────
			const { urlMapping, freedBytes } = await migrateProjectMedia(uid, projectId, rawJson);

			let migratedJson = rawJson;
			for (const [oldUrl, newUrl] of urlMapping) {
				migratedJson = migratedJson.split(oldUrl).join(newUrl);
			}
			const migratedData = JSON.parse(migratedJson) as typeof editorData;

			// ── 6. Update images collection with new public URLs ─────────────
			const imagesSnap = await db
				.collection("images")
				.where("projectId", "==", projectId)
				.where("ownerId", "==", uid)
				.get();

			if (!imagesSnap.empty) {
				const imgBatch = db.batch();
				for (const imgDoc of imagesSnap.docs) {
					const imgData = imgDoc.data();
					if (imgData.urls && typeof imgData.urls === "object") {
						const newUrls: Record<string, string> = {};
						for (const [variant, url] of Object.entries(
							imgData.urls as Record<string, string>,
						)) {
							newUrls[variant] = urlMapping.get(url) ?? url;
						}
						imgBatch.update(imgDoc.ref, { urls: newUrls });
					}
				}
				await imgBatch.commit();
			}

			// ── 7. Persist new URLs in the content doc ───────────────────────
			await contentRef.update(migratedData);

			// ── 8 & 9. Render + upload ───────────────────────────────────────
			// Only modes with rendersFile: true produce a downloadable file.
			let fileDownloadUrl: string | undefined;
			let renderedFilePath: string | undefined;

			if (modeConfig.rendersFile) {
				const renderOutput = (await renderExport(projectData.mode, {
					projectId,
					projectName: projectData.name,
					mode: projectData.mode,
					content: migratedData.content ?? null,
					theme: migratedData.theme ?? null,
				}))!;

				const safeProjectName = (projectData.name ?? "project")
					.replace(/[^\w\s-]/g, "")
					.trim()
					.replace(/\s+/g, "-") || "project";
				renderedFilePath = `public/${projectId}/exports/${exportId}.${renderOutput.extension}`;
				fileDownloadUrl = await uploadRenderedFile(
					renderedFilePath,
					renderOutput.buffer,
					renderOutput.mimeType,
					`${safeProjectName}.${renderOutput.extension}`,
				);
			}

			const contentSnapshot = {
				theme: migratedData.theme ?? null,
				content: migratedData.content ?? null,
			};

			// ── 10. Publish or Ghost Mode ────────────────────────────────────
			// Always create/update the published_projects document. When the user
			// requests a full publish the doc gets isPublished=true + slug. Otherwise
			// it is written in Ghost Mode (isPublished=false, no slug) so the user can
			// publish later without re-exporting.
			if (publish) {
				try {
					await applyPublish(
						db,
						projectId,
						uid,
						projectData.mode,
						publish,
						contentSnapshot,
						projectData.name,
					);
				} catch (err) {
					if (err instanceof PublishValidationError) {
						res.status(409).json({
							error:
								err.code === "SLUG_TAKEN" ? ERROR.SLUG_TAKEN : ERROR.PUBLISH_VALIDATION,
							message: err.message,
						});
						return;
					}
					throw err;
				}
			} else {
				await writeGhostEntry(
					db,
					projectId,
					uid,
					projectData.mode,
					projectData.name,
					contentSnapshot,
				);
			}

			// ── 11. Delete private originals (free quota) ────────────────────
			await deletePrivateProjectMedia(uid, projectId);

			// ── 12. Write export record + update project ─────────────────────
			const exportRef = projectRef.collection("exports").doc(exportId);
			const writeBatch = db.batch();

			// Migrate preview.heroImageUrl to public URL if it was a private file.
			const oldPreviewUrl: string | undefined = projectData.preview?.heroImageUrl;
			const newPreviewUrl = oldPreviewUrl ? (urlMapping.get(oldPreviewUrl) ?? oldPreviewUrl) : undefined;

			writeBatch.set(exportRef, {
				exportId,
				ownerId: uid,
				projectId,
				projectName: projectData.name,
				versionNumber: newVersionNumber,
				mode: projectData.mode,
				creditCost: modeConfig.creditCost,
				...(renderedFilePath ? { filePath: renderedFilePath } : {}),
				...(fileDownloadUrl ? { fileDownloadUrl } : {}),
				...(fileDownloadUrl ? { mimeType: "application/pdf" } : {}),
				...(publish ? { publishedSlug: publish.slug } : {}),
				createdAt: FieldValue.serverTimestamp(),
			});

			const projectDocUpdate: Record<string, unknown> = {
				status: "archived",
				// setsIsExported drives the two-step "exported but not yet published" UI.
				...(modeConfig.setsIsExported ? { isExported: true } : {}),
				lastExportId: exportId,
				exportVersion: newVersionNumber,
				lastExportAt: FieldValue.serverTimestamp(),
				updatedAt: FieldValue.serverTimestamp(),
			};
			// Update the dashboard thumbnail to point to the new public URL.
			if (newPreviewUrl && newPreviewUrl !== oldPreviewUrl) {
				projectDocUpdate["preview.heroImageUrl"] = newPreviewUrl;
			}
			writeBatch.update(projectRef, projectDocUpdate);

			if (freedBytes > 0) {
				writeBatch.update(userRef, {
					"stats.storageUsedBytes": FieldValue.increment(-freedBytes),
				});
			}

			await writeBatch.commit();

			// ── 12b. Remove the previous export (keep only latest per project) ──
			// Done after commit so the new record is safe before we touch anything.
			if (previousExportId) {
				try {
					const prevExportRef = projectRef.collection("exports").doc(previousExportId);
					const prevExportSnap = await prevExportRef.get();
					if (prevExportSnap.exists) {
						const prevFilePath: string | undefined = prevExportSnap.data()?.filePath;
						await prevExportRef.delete();
						if (prevFilePath) {
							await getStorage()
								.bucket()
								.file(prevFilePath)
								.delete()
								.catch((err) =>
									logger.warn(
										`[exportProject] Could not delete previous rendered file ${prevFilePath}`,
										err,
									),
								);
						}
					}
				} catch (err) {
					// Non-fatal: the old record and file just stays around.
					logger.warn(
						`[exportProject] Failed to clean up previous export ${previousExportId}`,
						err,
					);
				}
			}

			// ── 13. Deduct credits ───────────────────────────────────────────
			// Done last so the export is never rolled back due to a billing failure.
			// In the unlikely event of a balance race condition, we log for manual review.
			let finalBalance = { total: 0, purchased: 0, subscription: 0, bonus: 0 };
			try {
				const txResult = await processTransaction({
					uid,
					idempotencyKey: `export:${projectId}:${exportId}`,
					category: "credit",
					direction: "out",
					credit: {
						type: "spend",
						amount: modeConfig.creditCost,
						meta: {
							projectId,
							projectName: projectData.name,
							exportId,
							versionNumber: newVersionNumber,
							reason: "project_export",
						},
					},
				});
				finalBalance = txResult.balanceSnapshot;
			} catch (txErr) {
				logger.error(
					`[exportProject] Credit deduction failed for ${projectId}/${exportId}. Manual review needed.`,
					txErr,
				);
			}

			logger.info(
				`[exportProject] Project ${projectId} exported by ${uid}. v${newVersionNumber}, credits: ${modeConfig.creditCost}`,
			);

			const output: ExportOutput = {
				ok: true,
				exportId,
				versionNumber: newVersionNumber,
				...(fileDownloadUrl ? { fileDownloadUrl } : {}),
				...(publish ? { publishedSlug: publish.slug } : {}),
				balance: finalBalance,
			};
			res.status(200).json(output);
		} catch (err) {
			if (err instanceof TransactionEngineError && err.code === "insufficient_funds") {
				res.status(402).json({ error: ERROR.INSUFFICIENT_CREDITS });
				return;
			}
			logger.error(`[exportProject] Unhandled error for project ${projectId}:`, err);
			res.status(500).json({ error: ERROR.INTERNAL_SERVER_ERROR });
		}
	},
);
