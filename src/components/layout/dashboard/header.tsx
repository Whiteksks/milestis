'use client'

import { CreditsIndicator } from "./credits-indicator"
import { UserMenu } from "./user-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ClientOnly } from "@/components/shared/client-only"

interface HeaderProps {
  title?: string
}

export function DashboardHeader({ title = "Dashboard" }: HeaderProps) {
  const user = {
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
  }

  return (
    <>
      <header className="sticky top-4s z-50 mx-4 flex h-16 items-center justify-between rounded-2xl border border-border/30 bg-card/70 px-6 shadow-lg shadow-black/5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="-ml-1 rounded-xl hover:bg-accent/60 transition-colors" />
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <CreditsIndicator used={3} total={10} resetDate="Jan 1, 2026" />
          <ClientOnly>
            <UserMenu user={user} />
          </ClientOnly>
        </div>
      </header>
    </>
  )
}
