"use client"

import { useEffect, useState } from "react"
import { useUserStore } from "@/hooks/useUserStore"

function getGreeting(): string {
  const hour = new Date().getHours()
  
  // Ночной период (00:00 - 04:59)
  if (hour < 5) return "Burning the midnight oil?" // "Работаешь допоздна?"
  
  // Утро (05:00 - 11:59)
  if (hour < 12) {
    return hour < 7 ? "Early bird! Good morning" : "Good morning"
  }
  
  // День (12:00 - 16:59)
  if (hour < 17) return "Good afternoon"
  
  // Вечер (17:00 - 23:59)
  return "Good evening"
}

export function DashboardGreeting() {
  const { profile } = useUserStore()
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    setGreeting(getGreeting())
  }, [])

  const firstName = profile?.displayName?.split(" ")[0] ?? ""

  if (!greeting) return <div className="h-10" />

  return (
    <div>
      <h1 className="font-serif text-3xl md:text-4xl leading-tight">
        {greeting}{firstName ? `, ${firstName}` : ""}
      </h1>
      <p className="mt-1 text-muted-foreground">Ready to build something great?</p>
    </div>
  )
}