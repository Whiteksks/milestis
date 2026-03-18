"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"

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
} from "@/components/ui/sidebar"

interface AppSidebarProps {
  activeItem?: string
  locale?: string
}

const navItems = [
  { id: "dashboard", labelKey: "nav.dashboard", icon: Home, href: "/dashboard" },
  { id: "projects", labelKey: "nav.projects", icon: FolderOpen, href: "/dashboard/projects" },
  { id: "templates", labelKey: "nav.templates", icon: LayoutTemplate, href: "/dashboard/templates" },
  { id: "analytics", labelKey: "nav.analytics", icon: BarChart3, href: "/dashboard/analytics" },
  { id: "domains", labelKey: "nav.domains", icon: Globe, href: "/dashboard/domains" },
]

const bottomItems = [
  { id: "settings", labelKey: "nav.settings", icon: Settings, href: "/account" },
  { id: "help", labelKey: "nav.helpSupport", icon: HelpCircle, href: "/help" },
]

function withLocale(locale: string | undefined, href: string) {
  if (!locale) return href
  if (href.startsWith(`/${locale}/`) || href === `/${locale}`) return href
  return `/${locale}${href}`
}

export function AppSidebar({ activeItem = "dashboard", locale }: AppSidebarProps) {
  const t = useTranslations()

  return (
    <Sidebar collapsible="icon" variant="inset">
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
                      tooltip={t(item.labelKey)}
                      className="rounded-xl transition-all duration-200"
                    >
                      <Link href={withLocale(locale, item.href)}>
                        <Icon className="size-4" />
                        <span className="text-base">{t(item.labelKey)}</span>
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
                  tooltip={t(item.labelKey)}
                  className="rounded-xl transition-all duration-200"
                >
                  <Link href={withLocale(locale, item.href)}>
                    <Icon className="size-4" />
                    <span className="text-base">{t(item.labelKey)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarFooter>

    </Sidebar>
  )
}
