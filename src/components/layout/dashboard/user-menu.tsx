"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  User, CreditCard, Settings, LogOut, 
  HelpCircle, LayoutDashboard, Crown, ChevronsUpDown 
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { normalizePlanTier } from "@/lib/billing/billing.utils"
import { useUserStore } from "@/hooks/useUserStore"
import { cn } from "@/lib/utils"
import { UserAvatar } from "@/components/shared/user-avatar"

export const PLAN_CONFIG: Record<string, { labelKey: string; className: string }> = {
  free: { labelKey: "plans.free", className: "bg-muted text-muted-foreground" },
  explorer: { labelKey: "plans.explorer", className: "bg-muted text-muted-foreground" },
  creator: { labelKey: "plans.creator", className: "bg-primary/10 text-primary" },
  archive: { labelKey: "plans.archive", className: "bg-primary/10 text-primary" },
}

// Конфигурация навигации
const MAIN_NAV_ITEMS = [
  { href: "/dashboard",       icon: LayoutDashboard, labelKey: "nav.dashboard" },
  { href: "/account/profile", icon: User,            labelKey: "nav.profile" },
  { href: "/account/billing", icon: CreditCard,      labelKey: "nav.billing" },
  { href: "/account/settings", icon: Settings,        labelKey: "nav.settings" },
]

/** Shared profile + navigation + logout content, reused by the desktop sidebar dropdown and the mobile account drawer. */
export function AccountMenuBody({ onNavigate }: { onNavigate: () => void }) {
  const t = useTranslations()
  const router = useRouter()
  const { profile } = useUserStore()

  const { displayName = " ", email = " " } = profile || {}
  const planTier = normalizePlanTier(profile?.subscription?.planTier)
  const plan = planTier ? PLAN_CONFIG[planTier] : null

  const handleLogout = async () => {
    onNavigate()
    try {
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <div className="flex flex-col">
      {/* Profile Header */}
      <div className="flex items-center gap-3 px-4 py-4">
        <UserAvatar size="md" />
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-sm font-semibold leading-none">{displayName}</span>
          <span className="truncate text-xs text-muted-foreground">{email}</span>
        </div>
        {plan && (
          <span className={cn("ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", plan.className)}>
            {t(plan.labelKey)}
          </span>
        )}
      </div>

      <div className="mx-2 h-px bg-border/50" />

      {/* Main Navigation */}
      <nav className="p-1.5">
        {MAIN_NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
          >
            <item.icon className="size-4 text-muted-foreground" />
            {t(item.labelKey)}
          </Link>
        ))}
      </nav>

      <div className="mx-2 h-px bg-border/50" />

      {/* Secondary Actions */}
      <nav className="p-1.5">
        <Link
          href="/help"
          onClick={onNavigate}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <HelpCircle className="size-4" />
          {t('nav.helpSupport')}
        </Link>
        
        {(!planTier || planTier === "free") && (
          <Link
            href="/pricing"
            onClick={onNavigate}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
          >
            <Crown className="size-4" />
            {t('nav.upgradePlan')}
          </Link>
        )}
      </nav>

      <div className="mx-2 h-px bg-border/50" />

      {/* Logout */}
      <div className="p-1.5">
          <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/5 hover:text-destructive"
        >
          <LogOut className="size-4" />
          {t('nav.logOut')}
        </button>
      </div>
    </div>
  )
}
/** Account card for the desktop sidebar footer: avatar + name/email, opens the account dropdown. */
export function UserMenu() {
  const [open, setOpen] = useState(false)
  const { profile } = useUserStore()
  const { displayName = "Пользователь", email = "" } = profile || {}

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Меню профиля"
          className="group flex w-full items-center gap-2.5 rounded-xl border border-sidebar-border/40 bg-gradient-to-r from-sidebar-accent/50 via-sidebar-accent/30 to-transparent p-2 text-left outline-none transition-all duration-200 hover:border-sidebar-border/80 hover:bg-gradient-to-r hover:from-sidebar-accent/80 hover:via-sidebar-accent/50 hover:to-sidebar-accent/20 data-[state=open]:border-sidebar-border data-[state=open]:bg-sidebar-accent group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:border-none group-data-[collapsible=icon]:bg-none group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
        >
          <UserAvatar size="md" className="shrink-0" />

          <div className="flex min-w-0 flex-1 flex-col items-start gap-1 group-data-[collapsible=icon]:hidden">
            <span className="w-full truncate text-sm font-medium leading-none text-sidebar-foreground">
              {displayName}
            </span>
            {email && (
              <span className="w-full truncate text-[11px] leading-none text-muted-foreground">
                {email}
              </span>
            )}
          </div>

          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground/70 transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[collapsible=icon]:hidden" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        side="top"
        sideOffset={6}
        className="w-64 overflow-hidden rounded-2xl p-0 shadow-md"
      >
        <AccountMenuBody onNavigate={() => setOpen(false)} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}