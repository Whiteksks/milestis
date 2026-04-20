"use client"

import { useEffect, useState } from "react"
import { signOut } from "firebase/auth"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Globe, Download, FileText, Lightbulb, Trophy, Clock, RefreshCw, Sparkles, Newspaper } from "lucide-react"
import { LanguageSwitcher } from "@/components/ui/custom/LangSwitch"
import { useUserStore } from "@/hooks/useUserStore"
import { auth } from "@/lib/firebase/firebase"
import { deleteAccount, downloadAccountData, downloadProjectMetadata, saveUserProfile } from "@/lib/user"
import { toastUser } from "@/lib/toast"
import { useTranslations } from "next-intl"

const notificationItems = [
  {
    key: "project_updates" as const,
    icon: RefreshCw,
    labelKey: "notifications.items.project_updates.label",
    descKey: "notifications.items.project_updates.desc",
  },
  {
    key: "project_reminders" as const,
    icon: Clock,
    labelKey: "notifications.items.project_reminders.label",
    descKey: "notifications.items.project_reminders.desc",
  },
  {
    key: "project_milestones" as const,
    icon: Trophy,
    labelKey: "notifications.items.project_milestones.label",
    descKey: "notifications.items.project_milestones.desc",
  },
  {
    key: "whats_new" as const,
    icon: Newspaper,
    labelKey: "notifications.items.whats_new.label",
    descKey: "notifications.items.whats_new.desc",
  },
  {
    key: "personalized_recommendations" as const,
    icon: Lightbulb,
    labelKey: "notifications.items.personalized_recommendations.label",
    descKey: "notifications.items.personalized_recommendations.desc",
  },
  {
    key: "seasonal_specials" as const,
    icon: Sparkles,
    labelKey: "notifications.items.seasonal_specials.label",
    descKey: "notifications.items.seasonal_specials.desc",
  },
] as const

type NotificationKey = typeof notificationItems[number]["key"]

export default function AccountSettings() {
  const t = useTranslations("account.settings")
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const { profile, clearProfile } = useUserStore()
  const [notifications, setNotifications] = useState<Record<NotificationKey, boolean>>({
    project_updates: true,
    project_reminders: false,
    project_milestones: true,
    whats_new: true,
    personalized_recommendations: true,
    seasonal_specials: false,
  })
  const [saving, setSaving] = useState(false)
  const [exportingAccountData, setExportingAccountData] = useState(false)
  const [exportingProjectData, setExportingProjectData] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleExportAccountData = async () => {
    setExportingAccountData(true)
    try {
      await toastUser.exportData(downloadAccountData())
    } finally {
      setExportingAccountData(false)
    }
  }

  const handleExportProjectMetadata = async () => {
    setExportingProjectData(true)
    try {
      await toastUser.exportData(downloadProjectMetadata())
    } finally {
      setExportingProjectData(false)
    }
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(`${t("danger.deleteTitle")}\n\n${t("danger.deleteDescription")}`)
    if (!confirmed) return

    setDeletingAccount(true)
    try {
      await toastUser.deleteAccount(deleteAccount())
      clearProfile()
      try {
        await signOut(auth)
      } catch {
        // The auth user may already be invalid after server-side deletion.
      }
      router.push(`/${locale}`)
      router.refresh()
    } finally {
      setDeletingAccount(false)
    }
  }

  return (
    <div className="space-y-12">

      {/* Language */}
      <section className="max-w-4xl space-y-6">
        <div className="space-y-1 px-1">
          <h2 className="font-serif text-2xl tracking-tight text-foreground">{t("preferences.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("preferences.description")}</p>
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
                <Label className="text-[15px] font-semibold tracking-tight">{t("interfaceLanguage.label")}</Label>
                <p className="max-w-[440px] text-xs leading-relaxed text-muted-foreground">
                  {t("interfaceLanguage.description")} 
                  <span className="ml-1 text-primary/70 font-medium italic">{t("interfaceLanguage.note")}</span>
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
          <h2 className="font-serif text-2xl md:text-3xl">{t("notifications.title")}</h2>
          <p className="mt-1 text-muted-foreground">{t("notifications.description")}</p>
        </div>
        
        {/* Здесь мы используем grid для создания 2 колонок на экранах md и больше */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notificationItems.map(({ key, icon: Icon, labelKey, descKey }) => (
            <div 
              key={key} 
              className="flex items-start justify-between gap-4 p-5 rounded-2xl bg-card shadow-sm border border-border/40 hover:border-border transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col gap-1 mt-0.5">
                  <p className="font-medium leading-none">{t(labelKey)}</p>
                  <p className="text-sm text-muted-foreground leading-snug">{t(descKey)}</p>
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
            {saving ? t("save.saving") : t("save.saveSettings")}
          </Button>
        </div>
      </section>

      {/* Data */}
      <section className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl">{t("data.title")}</h2>
          <p className="mt-1 text-muted-foreground">{t("data.description")}</p>
        </div>
        <div className="rounded-2xl bg-card p-6 shadow-sm space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              className="flex-1 justify-start gap-2 rounded-full bg-transparent"
              onClick={handleExportAccountData}
              disabled={exportingAccountData || exportingProjectData || deletingAccount}
            >
              <Download className="h-4 w-4" />
              {t("data.downloadAccountData")}
            </Button>
            <Button
              variant="outline"
              className="flex-1 justify-start gap-2 rounded-full bg-transparent"
              onClick={handleExportProjectMetadata}
              disabled={exportingProjectData || exportingAccountData || deletingAccount}
            >
              <FileText className="h-4 w-4" />
              {t("data.exportProjectMetadata")}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">{t("data.descriptionLong")}</p>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl text-muted-foreground">{t("danger.title")}</h2>
          <p className="mt-1 text-muted-foreground">{t("danger.description")}</p>
        </div>
        <div className="rounded-2xl bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">{t("danger.deleteTitle")}</p>
              <p className="text-sm text-muted-foreground">{t("danger.deleteDescription")}</p>
            </div>
            <Button
              variant="outline"
              className="shrink-0 rounded-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive bg-transparent"
              onClick={handleDeleteAccount}
              disabled={deletingAccount || exportingAccountData || exportingProjectData}
            >
              {t("danger.deleteButton")}
            </Button>
          </div>
        </div>
      </section>

    </div>
  )
}