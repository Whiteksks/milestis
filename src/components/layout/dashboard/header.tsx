'use client'

import { UserMenu } from "./user-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ClientOnly } from "@/components/shared/client-only"
import { useTranslations } from "next-intl"

interface HeaderProps {
  title?: string
}

export function DashboardHeader({ title }: HeaderProps) {
  const t = useTranslations()
  const displayTitle = title ?? t('nav.dashboard')

  return (
    <>
      <header className="z-50 mx-4 flex h-16 items-center justify-between rounded-2xl border border-border/30 bg-card/70 px-6 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="-ml-1 rounded-xl hover:bg-accent/60 transition-colors hidden md:inline-flex" />
          <h1 className="text-lg font-semibold text-foreground">{displayTitle}</h1>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <ClientOnly>
            <UserMenu />
          </ClientOnly>
        </div>
      </header>
    </>
  )
}
