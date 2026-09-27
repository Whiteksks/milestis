export const MENU_PLANS = [
  { id: "menu-50", version: 1, photoLimit: 50, monthlyCredits: 200 },
  { id: "menu-100", version: 1, photoLimit: 100, monthlyCredits: 350 },
  { id: "menu-150", version: 1, photoLimit: 150, monthlyCredits: 500 },
  { id: "menu-200", version: 1, photoLimit: 200, monthlyCredits: 650 },
] as const;
export type MenuPlanId = typeof MENU_PLANS[number]["id"];
export const MENU_RENEWAL_GRACE_MS = 3 * 24 * 60 * 60 * 1000;
export const MENU_RENEWAL_RETRY_MS = 60 * 60 * 1000;

export interface MenuBilling {
  revision: number;
  planId: MenuPlanId;
  nextPlanId: MenuPlanId;
  planVersion: number;
  monthlyCredits: number;
  photoCount: number;
  status: "active" | "past_due" | "suspended";
  autoRenew: boolean;
  anchorAtMillis: number;
  periodIndex: number;
  periodStartMillis: number;
  periodEndMillis: number;
  nextAttemptAtMillis: number | null;
  lastTransactionId: string;
}

export class MenuBillingError extends Error {
  constructor(public readonly code: string, public readonly status = 409) { super(code); }
}
export function getMenuPlan(id: unknown) {
  const plan = MENU_PLANS.find((entry) => entry.id === id);
  if (!plan) throw new MenuBillingError("INVALID_PLAN", 400);
  return plan;
}
export function minimumMenuPlan(photoCount: number) {
  const plan = MENU_PLANS.find((entry) => photoCount <= entry.photoLimit);
  if (!plan) throw new MenuBillingError("PHOTO_LIMIT_EXCEEDED");
  return plan;
}

/** Always calculate from the original UTC anchor: Jan 31 -> Feb 28 -> Mar 31. */
export function menuPeriodBoundary(anchorAtMillis: number, monthOffset: number): number {
  const anchor = new Date(anchorAtMillis);
  if (!Number.isFinite(anchor.getTime()) || !Number.isSafeInteger(monthOffset) || monthOffset < 0) throw new MenuBillingError("INVALID_BILLING_PERIOD", 500);
  const target = new Date(anchorAtMillis);
  target.setUTCDate(1);
  target.setUTCMonth(anchor.getUTCMonth() + monthOffset);
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(anchor.getUTCDate(), lastDay));
  if (!Number.isFinite(target.getTime())) throw new MenuBillingError("INVALID_BILLING_PERIOD", 500);
  return target.getTime();
}

export function readMenuBilling(value: unknown): MenuBilling | null {
  if (value === undefined || value === null) return null;
  const data = value as MenuBilling;
  const plan = getMenuPlan(data.planId);
  const next = getMenuPlan(data.nextPlanId);
  if (data.planVersion !== plan.version || data.monthlyCredits !== plan.monthlyCredits
    || !Number.isSafeInteger(data.revision) || data.revision < 1
    || !Number.isSafeInteger(data.photoCount) || data.photoCount < 0 || data.photoCount > Math.min(plan.photoLimit, next.photoLimit)
    || !["active", "past_due", "suspended"].includes(data.status) || typeof data.autoRenew !== "boolean"
    || ![data.anchorAtMillis, data.periodStartMillis, data.periodEndMillis].every((date) => Number.isSafeInteger(date) && date > 0)
    || !Number.isSafeInteger(data.periodIndex) || data.periodIndex < 0
    || data.periodStartMillis !== menuPeriodBoundary(data.anchorAtMillis, data.periodIndex)
    || data.periodEndMillis !== menuPeriodBoundary(data.anchorAtMillis, data.periodIndex + 1)
    || typeof data.lastTransactionId !== "string" || !data.lastTransactionId
    || (data.nextAttemptAtMillis !== null && (!Number.isSafeInteger(data.nextAttemptAtMillis) || data.nextAttemptAtMillis < data.periodEndMillis))
    || (data.autoRenew ? data.status === "suspended" || data.nextAttemptAtMillis === null : data.nextAttemptAtMillis !== null)) {
    throw new MenuBillingError("INVALID_MENU_BILLING", 500);
  }
  return data;
}

export function hasMenuAccess(value: unknown, now = Date.now()): boolean {
  try {
    const billing = readMenuBilling(value);
    return !!billing && (now < billing.periodEndMillis
      || (billing.autoRenew && billing.status !== "suspended" && now < billing.periodEndMillis + MENU_RENEWAL_GRACE_MS));
  } catch { return false; }
}

/** A package is selected explicitly. Downgrades affect the next period, upgrades charge the full difference. */
export function proposeMenuBilling(previous: MenuBilling | null, planId: MenuPlanId, photoCount: number, now: number) {
  const plan = getMenuPlan(planId);
  if (!Number.isSafeInteger(photoCount) || photoCount < 0 || photoCount > plan.photoLimit) throw new MenuBillingError("PHOTO_LIMIT_EXCEEDED");
  if (previous && previous.periodEndMillis > now) {
    const upgrade = plan.monthlyCredits > previous.monthlyCredits;
    return {
      amount: upgrade ? plan.monthlyCredits - previous.monthlyCredits : 0,
      reason: upgrade ? "menu_upgrade" : "menu_update",
      billing: { ...previous, revision: previous.revision + 1, photoCount,
        planId: upgrade ? plan.id : previous.planId, monthlyCredits: upgrade ? plan.monthlyCredits : previous.monthlyCredits,
        nextPlanId: plan.id } satisfies MenuBilling,
    };
  }
  const continuing = previous?.autoRenew && now < previous.periodEndMillis + MENU_RENEWAL_GRACE_MS;
  const anchor = continuing ? previous.anchorAtMillis : now;
  const periodIndex = continuing ? previous.periodIndex + 1 : 0;
  const periodEndMillis = menuPeriodBoundary(anchor, periodIndex + 1);
  return {
    amount: plan.monthlyCredits, reason: "menu_monthly",
    billing: {
      revision: (previous?.revision ?? 0) + 1, planId: plan.id, nextPlanId: plan.id, planVersion: plan.version,
      monthlyCredits: plan.monthlyCredits, photoCount, status: "active", autoRenew: true,
      anchorAtMillis: anchor, periodIndex, periodStartMillis: menuPeriodBoundary(anchor, periodIndex), periodEndMillis,
      nextAttemptAtMillis: periodEndMillis, lastTransactionId: previous?.lastTransactionId ?? "",
    } satisfies MenuBilling,
  };
}
