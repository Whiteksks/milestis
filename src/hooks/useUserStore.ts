// store/useUserStore.ts
import { create } from 'zustand';
import type {
  UserProfileTemplate,
  UserSettings,
  UserSubscription,
  UserBalance,
  UserStats,
} from '@/lib/user';

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
