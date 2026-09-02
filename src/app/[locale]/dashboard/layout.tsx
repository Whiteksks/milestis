"use client"

import { useEffect } from "react"
import { usePathname, useSelectedLayoutSegments } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { useShallow } from "zustand/react/shallow"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/dashboard/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { MobileBottomNav } from "@/components/layout/dashboard/mobile-bottom-nav"
import { WelcomeModal } from "@/components/layout/dashboard/welcome-modal"
import { selectAuthLoading, selectCurrentUid, useUserStore } from "@/hooks/useUserStore"
import { prefetchActiveProjects } from "@/hooks/useProjectsQuery"

const headerTitles: Record<string, string> = {
  dashboard: "Dashboard",
  projects: "Projects",
  archive: "Archive",
  templates: "Templates",
  analytics: "Analytics",
  help: "Help & Support",
}

function getLocaleFromPathname(pathname: string): string | undefined {
  // Expected: /{locale}/dashboard/...
  const parts = pathname.split("/").filter(Boolean)
  return parts[0]
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const segments = useSelectedLayoutSegments()
  const queryClient = useQueryClient()
  const { uid, authLoading } = useUserStore(
    useShallow((state) => ({ uid: selectCurrentUid(state), authLoading: selectAuthLoading(state) }))
  )

  // Kick off the projects fetch as early as possible — before child pages mount.
  // prefetchQuery respects staleTime: if data is fresh it's a no-op.
  useEffect(() => {
    if (authLoading || !uid) return
    void prefetchActiveProjects(queryClient, uid)
  }, [uid, authLoading, queryClient])

  const firstSegment = segments[0] ?? ""
  const activeItem = firstSegment === "" ? "dashboard" : firstSegment

  const headerTitle = headerTitles[activeItem] ?? "Dashboard"
  const locale = getLocaleFromPathname(pathname)

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar activeItem={activeItem} locale={locale} />
      <SidebarInset>
        <div className="relative flex min-h-full flex-col ">
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-amber-50/40 via-background to-rose-50/20 rounded-xl" />

          <div className="md:sticky top-0 z-50 pt-4">
            <DashboardHeader title={headerTitle} />
          </div>

          <main className="relative flex-1 p-4 pb-20 md:pb-6 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </SidebarInset>
      <MobileBottomNav activeItem={activeItem} locale={locale} />
      <WelcomeModal />
    </SidebarProvider>
  )
}
