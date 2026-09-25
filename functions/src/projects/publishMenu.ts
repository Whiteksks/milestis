import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { getAuth } from "firebase-admin/auth";
import { db } from "../lib/firebaseAdmin";
import { ALLOWED_ORIGINS } from "../lib/cors";
import { publishMenuSnapshot, validateMenuPublishInput } from "./menu/publish";
import { copyMenuMedia } from "./menu/media";
import { MenuPublishError } from "./menu/snapshot";

// Menu billing is a separate future subscription flow. No legacy one-time debit.
export const publishMenu = onRequest({ cors: ALLOWED_ORIGINS, timeoutSeconds: 300, memory: "512MiB", concurrency: 5, maxInstances: 10 }, async (req, res) => {
  if (req.method !== "POST") { res.status(405).json({ error: "METHOD_NOT_ALLOWED" }); return; }
  if (req.rawBody.length > 4096) { res.status(413).json({ error: "INVALID_PAYLOAD" }); return; }
  const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
  if (!token) { res.status(401).json({ error: "UNAUTHORIZED" }); return; }
  let uid: string;
  try { uid = (await getAuth().verifyIdToken(token)).uid; }
  catch { res.status(401).json({ error: "UNAUTHORIZED" }); return; }
  try {
    res.json(await publishMenuSnapshot(db, uid, validateMenuPublishInput(req.body), copyMenuMedia));
  } catch (error) {
    if (error instanceof MenuPublishError) { res.status(error.status).json({ error: error.code }); return; }
    logger.error("[publishMenu] Publication failed", error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
});
