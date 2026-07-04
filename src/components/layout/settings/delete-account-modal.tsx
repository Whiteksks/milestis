"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { AlertTriangle, CreditCard, Trash2 } from "lucide-react"
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
}

export function DeleteAccountModal({
  open,
  onOpenChange,
  onConfirm,
  loading,
  userEmail,
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

  // Общий стиль для контента модального окна для соблюдения DRY
  const contentClassName = "max-w-md rounded-2xl p-6 overflow-hidden border border-border/60 bg-background shadow-xl transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={contentClassName}>
        <DialogHeader className="space-y-3">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/[0.03] shadow-sm dark:bg-destructive/[0.02]">
            <AlertTriangle className="size-5 text-destructive/90" />
          </div>
          <div className="space-y-1 text-center">
            <DialogTitle className="text-xl font-semibold tracking-tight text-foreground">
              {t("modal.title")}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground/90 leading-relaxed">
              {t("modal.warning")}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Список последствий в виде чистой карточки */}
        <div className="my-4 space-y-3 rounded-xl border border-border/50 bg-secondary/20 p-4 dark:bg-secondary/10">
          <div className="flex items-start gap-3 text-sm text-muted-foreground/90">
            <Trash2 className="mt-0.5 size-4 shrink-0 text-destructive/80" />
            <span className="leading-normal">{t("modal.warnProjects")}</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-muted-foreground/90">
            <CreditCard className="mt-0.5 size-4 shrink-0 text-destructive/80" />
            <span className="leading-normal">{t("modal.warnBilling")}</span>
          </div>
        </div>

        {/* Зона ввода email */}
        <div className="space-y-2 mb-2">
          <Label className="text-xs font-medium text-muted-foreground/95 uppercase tracking-wider">
            {t("modal.inputLabel")}
          </Label>
          <div className="rounded-xl border border-border/60 bg-secondary/10 px-3 py-2 text-center text-sm font-mono font-medium tracking-wide text-foreground selection:bg-primary/10">
            {userEmail}
          </div>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={userEmail}
            className="rounded-xl h-10 bg-background border-border/80 text-sm focus-visible:ring-destructive/30 focus-visible:border-destructive/60 font-mono"
            autoComplete="off"
            disabled={loading}
          />
        </div>

        <DialogFooter className="mt-4 flex flex-col gap-2 sm:flex-col">
          <Button
            variant="destructive"
            className="w-full rounded-full h-10 font-medium shadow-sm bg-destructive hover:bg-destructive/90 transition-all disabled:opacity-50 active:scale-[0.98]"
            onClick={handleConfirm}
            disabled={!isConfirmed || loading}
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
          <Button
            variant="ghost"
            className="w-full rounded-full h-10 font-medium hover:bg-secondary/60 text-muted-foreground hover:text-foreground"
            onClick={handleClose}
            disabled={loading}
          >
            {t("modal.cancelButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}