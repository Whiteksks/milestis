// store/useUserStore.ts
import { create } from 'zustand';

interface UserProfileTemplate {
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

interface UserSettings {
  language?: 'ru' | 'en' | 'kz';
  notifications?: {
    project_updates?: boolean;
    project_reminders?: boolean;
    project_milestones?: boolean;
    whats_new?: boolean;
    personalized_recommendations?: boolean;
    seasonal_specials?: boolean;
  };
}

interface UserSubscription {
  planId?: string;
  planTier?: 'free' | 'basic' | 'pro' | 'pro_plus';
  status?: 'active' | 'trialing' | 'past_due' | 'canceled';
}

interface UserBalance {
  total?: number;
  purchased?: number;
  subscription?: number;
  bonus?: number;
}

interface UserStats {
  totalProjects?: number;
  projectsPublished?: number;
  projectsInProgress?: number;
  storageUsedBytes?: number;
  totalCreditsSpent?: number;
}

interface UserProfile {
  uid: string | null;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  profileTemplate?: UserProfileTemplate;
  settings?: UserSettings;
  subscription?: UserSubscription;
  balance?: UserBalance;
  stats?: UserStats;
}

interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  setProfile: (data: UserProfile | null) => void;
  clearProfile: () => void;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  loading: true,
  setProfile: (data) => set({ profile: data, loading: false }),
  clearProfile: () => set({ profile: null, loading: false }),
  setLoading: (loading) => set({ loading }),
}));
