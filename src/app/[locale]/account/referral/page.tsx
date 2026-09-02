"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Users, Coins, Copy, Check, Mail } from "lucide-react"
import { FaWhatsapp, FaTelegram } from "react-icons/fa6"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { selectCurrentUid, useUserStore } from "@/hooks/useUserStore"
import { useReferralStats } from "@/hooks/useReferralStats"
import { buildReferralLink } from "@/lib/referral"

// Keep in sync with MILESTONE_TIERS in functions/src/users/referral.ts
const MILESTONES = [
  { threshold: 5, bonus: 50 },
  { threshold: 10, bonus: 100 },
  { threshold: 25, bonus: 250 },
]

export default function ReferralSettingsPage() {
  const t = useTranslations()
  const uid = useUserStore(selectCurrentUid)
  const { data, isLoading } = useReferralStats()
  const [copied, setCopied] = useState(false)

  const link = uid ? buildReferralLink(uid) : ""
  const shareMessage = t("referral.shareMessage")
  const encodedLink = encodeURIComponent(link)
  const encodedMessage = encodeURIComponent(shareMessage)

  const shareChannels = [
    {
      key: "whatsapp",
      label: t("referral.shareWhatsapp"),
      icon: FaWhatsapp,
      href: `https://wa.me/?text=${encodedMessage}%20${encodedLink}`,
      className: "bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20",
    },
    {
      key: "telegram",
      label: t("referral.shareTelegram"),
      icon: FaTelegram,
      href: `https://t.me/share/url?url=${encodedLink}&text=${encodedMessage}`,
      className: "bg-[#26A5E4]/10 text-[#26A5E4] hover:bg-[#26A5E4]/20",
    },
    {
      key: "email",
      label: t("referral.shareEmail"),
      icon: Mail,
      href: `mailto:?subject=${encodeURIComponent(t("referral.emailSubject"))}&body=${encodedMessage}%20${encodedLink}`,
      className: "bg-muted text-foreground hover:bg-muted/70",
    },
  ]

  const handleCopy = async () => {
    if (!link) return
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable — user can still select the text manually.
    }
  }

  const stats = [
    { key: "invited", icon: Users, labelKey: "referral.page.stats.invited", value: data?.count ?? 0 },
    { key: "earned", icon: Coins, labelKey: "referral.page.stats.earned", value: data?.creditsEarned ?? 0 },
  ]

  const referralCount = data?.count ?? 0
  const nextMilestone = MILESTONES.find((m) => referralCount < m.threshold)
  const milestoneProgress = nextMilestone ? Math.min(100, (referralCount / nextMilestone.threshold) * 100) : 100

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-8 pb-12">
        <section className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 rounded-xs" />
            <Skeleton className="h-4 w-72 rounded-xs" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-32 rounded-xs" />
            <Skeleton className="h-32 rounded-xs" />
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-12">

      {/* СЕКЦИЯ 1: Статистика */}
      <section className="space-y-4">
        <div className="flex items-center gap-4">
          <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            {t("referral.page.title")}
          </h2>
          <span className="h-px flex-1 bg-border/80" />
        </div>
        <p className="font-sans text-sm text-muted-foreground">{t("referral.page.description")}</p>

        <div className="grid gap-4 sm:grid-cols-2">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.key} className="rounded-xs border border-border bg-card p-5 md:p-6">
                <div className="flex size-9 items-center justify-center rounded-xs border border-border bg-secondary/50">
                  <Icon className="size-4 text-foreground" />
                </div>
                <div className="mt-4">
                  <p className="font-sans text-xs text-muted-foreground">{t(stat.labelKey)}</p>
                  <span className="mt-1 block font-mono text-4xl font-semibold tracking-tight text-foreground tabular-nums">
                    {stat.value.toLocaleString()}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="rounded-xs border border-border bg-card p-5 md:p-6">
          <div className="flex items-center justify-between">
            <p className="font-sans text-sm font-medium text-foreground">{t("referral.page.milestone.title")}</p>
            {nextMilestone && (
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {referralCount} / {nextMilestone.threshold}
              </span>
            )}
          </div>
          <Progress value={milestoneProgress} className="mt-3 h-1 bg-secondary rounded-none" />
          <p className="mt-2 font-sans text-xs text-muted-foreground">
            {nextMilestone
              ? t("referral.page.milestone.progress", {
                  count: referralCount,
                  threshold: nextMilestone.threshold,
                  bonus: nextMilestone.bonus,
                })
              : t("referral.page.milestone.complete")}
          </p>
        </div>
      </section>

      {/* СЕКЦИЯ 2: Ссылка-приглашение */}
      <section className="space-y-4">
        <div className="flex items-center gap-4">
          <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            {t("referral.page.linkTitle")}
          </h2>
          <span className="h-px flex-1 bg-border/80" />
        </div>
        <p className="font-sans text-sm text-muted-foreground">{t("referral.page.linkDescription")}</p>

        <div className="space-y-4 rounded-xs border border-border bg-card p-5 md:p-6">
          <div className="flex items-center gap-2 rounded-xs border border-border bg-background/50 p-2">
            <span className="flex-1 truncate px-2 font-mono text-xs text-muted-foreground">{link}</span>
            <Button size="sm" onClick={handleCopy} disabled={!link} className="shrink-0 rounded-xs">
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? t("referral.copied") : t("referral.copy")}
            </Button>
          </div>

          <div className="flex items-center gap-3">
            {shareChannels.map(({ key, label, icon: Icon, href, className }) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className={`flex size-10 items-center justify-center rounded-xs transition-colors ${link ? className : "bg-muted text-muted-foreground/40 pointer-events-none"}`}
              >
                <Icon className="size-4.5" />
              </a>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
