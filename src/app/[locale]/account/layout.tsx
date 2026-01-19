'use client'

import { AppSidebar } from "@/components/layout/dashboard/sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { SettingsMenu } from "@/components/layout/settings/settings-menu"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

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
        <div className="relative flex h-screen flex-col overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-amber-50/40 via-background to-rose-50/20" />

          <div className="relative pt-4">
            <DashboardHeader title="Settings" />
          </div>

          <main className="relative flex-1 overflow-y-auto p-6">
            <div className="mx-auto flex max-w-5xl flex-col gap-6 lg:flex-row lg:gap-8">
              
              {/* Меню */}
              <SettingsMenu />

              {/* Контент */}
              <div ref={contentRef} className="min-h-150 min-w-0 flex-1">
                <div className="transition-opacity duration-200">
                  {children}
                </div>
              </div>

            </div>
          </main>

        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default AccountLayout
