import { createHash } from "node:crypto";
import { db } from "../../../lib/firebaseAdmin";
import { availableCreditsInTransaction, processTransactionInFirestoreTransaction, TransactionEngineError } from "../../../transactions/engine";
import { countMenuDishPhotos } from "../../../domain/menu/content";
import { prepareMenuSnapshot } from "../snapshot";
import { getMenuPlan, minimumMenuPlan, MENU_RENEWAL_GRACE_MS, MENU_RENEWAL_RETRY_MS, MenuBillingError,
  proposeMenuBilling, readMenuBilling, type MenuBilling, type MenuPlanId } from "./model";

export const MENU_QUOTES = "menuBillingQuotes";
type MenuSnapshot = ReturnType<typeof prepareMenuSnapshot>;
export const menuSnapshotHash = (snapshot: MenuSnapshot) => createHash("sha256").update(JSON.stringify(snapshot)).digest("hex");
export const menuPhotoCount = (snapshot: MenuSnapshot) => countMenuDishPhotos(snapshot.content.sectionContent, snapshot.content.imageContent);
export interface MenuBillingQuote {
  ownerId: string; projectId: string; planId: MenuPlanId; billingRevision: number; snapshotHash: string;
  createdAtMillis: number; expiresAtMillis: number; amount: number;
  publishVersion?: number;
  result?: { ok: true; publishedSlug: string; publishedPages: Array<{ id: string; name: string; path: string }>; billing: MenuBilling };
}

function assertProject(project: FirebaseFirestore.DocumentData | undefined, uid: string) {
  if (!project) throw new MenuBillingError("NOT_FOUND", 404);
  if (project.ownerId !== uid) throw new MenuBillingError("FORBIDDEN", 403);
  if (project.mode !== "menu" || !["active", "archived"].includes(project.status)) throw new MenuBillingError("NOT_PUBLISHABLE");
}

export async function menuBillingStatus(uid: string, projectId: string) {
  return db.runTransaction(async (tx) => {
    const project = (await tx.get(db.collection("projects").doc(projectId))).data();
    assertProject(project, uid);
    // Subscription management must remain available even if the credit ledger needs repair.
    return { billing: readMenuBilling(project!.menuBilling) };
  });
}

export async function reviewMenuBilling(uid: string, projectId: string, requestedPlan?: MenuPlanId) {
  return db.runTransaction(async (tx) => {
    const projectRef = db.collection("projects").doc(projectId);
    const project = (await tx.get(projectRef)).data();
    assertProject(project, uid);
    const draft = (await tx.get(projectRef.collection("data").doc("content"))).data();
    const snapshot = prepareMenuSnapshot(draft);
    const photoCount = menuPhotoCount(snapshot);
    const minimum = minimumMenuPlan(photoCount);
    const previous = readMenuBilling(project!.menuBilling);
    const preferred = previous ? getMenuPlan(previous.nextPlanId) : minimum;
    const plan = requestedPlan ? getMenuPlan(requestedPlan) : preferred.photoLimit >= photoCount ? preferred : minimum;
    const now = Date.now();
    const proposal = proposeMenuBilling(previous, plan.id, photoCount, now);
    const availableCredits = await availableCreditsInTransaction(tx, uid);
    const quoteRef = db.collection(MENU_QUOTES).doc();
    const quote: MenuBillingQuote = {
      ownerId: uid, projectId, planId: plan.id, billingRevision: previous?.revision ?? 0,
      snapshotHash: menuSnapshotHash(snapshot), createdAtMillis: now, expiresAtMillis: now + 10 * 60_000, amount: proposal.amount,
    };
    // Keep receipts briefly for lost-response retries; Firestore TTL removes abandoned reviews.
    tx.set(quoteRef, { ...quote, deleteAt: new Date(now + 24 * 60 * 60 * 1000) });
    return { quoteId: quoteRef.id, photoCount, planId: plan.id, amount: proposal.amount,
      availableCredits, current: previous, billing: proposal.billing, expiresAtMillis: quote.expiresAtMillis };
  });
}

