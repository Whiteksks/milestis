'use client'

import { AppSidebar } from "@/components/layout/dashboard/sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { SettingsMenu } from "@/components/layout/settings/settings-menu"
import { useRouter, usePathname } from "next/navigation"

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const pathname = usePathname()

  const handleNavigate = (item: string) => {
    if (item === "dashboard") {
      router.push("/dashboard")
    }
  }

  // Determine active section based on pathname
  const getActiveSection = () => {
    if (pathname.includes("/account/profile")) return "profile"
    if (pathname.includes("/account/account")) return "account"
    if (pathname.includes("/account/billing")) return "billing"
    if (pathname.includes("/account/domains")) return "domains"
    if (pathname.includes("/account/appearance")) return "appearance"
    if (pathname.includes("/account/security")) return "security"
    return "profile" // Default
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar activeItem="settings" onNavigate={handleNavigate} />
      <SidebarInset>
        <div className="relative flex h-screen flex-col overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-amber-50/40 via-background to-rose-50/20" />

          <div className="relative pt-4">
            <DashboardHeader title="Settings" />
          </div>

          <main className="relative flex-1 overflow-y-auto p-6">
             <div className="mx-auto flex max-w-5xl gap-8">
                <SettingsMenu activeSection={getActiveSection()} onSectionChange={() => {}} />
                <div className="min-h-150 min-w-0 flex-1">
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
