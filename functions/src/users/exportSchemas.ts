/**
 * Export schemas for GDPR data export.
 *
 * Each interface is an explicit allowlist of fields sent to the user.
 * Each mapper picks only those fields from the raw Firestore document.
 *
 * Rule: when you add a field to a Firestore interface, TypeScript will NOT
 * automatically include it in exports — you must explicitly add it here.
 */

import type { UserRecord } from "firebase-admin/auth";
import type { DocumentSnapshot, QueryDocumentSnapshot } from "firebase-admin/firestore";

import type {
  UserSubscription,
  UserBalance,
  UserStats,
  UserSettings,
  UserProfileTemplate,
  UserMetadata,
  UserDocument,
} from "./userInterface";
import type { ProjectMode, ProjectStatus } from "../projects/projectInterface";

// ── URL sanitization ──────────────────────────────────────────────────────────

export function stripUrlToken(value: string): string {
  try {
    const url = new URL(value);
    if (!url.searchParams.has("token")) return value;
    url.searchParams.delete("token");
    return url.toString();
  } catch {
    return value;
  }
}

// ── Export types ─────────────────────────────────────────────────────────────

/** Firebase Auth account details. Includes creation/last sign-in timestamps. */
export interface ExportAuthPayload {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  photoURL: string | null;
  disabled: boolean;
  phoneNumber: string | null;
  createdAt: string | null;
  lastSignInAt: string | null;
}

/** Public Firestore user document fields. Internal fields (uid duplicate) excluded. */
export interface ExportUserDocument {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  profileTemplate: UserProfileTemplate;
  subscription: UserSubscription;
  balance: UserBalance;
  stats: UserStats;
  settings: UserSettings;
  metadata: Pick<UserMetadata, "schemaVersion"> & {
    createdAt: unknown;
    lastLoginAt: unknown;
  };
  updatedAt: unknown;
}

/**
 * Transaction record. Omits idempotencyKey (internal audit field).
 * Optional fields are included only when present in the document.
 */
export interface ExportTransaction {
  id: string;
  tid: string;
  uid: string;
  createdAt: string;
  direction: string;
  category: string;
  type: string;
  balanceSnapshot: { total: number; purchased: number; subscription: number; bonus: number };
  // billing-specific
  currency?: string;
  amountMinor?: number;
  refundedTxId?: string;
  // credit-specific
  amount?: number;
  billingTid?: string;
  // shared optional
  meta?: Record<string, unknown>;
}

/**
 * Credit lot document.
 * Shows the user their credit buckets and expiry info.
 */
export interface ExportCreditLot {
  id: string;
  bucket: "purchased" | "subscription" | "bonus";
  totalAmount: number;
  remainingAmount: number;
  createdAtMillis: number;
  expiresAtMillis: number;
  sourceTransactionId: string;
  createdAt: unknown;
}

/**
 * Project document.
 * Omits: publishedAccessToken (security), publishLockId/publishLockExpiresAtMillis/publishTransactionId (internal engine fields).
 */
export interface ExportProjectDocument {
  id: string;
  ownerId: string;
  name: string;
  mode: ProjectMode;
  status: ProjectStatus;
  createdAt: unknown;
  updatedAt: unknown;
  schemaVersion: number;
  isPublished?: boolean;
  publishedSlug?: string;
  publishVersion?: number;
  deletedAt?: unknown;
  purgeAt?: unknown;
  template?: { id: string };
  preview?: { heroImageUrl: string } | null;
}

/** Image metadata. URL tokens are stripped from any URLs in `meta`. */
export interface ExportImageMetadata {
  id: string;
  ownerId: string | null;
  projectId: string | null;
  meta: unknown;
  createdAt: unknown;
}

/**
 * Export record (publish history entry).
 * Omits: fileDownloadUrl (temporary signed URL, not meaningful for export).
 */
export interface ExportRecord {
  id: string;
  exportId: string;
  projectId: string;
  projectName: string;
  ownerId: string;
  versionNumber: number;
  mode: string;
  creditCost: number;
  publishedSlug: string;
  createdAt: unknown;
}

/**
 * Full published snapshot including design content.
 * Used by exportProjectContent — a per-project GDPR content export.
 * Omits: accessToken (security).
 */
export interface ExportPublishedSnapshotWithContent {
  id: string;
  ownerId: string | null;
  slug: string | null;
  name: string | null;
  mode: string | null;
  isPublished: boolean;
  theme: unknown;
  content: unknown;
  publishedAt: unknown;
}

// ── Mappers ───────────────────────────────────────────────────────────────────

export function mapAuthPayload(authUser: UserRecord): ExportAuthPayload {
  return {
    uid: authUser.uid,
    email: authUser.email ?? null,
    emailVerified: authUser.emailVerified,
    displayName: authUser.displayName ?? null,
    photoURL: authUser.photoURL ? stripUrlToken(authUser.photoURL) : null,
    disabled: authUser.disabled,
    phoneNumber: authUser.phoneNumber ?? null,
    createdAt: authUser.metadata.creationTime ?? null,
    lastSignInAt: authUser.metadata.lastSignInTime ?? null,
  };
}

