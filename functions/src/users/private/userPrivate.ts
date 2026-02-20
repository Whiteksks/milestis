import { FieldValue } from "firebase-admin/firestore";

export type FirestoreDate = string | FieldValue;

export type CloudPaymentsPaymentStatus =
  | "success"
  | "failed"
  | "pending"
  | "canceled"
  | string;

export interface UserPrivateBilling {
  token: string;
  subscriptionId: string;
  customerId: string;
  lastPaymentStatus: CloudPaymentsPaymentStatus;
  retryCount: number;
  lastErrorCode: string | null;
}

export interface UserPrivateRecentLogin {
  ip: string;
  date: FirestoreDate;
  ua: string;
}

export interface UserPrivateSecurity {
  fingerprint: string;
  trustScore: number;
  flags: string[];
  recentLogins: UserPrivateRecentLogin[];
  isAccountSharing: boolean;
  internalNotes: string;
}
// export interface UserPrivateIntegrations {
//   google_photos?: {
//     refresh_token: string;
//     linkedAt: FirestoreDate;
//     scope: string; // важно знать, какие права дал юзер
//   } | null;
//   // ... аналогично для других
// }
export interface UserPrivateIntegrations {
  google_drive_refresh_token?: string | null;
  google_photos_access_token?: string | null;
  dropbox_access_token?: string | null;
  one_drive_access_token?: string | null;
}

export interface UserPrivatePromoHistoryItem {
  code: string;
  usedAt: FirestoreDate;
}

export interface UserPrivateMarketing {
  promoHistory: UserPrivatePromoHistoryItem[];
  referralSource: string;
  abGroup: string;
  totalLtvUsd: number;
  conversionWindow: string;
}

export interface UserPrivateSystem {
  updatedAt: FirestoreDate;
  schemaVersion: number;
}

export interface UserPrivateDocument {
  billing?: UserPrivateBilling;
  security: UserPrivateSecurity;
  integrations?: UserPrivateIntegrations;
  marketing?: UserPrivateMarketing;
  system: UserPrivateSystem;
}
