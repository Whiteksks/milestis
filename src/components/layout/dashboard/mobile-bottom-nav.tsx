"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import {
  Home,
  FolderOpen,
  LayoutTemplate,
  MoreHorizontal,
  BarChart3,
  Globe,
  MessageCircle,
  FileText,
  Bell,
  CreditCard,
  Shield,
  User,
  Crown,
  ChevronRight,

} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import PromoCard, { MenuItem, MenuSection } from "./menu-card"
import { MobileDrawer } from "@/components/ui/custom/mobile-drawer"

interface MobileBottomNavProps {
  activeItem?: string
  locale?: string
}

function withLocale(locale: string | undefined, href: string) {
  if (!locale) return href
  if (href.startsWith(`/${locale}/`) || href === `/${locale}`) return href
  return `/${locale}${href}`
}

const mainNavItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, href: "/dashboard" },
  { id: "projects", label: "Projects", icon: FolderOpen, href: "/dashboard/projects" },
  { id: "templates", label: "Templates", icon: LayoutTemplate, href: "/dashboard/templates" },
  { id: "plan", label: "Upgrade", icon: Crown, href: "/pricing" },
]

const extraNavItems = [
  { id: "analytics", label: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
  { id: "domains", label: "Domains", icon: Globe, href: "/dashboard/domains" },
]

const settingsLinks = [
  { label: "Profile", href: "/account/profile", icon: User },
  { label: "Billing", href: "/account/billing", icon: CreditCard },
  { label: "Security", href: "/account/security", icon: Shield },
]

const helpLinks = [
  { label: "Help Center", href: "/help", icon: FileText },
  { label: "Contact Support", href: "/help/contact", icon: MessageCircle },
]

export function MobileBottomNav({ activeItem = "dashboard", locale }: MobileBottomNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Bottom navigation bar */}
      <nav className="fixed rounded-t-md bottom-0 left-0 right-0  z-40 flex h-16 items-center justify-around border-t border-border bg-background/95 backdrop-blur-md md:hidden">
        {mainNavItems.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.id
          return (
            <Link
              key={item.id}
              href={withLocale(locale, item.href)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-w-0",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center size-8 rounded-xl transition-colors",
                  isActive && "bg-primary/10"
                )}
              >
                <Icon className="size-5 shrink-0" />
              </div>
              <span className="text-[10px] font-medium truncate">{item.label}</span>
            </Link>
          )
        })}

        {/* More button */}
        <button
          onClick={() => setOpen(true)}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors text-muted-foreground hover:text-foreground min-w-0"
        >
          <div className="flex items-center justify-center size-8 rounded-xl">
            <MoreHorizontal className="size-5 shrink-0" />
          </div>
          <span className="text-[10px] font-medium">More</span>
        </button>
      </nav>

      {/* More drawer */}
      <MobileDrawer open={open} onOpenChange={setOpen}>
        <div className="flex-1 overflow-y-auto p-4 mt-2">
            {/* Баннер апгрейда */}
            <PromoCard
            title="Pro Plan"
            description="Unlock analytics, custom domains, and unlimited projects."
            ctaText="View All Plans"
            href={withLocale(locale, "/pricing")}
            onClick={() => setOpen(false)}
            />

            {/* Управление */}
            <MenuSection title="Management">
            <MenuItem
                label="Published Domains"
                icon={Globe}
                href={withLocale(locale, "/dashboard/domains")}
                onClick={() => setOpen(false)}
            />
            </MenuSection>

            {/* Настройки */}
            <MenuSection title="Account">
            {settingsLinks.map((link, i) => (
                <MenuItem
                key={link.href}
                {...link}
                href={withLocale(locale, link.href)}
                onClick={() => setOpen(false)}
                showBorder={i !== settingsLinks.length - 1}
                />
            ))}
            </MenuSection>

            {/* Поддержка */}
            <MenuSection title="Support">
            {helpLinks.map((link, i) => (
                <MenuItem
                key={link.href}
                {...link}
                href={withLocale(locale, link.href)}
                onClick={() => setOpen(false)}
                showBorder={i !== helpLinks.length - 1}
                />
            ))}
            </MenuSection>
        </div>
        </MobileDrawer>
    </>
  )
}