export function mapUserDocument(snapshot: DocumentSnapshot): ExportUserDocument {
  const d = snapshot.data() as UserDocument & { updatedAt?: unknown };
  return {
    id: snapshot.id,
    email: d.email ?? null,
    displayName: d.displayName ?? null,
    photoURL: d.photoURL ? stripUrlToken(d.photoURL) : null,
    profileTemplate: d.profileTemplate ?? {},
    subscription: d.subscription,
    balance: d.balance,
    stats: d.stats,
    settings: d.settings,
    metadata: {
      createdAt: d.metadata?.createdAt ?? null,
      lastLoginAt: d.metadata?.lastLoginAt ?? null,
      schemaVersion: d.metadata?.schemaVersion ?? 0,
    },
    updatedAt: d.updatedAt ?? null,
  };
}

export function mapTransaction(snapshot: QueryDocumentSnapshot): ExportTransaction {
  const d = snapshot.data() as Record<string, unknown>;
  return {
    id: snapshot.id,
    tid: d.tid as string,
    uid: d.uid as string,
    createdAt: d.createdAt as string,
    direction: d.direction as string,
    category: d.category as string,
    type: d.type as string,
    balanceSnapshot: d.balanceSnapshot as ExportTransaction["balanceSnapshot"],
    ...(d.currency !== undefined && { currency: d.currency as string }),
    ...(d.amountMinor !== undefined && { amountMinor: d.amountMinor as number }),
    ...(d.refundedTxId !== undefined && { refundedTxId: d.refundedTxId as string }),
    ...(d.amount !== undefined && { amount: d.amount as number }),
    ...(d.billingTid !== undefined && { billingTid: d.billingTid as string }),
    ...(d.meta !== undefined && { meta: d.meta as Record<string, unknown> }),
  };
}

export function mapCreditLot(snapshot: QueryDocumentSnapshot): ExportCreditLot {
  const d = snapshot.data() as Record<string, unknown>;
  return {
    id: snapshot.id,
    bucket: d.bucket as ExportCreditLot["bucket"],
    totalAmount: d.totalAmount as number,
    remainingAmount: d.remainingAmount as number,
    createdAtMillis: d.createdAtMillis as number,
    expiresAtMillis: d.expiresAtMillis as number,
    sourceTransactionId: d.sourceTransactionId as string,
    createdAt: d.createdAt ?? null,
  };
}

export function mapProjectDocument(snapshot: QueryDocumentSnapshot): ExportProjectDocument {
  const d = snapshot.data() as Record<string, unknown>;
  return {
    id: snapshot.id,
    ownerId: d.ownerId as string,
    name: d.name as string,
    mode: d.mode as ProjectMode,
    status: d.status as ProjectStatus,
    createdAt: d.createdAt ?? null,
    updatedAt: d.updatedAt ?? null,
    schemaVersion: (d.schemaVersion as number) ?? 0,
    ...(d.isPublished !== undefined && { isPublished: d.isPublished as boolean }),
    ...(d.publishedSlug !== undefined && { publishedSlug: d.publishedSlug as string }),
    ...(d.publishVersion !== undefined && { publishVersion: d.publishVersion as number }),
    ...(d.deletedAt !== undefined && { deletedAt: d.deletedAt }),
    ...(d.purgeAt !== undefined && { purgeAt: d.purgeAt }),
    ...(d.template !== undefined && { template: d.template as { id: string } }),
    ...(d.preview !== undefined && {
      preview: d.preview
        ? { heroImageUrl: stripUrlToken((d.preview as { heroImageUrl: string }).heroImageUrl) }
        : null,
    }),
  };
}

export function mapImageMetadata(snapshot: QueryDocumentSnapshot): ExportImageMetadata {
  const d = snapshot.data() as Record<string, unknown>;
  return {
    id: snapshot.id,
    ownerId: (d.ownerId as string) ?? null,
    projectId: (d.projectId as string) ?? null,
    meta: d.meta ?? null,
    createdAt: d.createdAt ?? null,
  };
}

export function mapExportRecord(snapshot: QueryDocumentSnapshot): ExportRecord {
  const d = snapshot.data() as Record<string, unknown>;
  return {
    id: snapshot.id,
    exportId: d.exportId as string,
    projectId: d.projectId as string,
    projectName: d.projectName as string,
    ownerId: d.ownerId as string,
    versionNumber: d.versionNumber as number,
    mode: d.mode as string,
    creditCost: d.creditCost as number,
    publishedSlug: d.publishedSlug as string,
    createdAt: d.createdAt ?? null,
  };
}

export function mapPublishedSnapshotWithContent(
  snapshot: QueryDocumentSnapshot,
): ExportPublishedSnapshotWithContent {
  const d = snapshot.data() as Record<string, unknown>;
  return {
    id: snapshot.id,
    ownerId: (d.ownerId as string) ?? null,
    slug: (d.slug as string) ?? null,
    name: (d.name as string) ?? null,
    mode: (d.mode as string) ?? null,
    isPublished: (d.isPublished as boolean) ?? false,
    theme: d.theme ?? null,
    content: d.content ?? null,
    publishedAt: d.publishedAt ?? null,
  };
}
