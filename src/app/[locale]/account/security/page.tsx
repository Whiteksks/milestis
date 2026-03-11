"use client"

import { useState, useEffect } from "react"
import { Check, Mail, Chrome } from "lucide-react"
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
} from "@/lib/auth-security"

export default function SecuritySettings() {
  const t = useTranslations()

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
  // (auth.currentUser.providerData is updated in-place synchronously after the call)
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
    else if (error) setGoogleError(t(error))
    setGoogleLoading(false)
  }

  const handleDisconnectGoogle = async () => {
    setGoogleLoading(true)
    setGoogleError(null)
    const { success, error } = await unlinkGoogleAccount()
    if (success) reloadProviders()
    else if (error) setGoogleError(t(error))
    setGoogleLoading(false)
  }

  const handleSendEmailLink = async () => {
    if (!emailInput) return
    setEmailLoading(true)
    setEmailError(null)
    const { success, error } = await sendEmailLinkForLinking(emailInput)
    if (success) setEmailLinkSent(true)
    else if (error) setEmailError(t(error))
    setEmailLoading(false)
  }

  const userEmail = auth.currentUser?.email ?? ""

  return (
    <div className="space-y-12">

      <section className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl">Sign-in Methods</h2>
          <p className="mt-1 text-muted-foreground">Manage how you access your Milestis account</p>
        </div>

        <div className="rounded-2xl bg-card shadow-sm">
          <div className="divide-y divide-border/40">

            {/* ── Email (Magic Link) row ── */}
            <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                  <Mail className="size-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">Email (Magic Link)</span>
                    {isEmailLinked && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Primary</span>
                    )}
                    {isEmailLinked && (
                      <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">
                        <Check className="size-3" /> Connected
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Sign in securely using a magic link sent to your email</p>
                  {isEmailLinked && userEmail && (
                    <p className="text-sm font-medium">{userEmail}</p>
                  )}
                  {/* Email input shown for Google-first users who haven't linked email yet */}
                  {!isEmailLinked && !emailLinkSent && (
                    <div className="mt-3 flex items-center gap-2">
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendEmailLink()}
                        className="h-8 max-w-64 text-sm"
                      />
                      <Button
                        size="sm"
                        className="rounded-full shrink-0"
                        onClick={handleSendEmailLink}
                        disabled={emailLoading || !emailInput}
                      >
                        {emailLoading ? "Sending…" : "Send link"}
                      </Button>
                    </div>
                  )}
                  {!isEmailLinked && emailLinkSent && (
                    <p className="text-sm text-green-600 mt-2">Check your inbox — a magic link was sent.</p>
                  )}
                  {emailError && <p className="text-sm text-destructive mt-1">{emailError}</p>}
                </div>
              </div>
              <div className="shrink-0">
                {isEmailLinked && (
                  <Button variant="ghost" size="sm" className="rounded-full" disabled>
                    Always enabled
                  </Button>
                )}
              </div>
            </div>

            {/* ── Google row ── */}
            <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                  <Chrome className="size-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">Google</span>
                    {/* Show Primary badge when Google is the only sign-in method */}
                    {isGoogleLinked && !isEmailLinked && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Primary</span>
                    )}
                    {isGoogleLinked && (
                      <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">
                        <Check className="size-3" /> Connected
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Sign in with your Google account</p>
                  {isGoogleLinked && !canDisconnectGoogle && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Add email access first before disconnecting Google.
                    </p>
                  )}
                  {googleError && <p className="text-sm text-destructive mt-1">{googleError}</p>}
                </div>
              </div>
              <div className="shrink-0">
                {isGoogleLinked ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full px-5"
                    onClick={handleDisconnectGoogle}
                    disabled={googleLoading || !canDisconnectGoogle}
                  >
                    {googleLoading ? "…" : "Disconnect"}
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    className="rounded-full px-5"
                    onClick={handleConnectGoogle}
                    disabled={googleLoading}
                  >
                    {googleLoading ? "…" : "Connect Google"}
                  </Button>
                )}
              </div>
            </div>

          </div>
        </div>

        <p className="text-sm text-muted-foreground px-1">
          Your Magic Link email will always remain the primary way to recover your account.
        </p>
      </section>

    </div>
  )
}
