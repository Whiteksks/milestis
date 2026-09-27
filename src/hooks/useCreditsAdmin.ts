'use client'

import { useQuery } from '@tanstack/react-query'
import { auth } from '@/lib/firebase/firebase'
import { useUserStore } from './useUserStore'

/** UI visibility only. Every administrative operation is authorized again on the server. */
export function useCreditsAdmin() {
  const uid = useUserStore((state) => state.profile?.uid)
  return useQuery({ queryKey: ['credits-admin', uid], enabled: !!uid, retry: false, staleTime: 30_000,
    queryFn: async () => {
      const user = auth.currentUser
      if (!user || user.uid !== uid) return false
      return (await user.getIdTokenResult(true)).claims.creditsAdmin === true
    },
  })
}
