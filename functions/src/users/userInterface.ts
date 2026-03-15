import { FieldValue } from "firebase-admin/firestore";

export interface UserProfileTemplate {
  name?: string;
  location?: string;
  bio?: string;
  sociallinks?: {
    link1?: string;
    link2?: string;
    link3?: string;
    link4?: string;
  }
}

export interface UserStats {
  totalProjects: number;
  projectsPublished: number;
  projectsInProgress: number;
  storageUsedBytes: number;
  totalCreditsSpent: number;
}

export interface UserMetadata {
  createdAt: FieldValue;
  lastLoginAt?: FieldValue;
  terms: {
    acceptedVersion: string
    acceptedAt: FieldValue
  }
  schemaVersion: number
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
};


export type SubscriptionTier = "free" | "basic" | "pro" | "pro_plus";
export type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled";

export interface SubscriptionFeatures {
  maxProjects: number;
  maxStorageBytes: number;
  canRemoveBranding: boolean;
  highQualityExport: boolean;
  prioritySupport: boolean;
}

export interface UserSubscription {
  planId: string;
  planTier: SubscriptionTier;
  status: SubscriptionStatus;
  gracePeriodEnd?: FieldValue | null;
  trialEnd?: FieldValue | null;
  currentPeriodStart?: FieldValue;
  currentPeriodEnd?: FieldValue;
  cancelAtPeriodEnd?: boolean;
  features: SubscriptionFeatures;
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