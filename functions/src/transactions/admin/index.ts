import { onCall, HttpsError } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { ALLOWED_ORIGINS } from "../../lib/cors";
import { TransactionEngineError } from "../engine";
import { assertCreditsAdmin, findCreditAccount, grantCompensation } from "./service";

export const adminCredits = onCall({ cors: ALLOWED_ORIGINS, timeoutSeconds: 60, concurrency: 10, maxInstances: 5 }, async (request) => {
  if (!request.auth?.uid) throw new HttpsError("unauthenticated", "AUTH_REQUIRED");
  try {
    // Read current claims from Auth, so removing a role takes effect even with an old ID token.
    await assertCreditsAdmin(request.auth.uid);
    const data = request.data;
    if (!data || typeof data !== "object" || Array.isArray(data)) throw new HttpsError("invalid-argument", "INVALID_REQUEST");
    if (data.action === "lookup") return await findCreditAccount(data.identifier);
    if (data.action === "grant") return await grantCompensation(request.auth.uid, data);
    throw new HttpsError("invalid-argument", "INVALID_REQUEST");
  } catch (error) {
    if (error instanceof HttpsError) throw error;
    if (error instanceof TransactionEngineError) {
      if (error.code === "balance_inconsistent") throw new HttpsError("failed-precondition", "BALANCE_INCONSISTENT");
      if (error.code === "idempotency_conflict") throw new HttpsError("already-exists", "REQUEST_CONFLICT");
      if (error.code === "user_not_found") throw new HttpsError("not-found", "ACCOUNT_NOT_FOUND");
    }
    if ((error as { code?: string })?.code === "auth/user-not-found") throw new HttpsError("not-found", "ACCOUNT_NOT_FOUND");
    if (["auth/invalid-email", "auth/invalid-uid"].includes((error as { code?: string })?.code ?? "")) throw new HttpsError("invalid-argument", "INVALID_ACCOUNT");
    logger.error("[adminCredits] Request failed", { adminUid: request.auth.uid, error });
    throw new HttpsError("internal", "INTERNAL_ERROR");
  }
});
