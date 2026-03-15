"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Globe, Bell, Download, FileText, Lightbulb, Trophy, Clock, RefreshCw, Sparkles, Newspaper } from "lucide-react"
import { LanguageSwitcher } from "@/components/ui/custom/LangSwitch"
import { useUserStore } from "@/hooks/useUserStore"
import { saveUserProfile } from "@/lib/user"
import { toastUser } from "@/lib/toast"

const notificationItems = [
  {
    key: "project_updates" as const,
    icon: RefreshCw,
    label: "Project Updates",
    desc: "Get notified when your published project status changes",
  },
  {
    key: "project_reminders" as const,
    icon: Clock,
    label: "Project Reminders",
    desc: "Reminders to continue working on unfinished projects",
  },
  {
    key: "project_milestones" as const,
    icon: Trophy,
    label: "Project Milestones",
    desc: "Celebrate when your projects reach new view or share counts",
  },
  {
    key: "whats_new" as const,
    icon: Newspaper,
    label: "What's New",
    desc: "Feature announcements and platform updates",
  },
  {
    key: "personalized_recommendations" as const,
    icon: Lightbulb,
    label: "Personalized Recommendations",
    desc: "Tips and template suggestions tailored to your work",
  },
  {
    key: "seasonal_specials" as const,
    icon: Sparkles,
    label: "Seasonal Specials",
    desc: "Holiday themes, limited-time offers and special collections",
  },
] as const

type NotificationKey = typeof notificationItems[number]["key"]

export default function AccountSettings() {
  const { profile } = useUserStore()
  const [notifications, setNotifications] = useState<Record<NotificationKey, boolean>>({
    project_updates: true,
    project_reminders: false,
    project_milestones: true,
    whats_new: true,
    personalized_recommendations: true,
    seasonal_specials: false,
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!profile?.settings?.notifications) return
    const n = profile.settings.notifications
    setNotifications({
      project_updates: n.project_updates ?? true,
      project_reminders: n.project_reminders ?? false,
      project_milestones: n.project_milestones ?? true,
      whats_new: n.whats_new ?? true,
      personalized_recommendations: n.personalized_recommendations ?? true,
      seasonal_specials: n.seasonal_specials ?? false,
    })
  }, [profile?.uid])

  const toggle = (key: NotificationKey, value: boolean) =>
    setNotifications((prev) => ({ ...prev, [key]: value }))

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      await toastUser.saveSettings(
        saveUserProfile({ settings: { notifications } })
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-12">

      {/* Language */}
      <section className="max-w-4xl space-y-6">
        <div className="space-y-1 px-1">
          <h2 className="font-serif text-2xl tracking-tight text-foreground">Preferences</h2>
          <p className="text-sm text-muted-foreground">
            Manage your language and regional interface settings.
          </p>
        </div>

        {/* Карточка настройки */}
        <div className="group rounded-xl border border-border/50 bg-card p-5 shadow-sm transition-all hover:border-border/80">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            
            {/* Левая часть: Иконка и Текст (занимает всё свободное место) */}
            <div className="flex flex-1 items-start gap-4">
              <div className="mt-1 hidden rounded-md border border-border/50 p-2 shadow-sm sm:block">
                <Globe className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="space-y-1">
                <Label className="text-[15px] font-semibold tracking-tight">
                  Interface Language
                </Label>
                <p className="max-w-[440px] text-xs leading-relaxed text-muted-foreground">
                  Select the language used for menus and system notifications. 
                  <span className="ml-1 text-primary/70 font-medium italic">
                    Note: This won't translate your project data.
                  </span>
                </p>
              </div>
            </div>

            {/* Правая часть: Компактный Switcher */}
            <div className="w-full sm:w-auto sm:min-w-[180px]">
              <div className="[&_button]:h-9 [&_button]:w-full [&_button]:justify-between [&_button]:px-3 [&_button]:text-sm">
                <LanguageSwitcher />
              </div>
            </div>

          </div>
        </div>
      </section>
      {/* Notifications - Обновленный блок (2 колонки) */}
      <section className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl">Notifications</h2>
          <p className="mt-1 text-muted-foreground">Emails you would like to receive</p>
        </div>
        
        {/* Здесь мы используем grid для создания 2 колонок на экранах md и больше */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notificationItems.map(({ key, icon: Icon, label, desc }) => (
            <div 
              key={key} 
              className="flex items-start justify-between gap-4 p-5 rounded-2xl bg-card shadow-sm border border-border/40 hover:border-border transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col gap-1 mt-0.5">
                  <p className="font-medium leading-none">{label}</p>
                  <p className="text-sm text-muted-foreground leading-snug">{desc}</p>
                </div>
              </div>
              <Switch
                className="mt-1 shrink-0"
                checked={notifications[key]}
                onCheckedChange={(v) => toggle(key, v)}
              />
            </div>
          ))}
        </div>
        
        <div className="flex justify-end">
          <Button className="rounded-full px-8" onClick={handleSaveSettings} disabled={saving}>
            {saving ? "Saving…" : "Save Settings"}
          </Button>
        </div>
      </section>

      {/* Data */}
      <section className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl">Data & Export</h2>
          <p className="mt-1 text-muted-foreground">Download your account information and project data</p>
        </div>
        <div className="rounded-2xl bg-card p-6 shadow-sm space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" className="flex-1 justify-start gap-2 rounded-full bg-transparent">
              <Download className="h-4 w-4" />
              Download Account Data
            </Button>
            <Button variant="outline" className="flex-1 justify-start gap-2 rounded-full bg-transparent">
              <FileText className="h-4 w-4" />
              Export Project Metadata
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Account data includes your profile, preferences, and usage history.
          </p>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl text-muted-foreground">Danger Zone</h2>
          <p className="mt-1 text-muted-foreground">Permanent actions that cannot be undone</p>
        </div>
        <div className="rounded-2xl bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">Delete your account</p>
              <p className="text-sm text-muted-foreground">This will permanently remove all your projects and data.</p>
            </div>
            <Button
              variant="outline"
              className="shrink-0 rounded-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive bg-transparent"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </section>

    </div>
  )
}