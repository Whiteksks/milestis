"use client"

import { useEffect, useState } from "react"
import { useShallow } from "zustand/react/shallow"
import { signOut } from "firebase/auth"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe, Download, Package, Lightbulb, Trophy, Clock, RefreshCw, Sparkles, Newspaper } from "lucide-react"
import { setLocaleCookie } from "@/components/ui/custom/LangSwitch"
import { useUserStore, selectSubscription } from "@/hooks/useUserStore"
import { isEffectivePaidSubscription } from "@/lib/billing/billing.utils"
import { auth } from "@/lib/firebase/firebase"
import { deleteAccount, downloadAccountData, downloadProjectContent, saveUserProfile } from "@/lib/user"
import { toastUser } from "@/lib/toast"
import { useTranslations } from "next-intl"
import { useQuery } from "@tanstack/react-query"
import { DeleteAccountModal } from "@/components/layout/settings/delete-account-modal"
import { collection, getDocs, orderBy, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { projectKeys, mapProjectDoc } from "@/hooks/useProjectsQuery"

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
  const { profile, clearProfile } = useUserStore(
    useShallow((state) => ({
      profile: state.profile,
      clearProfile: state.clearProfile,
    }))
  )
  const subscription = useUserStore(selectSubscription)
  const [notifications, setNotifications] = useState<Record<NotificationKey, boolean>>({
    project_updates: true,
    project_reminders: false,
    project_milestones: true,
    whats_new: true,
    personalized_recommendations: true,
    seasonal_specials: false,
  })
  const [saving, setSaving] = useState(false)
  const [selectedLang, setSelectedLang] = useState<'en' | 'ru' | 'kz'>(
    (profile?.settings?.language) ?? (locale as 'en' | 'ru' | 'kz') ?? 'en'
  )
  const [exportingAccountData, setExportingAccountData] = useState(false)
  const [exportingProjectContent, setExportingProjectContent] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string>("")
  const [deletingAccount, setDeletingAccount] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const hasBlockingSubscription = isEffectivePaidSubscription(subscription) && subscription?.cancelAtPeriodEnd !== true

  const { data: exportableProjects = [] } = useQuery({
    queryKey: profile?.uid ? [...projectKeys.all(profile.uid), "export-list"] : ["no-user"],
    enabled: !!profile?.uid,
    queryFn: async () => {
      const uid = profile!.uid
      const snap = await getDocs(
        query(
          collection(db, "projects"),
          where("ownerId", "==", uid),
          where("status", "in", ["active", "archived"]),
          orderBy("updatedAt", "desc"),
        ),
      )
      return snap.docs.map((d) => mapProjectDoc(d.data(), d.id))
    },
  })

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
  }, [profile?.settings?.notifications])

  useEffect(() => {
    if (profile?.settings?.language) {
      setSelectedLang(profile.settings.language)
    }
  }, [profile?.settings?.language])

  const toggle = (key: NotificationKey, value: boolean) =>
    setNotifications((prev) => ({ ...prev, [key]: value }))

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      toastUser.saveSettings(
        saveUserProfile({ settings: { notifications, language: selectedLang } })
      )
      setLocaleCookie(selectedLang)
      if (selectedLang !== locale) {
        router.push(`/${selectedLang}/account/settings`)
      }
    } finally {
      setSaving(false)
    }
  }

  const handleExportAccountData = async () => {
    setExportingAccountData(true)
    try {
      toastUser.exportData(downloadAccountData())
    } finally {
      setExportingAccountData(false)
    }
  }

  const handleExportProjectContent = async () => {
    if (!selectedProjectId) return
    setExportingProjectContent(true)
    try {
      toastUser.exportData(downloadProjectContent(selectedProjectId))
    } finally {
      setExportingProjectContent(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeletingAccount(true)
    try {
      await toastUser.deleteAccount(deleteAccount())
      setDeleteModalOpen(false)
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
    <>
      <div className="mx-auto max-w-5xl space-y-10 pb-12">
        
        {/* Preferences / Interface Language */}
        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
              {t("preferences.title")}
            </h2>
            <span className="h-px flex-1 bg-border/80" />
          </div>
          <p className="font-sans text-sm text-muted-foreground">{t("preferences.description")}</p>

          <div className="rounded-xs border border-border bg-card p-5 md:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              
              <div className="flex flex-1 items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xs border border-border bg-secondary/50">
                  <Globe className="size-5 text-foreground" />
                </div>
                <div className="space-y-1">
                  <Label className="font-sans text-sm font-medium text-foreground">
                    {t("interfaceLanguage.label")}
                  </Label>
                  <p className="font-sans text-sm text-muted-foreground">
                    {t("interfaceLanguage.description")}{" "}
                    <span className="font-medium text-foreground/80 italic">{t("interfaceLanguage.note")}</span>
                  </p>
                </div>
              </div>

              <div className="w-full sm:w-auto sm:min-w-[200px] shrink-0 pt-2 sm:pt-0">
                <Select value={selectedLang} onValueChange={(v) => setSelectedLang(v as 'en' | 'ru' | 'kz')}>
                  <SelectTrigger className="h-9 w-full rounded-xs border-border bg-background font-sans text-sm focus:ring-1 focus:ring-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xs border-border bg-popover font-sans text-sm">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ru">Русский</SelectItem>
                    <SelectItem value="kz">Қазақша</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
              {t("notifications.title")}
            </h2>
            <span className="h-px flex-1 bg-border/80" />
          </div>
          <p className="font-sans text-sm text-muted-foreground">{t("notifications.description")}</p>

          <div className="rounded-xs border border-border bg-card p-5 md:p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notificationItems.map(({ key, icon: Icon, labelKey, descKey }) => (
                <div 
                  key={key} 
                  className="flex items-start justify-between gap-4 p-4 rounded-xs border border-border bg-background/50"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xs border border-border bg-secondary/50">
                      <Icon className="size-4 text-foreground" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <p className="font-sans text-sm font-medium leading-none text-foreground">{t(labelKey)}</p>
                      <p className="font-sans text-xs leading-relaxed text-muted-foreground">{t(descKey)}</p>
                    </div>
                  </div>
                  <Switch
                    className="shrink-0 data-[state=checked]:bg-foreground"
                    checked={notifications[key]}
                    onCheckedChange={(v) => toggle(key, v)}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end border-t border-border/80 pt-4">
              <Button 
                className="h-9 rounded-xs bg-foreground px-5 font-sans text-xs font-medium text-background transition-colors hover:bg-foreground/90" 
                onClick={handleSaveSettings} 
                disabled={saving}
              >
                {saving ? t("save.saving") : t("save.saveSettings")}
              </Button>
            </div>
          </div>
        </section>

        {/* Data Management */}
        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
              {t("data.title")}
            </h2>
            <span className="h-px flex-1 bg-border/80" />
          </div>
          <p className="font-sans text-sm text-muted-foreground">{t("data.description")}</p>

          <div className="rounded-xs border border-border bg-card p-5 md:p-6 space-y-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <Button
                variant="outline"
                className="h-9 rounded-xs border-border px-4 font-sans text-xs hover:bg-secondary/60 w-full sm:w-auto"
                onClick={handleExportAccountData}
                disabled={exportingAccountData || exportingProjectContent || deletingAccount}
              >
                <Download className="mr-2 size-4 text-muted-foreground" />
                <span>{t("data.downloadAccountData")}</span>
              </Button>

              {exportableProjects.length > 0 && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full lg:w-auto">
                  <Select
                    value={selectedProjectId}
                    onValueChange={setSelectedProjectId}
                    disabled={exportingProjectContent || deletingAccount}
                  >
                    <SelectTrigger className="h-9 w-full sm:w-[220px] rounded-xs border-border bg-background font-sans text-sm">
                      <SelectValue placeholder={t("data.selectProject")} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xs border-border bg-popover font-sans text-sm">
                      {exportableProjects.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    className="h-9 rounded-xs border-border px-4 font-sans text-xs hover:bg-secondary/60 w-full sm:w-auto"
                    onClick={handleExportProjectContent}
                    disabled={!selectedProjectId || exportingProjectContent || deletingAccount}
                  >
                    <Package className="mr-2 size-4 text-muted-foreground" />
                    <span>{t("data.exportProjectContent")}</span>
                  </Button>
                </div>
              )}
            </div>

            <div className="border-t border-border/80 pt-4">
              <p className="font-sans text-xs leading-relaxed text-muted-foreground">{t("data.descriptionLong")}</p>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <h2 className="font-serif text-2xl font-medium tracking-tight text-destructive sm:text-3xl">
              {t("danger.title")}
            </h2>
            <span className="h-px flex-1 bg-destructive/30" />
          </div>
          <p className="font-sans text-sm text-muted-foreground">{t("danger.description")}</p>

          <div className="rounded-xs border border-destructive/30 bg-destructive/5 p-5 md:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1 min-w-0">
                <p className="font-sans text-sm font-medium text-foreground">{t("danger.deleteTitle")}</p>
                <p className="font-sans text-sm text-muted-foreground">{t("danger.deleteDescription")}</p>
              </div>
              <Button
                variant="destructive"
                className="h-9 rounded-xs px-4 font-sans text-xs font-medium shrink-0"
                onClick={() => setDeleteModalOpen(true)}
                disabled={deletingAccount || exportingAccountData || exportingProjectContent}
              >
                {t("danger.deleteButton")}
              </Button>
            </div>
          </div>
        </section>

      </div>

      <DeleteAccountModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDeleteAccount}
        loading={deletingAccount}
        userEmail={profile?.email ?? ""}
        hasActiveSub={hasBlockingSubscription}
        billingHref={`/${locale}/account/billing`}
      />
    </>
  )
}
