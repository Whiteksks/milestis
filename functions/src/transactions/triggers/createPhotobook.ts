import { onCall, HttpsError } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";

import { db } from "../../lib/firebaseAdmin";
import { processTransaction, TransactionEngineError } from "../engine";

type CreatePhotobookInput = {
	projectId: string;
	projectTitle?: string;
	costCredits: number;
	idempotencyKey: string;
	// Optional fallback when project doc does not exist yet.
	layoutReady?: boolean;
};

export const createPhotobook = onCall(
	{
		concurrency: 50,
		timeoutSeconds: 60,
		maxInstances: 20,
	},
	async (request) => {
		if (!request.auth?.uid) {
			throw new HttpsError("unauthenticated", "AUTH_REQUIRED");
		}

		const uid = request.auth.uid;
		const data = (request.data ?? {}) as Partial<CreatePhotobookInput>;

		if (!data.projectId) {
			throw new HttpsError("invalid-argument", "projectId is required");
		}
		if (!data.idempotencyKey) {
			throw new HttpsError("invalid-argument", "idempotencyKey is required");
		}
		const cost = typeof data.costCredits === "number" ? data.costCredits : NaN;
		if (!Number.isFinite(cost) || cost <= 0) {
			throw new HttpsError("invalid-argument", "costCredits must be > 0");
		}

		// Layout readiness check (best-effort): look for a project doc and common fields.
		let isReady = data.layoutReady === true;
		try {
			const projectSnap = await db.collection("projects").doc(data.projectId).get();
			if (projectSnap.exists) {
				const p = projectSnap.data() as Record<string, unknown>;
				const readyFlag =
					typeof p?.layoutReady === "boolean"
						? p.layoutReady
						: typeof p?.isLayoutReady === "boolean"
							? p.isLayoutReady
							: undefined;
				if (typeof readyFlag === "boolean") isReady = readyFlag;
				if (typeof p?.status === "string") {
					isReady = p.status.toLowerCase() === "ready";
				}
			}
		} catch (err) {
			logger.warn("createPhotobook: project readiness check failed", { err });
		}

		if (!isReady) {
			throw new HttpsError("failed-precondition", "layout_not_ready");
		}

		try {
			const result = await processTransaction({
				uid,
				idempotencyKey: data.idempotencyKey,
				category: "credit",
				direction: "out",
				credit: {
					type: "spend",
					amount: cost,
					meta: {
						projectId: data.projectId,
						projectTitle: data.projectTitle,
						itemType: "photobook",
						reason: "create_photobook",
					},
				},
			});

			return {
				ok: true,
				tid: result.tid,
				balance: result.balanceSnapshot,
			};
		} catch (err) {
			if (err instanceof TransactionEngineError && err.code === "insufficient_funds") {
				throw new HttpsError("failed-precondition", "insufficient_funds");
			}
			logger.error("createPhotobook failed", { err, uid });
			throw new HttpsError("internal", "INTERNAL_ERROR");
		}
	},
);
