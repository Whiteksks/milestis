"use client"

import { useEffect, useState } from "react"
import { useUserStore } from "@/hooks/useUserStore"
import { useTranslations } from "next-intl"

function getGreetingKey(): string {
  const hour = new Date().getHours()

  if (hour < 5) return "greetings.midnight"
  if (hour < 12) return hour < 7 ? "greetings.earlyBird" : "greetings.goodMorning"
  if (hour < 17) return "greetings.goodAfternoon"
  return "greetings.goodEvening"
}

export function DashboardGreeting() {
  const { profile } = useUserStore()
  const [greetingKey, setGreetingKey] = useState("")
  const t = useTranslations()

  useEffect(() => {
    setGreetingKey(getGreetingKey())
  }, [])

  const firstName = profile?.displayName?.split(" ")[0] ?? ""

  if (!greetingKey) return <div className="h-10" />

  const greeting = t(greetingKey)

  return (
    <div>
      <h1 className="font-serif text-3xl md:text-4xl leading-tight">
        {greeting}{firstName ? `, ${firstName}` : ""}
      </h1>
      <p className="mt-1 text-muted-foreground">{t('greetings.readyToBuild')}</p>
    </div>
  )
}