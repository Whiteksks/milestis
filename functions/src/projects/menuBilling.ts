import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { getAuth } from "firebase-admin/auth";
import { ALLOWED_ORIGINS } from "../lib/cors";
import { TransactionEngineError } from "../transactions/engine";
import { MenuBillingError, getMenuPlan } from "./menu/billing/model";
import { menuBillingStatus, reviewMenuBilling, setMenuAutoRenew } from "./menu/billing/service";
import { MenuPublishError } from "./menu/snapshot";

export const menuBilling = onRequest({ cors: ALLOWED_ORIGINS, timeoutSeconds: 60, concurrency: 10, maxInstances: 10 }, async (req, res) => {
  if (req.method !== "POST") { res.status(405).json({ error: "METHOD_NOT_ALLOWED" }); return; }
  if (req.rawBody.length > 4096) { res.status(413).json({ error: "INVALID_PAYLOAD" }); return; }
  const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
  if (!token) { res.status(401).json({ error: "UNAUTHORIZED" }); return; }
  let uid: string;
  try { uid = (await getAuth().verifyIdToken(token)).uid; }
  catch { res.status(401).json({ error: "UNAUTHORIZED" }); return; }
  try {
    const { projectId, action, planId, autoRenew, revision } = req.body ?? {};
    if (typeof projectId !== "string" || !/^[a-zA-Z0-9_-]{1,128}$/.test(projectId)) throw new MenuBillingError("INVALID_PAYLOAD", 400);
    if (action === "status") res.json(await menuBillingStatus(uid, projectId));
    else if (action === "review") res.json(await reviewMenuBilling(uid, projectId, planId === undefined ? undefined : getMenuPlan(planId).id));
    else if (action === "autoRenew" && typeof autoRenew === "boolean" && Number.isSafeInteger(revision)) res.json(await setMenuAutoRenew(uid, projectId, autoRenew, revision));
    else throw new MenuBillingError("INVALID_PAYLOAD", 400);
  } catch (error) {
    if (error instanceof MenuBillingError || error instanceof MenuPublishError) { res.status(error.status).json({ error: error.code }); return; }
    if (error instanceof TransactionEngineError && error.code === "insufficient_funds") { res.status(409).json({ error: "INSUFFICIENT_CREDITS" }); return; }
    if (error instanceof TransactionEngineError && error.code === "balance_inconsistent") {
      logger.error("[menuBilling] Credit ledger needs reconciliation", { uid, error });
      res.status(409).json({ error: "BALANCE_INCONSISTENT" }); return;
    }
    logger.error("[menuBilling] Request failed", error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
});
