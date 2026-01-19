"use client"

import { usePathname, useSelectedLayoutSegments } from "next/navigation"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/dashboard/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard/header"

const headerTitles: Record<string, string> = {
  dashboard: "Dashboard",
  projects: "Projects",
  templates: "Templates",
  analytics: "Analytics",
  domains: "Domains",
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

  const firstSegment = segments[0] ?? ""
  const activeItem = firstSegment === "" ? "dashboard" : firstSegment

  const headerTitle = headerTitles[activeItem] ?? "Dashboard"
  const locale = getLocaleFromPathname(pathname)

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar activeItem={activeItem} locale={locale} />
      <SidebarInset>
        <div className="relative flex h-screen flex-col overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-amber-50/40 via-background to-rose-50/20" />

          <div className="relative pt-4">
            <DashboardHeader title={headerTitle} />
          </div>

          <main className="relative flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
