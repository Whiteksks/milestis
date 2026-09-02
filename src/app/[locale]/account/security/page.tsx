"use client"

import { useState, useEffect } from "react"
import { Check, Mail } from "lucide-react"
import { FaChrome } from "react-icons/fa6"
import { onAuthStateChanged } from "firebase/auth"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { auth } from "@/lib/firebase"
import {
  GOOGLE_PROVIDER_ID,
  EMAIL_PROVIDER_ID,
  linkGoogleAccount,
  unlinkGoogleAccount,
  sendEmailLinkForLinking,
} from "@/lib/auth"

export default function SecuritySettings() {
  const t = useTranslations("account.security")
  const g = useTranslations()

  const [providers, setProviders] = useState<string[]>([])

  // Google sign-in method state
  const [googleLoading, setGoogleLoading] = useState(false)
  const [googleError, setGoogleError] = useState<string | null>(null)

  // Email linking state (used when the account was created via Google)
  const [emailInput, setEmailInput] = useState("")
  const [emailLinkSent, setEmailLinkSent] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setProviders(user?.providerData.map((p) => p.providerId) ?? [])
    })
    return unsub
  }, [])

  // Re-read providerData from the current user object after a link/unlink call
  const reloadProviders = () => {
    setProviders(auth.currentUser?.providerData.map((p) => p.providerId) ?? [])
  }

  const isEmailLinked = providers.includes(EMAIL_PROVIDER_ID)
  const isGoogleLinked = providers.includes(GOOGLE_PROVIDER_ID)
  // Google can only be disconnected when email is also linked so the user keeps access
  const canDisconnectGoogle = isEmailLinked

  const handleConnectGoogle = async () => {
    setGoogleLoading(true)
    setGoogleError(null)
    const { success, error } = await linkGoogleAccount()
    if (success) reloadProviders()
    else if (error) setGoogleError(error)
    setGoogleLoading(false)
  }

  const handleDisconnectGoogle = async () => {
    setGoogleLoading(true)
    setGoogleError(null)
    const { success, error } = await unlinkGoogleAccount()
    if (success) reloadProviders()
    else if (error) setGoogleError(error)
    setGoogleLoading(false)
  }

  const handleSendEmailLink = async () => {
    if (!emailInput) return
    setEmailLoading(true)
    setEmailError(null)
    const { success, error } = await sendEmailLinkForLinking(emailInput)
    if (success) setEmailLinkSent(true)
    else if (error) setEmailError(error)
    setEmailLoading(false)
  }

  const userEmail = auth.currentUser?.email ?? ""

  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-12">
      <section className="space-y-4">
        <div className="flex items-center gap-4">
          <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            {t("signIn.title")}
          </h2>
          <span className="h-px flex-1 bg-border/80" />
        </div>
        <p className="font-sans text-sm text-muted-foreground">
          {t("signIn.description")}
        </p>

        <div className="rounded-xs border border-border bg-card p-5 md:p-6">
          <div className="divide-y divide-border/80">
            
            {/* ── Email (Magic Link) row ── */}
            <div className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xs border border-border bg-secondary/50">
                  <Mail className="size-5 text-foreground" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-sans text-sm font-medium text-foreground">
                      {t("email.title")}
                    </span>
                    {isEmailLinked && (
                      <span className="rounded-xs border border-border bg-secondary/80 px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-secondary-foreground">
                        {t("email.primary")}
                      </span>
                    )}
                    {isEmailLinked && (
                      <span className="flex items-center gap-1 rounded-xs border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        <Check className="size-3" /> Connected
                      </span>
                    )}
                  </div>
                  
                  <p className="font-sans text-sm text-muted-foreground">
                    {t("email.description")}
                  </p>

                  {isEmailLinked && userEmail && (
                    <p className="font-sans text-sm font-medium text-foreground pt-1">
                      {userEmail}
                    </p>
                  )}

                  {/* Email input shown for Google-first users who haven't linked email yet */}
                  {!isEmailLinked && !emailLinkSent && (
                    <div className="mt-3 flex items-center gap-2">
                      <Input
                        type="email"
                        placeholder={t("email.placeholder")}
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendEmailLink()}
                        className="h-9 max-w-xs rounded-xs border-border bg-background font-sans text-sm focus-visible:ring-1 focus-visible:ring-foreground"
                      />
                      <Button
                        size="sm"
                        className="h-9 shrink-0 rounded-xs bg-foreground px-4 font-sans text-xs font-medium text-background transition-colors hover:bg-foreground/90"
                        onClick={handleSendEmailLink}
                        disabled={emailLoading || !emailInput}
                      >
                        {emailLoading ? t("email.sending") : t("email.sendButton")}
                      </Button>
                    </div>
                  )}

                  {!isEmailLinked && emailLinkSent && (
                    <p className="mt-2 font-sans text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      {t("email.checkInbox")}
                    </p>
                  )}

                  {emailError && (
                    <p className="mt-1 font-sans text-xs font-medium text-destructive">
                      {g(emailError)}
                    </p>
                  )}
                </div>
              </div>

              <div className="shrink-0 pt-2 sm:pt-0">
                {isEmailLinked && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9 rounded-xs border-border px-4 font-sans text-xs hover:bg-transparent" 
                    disabled
                  >
                    {t("email.alwaysEnabled")}
                  </Button>
                )}
              </div>
            </div>

            {/* ── Google row ── */}
            <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xs border border-border bg-secondary/50">
                  <FaChrome className="size-5 text-foreground" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-sans text-sm font-medium text-foreground">
                      {t("google.title")}
                    </span>
                    {isGoogleLinked && !isEmailLinked && (
                      <span className="rounded-xs border border-border bg-secondary/80 px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-secondary-foreground">
                        Primary
                      </span>
                    )}
                    {isGoogleLinked && (
                      <span className="flex items-center gap-1 rounded-xs border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        <Check className="size-3" /> Connected
                      </span>
                    )}
                  </div>

                  <p className="font-sans text-sm text-muted-foreground">
                    {t("google.description")}
                  </p>

                  {isGoogleLinked && !canDisconnectGoogle && (
                    <p className="mt-1 font-sans text-xs text-muted-foreground">
                      {t("google.cannotDisconnectNote")}
                    </p>
                  )}

                  {googleError && (
                    <p className="mt-1 font-sans text-xs font-medium text-destructive">
                      {g(googleError)}
                    </p>
                  )}
                </div>
              </div>

              <div className="shrink-0 pt-2 sm:pt-0">
                {isGoogleLinked ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 rounded-xs border-border px-4 font-sans text-xs hover:bg-secondary/60"
                    onClick={handleDisconnectGoogle}
                    disabled={googleLoading || !canDisconnectGoogle}
                  >
                    {googleLoading ? "…" : t("google.disconnect")}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="h-9 rounded-xs bg-foreground px-4 font-sans text-xs font-medium text-background transition-colors hover:bg-foreground/90"
                    onClick={handleConnectGoogle}
                    disabled={googleLoading}
                  >
                    {googleLoading ? "…" : t("google.connect")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <p className="font-sans text-xs text-muted-foreground">
          {t("note.recoveryPrimary")}
        </p>
      </section>
    </div>
  )
}