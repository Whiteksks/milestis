"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"

import { useUserStore } from "@/hooks/useUserStore"
import { consumeNewSignupFlag } from "@/lib/analytics"

export function AuthenticatedRedirect() {
  const router = useRouter()
  const locale = useLocale()
  const authStatus = useUserStore((state) => state.authStatus)
  const sessionSynced = useUserStore((state) => state.sessionSynced)

  useEffect(() => {
    if (authStatus === "authenticated" && sessionSynced) {
      // ?signup=1 lets a no-code Meta Pixel "URL contains" rule fire CompleteRegistration
      // only for this first post-registration landing, never on returning-user logins.
      const suffix = consumeNewSignupFlag() ? "?signup=1" : ""
      router.replace(`/${locale}/dashboard${suffix}`)
    }
  }, [authStatus, sessionSynced, locale, router])

  return null
}