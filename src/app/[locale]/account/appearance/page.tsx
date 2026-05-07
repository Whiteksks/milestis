"use client"

import { useEffect, useState } from "react"
import { Check, Sun, Moon, Laptop, Zap } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useThemeTransition } from "@/hooks/useThemeTransition"
import AppearanceSettingsSkeleton from "./loading"
import { useTranslations } from "next-intl"
import { Switch } from "@/components/ui/switch"

const themes = [
  {
    id: "light",
    nameKey: "themes.light.name",
    descriptionKey: "themes.light.description",
    icon: Sun,
    colors: { bg: "bg-amber-50", sidebar: "bg-stone-50", card: "bg-white", accent: "bg-rose-400", text: "bg-stone-400" },
  },
  {
    id: "cozy",
    nameKey: "themes.cozy.name",
    descriptionKey: "themes.cozy.description",
    icon: Sun,
    colors: { bg: "bg-amber-100", sidebar: "bg-amber-50", card: "bg-orange-50", accent: "bg-amber-500", text: "bg-amber-700" },
  },
  {
    id: "dark",
    nameKey: "themes.dark.name",
    descriptionKey: "themes.dark.description",
    icon: Moon,
    colors: { bg: "bg-stone-950", sidebar: "bg-stone-900", card: "bg-stone-800", accent: "bg-rose-500", text: "bg-stone-600" },
  },
]

export default function AppearanceSettings() {
  const t = useTranslations("account.appearance")
  const { theme, setTheme, highContrast, setHighContrast } = useThemeTransition()

  const activeTheme = themes.find((th) => th.id === theme) || themes[0]
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <AppearanceSettingsSkeleton />

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl">{t("title")}</h2>
            <p className="mt-1 text-muted-foreground">{t("description")}</p>
          </div>
          <Select value={theme === "system" ? "system" : "manual"} onValueChange={(v) => (v === "system" ? setTheme("system") : setTheme("light"))}>
            <SelectTrigger className="w-auto rounded-full bg-secondary border-0">
              <div className="flex items-center gap-2">
                <Laptop className="h-4 w-4" />
                <SelectValue placeholder={t("select.syncing")} />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">{t("select.manual")}</SelectItem>
              <SelectItem value="system">{t("select.system")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-8">
          <div className="flex flex-col items-center gap-6 sm:hidden">
            <div className={`${activeTheme.colors.bg} relative aspect-video w-full overflow-hidden rounded-2xl border transition-colors duration-500 flex`}>
              {/* Sidebar strip */}
              <div className={`w-14 shrink-0 h-full ${activeTheme.colors.sidebar} flex flex-col items-center pt-4 gap-3 transition-colors duration-500`}>
                <div className={`size-6 rounded-xl ${activeTheme.colors.accent} opacity-90`} />
                <div className={`size-6 rounded-lg ${activeTheme.colors.card} opacity-50`} />
                <div className={`size-6 rounded-lg ${activeTheme.colors.card} opacity-50`} />
              </div>
              {/* Content area */}
              <div className="flex-1 p-3 flex flex-col gap-2">
                <div className={`h-6 w-full rounded-xl ${activeTheme.colors.card} opacity-80 transition-colors duration-500`} />
                <div className="flex gap-2 flex-1">
                  <div className={`flex-1 rounded-xl ${activeTheme.colors.card} opacity-90 transition-colors duration-500`} />
                  <div className="flex flex-col gap-2 w-1/3">
                    <div className={`flex-1 rounded-xl ${activeTheme.colors.card} opacity-60 transition-colors duration-500`} />
                    <div className={`h-10 rounded-xl ${activeTheme.colors.accent} opacity-50 transition-colors duration-500`} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              {themes.map((th) => (
                <button
                  key={th.id}
                  onClick={() => setTheme(th.id)}
                  className={`relative flex size-12 items-center justify-center rounded-full border-2 transition-all ${theme === th.id ? "border-primary scale-110 shadow-md" : "border-transparent"}`}>
                  <div className={`size-10 rounded-full ${th.colors.bg} border shadow-inner`} />
                  {theme === th.id && (
                    <div className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-white">
                      <Check className="size-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-sm font-medium">{t(activeTheme.nameKey)}</p>
          </div>

          <div className="hidden gap-4 sm:grid sm:grid-cols-3">
            {themes.map((th) => {
              const isActive = theme === th.id
              const Icon = th.icon
              return (
                <button
                  key={th.id}
                  onClick={() => setTheme(th.id)}
                  className={`group relative overflow-hidden rounded-2xl border-2 p-1 transition-all duration-300 hover:scale-[1.02] ${isActive ? "border-primary shadow-lg shadow-primary/20" : "border-border hover:border-primary/40"}`}>
                  <div className={`${th.colors.bg} relative aspect-4/3 overflow-hidden rounded-xl flex`}>
                    {/* Sidebar strip */}
                    <div className={`w-7 shrink-0 h-full ${th.colors.sidebar} flex flex-col items-center pt-2 gap-1.5`}>
                      <div className={`size-3 rounded-md ${th.colors.accent} opacity-90`} />
                      <div className={`size-3 rounded-md ${th.colors.card} opacity-50`} />
                      <div className={`size-3 rounded-md ${th.colors.card} opacity-50`} />
                    </div>
                    {/* Content area */}
                    <div className="flex-1 p-1.5 flex flex-col gap-1.5">
                      <div className={`h-3 w-full rounded-lg ${th.colors.card} opacity-80`} />
                      <div className="flex gap-1.5 flex-1">
                        <div className={`flex-1 rounded-lg ${th.colors.card} opacity-90`} />
                        <div className="flex flex-col gap-1.5 w-1/3">
                          <div className={`flex-1 rounded-lg ${th.colors.card} opacity-60`} />
                          <div className={`h-4 rounded-lg ${th.colors.accent} opacity-50`} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2.5 text-left">
                    <div className="flex items-center gap-2">
                      <Icon className="size-4 text-muted-foreground" />
                      <p className="text-sm font-medium">{t(th.nameKey)}</p>
                    </div>
                    {isActive && <Check className="size-4 text-primary" />}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="h-px w-full bg-border/40" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-secondary">
                <Zap className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{t("highContrast.title")}</p>
                <p className="text-xs text-muted-foreground">{t("highContrast.description")}</p>
              </div>
            </div>
            <Switch id="contrast" checked={highContrast} onCheckedChange={setHighContrast} />
          </div>
        </div>
      </section>
    </div>
  )
}