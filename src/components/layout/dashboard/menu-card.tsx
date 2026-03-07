"use client"

import Link from "next/link"
import { ChevronRight, LucideIcon, Crown } from "lucide-react"
import { cn } from "@/lib/utils"

// 1. Компонент для строк списка (Settings, Domains, Help)
interface MenuItemProps {
  label: string
  href: string
  icon: LucideIcon
  iconColor?: string
  onClick: () => void
  showBorder?: boolean
}

export function MenuItem({ label, href, icon: Icon, iconColor, onClick, showBorder }: MenuItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3.5 transition-colors active:bg-accent",
        showBorder && "border-b border-border/50"
      )}
    >
      <div className="flex items-center justify-center size-8 rounded-lg bg-background border shadow-sm">
        <Icon className={cn("size-4", iconColor || "text-muted-foreground")} />
      </div>
      <span className="flex-1 text-sm font-medium">{label}</span>
      <ChevronRight className="size-4 text-muted-foreground/40" />
    </Link>
  )
}

// 2. Компонент для акцентной карточки (Upgrade)
interface PromoCardProps {
  title: string
  description: string
  ctaText: string
  href: string
  onClick: () => void
}

export default function PromoCard({ title, description, ctaText, href, onClick }: PromoCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-background border border-primary/20 p-5 shadow-sm mb-6">
      <Crown className="absolute -right-4 -top-4 size-24 text-primary/10 -rotate-12" />
      <div className="relative z-10 space-y-3">
        <div className="space-y-1">
          <h3 className="font-bold text-lg leading-none">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
      <Link
        href={href}
        onClick={onClick}
        className="flex items-center justify-center w-full bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-semibold shadow-md active:scale-[0.98] transition-transform"
      >
        {ctaText}
      </Link>
    </div>
  </div>
  )
}

// 3. Компонент группы (обертка с заголовком)
export function MenuSection({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2 mb-6">
      {title && (
        <h3 className="px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
        {title}
      </h3>
    )}
    <div className="bg-muted/30 rounded-2xl border border-border overflow-hidden">
      {children}
    </div>
  </div>
  )
}
