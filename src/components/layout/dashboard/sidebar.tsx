"use client"

import Link from "next/link"

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
  locale?: string
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, href: "/dashboard" },
  { id: "projects", label: "Projects", icon: FolderOpen, href: "/dashboard/projects" },
  { id: "templates", label: "Templates", icon: LayoutTemplate, href: "/dashboard/templates" },
  { id: "analytics", label: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
  { id: "domains", label: "Domains", icon: Globe, href: "/dashboard/domains" },
]

const bottomItems = [
  { id: "settings", label: "Settings", icon: Settings, href: "/account" },
  { id: "help", label: "Help & Support", icon: HelpCircle, href: "/help" },
]

function withLocale(locale: string | undefined, href: string) {
  if (!locale) return href
  if (href.startsWith(`/${locale}/`) || href === `/${locale}`) return href
  return `/${locale}${href}`
}

export function AppSidebar({ activeItem = "dashboard", locale }: AppSidebarProps) {

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex h-14 items-center gap-2 ">
          <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10">
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
                      asChild
                      isActive={activeItem === item.id}
                      tooltip={item.label}
                      className="rounded-xl transition-all duration-200"
                    >
                      <Link href={withLocale(locale, item.href)}>
                        <Icon className="size-4" />
                        <span className="text-base">{item.label}</span>
                      </Link>
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
                  asChild
                  isActive={activeItem === item.id}
                  tooltip={item.label}
                  className="rounded-xl transition-all duration-200"
                >
                  <Link href={withLocale(locale, item.href)}>
                    <Icon className="size-4" />
                    <span className="text-base">{item.label}</span>
                  </Link>
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
