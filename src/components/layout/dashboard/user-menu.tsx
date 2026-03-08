"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  User, CreditCard, Settings, LogOut, 
  HelpCircle, LayoutDashboard, Crown 
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useUserStore } from "@/hooks/useUserStore"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { MobileDrawer } from "@/components/ui/custom/mobile-drawer"

// Конфигурация тарифов
const PLAN_CONFIG: Record<string, { label: string; className: string }> = {
  free:     { label: "Free",  className: "bg-muted text-muted-foreground" },
  basic:    { label: "Basic", className: "bg-muted text-muted-foreground" },
  pro:      { label: "Pro",   className: "bg-primary/10 text-primary" },
  pro_plus: { label: "Pro+",  className: "bg-primary/10 text-primary" },
}

// Конфигурация навигации
const MAIN_NAV_ITEMS = [
  { href: "/dashboard",       icon: LayoutDashboard, label: "Dashboard" },
  { href: "/account/profile", icon: User,            label: "Profile" },
  { href: "/account/billing", icon: CreditCard,      label: "Billing" },
  { href: "/account",         icon: Settings,        label: "Settings" },
]

export function UserMenu() {
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile()
  const router = useRouter()
  const { profile } = useUserStore()

  // Данные пользователя
  const { displayName = "User", email = "", photoURL = "" } = profile || {}
  const planTier = profile?.subscription?.planTier
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

  // Общий компонент аватара
  const UserAvatar = ({ className }: { className?: string }) => (
    <Avatar className={cn("size-8", className)}>
      <AvatarImage src='' alt='avatar'/>
      <AvatarFallback className="text-xs bg-primary/10 text-primary">
        User
      </AvatarFallback>
    </Avatar>
  )

  const menuBody = (
    <div className="flex flex-col">
      {/* Profile Header */}
      <div className="flex items-center gap-3 px-4 py-4">
        <UserAvatar className="size-10" />
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-sm font-semibold leading-none">{displayName}</span>
          <span className="truncate text-xs text-muted-foreground">{email}</span>
        </div>
        {plan && (
          <span className={cn("ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", plan.className)}>
            {plan.label}
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
            {item.label}
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
          Help & Support
        </Link>
        
        {(!planTier || planTier === "free") && (
          <Link
            href="/pricing"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
          >
            <Crown className="size-4" />
            Upgrade Plan
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
          Log out
        </button>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <MobileDrawer 
        open={open} 
        onOpenChange={setOpen} 
        trigger={<UserAvatar />}
      >
        {menuBody}
      </MobileDrawer>
    )
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="group flex items-center gap-2.5 rounded-xl p-1.5 outline-none transition-colors hover:bg-accent/50">
          <UserAvatar />
          <div className="hidden flex-col items-start md:flex">
            <span className="text-sm font-medium leading-none group-hover:text-foreground">{displayName}</span>
            <span className="text-[11px] text-muted-foreground">email@gmail.com</span>
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