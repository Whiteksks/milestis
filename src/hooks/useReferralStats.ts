import { useQuery } from '@tanstack/react-query'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { selectCurrentUid, selectProfileHydrating, useUserStore } from '@/hooks/useUserStore'

export interface ReferralStats {
  count: number
  creditsEarned: number
}

async function fetchReferralStats(uid: string): Promise<ReferralStats> {
  const referralsQuery = query(collection(db, 'referrals'), where('referrerUid', '==', uid))
  const snapshot = await getDocs(referralsQuery)

  let creditsEarned = 0
  snapshot.forEach((docSnap) => {
    const amount = docSnap.data().rewardedReferrer
    if (typeof amount === 'number') creditsEarned += amount
  })

  return { count: snapshot.size, creditsEarned }
}

export function useReferralStats() {
  const loading = useUserStore(selectProfileHydrating)
  const uid = useUserStore(selectCurrentUid)

  return useQuery({
    queryKey: ['referral-stats', uid],
    queryFn: () => fetchReferralStats(uid ?? ''),
    enabled: !loading && !!uid,
    staleTime: 5 * 60 * 1000,
  })
}
