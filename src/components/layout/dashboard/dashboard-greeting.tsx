"use client"

import { useUserStore } from "@/hooks/useUserStore"

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

export function DashboardGreeting() {
  const { profile } = useUserStore()
  const firstName = profile?.displayName?.split(" ")[0] ?? ""

  return (
    <div>
      <div>
        <h1 className="font-serif text-3xl md:text-4xl leading-tight">
          {getGreeting()}{firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="mt-1 text-muted-foreground">Start a new project in seconds</p>
      </div>
    </div>
  )
}