export function validateMenuQuote(quote: MenuBillingQuote | undefined, uid: string, projectId: string, project: FirebaseFirestore.DocumentData, snapshot: MenuSnapshot) {
  if (!quote || quote.ownerId !== uid || quote.projectId !== projectId) throw new MenuBillingError("INVALID_QUOTE");
  if (quote.expiresAtMillis <= Date.now()) throw new MenuBillingError("QUOTE_EXPIRED");
  if (quote.snapshotHash !== menuSnapshotHash(snapshot)) throw new MenuBillingError("DRAFT_CHANGED");
  const previous = readMenuBilling(project.menuBilling);
  if ((previous?.revision ?? 0) !== quote.billingRevision) throw new MenuBillingError("BILLING_STATE_CHANGED");
  // Crossing a billing boundary changes what is being paid for. Obtain fresh consent.
  if (previous && ((quote.createdAtMillis < previous.periodEndMillis && Date.now() >= previous.periodEndMillis)
    || (quote.createdAtMillis < previous.periodEndMillis + MENU_RENEWAL_GRACE_MS && Date.now() >= previous.periodEndMillis + MENU_RENEWAL_GRACE_MS))) {
    throw new MenuBillingError("QUOTE_EXPIRED");
  }
  const proposal = proposeMenuBilling(previous, quote.planId, menuPhotoCount(snapshot), quote.createdAtMillis);
  if (proposal.amount !== quote.amount) throw new MenuBillingError("BILLING_STATE_CHANGED");
  return proposal;
}

export async function payMenuProposal(tx: FirebaseFirestore.Transaction, projectId: string, project: FirebaseFirestore.DocumentData,
  proposal: ReturnType<typeof proposeMenuBilling>, operationId: string): Promise<MenuBilling> {
  const billing = { ...proposal.billing };
  if (proposal.amount > 0) {
    const debit = await processTransactionInFirestoreTransaction(tx, {
      uid: project.ownerId, idempotencyKey: `menu:${projectId}:${operationId}`, category: "credit", direction: "out",
      credit: { type: "spend", amount: proposal.amount, meta: {
        reason: proposal.reason, projectId, projectName: project.name ?? "Menu", mode: "menu", planId: billing.planId,
        planVersion: billing.planVersion, periodStartMillis: billing.periodStartMillis, periodEndMillis: billing.periodEndMillis,
      } },
    });
    billing.lastTransactionId = debit.tid;
  }
  return billing;
}

export async function setMenuAutoRenew(uid: string, projectId: string, autoRenew: boolean, revision: number) {
  return db.runTransaction(async (tx) => {
    const ref = db.collection("projects").doc(projectId);
    const project = (await tx.get(ref)).data();
    assertProject(project, uid);
    const previous = readMenuBilling(project!.menuBilling);
    if (!previous || previous.revision !== revision) throw new MenuBillingError("BILLING_STATE_CHANGED");
    if (autoRenew && (previous.periodEndMillis <= Date.now() || !project!.isPublished)) throw new MenuBillingError("PAYMENT_REQUIRED");
    const billing: MenuBilling = { ...previous, revision: previous.revision + 1, autoRenew,
      nextAttemptAtMillis: autoRenew ? previous.periodEndMillis : null };
    tx.update(ref, { menuBilling: billing });
    return { billing };
  });
}

export async function renewMenuBillingPeriod(projectId: string): Promise<"renewed" | "past_due" | "suspended" | "skipped"> {
  return db.runTransaction(async (tx) => {
    const ref = db.collection("projects").doc(projectId);
    const project = (await tx.get(ref)).data();
    if (!project) return "skipped";
    const previous = readMenuBilling(project.menuBilling);
    const now = Date.now();
    if (!previous?.autoRenew || previous.nextAttemptAtMillis === null || previous.nextAttemptAtMillis > now || previous.periodEndMillis > now) return "skipped";
    if (project.mode !== "menu" || !["active", "archived"].includes(project.status) || !project.isPublished || now >= previous.periodEndMillis + MENU_RENEWAL_GRACE_MS) {
      tx.update(ref, { menuBilling: { ...previous, revision: previous.revision + 1, status: "suspended", autoRenew: false, nextAttemptAtMillis: null } });
      return "suspended";
    }
    const published = (await tx.get(db.collection("published_projects").doc(projectId))).data();
    if (!published || !published.isPublished) throw new MenuBillingError("PUBLICATION_MISSING", 500);
    const photoCount = menuPhotoCount(prepareMenuSnapshot(published));
    const proposal = proposeMenuBilling(previous, previous.nextPlanId, photoCount, now);
    try {
      const billing = await payMenuProposal(tx, projectId, project, proposal, `renew:${previous.periodEndMillis}`);
      tx.update(ref, { menuBilling: billing });
      return "renewed";
    } catch (error) {
      if (!(error instanceof TransactionEngineError) || error.code !== "insufficient_funds") throw error;
      tx.update(ref, { menuBilling: { ...previous, revision: previous.revision + 1, status: "past_due",
        nextAttemptAtMillis: Math.min(now + MENU_RENEWAL_RETRY_MS, previous.periodEndMillis + MENU_RENEWAL_GRACE_MS) } });
      return "past_due";
    }
  });
}
