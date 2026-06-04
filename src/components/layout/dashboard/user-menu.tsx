"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  User, CreditCard, Settings, LogOut, 
  HelpCircle, LayoutDashboard, Crown 
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
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { MobileDrawer } from "@/components/ui/custom/mobile-drawer"
import { UserAvatar } from "@/components/shared/user-avatar"

const PLAN_CONFIG: Record<string, { labelKey: string; className: string }> = {
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

export function UserMenu() {
  const [open, setOpen] = useState(false)
  const t = useTranslations()
  const isMobile = useIsMobile()
  const router = useRouter()
  const { profile } = useUserStore()

  // Данные пользователя
  const { displayName = " ", email = " " } = profile || {}
  const planTier = normalizePlanTier(profile?.subscription?.planTier)
  const plan = planTier ? PLAN_CONFIG[planTier] : null

  const handleLogout = async () => {
    setOpen(false)
    try {
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }


  const menuBody = (
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
            onClick={() => setOpen(false)}
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
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <HelpCircle className="size-4" />
          {t('nav.helpSupport')}
        </Link>
        
        {(!planTier || planTier === "free") && (
          <Link
            href="/pricing"
            onClick={() => setOpen(false)}
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

  if (isMobile) {
    return (
      <MobileDrawer 
        open={open} 
        onOpenChange={setOpen} 
        trigger={
          <button className="outline-none">
            <UserAvatar size="sm" />
          </button>
        }
      >
        {menuBody}
      </MobileDrawer>
    )
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="group flex items-center gap-2.5 rounded-xl p-1.5 outline-none transition-colors hover:bg-accent/50">
          <UserAvatar size="sm" />
          <div className="hidden flex-col items-start md:flex">
            <span className="text-sm font-medium leading-none group-hover:text-foreground">{displayName}</span>
            <span className="text-[11px] text-muted-foreground">{email}</span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 overflow-hidden rounded-2xl p-0 shadow-xl"
      >
        {menuBody}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}