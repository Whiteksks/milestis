"use client"

import { useEffect, useState } from "react"
import { Check, Sun, Moon, Laptop, Zap } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "next-themes"
import AppearanceSettingsSkeleton from "./loading"
import { useTranslations } from "next-intl"

const themes = [
  {
    id: "light",
    nameKey: "themes.light.name",
    descriptionKey: "themes.light.description",
    icon: Sun,
    colors: { bg: "bg-amber-50", accent: "bg-rose-300", card: "bg-white", text: "bg-stone-400" },
  },
  {
    id: "cozy",
    nameKey: "themes.cozy.name",
    descriptionKey: "themes.cozy.description",
    icon: Sun,
    colors: { bg: "bg-orange-100", accent: "bg-amber-400", card: "bg-orange-50", text: "bg-amber-700" },
  },
  {
    id: "dark",
    nameKey: "themes.dark.name",
    descriptionKey: "themes.dark.description",
    icon: Moon,
    colors: { bg: "bg-stone-900", accent: "bg-rose-400", card: "bg-stone-800", text: "bg-stone-500" },
  },
]

export default function AppearanceSettings() {
  const t = useTranslations("account.appearance")
  const { theme, setTheme } = useTheme()
  const [highContrast, setHighContrast] = useState(false)

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
            <div className={`${activeTheme.colors.bg} relative aspect-video w-full overflow-hidden rounded-2xl border p-4 transition-colors duration-500`}>
              <div className={`absolute left-4 top-4 bottom-4 w-12 ${activeTheme.colors.card} rounded-xl opacity-90 shadow-sm`} />
              <div className={`absolute left-20 right-4 top-4 h-6 ${activeTheme.colors.card} rounded-lg opacity-90`} />
              <div className={`absolute left-20 right-4 top-14 h-16 ${activeTheme.colors.card} rounded-xl opacity-90`}>
                <div className={`absolute right-3 top-3 h-5 w-12 ${activeTheme.colors.accent} rounded-full`} />
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
                  <div className={`${th.colors.bg} relative aspect-4/3 overflow-hidden rounded-xl p-3`}>
                    <div className={`absolute left-2 top-2 bottom-2 w-8 ${th.colors.card} rounded-lg opacity-90`}>
                      <div className={`mx-1.5 mt-2 h-1.5 w-5 ${th.colors.text} rounded-full opacity-60`} />
                    </div>
                    <div className={`absolute left-12 right-2 top-2 h-5 ${th.colors.card} rounded-lg opacity-90`} />
                    <div className={`absolute left-12 right-2 top-9 h-8 ${th.colors.card} rounded-lg opacity-90`}>
                      <div className={`absolute right-2 top-2 h-4 w-10 ${th.colors.accent} rounded-full`} />
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