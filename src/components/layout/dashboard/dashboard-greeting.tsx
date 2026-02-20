"use client"

import { useUserStore } from "@/hooks/useUserStore"
import { BookOpen, Coins, Calendar } from "lucide-react"

const CREDITS_USED = 3
const CREDITS_TOTAL = 10
const RESET_DATE = "Mar 1"
const TOTAL_PROJECTS = 4

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

export function DashboardGreeting() {
  const { profile } = useUserStore()
  const firstName = profile?.displayName?.split(" ")[0] ?? ""
  const remaining = CREDITS_TOTAL - CREDITS_USED

  const stats = [
    { icon: BookOpen, label: `${TOTAL_PROJECTS} projects` },
    { icon: Coins, label: `${remaining} / ${CREDITS_TOTAL} credits` },
    { icon: Calendar, label: `Resets ${RESET_DATE}` },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-serif text-3xl md:text-4xl leading-tight">
          {getGreeting()}{firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="mt-1 text-muted-foreground">Here's what's happening with your projects</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {stats.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 rounded-full bg-card px-4 py-2 shadow-sm text-sm"
          >
            <Icon className="size-4 text-primary" />
            <span className="font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
