"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"

import { useUserStore } from "@/hooks/useUserStore"

export function AuthenticatedRedirect() {
  const router = useRouter()
  const locale = useLocale()
  const authStatus = useUserStore((state) => state.authStatus)

  useEffect(() => {
    if (authStatus === "authenticated") {
      router.replace(`/${locale}/dashboard`)
    }
  }, [authStatus, locale, router])

  return null
}