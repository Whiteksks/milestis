"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Mail, CheckCircle2, ArrowLeft, Sparkles } from "lucide-react"
import { sendSignInLinkToEmail } from "@/lib/auth"
import { useTranslations } from "next-intl"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const t = useTranslations()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSendMagicLink = async () => {
    if (!email) return
    setLoading(true)
    setError(null)

    const { success, error } = await sendSignInLinkToEmail(email)

    if (success) {
      setSent(true)
    } else if (error) {
      setError(t(error))
    }

    setLoading(false)
  }

  const handleChangeEmail = () => {
    setSent(false)
    setError(null)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setEmail("")
      setSent(false)
      setError(null)
      setLoading(false)
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-105 rounded-3xl border-border/30 bg-card/98 p-0 shadow-2xl shadow-black/10 backdrop-blur-xl">
        <div className="p-8">
          {!sent ? (
            <>
              <DialogHeader className="space-y-3 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <DialogTitle className="text-2xl font-semibold">
                  {t("loginModal.title")}
                </DialogTitle>
                <DialogDescription>
                  {t("loginModal.description")}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-8 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("loginModal.emailLabel")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("loginModal.emailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl border-border/40 bg-background/50 px-4"
                  />
                  {error && (
                    <p className="text-xs text-red-500">{error}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {t("loginModal.noPasswordRequired")}
                  </p>
                </div>

                <Button
                  onClick={handleSendMagicLink}
                  disabled={loading || !email}
                  className="h-12 w-full rounded-xl bg-primary font-medium text-primary-foreground shadow-md shadow-primary/20 disabled:opacity-50"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {loading ? t("loginModal.sendingButton") : t("loginModal.sendButton")}
                </Button>

                <div className="relative flex items-center py-2">
                  <Separator className="flex-1" />
                  <span className="px-4 text-xs text-muted-foreground">
                    {t("loginModal.orSeparator")}
                  </span>
                  <Separator className="flex-1" />
                </div>

                <Button
                  variant="outline"
                  className="h-12 w-full rounded-xl border-border/40 bg-background/50 font-medium"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {t("loginModal.googleButton")}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>

              <h2 className="mt-6 text-2xl font-semibold">
                {t("loginModal.checkEmailTitle")}
              </h2>

            <p className="mt-3 text-muted-foreground">
              {t("loginModal.checkEmailDescription", { email })}
            </p>

              <p className="mt-4 text-xs text-muted-foreground/70">
                {t("loginModal.checkEmailSpam")}
              </p>

              <div className="mt-8 w-full space-y-3">
                <Button
                  onClick={handleSendMagicLink}
                  disabled={loading}
                  className="h-11 w-full rounded-xl bg-primary font-medium text-primary-foreground"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {t("loginModal.resendButton")}
                </Button>

                <Button
                  variant="ghost"
                  onClick={handleChangeEmail}
                  className="h-11 w-full rounded-xl"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t("loginModal.differentEmailButton")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
