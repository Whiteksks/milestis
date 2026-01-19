'use client'

import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AccountPage() {
  const router = useRouter()
  const params = useParams<{ locale: string }>()

  useEffect(() => {
    const locale = params?.locale
    router.replace(locale ? `/${locale}/account/profile` : "/account/profile")
  }, [params, router])
  
  return null
}
