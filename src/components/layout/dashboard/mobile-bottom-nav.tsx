"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
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
  { id: "dashboard", labelKey: "nav.dashboard", icon: Home, href: "/dashboard" },
  { id: "projects", labelKey: "nav.projects", icon: FolderOpen, href: "/dashboard/projects" },
  { id: "templates", labelKey: "nav.templates", icon: LayoutTemplate, href: "/dashboard/templates" },
  { id: "plan", labelKey: "nav.upgrade", icon: Crown, href: "/pricing" },
]

const extraNavItems = [
  { id: "analytics", labelKey: "nav.analytics", icon: BarChart3, href: "/dashboard/analytics" },
  { id: "domains", labelKey: "nav.domains", icon: Globe, href: "/dashboard/domains" },
]

const settingsLinks = [
  { labelKey: "nav.profile", href: "/account/profile", icon: User },
  { labelKey: "nav.billing", href: "/account/billing", icon: CreditCard },
  { labelKey: "nav.security", href: "/account/security", icon: Shield },
]

const helpLinks = [
  { labelKey: "nav.helpCenter", href: "/help", icon: FileText },
  { labelKey: "nav.contactSupport", href: "/help/contact", icon: MessageCircle },
]

export function MobileBottomNav({ activeItem = "dashboard", locale }: MobileBottomNavProps) {
  const [open, setOpen] = useState(false)
  const t = useTranslations()

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
                <span className="text-[10px] font-medium truncate">{t(item.labelKey)}</span>
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
          <span className="text-[10px] font-medium">{t('nav.more')}</span>
        </button>
      </nav>

      {/* More drawer */}
      <MobileDrawer open={open} onOpenChange={setOpen}>
        <div className="flex-1 overflow-y-auto p-4 mt-2">
            {/* Баннер апгрейда */}
            <PromoCard
            title={t('promo.proPlanTitle')}
            description={t('promo.proPlanDescription')}
            ctaText={t('promo.viewAllPlans')}
            href={withLocale(locale, "/pricing")}
            onClick={() => setOpen(false)}
            />

            {/* Управление */}
            <MenuSection title={t('nav.management')}>
            <MenuItem
              label={t('nav.publishedDomains')}
              icon={Globe}
              href={withLocale(locale, "/dashboard/domains")}
              onClick={() => setOpen(false)}
            />
            </MenuSection>

            {/* Настройки */}
            <MenuSection title={t('nav.account')}>
            {settingsLinks.map((link, i) => (
              <MenuItem
              key={link.href}
              label={t(link.labelKey)}
              icon={link.icon}
              href={withLocale(locale, link.href)}
              onClick={() => setOpen(false)}
              showBorder={i !== settingsLinks.length - 1}
              />
            ))}
            </MenuSection>

            {/* Поддержка */}
            <MenuSection title={t('nav.support')}>
            {helpLinks.map((link, i) => (
              <MenuItem
              key={link.href}
              label={t(link.labelKey)}
              icon={link.icon}
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
