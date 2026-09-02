"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Gift, Copy, Check } from "lucide-react"
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

function ReferralModalBody({ locale }: { locale?: string }) {
  const t = useTranslations()
  const uid = useUserStore(selectCurrentUid)
  const [copied, setCopied] = useState(false)

  const link = uid ? buildReferralLink(uid, locale ?? "en") : ""

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

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 mx-auto">
        <Gift className="h-7 w-7 text-amber-600" />
      </div>

      <div className="text-center space-y-2">
        <h2 className="font-serif text-2xl font-medium tracking-tight">
          {t("referral.title")}
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {t("referral.description")}
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 p-2">
        <span className="flex-1 truncate px-2 text-xs text-muted-foreground">{link}</span>
        <Button size="sm" onClick={handleCopy} disabled={!link} className="shrink-0 rounded-lg">
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? t("referral.copied") : t("referral.copy")}
        </Button>
      </div>
    </div>
  )
}

interface ReferralModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  locale?: string
}

function ReferralModal({ open, onOpenChange, locale }: ReferralModalProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <MobileDrawer open={open} onOpenChange={onOpenChange}>
        <ReferralModalBody locale={locale} />
      </MobileDrawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">Invite friends</DialogTitle>
      <DialogDescription className="sr-only">Invite friends and earn credits</DialogDescription>
      <DialogContent className="overflow-hidden rounded-2xl border border-border/40 bg-background p-0 sm:max-w-2xl">
        <ReferralModalBody locale={locale} />
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
          className="h-9 rounded-lg bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 hover:text-amber-800 font-medium transition-colors"
        >
          <Gift className="!size-4.5" />
          <span className="text-sm">{t("referral.button")}</span>
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
        className="fixed bottom-20 right-4 z-40 flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 transition-transform active:scale-95 md:hidden"
      >
        <Gift className="size-5" />
      </button>
      <ReferralModal open={open} onOpenChange={setOpen} locale={locale} />
    </>
  )
}
