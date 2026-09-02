"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Gift, Copy, Check, Mail, ArrowRight } from "lucide-react"
import { FaWhatsapp, FaTelegram } from "react-icons/fa6"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { MobileDrawer } from "@/components/ui/custom/mobile-drawer"
import { Button } from "@/components/ui/button"
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { selectCurrentUid, useUserStore } from "@/hooks/useUserStore"
import { buildReferralLink } from "@/lib/referral"

function ReferralModalBody({ onNavigateToStats }: { onNavigateToStats: () => void }) {
  const t = useTranslations()
  const uid = useUserStore(selectCurrentUid)
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
      className: "bg-muted text-foreground border-border hover:bg-muted/80",
    },
    {
      key: "telegram",
      label: t("referral.shareTelegram"),
      icon: FaTelegram,
      href: `https://t.me/share/url?url=${encodedLink}&text=${encodedMessage}`,
      className: "bg-muted text-foreground border-border hover:bg-muted/80",
    },
    {
      key: "email",
      label: t("referral.shareEmail"),
      icon: Mail,
      href: `mailto:?subject=${encodeURIComponent(t("referral.emailSubject"))}&body=${encodedMessage}%20${encodedLink}`,
      className: "bg-muted text-foreground border-border hover:bg-muted/80",
    },
  ]

  const handleCopy = async () => {
    if (!link) return
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-6 text-left max-h-[85vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xs border border-border bg-secondary/50">
          <Gift className="size-4 text-foreground" />
        </div>
        <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground">
          {t("referral.title")}
        </h2>
      </div>
      <p className="font-sans text-sm text-muted-foreground">
        {t("referral.description")}
      </p>

      {/* Referral Link */}
      <div className="flex items-center gap-2 rounded-xs border border-border bg-background/50 p-2">
        <span className="flex-1 truncate px-2 font-mono text-xs text-muted-foreground">
          {link}
        </span>
        <Button size="sm" onClick={handleCopy} disabled={!link} className="shrink-0 rounded-xs">
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? t("referral.copied") : t("referral.copy")}
        </Button>
      </div>

      {/* Share Channels - Растянутая сетка без пустого пространства */}
      <div className="space-y-2">
        <p className="font-sans text-xs text-muted-foreground">{t("referral.shareVia")}</p>
        <div className="grid grid-cols-3 gap-2.5">
          {shareChannels.map(({ key, label, icon: Icon, href, className }) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className={`flex h-10 w-full items-center justify-center gap-2 rounded-xs border px-3 text-xs font-medium transition-colors ${
                link ? className : "bg-muted text-muted-foreground/40 border-transparent pointer-events-none"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              <span className="truncate">{label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Track progress teaser */}
      <button
        type="button"
        onClick={onNavigateToStats}
        className="flex w-full items-center justify-between rounded-xs border border-border bg-card p-4 text-left transition-colors hover:bg-muted/40"
      >
        <span className="font-sans text-sm font-medium text-foreground">{t("referral.trackProgress")}</span>
        <ArrowRight className="size-4 text-muted-foreground" />
      </button>
    </div>
  )
}

interface ReferralModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  locale?: string
}

export function ReferralModal({ open, onOpenChange, locale }: ReferralModalProps) {
  const isMobile = useIsMobile()
  const router = useRouter()

  const handleNavigateToStats = () => {
    onOpenChange(false)
    router.push(locale ? `/${locale}/account/referral` : "/account/referral")
  }

  if (isMobile) {
    return (
      <MobileDrawer open={open} onOpenChange={onOpenChange}>
        <ReferralModalBody onNavigateToStats={handleNavigateToStats} />
      </MobileDrawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">Invite friends</DialogTitle>
      <DialogDescription className="sr-only">Invite friends and earn credits</DialogDescription>
      <DialogContent className="rounded-2xl border border-border/60 bg-background p-0 sm:max-w-xl duration-150 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
        <ReferralModalBody onNavigateToStats={handleNavigateToStats} />
      </DialogContent>
    </Dialog>
  )
}

/** Highlighted entry above "Settings" in the desktop sidebar footer. */
export function SidebarReferralButton({ locale }: { locale?: string }) {
  const [open, setOpen] = useState(false)
  const t = useTranslations()

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => setOpen(true)}
          tooltip={t("referral.button")}
          className="relative h-9 rounded-xl border border-primary/20 bg-primary/5 text-foreground hover:bg-primary/10 hover:text-foreground font-medium transition-colors"
        >
          <Gift className="!size-4 text-primary shrink-0" />
          <span className="text-sm font-sans flex-1 truncate">{t("referral.button")}</span>
          <span className="relative flex size-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex size-2 rounded-full bg-primary"></span>
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <ReferralModal open={open} onOpenChange={setOpen} locale={locale} />
    </>
  )
}

/** Static floating button above the mobile bottom nav bar. */
export function MobileReferralButton({ locale }: { locale?: string }) {
  const [open, setOpen] = useState(false)
  const t = useTranslations()

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("referral.button")}
        className="fixed bottom-20 right-4 z-40 flex size-11 items-center justify-center rounded-full border border-primary/30 bg-background text-primary shadow-lg transition-transform active:scale-95 md:hidden"
      >
        <Gift className="size-5" />
        <span className="absolute top-0 right-0 flex size-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex size-2.5 rounded-full bg-primary"></span>
        </span>
      </button>
      <ReferralModal open={open} onOpenChange={setOpen} locale={locale} />
    </>
  )
}