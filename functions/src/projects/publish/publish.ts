import { createHash } from "crypto";
import { FieldValue, type Firestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions/v2";
import { processTransactionInFirestoreTransaction } from "../../transactions/engine";
import type { BalanceSnapshot } from "../../transactions/types";
import type { CommitPublishInput, PreparedPublishInput } from "./types";
import type { PublishInput } from "./types";
import type { ProjectMode } from "../projectInterface";
import {
	getSlugReservationDocId,
	getSlugValidationError,
	normalizeSlug,
	PUBLISHED_PROJECT_SLUGS_COLLECTION,
} from "./slug/index";

// ─── Errors ───────────────────────────────────────────────────────────────────

export class PublishValidationError extends Error {
	constructor(
		public readonly code: "INVALID_SLUG" | "SLUG_TAKEN" | "MISSING_ACCESS_TOKEN" | "FORBIDDEN" | "NOT_PUBLISHABLE",
		message: string,
	) {
		super(message);
	}
}
export function preparePublishInput(
	input: Pick<PublishInput, "slug" | "accessToken">,
): PreparedPublishInput {
	const { slug, accessToken } = input;
	const normalizedSlug = normalizeSlug(slug);

	const slugValidationError = getSlugValidationError(normalizedSlug);
	if (slugValidationError) {
		throw new PublishValidationError(
			"INVALID_SLUG",
			slugValidationError,
		);
	}

	let hashedToken: string | undefined;
	if (accessToken) {
		hashedToken = createHash("sha256").update(accessToken).digest("hex");
	}

	return {
		slug: normalizedSlug,
		...(accessToken ? { accessToken } : {}),
		...(hashedToken ? { hashedToken } : {}),
	};
}

function ensurePublishableProject(project: Record<string, unknown>, uid: string): void {
	if (project.ownerId !== uid) {
		throw new PublishValidationError("FORBIDDEN", "You do not own this project.");
	}
	if (project.status !== "active" || project.isPublished === true) {
		throw new PublishValidationError("NOT_PUBLISHABLE", "Project is not publishable.");
	}
}

function ensureAccessToken(mode: ProjectMode, accessToken?: string): void {
	if (mode === "photobook" && !accessToken) {
		throw new PublishValidationError(
			"MISSING_ACCESS_TOKEN",
			"accessToken is required for photobook projects.",
		);
	}
}

export async function commitPublish(
	db: Firestore,
	input: CommitPublishInput,
): Promise<{ balanceSnapshot: BalanceSnapshot; publishedSlug: string; transactionId: string }> {
	const { projectId, uid, mode, projectName, prepared, contentSnapshot, creditCost, freedBytes, previewHeroUrl } = input;

	return await db.runTransaction(async (tx) => {
		const projectRef = db.collection("projects").doc(projectId);
		const publishedRef = db.collection("published_projects").doc(projectId);
		const slugRef = db.collection(PUBLISHED_PROJECT_SLUGS_COLLECTION).doc(
			getSlugReservationDocId(mode, prepared.slug, prepared.hashedToken),
		);
		const exportRef = projectRef.collection("exports").doc();

		const [projectSnap, slugSnap] = await Promise.all([tx.get(projectRef), tx.get(slugRef)]);
		if (!projectSnap.exists) {
			throw new PublishValidationError("NOT_PUBLISHABLE", "Project not found.");
		}
		const projectData = projectSnap.data() as Record<string, unknown>;
		ensurePublishableProject(projectData, uid);
		ensureAccessToken(mode, prepared.accessToken);

		if (slugSnap.exists) {
			const slugData = slugSnap.data() as Record<string, unknown>;
			if (slugData.projectId !== projectId) {
				throw new PublishValidationError("SLUG_TAKEN", "This slug is already taken.");
			}
		}

		const publishVersion = typeof projectData.publishVersion === "number" ? projectData.publishVersion : 0;

		const debit = await processTransactionInFirestoreTransaction(tx, {
			uid,
			idempotencyKey: `publish:${projectId}:v${publishVersion + 1}`,
			category: "credit",
			direction: "out",
			credit: {
				type: "spend",
				amount: creditCost,
				meta: { projectId, mode, slug: prepared.slug },
			},
		});

		const publishedData: Record<string, unknown> = {
			ownerId: uid,
			slug: prepared.slug,
			name: projectName,
			mode,
			isPublished: true,
			theme: contentSnapshot.theme,
			content: contentSnapshot.content,
			publishedAt: FieldValue.serverTimestamp(),
		};
		if (prepared.hashedToken) publishedData.accessToken = prepared.hashedToken;

		tx.set(slugRef, {
			projectId,
			ownerId: uid,
			mode,
			slug: prepared.slug,
			updatedAt: FieldValue.serverTimestamp(),
		});
		tx.set(publishedRef, publishedData);
		tx.update(projectRef, {
			isPublished: true,
			publishedSlug: prepared.slug,
			...(prepared.accessToken ? { publishedAccessToken: prepared.accessToken } : {}),
			status: "archived",
			publishedAt: FieldValue.serverTimestamp(),
			publishLockId: FieldValue.delete(),
			publishLockExpiresAtMillis: FieldValue.delete(),
			publishTransactionId: debit.tid,
			publishVersion: FieldValue.increment(1),
			...(previewHeroUrl ? { "preview.heroImageUrl": previewHeroUrl } : {}),
			updatedAt: FieldValue.serverTimestamp(),
		});
		tx.update(db.collection("users").doc(uid), {
			"stats.projectsPublished": FieldValue.increment(1),
			...(freedBytes > 0 ? { "stats.storageUsedBytes": FieldValue.increment(-freedBytes) } : {}),
		});
		tx.set(exportRef, {
			exportId: exportRef.id,
			projectId,
			projectName,
			ownerId: uid,
			versionNumber: 1,
			mode,
			creditCost,
			publishedSlug: prepared.slug,
			createdAt: FieldValue.serverTimestamp(),
		});

		return {
			balanceSnapshot: debit.balanceSnapshot,
			publishedSlug: prepared.slug,
			transactionId: debit.tid,
		};
	});
}

export function logPublishedProject(projectId: string, slug: string): void {
	logger.info(`[publish] Project ${projectId} published with slug "${slug}".`);
}
