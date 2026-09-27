import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions/v2";
import { db } from "../../../lib/firebaseAdmin";
import { renewMenuBillingPeriod } from "./service";

export const renewMenuBillingCron = onSchedule(
  { schedule: "every 60 minutes", timeZone: "UTC", timeoutSeconds: 540, retryCount: 0 },
  async () => {
    const now = Date.now();
    const deadline = now + 480_000;
    const query = db.collection("projects")
      .where("menuBilling.autoRenew", "==", true)
      .where("menuBilling.nextAttemptAtMillis", "<=", now)
      .orderBy("menuBilling.nextAttemptAtMillis", "asc").limit(100);
    let cursor: FirebaseFirestore.QueryDocumentSnapshot | undefined;
    const counts = { renewed: 0, past_due: 0, suspended: 0, skipped: 0, failed: 0 };
    let complete = false;
    while (Date.now() < deadline) {
      const page = await (cursor ? query.startAfter(cursor) : query).get();
      for (const project of page.docs) {
        if (Date.now() >= deadline) break;
        try { counts[await renewMenuBillingPeriod(project.id)]++; }
        catch (error) { counts.failed++; logger.error("[renewMenuBilling] Renewal failed", { projectId: project.id, error }); }
      }
      if (Date.now() >= deadline) break;
      if (page.size < 100) { complete = true; break; }
      cursor = page.docs[page.docs.length - 1];
    }
    logger.info("[renewMenuBilling] Complete", { ...counts, complete });
  },
);
