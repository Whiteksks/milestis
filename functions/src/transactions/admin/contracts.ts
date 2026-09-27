import type { BalanceSnapshot } from "../types";

export const MAX_COMPENSATION_CREDITS = 100_000;
export interface CreditAccount {
  uid: string;
  email: string | null;
  displayName: string | null;
  balance: BalanceSnapshot | null;
  availableCredits: number | null;
  needsReconciliation: boolean;
}
export interface CompensationInput {
  targetUid: string;
  amount: number;
  reason: string;
  requestId: string;
}
export interface CompensationReceipt {
  tid: string;
  targetUid: string;
  amount: number;
  balance: BalanceSnapshot;
  idempotent: boolean;
}
