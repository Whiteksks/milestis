"use client"

import { useRouter } from "next/navigation"

import { FolderOpen, Home, Settings, HelpCircle, LayoutTemplate, BarChart3, Globe, Heart } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

interface AppSidebarProps {
  activeItem?: string
  onNavigate?: (item: string) => void
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "templates", label: "Templates", icon: LayoutTemplate },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "domains", label: "Domains", icon: Globe },
]

const bottomItems = [
  { id: "settings", label: "Settings", icon: Settings },
  { id: "help", label: "Help & Support", icon: HelpCircle },
]

export function AppSidebar({ activeItem = "dashboard", onNavigate }: AppSidebarProps) {
  const router = useRouter()

  const handleNavigate = (id: string) => {
    if (id === "help") {
      router.push("/help")
      return
    }
    
    if (id === "settings") {
      router.push("/account")
      return
    }

    if (id === "dashboard") {
      router.push("/dashboard")
      return
    }

    onNavigate?.(id)
  }

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex h-14 items-center gap-3 px-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
            <Heart className="size-5 text-primary" />
          </div>
          <span className="text-lg font-bold text-sidebar-foreground truncate group-data-[collapsible=icon]:hidden">
            Milestis
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={activeItem === item.id}
                      tooltip={item.label}
                        onClick={() => handleNavigate(item.id)}
                      className="rounded-xl transition-all duration-200 hover:scale-[1.02]"
                    >
                      <Icon className="size-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border pt-2">
        <SidebarMenu>
          {bottomItems.map((item) => {
            const Icon = item.icon
            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  isActive={activeItem === item.id}
                  tooltip={item.label}
                  onClick={() => handleNavigate(item.id)}
                  className="rounded-xl transition-all duration-200 hover:scale-[1.02]"
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
