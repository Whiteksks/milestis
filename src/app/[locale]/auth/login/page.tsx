"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox" // Импортировано из UI
import { CheckCircle2, ArrowLeft, Zap, ArrowRight, Share, Palette, Mail, Gift } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import Header from "@/components/layout/header"
import { AuthenticatedRedirect } from "@/components/auth/authenticated-redirect"
import { sendSignInLinkToEmail, signInWithPassword, signInWithGoogle } from "@/lib/auth"
import { peekReferralCode } from "@/lib/referral"
import Link from "next/link"

export default function LoginPage() {
  const t = useTranslations()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [consentChecked, setConsentChecked] = useState(false) // Стейт чекбокса
  const [newsletterChecked, setNewsletterChecked] = useState(false) // Согласие на рассылку
  const [showPasswordLogin, setShowPasswordLogin] = useState(false)
  const [showEmailFlow, setShowEmailFlow] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [hasReferral, setHasReferral] = useState(false)

  useEffect(() => {
    const urlRef = new URLSearchParams(window.location.search).get("ref")
    setHasReferral(!!(urlRef || peekReferralCode()))
  }, [])

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
      recordIubendaConsent(email) // Вызов согласия
      setSent(true)
    } else if (error) {
      setError(error)
    }

    setLoading(false)
  }

  const handleSignInWithPassword = async () => {
    if (!email || !password || !consentChecked) return
    setLoading(true)
    setError(null)
    const { success, error } = await signInWithPassword(email, password)
    if (success) {
      recordIubendaConsent(email) // Вызов согласия
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
    } else if (error) {
      setError(error)
    }
    setGoogleLoading(false)
  }

  const features = [
    {
      icon: Zap,
      key: "instant"
    },
    {
      icon: Palette,
      key: "design"
    },
    {
      icon: Share,
      key: "share"
    }
  ]
  
  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/10 flex flex-col">
      <AuthenticatedRedirect />
      <Header className="absolute top-0 w-full bg-transparent z-50" showAuthButton={false} />

      <main className="flex-1 flex items-center justify-center p-2 md:pt-28 relative z-10">
        
        <Card className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 overflow-hidden bg-card border-border/40 rounded-2xl shadow-xl transition-all duration-300">
          
          {/* Левая часть (Split): dark contrast panel — tone shift is the strongest depth lever */}
          <aside className="hidden lg:flex lg:p-16 flex-col rounded-r-sm justify-between border-b lg:border-b-0 lg:border-r border-border/40 bg-foreground text-background">
            <div className="space-y-8">
              <div className="space-y-5 text-left">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs font-medium uppercase tracking-widest text-background/50">
                    {t("loginPage.brand")}
                  </span>
                  <span className="h-px flex-1 bg-background/20" />
                </div>
                <h1 className="font-serif text-4xl leading-tight tracking-tight md:text-5xl">
                  {t("loginPage.heroTitleStart")} <span className="italic">{t("loginPage.heroTitleHighlight")}</span>
                </h1>
                <p className="max-w-lg text-lg leading-relaxed text-background/70 font-light">
                  {t("loginPage.heroSubtitle")}
                </p>
              </div>  

              <div className="space-y-5 pt-6">
                {features.map((feature, index) => (
                  <div key={index} className="border-l-2 border-background/25 pl-4 transition-colors hover:border-background/60">
                    <h3 className="text-sm font-medium text-background">{t(`loginPage.features.${feature.key}.title`)}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-background/60 font-light">
                      {t(`loginPage.features.${feature.key}.description`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-10 mt-10 lg:mt-0 border-t border-background/20 text-left">
              <p className="text-xs text-background/50 font-light italic font-serif">
                {t("loginPage.heroQuote")}
              </p>
            </div>
          </aside>

          {/* Правая часть (Split): Login Form */}
          <main className="flex-1 flex flex-col justify-center p-10 lg:p-16 relative">
            <div className="max-w-md w-full mx-auto">
              {!sent ? (
                <div className="space-y-8">
                  {hasReferral && (
                    <div className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-500/15">
                        <Gift className="size-4.5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{t("loginPage.referralBanner.title")}</p>
                        <p className="text-xs leading-relaxed text-muted-foreground">{t("loginPage.referralBanner.description")}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 text-center">
                    <span className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground/50">
                      {t("loginPage.signInTag")}
                    </span>
                    <h2 className="font-serif text-3xl tracking-tight">
                      {t("loginPage.welcomeTitleStart")} <span className="text-primary italic">{t("loginPage.welcomeTitleHighlight")}</span>
                    </h2>
                    <p className="text-muted-foreground font-light italic font-serif">
                      {t("loginPage.subtitle")}
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
                        {googleLoading ? t("loginPage.signingInButton") : t("loginPage.continueWithGoogle")}
                      </Button>
                    )}

                    {!showEmailFlow ? (
                      <button
                        type="button"
                        onClick={() => setShowEmailFlow(true)}
                        className="flex w-full items-center justify-center gap-1.5 text-center text-xs font-light text-muted-foreground/70 underline underline-offset-4 transition-colors hover:text-foreground"
                      >
                        <Mail className="size-3.5" />
                        {t("loginPage.continueWithEmail")}
                      </button>
                    ) : (
                      <div className="space-y-5">
                        <button
                          type="button"
                          onClick={() => { setShowEmailFlow(false); setShowPasswordLogin(false) }}
                          className="flex items-center gap-1 text-xs font-light text-muted-foreground/70 transition-colors hover:text-foreground"
                        >
                          <ArrowLeft className="size-3.5" />
                          {t("loginPage.backButton")}
                        </button>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
                            {t("loginPage.emailLabel")}
                          </Label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder={t("loginPage.emailPlaceholder")} 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMagicLink()}
                            className="h-12 bg-background/50 border-border/60 focus-visible:ring-primary/20 rounded-xl px-4"
                          />
                          {error && <p className="text-xs text-destructive mt-1">{t(error as Parameters<typeof t>[0])}</p>}
                        </div>

                        <Button 
                          onClick={handleSendMagicLink}
                          disabled={loading || !email || !consentChecked}
                          className="w-full h-12 text-base font-semibold rounded-xl transition-colors group"
                        >
                          {loading ? t("loginPage.sendingButton") : t("loginPage.sendButton")}
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>

                        {!showPasswordLogin ? (
                          <button
                            type="button"
                            onClick={() => setShowPasswordLogin(true)}
                            className="w-full text-center text-xs font-light text-muted-foreground/70 underline underline-offset-4 transition-colors hover:text-foreground"
                          >
                            {t("loginPage.orSignInWithPassword")}
                          </button>
                        ) : (
                          <div className="space-y-3">
                            <div className="relative flex items-center gap-3">
                              <div className="h-px flex-1 bg-border/40" />
                              <span className="text-xs text-muted-foreground/50 font-light">{t("loginPage.orSeparator")}</span>
                              <div className="h-px flex-1 bg-border/40" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
                                {t("loginPage.passwordLabel")}
                              </Label>
                              <Input
                                id="password"
                                type="password"
                                placeholder={t("loginPage.passwordPlaceholder")}
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
                              {loading ? t("loginPage.signingInButton") : t("loginPage.signInPasswordButton")}
                              <ArrowRight className="ml-2 w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Блок согласия с чекбоксом */}
                  <div className="space-y-3 pt-2">
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
                        {t("loginPage.consentAgreePrefix")}{" "}
                        <Link href="/policies/terms" className="underline underline-offset-4 hover:text-foreground transition-colors">
                          {t("loginPage.termsOfService")}
                        </Link>
                        {" "}{t("loginPage.consentAnd")}{" "}
                        <Link href="/policies/privacy-policy" className="underline underline-offset-4 hover:text-foreground transition-colors">
                          {t("loginPage.privacyPolicy")}
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
                        {t("loginPage.newsletterConsent")}
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                /* Success State: Airy & Focused */
                <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto border border-border">
                    <CheckCircle2 className="h-10 w-10 text-primary" />
                  </div>
                  
                  <div className="space-y-3 pt-4">
                    <h2 className="font-serif text-3xl tracking-tight">{t("loginPage.checkInboxTitle")}</h2>
                    <p className="text-muted-foreground font-light leading-relaxed italic font-serif text-lg">
                      {t("loginPage.checkInboxDescription")} <br />
                      <span className="text-foreground not-italic font-sans font-medium">{email}</span>
                    </p>
                  </div>

                  <div className="pt-10 space-y-4">
                    <Button 
                      variant="outline"
                      onClick={() => setSent(false)}
                      className="w-full h-12 rounded-xl border-border/60 bg-background/50 hover:bg-muted/30 transition-colors"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      {t("loginPage.changeEmailButton")}
                    </Button>
                    <p className="text-xs text-muted-foreground font-light max-w-sm mx-auto">
                      {t("loginPage.resendHint")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </main>
        </Card>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 px-6 relative z-10">
        <p className="text-xs text-muted-foreground/60 font-light">
          {t("loginPage.footer")}
        </p>
      </footer>
    </div>
  )
}