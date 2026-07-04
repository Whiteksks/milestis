"use client"

import { useState } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { AlertTriangle, CreditCard, ExternalLink, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DeleteAccountModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  loading: boolean
  userEmail: string
  /** Whether the user currently has an active paid subscription. */
  hasActiveSub?: boolean
  /** URL to the billing/subscription settings page. */
  billingHref?: string
}

export function DeleteAccountModal({
  open,
  onOpenChange,
  onConfirm,
  loading,
  userEmail,
  hasActiveSub,
  billingHref,
}: DeleteAccountModalProps) {
  const t = useTranslations("account.settings.danger")
  const [inputValue, setInputValue] = useState("")

  const isConfirmed = inputValue.trim().toLowerCase() === userEmail.trim().toLowerCase()

  function handleClose() {
    if (loading) return
    setInputValue("")
    onOpenChange(false)
  }

  function handleConfirm() {
    if (!isConfirmed || loading) return
    onConfirm()
  }

  const contentClassName = "max-w-[460px] rounded-2xl border border-border/60 bg-background p-0 shadow-xl overflow-hidden transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={contentClassName}>
        <DialogHeader className="border-b border-border/50 bg-destructive/[0.025] px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-destructive/20 bg-background shadow-sm">
              <AlertTriangle className="size-5 text-destructive" />
            </div>
            <div className="min-w-0 space-y-1">
              <DialogTitle className="text-xl font-semibold tracking-tight text-foreground">
                {t("modal.title")}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground/90 leading-relaxed">
                {t("modal.warning")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 px-5 py-5">
          <div className="grid gap-2 rounded-xl border border-border/50 bg-secondary/15 p-3.5">
            <div className="flex items-start gap-3 text-sm text-muted-foreground/90">
              <Trash2 className="mt-0.5 size-4 shrink-0 text-destructive/80" />
              <span className="leading-normal">{t("modal.warnProjects")}</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-muted-foreground/90">
              <CreditCard className="mt-0.5 size-4 shrink-0 text-destructive/80" />
              <span className="leading-normal">{t("modal.warnBilling")}</span>
            </div>
          </div>

          {hasActiveSub && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.06] p-3.5 dark:bg-amber-500/[0.05]">
              <div className="flex items-start gap-3">
                <CreditCard className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground leading-tight">
                    {t("modal.activeSubTitle")}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t("modal.activeSubDescription")}
                  </p>
                </div>
              </div>
              {billingHref && (
                <Button asChild variant="outline" size="sm" className="mt-3 h-8 rounded-full px-3 text-xs">
                  <Link href={billingHref}>
                    {t("modal.activeSubButton")}
                    <ExternalLink className="size-3" />
                  </Link>
                </Button>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground/95 uppercase tracking-wider">
              {t("modal.inputLabel")}
            </Label>
            <div className="rounded-lg border border-border/60 bg-secondary/10 px-3 py-2 text-sm font-mono font-medium text-foreground selection:bg-primary/10">
              {userEmail}
            </div>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={userEmail}
              className="h-10 rounded-lg border-border/80 bg-background font-mono text-sm focus-visible:border-destructive/60 focus-visible:ring-destructive/30"
              autoComplete="off"
              disabled={loading}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-end gap-2 border-t border-border/50 bg-secondary/10 px-5 py-4 sm:justify-end">
          <Button
            variant="ghost"
            className="h-9 rounded-full px-4 font-medium text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
            onClick={handleClose}
            disabled={loading}
          >
            {t("modal.cancelButton")}
          </Button>
          <Button
            variant="destructive"
            className="h-9 rounded-full px-5 font-medium shadow-sm transition-all disabled:opacity-50 active:scale-[0.98]"
            onClick={handleConfirm}
            disabled={!isConfirmed || loading || hasActiveSub}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {t("modal.deleting")}
              </span>
            ) : (
              t("modal.confirmButton")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
