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
    <div className="space-y-16 max-w-5xl mx-auto pb-12">
      <section className="space-y-6">
        <div className="space-y-1 px-1">
          <h2 className="font-serif text-2xl md:text-3xl tracking-tight text-foreground">{t("preferences.title")}</h2>
          <p className="text-sm text-muted-foreground/90">{t("preferences.description")}</p>
        </div>

        <div className="group rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:border-border/100 hover:shadow-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            
            <div className="flex flex-1 items-center gap-4">
              <div className="hidden rounded-xl border border-border/60 bg-secondary/30 p-2.5 shadow-sm sm:block transition-colors group-hover:bg-secondary">
                <Globe className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
              </div>
              <div className="space-y-1">
                <Label className="text-[16px] font-semibold tracking-tight">{t("interfaceLanguage.label")}</Label>
                <p className="max-w-xl text-xs leading-relaxed text-muted-foreground/80">
                  {t("interfaceLanguage.description")} 
                  <span className="ml-1.5 text-primary/80 font-medium italic">{t("interfaceLanguage.note")}</span>
                </p>
              </div>
            </div>

            <div className="w-full sm:w-auto sm:min-w-[200px]">
              <Select value={selectedLang} onValueChange={(v) => setSelectedLang(v as 'en' | 'ru' | 'kz')}>
                <SelectTrigger className="h-10 w-full rounded-full px-4 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
      <section className="space-y-6">
        <div className="px-1">
          <h2 className="font-serif text-2xl md:text-3xl tracking-tight text-foreground">{t("notifications.title")}</h2>
          <p className="mt-1 text-sm text-muted-foreground/90">{t("notifications.description")}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notificationItems.map(({ key, icon: Icon, labelKey, descKey }) => (
            <div 
              key={key} 
              className="flex items-center justify-between gap-4 p-5 rounded-2xl bg-card shadow-sm border border-border/50 hover:border-border/90"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary/50 group-hover:bg-primary/10 transition-colors duration-300">
                  <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="font-medium text-[15px] leading-tight text-foreground">{t(labelKey)}</p>
                  <p className="text-xs text-muted-foreground/80 leading-normal max-w-[260px] sm:max-w-none">{t(descKey)}</p>
                </div>
              </div>
              <Switch
                className="shrink-0 data-[state=checked]:bg-primary"
                checked={notifications[key]}
                onCheckedChange={(v) => toggle(key, v)}
              />
            </div>
          ))}
        </div>
        
        <div className="flex justify-end pt-2">
          <Button className="rounded-full px-8 h-10 shadow-sm font-medium hover:opacity-90 transition-opacity" onClick={handleSaveSettings} disabled={saving}>
            {saving ? t("save.saving") : t("save.saveSettings")}
          </Button>
        </div>
      </section>

      {/* Data Management */}
      <section className="space-y-6">
        <div className="px-1">
          <h2 className="font-serif text-2xl md:text-3xl tracking-tight text-foreground">{t("data.title")}</h2>
          <p className="mt-1 text-sm text-muted-foreground/90">{t("data.description")}</p>
        </div>
        <div className="rounded-2xl bg-card border border-border/50 p-6 shadow-sm space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Button
              variant="outline"
              className="w-full justify-center gap-2 rounded-full bg-transparent h-10 sm:w-auto px-5 border-border/80 hover:bg-secondary/50 transition-colors"
              onClick={handleExportAccountData}
              disabled={exportingAccountData || exportingProjectContent || deletingAccount}
            >
              <Download className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{t("data.downloadAccountData")}</span>
            </Button>

            {exportableProjects.length > 0 && (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full lg:w-auto">
                <Select
                  value={selectedProjectId}
                  onValueChange={setSelectedProjectId}
                  disabled={exportingProjectContent || deletingAccount}
                >
                  <SelectTrigger className="h-10 w-full sm:w-[220px] rounded-full text-sm border-border/80 px-4">
                    <SelectValue placeholder={t("data.selectProject")} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {exportableProjects.map((p) => (
                      <SelectItem key={p.id} value={p.id} className="rounded-lg">
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto shrink-0 gap-2 rounded-full bg-transparent h-10 px-5 border-border/80 hover:bg-secondary/50 transition-colors"
                  onClick={handleExportProjectContent}
                  disabled={!selectedProjectId || exportingProjectContent || deletingAccount}
                >
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{t("data.exportProjectContent")}</span>
                </Button>
              </div>
            )}
          </div>
          <div className="border-t border-border/40 pt-4">
            <p className="text-xs text-muted-foreground/70 leading-relaxed">{t("data.descriptionLong")}</p>
          </div>
        </div>
      </section>

      {/* Privacy & Cookies */}
      <section className="space-y-6">
        <div className="px-1">
          <h2 className="font-serif text-2xl md:text-3xl tracking-tight text-foreground">{t("privacy.title")}</h2>
          <p className="mt-1 text-sm text-muted-foreground/90">{t("privacy.description")}</p>
        </div>
        <div className="rounded-2xl bg-card border border-border/50 p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="font-semibold text-foreground text-[15px]">{t("privacy.preferencesButton")}</p>
              <p className="text-xs text-muted-foreground/80 max-w-xl leading-normal">{t("privacy.preferencesDescription")}</p>
            </div>
            <Button
              variant="outline"
              className="shrink-0 rounded-full h-10 px-6 border-border/80 hover:bg-secondary/50 font-medium transition-colors"
              onClick={() => (window as Window & { _iub?: { cs?: { api?: { openPreferences?: () => void } } } })._iub?.cs?.api?.openPreferences?.()}
            >
              {t("privacy.preferencesButton")}
            </Button>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="space-y-6">
        <div className="px-1">
          <h2 className="font-serif text-2xl md:text-3xl tracking-tight text-destructive/90">{t("danger.title")}</h2>
          <p className="mt-1 text-sm text-muted-foreground/90">{t("danger.description")}</p>
        </div>
        <div className="rounded-2xl border border-destructive/20 bg-destructive/[0.01] p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="font-semibold text-foreground text-[15px]">{t("danger.deleteTitle")}</p>
              <p className="text-xs text-muted-foreground/80 max-w-xl leading-normal">{t("danger.deleteDescription")}</p>
            </div>
            <Button
              className="shrink-0 rounded-full h-10 px-6 border-destructive/60 text-primary-foreground hover:bg-destructive hover:text-destructive-foreground font-medium transition-all duration-200"
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