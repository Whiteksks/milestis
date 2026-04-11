"use client"

import Link from "next/link"
import { useState } from "react"
import { useTranslations } from "next-intl"

import { 
  FolderOpen, 
  Home, 
  Settings, 
  HelpCircle, 
  Globe, 
  Plus,
  Archive,
} from "lucide-react"
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
import { NewProjectModal } from "@/components/layout/dashboard/new-project-modal"
import Logo from "../logo"

interface AppSidebarProps {
  activeItem?: string
  locale?: string
}
//  { id: "templates", labelKey: "nav.templates", icon: LayoutTemplate, href: "/dashboard/templates" },
const navItems = [
  { id: "dashboard", labelKey: "nav.dashboard", icon: Home, href: "/dashboard" },
  { id: "projects", labelKey: "nav.projects", icon: FolderOpen, href: "/dashboard/projects" },
  { id: "archive", labelKey: "nav.archive", icon: Archive, href: "/dashboard/archive" },
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
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader className="border-b border-sidebar-border/40 bg-sidebar/50 backdrop-blur-sm">
          <div className="flex h-14 items-center px-4 overflow-hidden">
            <Link href="/dashboard" className="flex items-center justify-center shrink-0">
              {/* Полное лого: скрывается при collapsed */}
              <div className="group-data-[collapsible=icon]:hidden">
                <Logo className="gap-3 size-24" />
              </div>
              
              {/* Одна буква: показывается ТОЛЬКО при collapsed */}
              <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center">
              </div>
            </Link>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2 pt-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {/* Кнопка New Project: теперь она выглядит как стандартный, но выделенный элемент управления */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip={t('nav.newProject')}
                    onClick={() => setModalOpen(true)}
                    className="h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 
                    hover:text-primary-foreground shadow-sm transition-all
                    group-data-[collapsible=icon]:mb-2"
                  >
                    <Plus className="size-4 shrink-0" />
                    <span className="font-medium">{t('nav.newProject')}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Разделитель стал более незаметным */}
                <div className="my-3 h-px bg-sidebar-border/30 mx-2 group-data-[collapsible=icon]:hidden" />

                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeItem === item.id
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={t(item.labelKey)}
                        className={`rounded-lg h-10 transition-colors ${
                          isActive 
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                            : "text-muted-foreground hover:text-sidebar-foreground"
                        }`}
                      >
                        <Link href={withLocale(locale, item.href)}>
                          <Icon className={`size-4.5 ${isActive ? "text-primary" : ""}`} />
                          <span className="text-sm">{t(item.labelKey)}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border/40 p-2">
          <SidebarMenu className="gap-1">
            {bottomItems.map((item) => {
              const Icon = item.icon
              const isActive = activeItem === item.id
              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={t(item.labelKey)}
                    className="rounded-lg h-9 text-muted-foreground hover:text-sidebar-foreground"
                  >
                    <Link href={withLocale(locale, item.href)}>
                      <Icon className="!size-4.5" />
                      <span className="text-sm">{t(item.labelKey)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <NewProjectModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  )
}