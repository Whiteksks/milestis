"use client"

import Link from "next/link"
import { useState } from "react"
import { useTranslations } from "next-intl"

import { 
  FolderOpen, 
  Home, 
  Settings, 
  HelpCircle, 
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
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { NewProjectModal } from "@/components/layout/dashboard/new-project-modal"
import { SidebarReferralButton } from "@/components/layout/dashboard/referral"
import { UserMenu } from "@/components/layout/dashboard/user-menu"
import { ClientOnly } from "@/components/shared/client-only"
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
        <SidebarHeader className="border-b border-sidebar-border/40 bg-sidebar/50">
          <div className="flex h-14 items-center justify-between overflow-hidden group-data-[collapsible=icon]:px-2">
            {/* Лого скрывается полностью при collapsed, оставляя место только под триггер */}
            <Link href="/dashboard" className="px-4 flex items-center justify-center shrink-0 group-data-[collapsible=icon]:hidden">
              <Logo className="gap-3 size-24" />
            </Link>
            <SidebarTrigger className="rounded-lg hover:bg-sidebar-accent/60 transition-colors" />
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
          <ClientOnly>
            <UserMenu />
          </ClientOnly>
          <div className="my-2 h-px bg-sidebar-border/30 mx-2" />
          <SidebarMenu className="gap-1">
            <SidebarReferralButton locale={locale} />
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