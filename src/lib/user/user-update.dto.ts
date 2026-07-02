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

export interface UserSubscriptionFeatures {
  maxProjects: number;
  maxStorageBytes: number;
  canRemoveBranding: boolean;
  photographerWorkspace: boolean;
  monthlyCredits: number;
  creditTopupRatePerDollar: number;
  prioritySupport: boolean;
}

export type SubscriptionPlanTier = "free" | "explorer" | "creator" | "archive";

export interface UserSubscription {
  planId: string;
  planTier: SubscriptionPlanTier;
  planInterval?: "month" | "year";
  status: "active" | "trialing" | "past_due" | "paused" | "canceled";
  gracePeriodEnd?: Date | null;
  trialEnd?: Date | null;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  polarSubscriptionId?: string;
  polarCustomerId?: string;
  polarProductId?: string;
  features: UserSubscriptionFeatures;
}

export interface UserBalance {
  total: number;
  purchased: number;
  subscription: number;
  bonus: number;
}

export interface UserStats {
  /** Current number of project docs that still exist, including trashed ones awaiting purge. */
  totalProjects: number;
  /** Lifetime count of successful publish commits. */
  projectsPublished: number;
  storageUsedBytes: number;
  totalCreditsSpent: number;
}

export interface UserDocument {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  profileTemplate: UserProfileTemplate;
  settings: UserSettings;
  subscription: UserSubscription;
  balance: UserBalance;
  stats: UserStats;
}