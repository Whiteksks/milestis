"use client"

import { useEffect, useRef } from "react"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { useTranslations } from "next-intl"
import { db } from "@/lib/firebase"
import { toast } from "@/lib/toast"
import { selectCurrentUid, useUserStore } from "@/hooks/useUserStore"

const SEEN_COUNT_STORAGE_PREFIX = "milestis_referral_seen_count:"

/**
 * Global listener (mounted once in the root layout) that watches the current user's
 * `referrals` docs and toasts a celebration message the moment a friend's signup converts.
 * Compares against a per-uid last-seen count in localStorage so it never toasts for
 * referrals that already existed before this device/session first loaded.
 */
export function ReferralConversionToast() {
  const uid = useUserStore(selectCurrentUid)
  const t = useTranslations()
  const lastSeenCountRef = useRef<number | null>(null)

  useEffect(() => {
    if (!uid) return

    lastSeenCountRef.current = null
    const storageKey = `${SEEN_COUNT_STORAGE_PREFIX}${uid}`

    const referralsQuery = query(collection(db, "referrals"), where("referrerUid", "==", uid))
    const unsubscribe = onSnapshot(referralsQuery, (snapshot) => {
      const count = snapshot.size
      const lastSeen = lastSeenCountRef.current ?? Number(window.localStorage.getItem(storageKey) ?? count)

      if (count > lastSeen) {
        const newConversions = count - lastSeen
        toast.success(
          newConversions === 1
            ? t("referral.toast.singleConversion")
            : t("referral.toast.multipleConversions", { count: newConversions })
        )
      }

      lastSeenCountRef.current = count
      window.localStorage.setItem(storageKey, String(count))
    })

    return unsubscribe
  }, [uid, t])

  return null
}
