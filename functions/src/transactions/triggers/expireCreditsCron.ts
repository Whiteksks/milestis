import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions/v2";
import { db } from "../../lib/firebaseAdmin";
import { expireCreditLot } from "../engine";

const PAGE_SIZE = 200;

export const expireCreditsCron = onSchedule(
	{ schedule: "every 60 minutes", timeZone: "UTC", timeoutSeconds: 540, retryCount: 0 },
	async () => {
		const nowMillis = Date.now();
		const deadline = nowMillis + 480_000;
		const query = db.collectionGroup("creditLots")
			.where("expiresAtMillis", "<=", nowMillis)
			.where("remainingAmount", ">", 0)
			.orderBy("expiresAtMillis", "asc")
			.orderBy("remainingAmount", "asc")
			.limit(PAGE_SIZE);
		let cursor: FirebaseFirestore.QueryDocumentSnapshot | undefined;
		let processed = 0;
		let skipped = 0;
		let failed = 0;
		let scanned = 0;
		let complete = false;

		while (Date.now() < deadline) {
			const page = await (cursor ? query.startAfter(cursor) : query).get();
			for (const document of page.docs) {
				if (Date.now() >= deadline) break;
				scanned++;
				const parts = document.ref.path.split("/");
				if (parts.length !== 4 || parts[0] !== "users" || parts[2] !== "creditLots") {
					failed++;
					logger.error("expireCreditsCron: invalid lot path", { lot: document.ref.path });
					continue;
				}
				try {
					const result = await expireCreditLot(parts[1], parts[3]);
					if (result && !result.idempotent) processed++;
					else skipped++;
				} catch (error) {
					failed++;
					logger.error("expireCreditsCron: failed to expire", { lot: document.ref.path, error });
				}
			}
			if (Date.now() >= deadline) break;
			if (page.size < PAGE_SIZE) { complete = true; break; }
			// Advance even after individual failures, so one broken account cannot block the page.
			cursor = page.docs[page.docs.length - 1];
		}
		logger.info("expireCreditsCron done", { processed, skipped, failed, scanned, complete });
		if (!complete) logger.warn("expireCreditsCron: time budget reached; remaining lots will be retried next run");
	},
);
