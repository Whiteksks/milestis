// store/useUserStore.ts
import { create } from 'zustand';

interface UserProfile {
  email: string | null;
  displayName: string | null;
}

interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  setProfile: (data: UserProfile | null) => void;
  clearProfile: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  loading: true,
  setProfile: (data) => set({ profile: data, loading: false }),
  clearProfile: () => set({ profile: null, loading: false }),
}));
