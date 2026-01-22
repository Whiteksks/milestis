"use client"

import { useState } from "react"
import { Check, Sun, Moon, Laptop, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "next-themes"

const themes = [
  {
    id: "light",
    name: "Light",
    description: "Warm and cozy",
    icon: Sun,
    colors: { bg: "bg-amber-50", accent: "bg-rose-300", card: "bg-white", text: "bg-stone-400" },
  },
  {
    id: "cozy",
    name: "Cozy",
    description: "Soft and muted",
    icon: Sun,
    colors: { bg: "bg-orange-100", accent: "bg-amber-400", card: "bg-orange-50", text: "bg-amber-700" },
  },
  {
    id: "dark",
    name: "Dark",
    description: "Easy on the eyes",
    icon: Moon,
    colors: { bg: "bg-stone-900", accent: "bg-rose-400", card: "bg-stone-800", text: "bg-stone-500" },
  },
]

export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme()
  const [highContrast, setHighContrast] = useState(false)

  // Находим текущую активную тему для мобильного превью
  const activeTheme = themes.find((t) => t.id === theme) || themes[0]

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-border/40 bg-card/80 backdrop-blur-sm">
        <CardHeader className="flex flex-col md:flex-row items-center justify-between space-y-0 pb-7">
          <div className="space-y-1.5">
            <CardTitle>Color Theme</CardTitle>
            <CardDescription>Choose how Milestis looks for you</CardDescription>
          </div>
          <Select value={theme === 'system' ? 'system' : 'manual'} onValueChange={(v) => v === 'system' ? setTheme('system') : setTheme('light')}>
            <SelectTrigger className="w-auto bg-muted/50">
              <div className="flex items-center gap-2">
                <Laptop className="h-4 w-4" />
                <SelectValue placeholder="Syncing" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual Selection</SelectItem>
              <SelectItem value="system">Sync with System</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Mobile View: One Skeleton + Circles */}
          <div className="flex flex-col items-center gap-6 sm:hidden">
            <div className={`${activeTheme.colors.bg} relative aspect-video w-full overflow-hidden rounded-2xl border p-4 transition-colors duration-500`}>
               {/* Skeleton UI */}
               <div className={`absolute left-4 top-4 bottom-4 w-12 ${activeTheme.colors.card} rounded-xl opacity-90 shadow-sm`} />
               <div className={`absolute left-20 right-4 top-4 h-6 ${activeTheme.colors.card} rounded-lg opacity-90`} />
               <div className={`absolute left-20 right-4 top-14 h-16 ${activeTheme.colors.card} rounded-xl opacity-90`}>
                  <div className={`absolute right-3 top-3 h-5 w-12 ${activeTheme.colors.accent} rounded-full`} />
               </div>
            </div>
            
            <div className="flex gap-4">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`relative flex size-12 items-center justify-center rounded-full border-2 transition-all ${
                    theme === t.id ? "border-primary scale-110 shadow-md" : "border-transparent"
                  }`}
                >
                  <div className={`size-10 rounded-full ${t.colors.bg} border shadow-inner`} />
                  {theme === t.id && (
                    <div className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-white">
                      <Check className="size-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-sm font-medium">{activeTheme.name}</p>
          </div>

          {/* Desktop View: Grid (hidden on mobile) */}
          <div className="hidden gap-4 sm:grid sm:grid-cols-3">
            {themes.map((t) => {
              const isActive = theme === t.id
              const Icon = t.icon
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`group relative overflow-hidden rounded-2xl border-2 p-1 transition-all duration-300 hover:scale-[1.02] ${
                    isActive ? "border-primary shadow-lg shadow-primary/20" : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className={`${t.colors.bg} relative aspect-4/3 overflow-hidden rounded-xl p-3`}>
                    <div className={`absolute left-2 top-2 bottom-2 w-8 ${t.colors.card} rounded-lg opacity-90`}>
                      <div className={`mx-1.5 mt-2 h-1.5 w-5 ${t.colors.text} rounded-full opacity-60`} />
                    </div>
                    <div className={`absolute left-12 right-2 top-2 h-5 ${t.colors.card} rounded-lg opacity-90`} />
                    <div className={`absolute left-12 right-2 top-9 h-8 ${t.colors.card} rounded-lg opacity-90`}>
                      <div className={`absolute right-2 top-2 h-4 w-10 ${t.colors.accent} rounded-full`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2.5 text-left">
                    <div className="flex items-center gap-2">
                      <Icon className="size-4 text-muted-foreground" />
                      <p className="text-sm font-medium">{t.name}</p>
                    </div>
                    {isActive && <Check className="size-4 text-primary" />}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="h-px w-full bg-border/40" />

          {/* High Contrast Toggle */}
          <div className="flex items-center justify-between rounded-xl bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <Label htmlFor="contrast" className="text-base font-medium">High Contrast</Label>
                <p className="text-sm text-muted-foreground">Make muted colors more vivid and borders sharper</p>
              </div>
            </div>
            <Switch id="contrast" checked={highContrast} onCheckedChange={setHighContrast} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}