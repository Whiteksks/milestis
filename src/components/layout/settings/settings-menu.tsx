"use client"

import { User, CreditCard, Palette, Shield, Building, Archive } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

const settingsMenu = [
  { id: "profile", labelKey: "account.menu.profile", navigate: "/account/profile", icon: User },
  { id: "settings", labelKey: "account.menu.account", navigate: "/account/settings", icon: Building },
  { id: "billing", labelKey: "account.menu.billing", navigate: "/account/billing", icon: CreditCard },
  { id: "archive", labelKey: "account.menu.archive", navigate: "/account/archive", icon: Archive },
  { id: "appearance", labelKey: "account.menu.appearance", navigate: "/account/appearance", icon: Palette },
  { id: "security", labelKey: "account.menu.security", navigate: "/account/security", icon: Shield },
]

export function SettingsMenu() {
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations()

  const getIsActive = (itemPath: string) => {
    return pathname === itemPath || pathname.endsWith(itemPath)
  }

  const handleNavigation = (targetPath: string) => {
    router.push(targetPath) 
  }

  return (
    <div className="h-fit w-full md:w-56 shrink-0">
      <nav className="sticky top-24 rounded-2xl bg-card/60 p-2 backdrop-blur-sm border border-border/30">
        <div className="space-y-1">
          {settingsMenu.map((item) => {
            const Icon = item.icon
            const isActive = getIsActive(item.navigate)
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.navigate)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
                {t(item.labelKey)}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}