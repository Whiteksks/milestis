import { create } from 'zustand';
import type {
  UserProfileTemplate,
  UserSettings,
  UserSubscription,
  UserBalance,
  UserStats,
} from '@/lib/user';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';
export type ProfileStatus = 'idle' | 'loading' | 'ready';

export interface UserProfile {
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

export interface UserState {
  profile: UserProfile | null;
  authStatus: AuthStatus;
  profileStatus: ProfileStatus;
  /** true after syncServerSession resolves — cookie is guaranteed to exist */
  sessionSynced: boolean;
  setAuthLoading: () => void;
  setAuthenticatedProfile: (data: UserProfile, profileStatus?: Exclude<ProfileStatus, 'idle'>) => void;
  clearProfile: () => void;
  setSessionSynced: () => void;
  updateBalance: (balance: UserBalance) => void;
  updateSubscription: (subscription: UserSubscription) => void;
}

export const selectCurrentUid = (state: UserState) => state.profile?.uid ?? null;
export const selectAuthLoading = (state: UserState) => state.authStatus === 'loading';
export const selectProfileHydrating = (state: UserState) =>
  state.authStatus === 'loading' ||
  (state.authStatus === 'authenticated' && state.profileStatus === 'loading');
export const selectSubscription = (state: UserState) => state.profile?.subscription ?? null;
export const selectBalance = (state: UserState) => state.profile?.balance ?? null;

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  authStatus: 'loading',
  profileStatus: 'idle',
  sessionSynced: false,
  setAuthLoading: () => set({ profile: null, authStatus: 'loading', profileStatus: 'idle', sessionSynced: false }),
  setAuthenticatedProfile: (data, profileStatus = 'ready') => set({
    profile: data,
    authStatus: 'authenticated',
    profileStatus,
  }),
  clearProfile: () => set({
    profile: null,
    authStatus: 'unauthenticated',
    profileStatus: 'idle',
    sessionSynced: false,
  }),
  setSessionSynced: () => set({ sessionSynced: true }),
  updateBalance: (balance) =>
    set((state) =>
      state.profile ? { profile: { ...state.profile, balance } } : {},
    ),
  updateSubscription: (subscription) =>
    set((state) =>
      state.profile ? { profile: { ...state.profile, subscription } } : {},
    ),
}));
