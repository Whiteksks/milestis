'use client'

import { AppSidebar } from "@/components/layout/dashboard/sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { SettingsMenu } from "@/components/layout/settings/settings-menu"
import { MobileBottomNav } from "@/components/layout/dashboard/mobile-bottom-nav"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { useTranslations } from "next-intl"

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const t = useTranslations()

  useEffect(() => {
    if (window.innerWidth < 1024) {
      requestAnimationFrame(() => {
        contentRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      })
    }
  }, [pathname])
  
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar activeItem="settings" locale={pathname.split("/").filter(Boolean)[0]} />
      <SidebarInset>
        <div className="relative flex min-h-full flex-col">
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-amber-50/40 via-background to-rose-50/20 rounded-xl" />

          <div className="md:sticky top-0 z-50 pt-4">
            {/** localized header title */}
            <DashboardHeader title={t('nav.settings')} />
          </div>

          <main className="relative flex-1 p-4 pb-20 md:pb-6 md:p-6 lg:p-8">
            <div className="mx-auto flex max-w-5xl flex-col gap-6 lg:flex-row lg:gap-8">
              
              {/* Меню */}
              <SettingsMenu />

              {/* Контент */}
              <div ref={contentRef} className="min-h-150 min-w-0 flex-1">
                {children}
              </div>

            </div>
          </main>

        </div>
      </SidebarInset>
      <MobileBottomNav activeItem="settings" locale={pathname.split("/").filter(Boolean)[0]} />
    </SidebarProvider>
  )
}

export default AccountLayout
