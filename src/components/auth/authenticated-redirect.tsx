"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"

import { useUserStore } from "@/hooks/useUserStore"

export function AuthenticatedRedirect() {
  const router = useRouter()
  const locale = useLocale()
  const authStatus = useUserStore((state) => state.authStatus)
  const profileStatus = useUserStore((state) => state.profileStatus)

  useEffect(() => {
    if (authStatus === "authenticated" && profileStatus === "ready") {
      router.replace(`/${locale}/dashboard`)
    }
  }, [authStatus, profileStatus, locale, router])

  return null
}