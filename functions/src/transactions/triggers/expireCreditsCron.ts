import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions/v2";

import { db } from "../../lib/firebaseAdmin";
import { processTransaction, TransactionEngineError } from "../engine";

type CreditLotDoc = {
	bucket: "purchased" | "subscription" | "bonus";
	remainingAmount: number;
	expiresAtMillis: number;
};

export const expireCreditsCron = onSchedule(
	{
		schedule: "every day 03:10",
		timeZone: "UTC",
		timeoutSeconds: 540,
		retryCount: 0,
	},
	async () => {
		const nowMillis = Date.now();

		const q = db
			.collectionGroup("creditLots")
			.where("expiresAtMillis", "<=", nowMillis)
			.orderBy("expiresAtMillis", "asc")
			.limit(500);

		const snap = await q.get();
		let processed = 0;
		let skipped = 0;

		for (const doc of snap.docs) {
			const data = doc.data() as Partial<CreditLotDoc>;
			const remaining = typeof data.remainingAmount === "number" ? data.remainingAmount : 0;
			const bucket = data.bucket;
			if (!bucket || remaining <= 0) {
				skipped++;
				continue;
			}

			const userDoc = doc.ref.parent.parent;
			if (!userDoc) {
				skipped++;
				continue;
			}

			const uid = userDoc.id;
			const idem = `expire:${uid}:${doc.id}`;

			try {
				await processTransaction({
					uid,
					idempotencyKey: idem,
					category: "credit",
					direction: "out",
					termsVersion: 1,
					clientIpCountry: "system",
					isManual: false,
					credit: {
						type: "expire",
						amount: remaining,
						expireLotPath: doc.ref.path,
						metadata: {
							reason: "credits_expired",
						},
					},
				});
				processed++;
			} catch (err) {
				if (err instanceof TransactionEngineError && err.code === "insufficient_funds") {
					// Balance snapshot might have drifted; just skip and continue.
					logger.warn("expireCreditsCron: insufficient funds while expiring", {
						uid,
						lot: doc.ref.path,
					});
					skipped++;
					continue;
				}
				logger.error("expireCreditsCron: failed to expire", {
					uid,
					lot: doc.ref.path,
					err,
				});
				skipped++;
			}
		}

		logger.info("expireCreditsCron done", { processed, skipped, scanned: snap.size });
	},
);
