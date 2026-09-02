"use client"

import React, { useRef, useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, ArrowLeft, ArrowRight, Mail } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { sendSignInLinkToEmail, signInWithPassword, signInWithGoogle } from "@/lib/auth"
import Link from "next/link"
import { useIsMobile } from "@/hooks/use-mobile"
import { Checkbox } from "@/components/ui/checkbox"
import { useTranslations } from "next-intl"
import modalPhoto from "@/components/assets/n1ce-unsplash-2.webp"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const t = useTranslations()
  const isMobile = useIsMobile()
  const [email, setEmail] = useState("")

  // Blur the trigger button before vaul sets aria-hidden on the rest of the page
  React.useEffect(() => {
    if (open) (document.activeElement as HTMLElement)?.blur()
  }, [open])
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [consentChecked, setConsentChecked] = useState(false)
  const [newsletterChecked, setNewsletterChecked] = useState(false)
  const [showPasswordLogin, setShowPasswordLogin] = useState(false)
  const [showEmailFlow, setShowEmailFlow] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  // Iubenda temporarily disabled — no-op until re-enabled
  const recordIubendaConsent = (email: string) => {
    void email
    /*
    ;(window as Window & { _iub?: { cons_instructions?: unknown[] } })._iub?.cons_instructions?.push([
      "submit",
      {
        subject: { email },
        preferences: {
          terms: true,
          privacy_policy: true,
          ...(newsletterChecked ? { newsletter: true } : {}),
        },
      },
    ])
    */
  }

  const handleSendMagicLink = async () => {
    if (!email || !consentChecked) return
    setLoading(true)
    setError(null)

    const { success, error } = await sendSignInLinkToEmail(email)

    if (success) {
      recordIubendaConsent(email)
      setSent(true)
    } else if (error) {
      setError(error)
    }

    setLoading(false)
  }

  const handleChangeEmail = () => {
    setSent(false)
    setError(null)
  }

  const handleSignInWithPassword = async () => {
    if (!email || !password || !consentChecked) return
    setLoading(true)
    setError(null)
    const { success, error } = await signInWithPassword(email, password)
    if (success) {
      recordIubendaConsent(email)
    } else if (error) {
      setError(error)
    }
    setLoading(false)
  }

  const handleGoogleSignIn = async () => {
    if (!consentChecked) return
    setGoogleLoading(true)
    setError(null)
    const { success, error } = await signInWithGoogle()
    if (success) {
      recordIubendaConsent(email)
      handleOpenChange(false)
    } else if (error) {
      setError(error)
    }
    setGoogleLoading(false)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setEmail("")
      setSent(false)
      setError(null)
      setLoading(false)
      setPassword("")
      setConsentChecked(false)
      setNewsletterChecked(false)
      setShowPasswordLogin(false)
      setShowEmailFlow(false)
    }
    onOpenChange(open)
  }

  const innerContent = (
    <div className="p-8">
      {!sent ? (
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-muted-foreground/50">
              {t("loginModal.brand")}
            </span>
            <h2 className="font-serif text-2xl tracking-tight">
              {t("loginModal.titleStart")} <span className="text-primary italic">{t("loginModal.titleHighlight")}</span>
            </h2>
            <p className="text-muted-foreground font-light italic font-serif">
              {t("loginModal.subtitle")}
            </p>
          </div>

          <div className="space-y-5">
            {!showEmailFlow && (
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || !consentChecked}
                className="w-full h-12 text-base font-semibold rounded-xl border-border/60 hover:bg-muted/30 transition-colors"
              >
                <FcGoogle className="mr-2 size-5" />
                {googleLoading ? t("loginModal.signingInButton") : t("loginModal.continueWithGoogle")}
              </Button>
            )}

            {!showEmailFlow ? (
              <button
                type="button"
                onClick={() => setShowEmailFlow(true)}
                className="flex w-full items-center justify-center gap-1.5 text-center text-xs font-light text-muted-foreground/70 underline underline-offset-4 transition-colors hover:text-foreground"
              >
                <Mail className="size-3.5" />
                {t("loginModal.continueWithEmail")}
              </button>
            ) : (
              <div className="space-y-5">
                <button
                  type="button"
                  onClick={() => { setShowEmailFlow(false); setShowPasswordLogin(false) }}
                  className="flex items-center gap-1 text-xs font-light text-muted-foreground/70 transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="size-3.5" />
                  {t("loginModal.backButton")}
                </button>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70"
                  >
                    {t("loginModal.emailLabel")}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("loginModal.emailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMagicLink()}
                    className="h-12 bg-background/50 border-border/60 focus-visible:ring-primary/20 rounded-xl px-4"
                  />
                  {error && (
                    <p className="text-xs text-destructive mt-1">{t(error as Parameters<typeof t>[0])}</p>
                  )}
                </div>

                <Button
                  onClick={handleSendMagicLink}
                  disabled={loading || !email || !consentChecked}
                  className="w-full h-12 text-base font-semibold rounded-xl transition-colors group"
                >
                  {loading ? t("loginModal.sendingButton") : t("loginModal.sendButton")}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                {!showPasswordLogin ? (
                  <button
                    type="button"
                    onClick={() => setShowPasswordLogin(true)}
                    className="w-full text-center text-xs font-light text-muted-foreground/70 underline underline-offset-4 transition-colors hover:text-foreground"
                  >
                    {t("loginModal.orSignInWithPassword")}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="relative flex items-center gap-3">
                      <div className="h-px flex-1 bg-border/40" />
                      <span className="text-xs text-muted-foreground/50 font-light">{t("loginModal.orSeparator")}</span>
                      <div className="h-px flex-1 bg-border/40" />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70"
                      >
                        {t("loginModal.passwordLabel")}
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder={t("loginModal.passwordPlaceholder")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSignInWithPassword()}
                        className="h-12 bg-background/50 border-border/60 focus-visible:ring-primary/20 rounded-xl px-4"
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleSignInWithPassword}
                      disabled={loading || !email || !password || !consentChecked}
                      className="w-full h-10 text-sm font-medium rounded-xl border-border/60 hover:border-border hover:bg-muted/30 transition-colors group"
                    >
                      {loading ? t("loginModal.signingInButton") : t("loginModal.signInPasswordButton")}
                      <ArrowRight className="ml-2 w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Checkbox
                id="auth-consent"
                checked={consentChecked}
                onCheckedChange={(v) => setConsentChecked(v === true)}
                className="mt-0.5 shrink-0"
              />
              <label
                htmlFor="auth-consent"
                className="text-xs text-muted-foreground font-light leading-relaxed cursor-pointer select-none"
              >
                {t("loginModal.consentAgreePrefix")}{" "}
                <Link href="/policies/terms" className="underline underline-offset-4 hover:text-foreground transition-colors">
                  {t("loginModal.termsOfService")}
                </Link>
                {" "}{t("loginModal.consentAnd")}{" "}
                <Link href="/policies/privacy-policy" className="underline underline-offset-4 hover:text-foreground transition-colors">
                  {t("loginModal.privacyPolicy")}
                </Link>
              </label>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox
                id="newsletter-consent"
                checked={newsletterChecked}
                onCheckedChange={(v) => setNewsletterChecked(v === true)}
                className="mt-0.5 shrink-0"
              />
              <label
                htmlFor="newsletter-consent"
                className="text-xs text-muted-foreground font-light leading-relaxed cursor-pointer select-none"
              >
                {t("loginModal.newsletterConsent")}
              </label>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto border border-border">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>

          <div className="space-y-3">
            <h2 className="font-serif text-2xl tracking-tight">
              {t("loginModal.checkInboxTitle")}
            </h2>
            <p className="text-muted-foreground font-light leading-relaxed italic font-serif">
              {t("loginModal.checkInboxDescription")}{" "}
              <span className="text-foreground not-italic font-sans font-medium">{email}</span>
            </p>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={handleChangeEmail}
              className="w-full h-12 rounded-xl border-border/60 bg-background/50 hover:bg-muted/30 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("loginModal.changeEmailButton")}
            </Button>
            <p className="text-xs text-muted-foreground font-light">
              {t("loginModal.resendHint")}
            </p>
          </div>
        </div>
      )}
    </div>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
          <DrawerContent
            onOpenAutoFocus={(e) => {
              e.preventDefault()
              menuRef.current?.focus()
            }}
          >
          <DrawerHeader className="sr-only">
            <DrawerTitle>{t("loginModal.dialogTitle")}</DrawerTitle>
            <DrawerDescription>{t("loginModal.dialogDescription")}</DrawerDescription>
          </DrawerHeader>
          <div ref={menuRef} tabIndex={-1} className="pb-4 px-2 outline-none">
            {innerContent}
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-105 lg:max-w-4xl lg:grid-cols-2 gap-0 overflow-hidden rounded-2xl border-border/30 bg-card p-0 shadow-2xl shadow-black/10">
          <DialogHeader className="sr-only">
            <DialogTitle>{t("loginModal.dialogTitle")}</DialogTitle>
            <DialogDescription>{t("loginModal.dialogDescription")}</DialogDescription>
          </DialogHeader>
        {innerContent}
        {/* Photo panel — desktop only, mirrors the split layout used on the full /auth/login page */}
        <div className="relative hidden lg:block">
          <Image
            src={modalPhoto}
            alt="An open interactive photo book page"
            fill
            sizes="400px"
            className="object-cover"
          />
          <div className="absolute bottom-6 left-6 rounded-2xl bg-foreground p-4 text-background shadow-xl">
            <p className="font-mono text-[10px] uppercase tracking-widest text-background/60">Publish in</p>
            <p className="mt-0.5 font-serif text-lg italic">5 minutes</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
