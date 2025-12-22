"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/dashboard/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { CreateCards } from "@/components/layout/dashboard/create-cards"
import { ProjectGrid } from "@/components/layout/dashboard/project-grid"
import { HelpPage } from "@/components/layout/supportPage/help-page"
import { ProjectsPage } from "@/components/layout/dashboard/projects-page"
import { TemplatesPage } from "@/components/layout/dashboard/templates-page"
import { AnalyticsPage } from "@/components/layout/dashboard/analytics-page"
import { DomainsPage } from "@/components/layout/dashboard/domains-page"

export default function DashboardPage() {
  const [activeView, setActiveView] = useState("dashboard")

  const handleNavigate = (item: string) => {
    setActiveView(item)
  }

  const headerTitles: Record<string, string> = {
    settings: "Settings",
    help: "Help & Support",
    projects: "Projects",
    templates: "Templates",
    analytics: "Analytics",
    domains: "Domains",
    dashboard: "Dashboard",
  }

  const headerTitle = headerTitles[activeView] || "Dashboard"

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar activeItem={activeView} onNavigate={handleNavigate} />
      <SidebarInset>
        <div className="relative flex h-screen flex-col overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-amber-50/40 via-background to-rose-50/20" />

          <div className="relative pt-4">
            <DashboardHeader title={headerTitle} />
          </div>

          <main className="relative flex-1 overflow-y-auto p-6">
            {activeView === "help" ? (
              <HelpPage />
            ) : activeView === "projects" ? (
              <ProjectsPage />
            ) : activeView === "templates" ? (
              <TemplatesPage />
            ) : activeView === "analytics" ? (
              <AnalyticsPage />
            ) : activeView === "domains" ? (
              <DomainsPage />
            ) : (
              <div className="mx-auto max-w-6xl space-y-10">
                <section>
                  <h2 className="mb-5 text-xl font-semibold text-foreground">Create something new</h2>
                  <CreateCards />
                </section>
                <section>
                  <h2 className="mb-5 text-xl font-semibold text-foreground">Recent Projects</h2>
                  <ProjectGrid />
                </section>
              </div>
            )}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
