import { FieldValue } from "firebase-admin/firestore";

// --- Вспомогательные типы ---
export type SubscriptionTier = "free" | "explorer" | "creator" | "archive";
export type SubscriptionStatus = "active" | "trialing" | "past_due" | "paused" | "canceled";

export interface UserSubscription {
  priceId?: string; // polar product price id (absent for free tier)
  planTier: SubscriptionTier; // free/explorer/creator/archive
  planInterval?: "month" | "year"; // billing interval (absent for free tier)
  status: SubscriptionStatus;
  nextBillDate?: FieldValue;
  cancelAtPeriodEnd?: boolean;
  hadTrial?: boolean;
  currency?: string;
  amount?: number; // in cents
  features: SubscriptionFeatures;
}

export interface SubscriptionFeatures {
  maxProjects: number;
  maxStorageBytes: number;
  canRemoveBranding: boolean;
  /** Enables Professional/Advanced Workspace UI (photographer portfolio tools). */
  photographerWorkspace: boolean;
  /** Credits granted automatically each billing period. */
  monthlyCredits: number;
  /** Credits the user receives per $1 spent on credit top-up packs (subscriber rate vs free rate of 1). */
  creditTopupRatePerDollar: number;
  prioritySupport: boolean;
}

export interface UserBilling {
  customerId: string;
  subscriptionId: string; 
  cardBrand: string;
  cardLastFour: string;
  cardExpiry: string;
}



export interface UserProfileTemplate {
  name?: string;
  location?: string;
  bio?: string;
  sociallinks?: {
    link1?: string;
    link2?: string;
    link3?: string;
    link4?: string;
  };
}

export interface UserStats {
  /** Current number of project docs that still exist, including trashed ones awaiting purge. */
  totalProjects: number;
  /** Lifetime count of successful publish commits. */
  projectsPublished: number;
  storageUsedBytes: number;
  totalCreditsSpent: number;
}

export interface UserMetadata {
  createdAt: FieldValue;
  lastLoginAt?: FieldValue;
  terms: {
    acceptedVersion: string;
    acceptedAt: FieldValue;
  };
  schemaVersion: number;
}

export interface UserSettings {
  language?: "ru" | "en" | "kz";
  notifications: {
    project_updates: boolean;
    project_reminders: boolean;
    project_milestones: boolean;
    whats_new: boolean;
    personalized_recommendations: boolean;
    seasonal_specials: boolean;
  };
}

export interface UserBalance {
  total: number;
  purchased: number;
  subscription: number;
  bonus: number;
}

export interface UserDocument {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  profileTemplate: UserProfileTemplate;
  subscription: UserSubscription;
  balance: UserBalance;
  settings: UserSettings;
  stats: UserStats;
  metadata: UserMetadata;
}