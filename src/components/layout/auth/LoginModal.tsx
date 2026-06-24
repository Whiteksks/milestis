"use client"

import React, { useRef, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, ArrowLeft, ArrowRight, FlaskConical } from "lucide-react"
import { sendSignInLinkToEmail, signInWithPassword } from "@/lib/auth"
import Link from "next/link"
import { useIsMobile } from "@/hooks/use-mobile"
import { Checkbox } from "@/components/ui/checkbox"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  
  const isMobile = useIsMobile()
  const [email, setEmail] = useState("")

  // Blur the trigger button before vaul sets aria-hidden on the rest of the page
  React.useEffect(() => {
    if (open) (document.activeElement as HTMLElement)?.blur()
  }, [open])
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [password, setPassword] = useState("")
  const [consentChecked, setConsentChecked] = useState(false)

  const recordIubendaConsent = (email: string) => {
    ;(window as Window & { _iub?: { cons_instructions?: unknown[] } })._iub?.cons_instructions?.push([
      "submit",
      {
        subject: { email },
        preferences: { terms: true, privacy_policy: true },
      },
    ])
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

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setEmail("")
      setSent(false)
      setError(null)
      setLoading(false)
      setShowPasswordForm(false)
      setPassword("")
      setConsentChecked(false)
    }
    onOpenChange(open)
  }

  const innerContent = (
    <div className="p-8">
      {!sent ? (
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold tracking-tight">
              Sign In To Milestis
            </h2>
            <p className="text-muted-foreground font-light italic font-serif">
              Enter your email to start creating.
            </p>
          </div>

          {/* Toggle: Test Account */}
          <button
            type="button"
            onClick={() => { setShowPasswordForm(!showPasswordForm); setPassword(""); setError(null); }}
            className={`w-full flex items-center justify-center gap-2 h-10 rounded-xl border text-sm font-medium transition-all ${
              showPasswordForm
                ? "bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400"
                : "bg-muted/30 border-border/40 text-muted-foreground hover:text-foreground hover:border-border/70"
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            {showPasswordForm ? "Back to Magic Link" : "Test Account"}
          </button>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMagicLink()}
                className="h-12 bg-background/50 backdrop-blur-sm border-border/60 focus-visible:ring-primary/20 rounded-xl px-4"
              />
              {error && (
                <p className="text-xs text-destructive mt-1">{error}</p>
              )}
            </div>

            {!showPasswordForm && (
            <Button
              onClick={handleSendMagicLink}
              disabled={loading || !email || !consentChecked}
              className="w-full h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/5 hover:scale-[1.01] transition-all active:scale-95 group"
            >
              {loading ? "Sending..." : "Send Magic Link"}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            )}

            {showPasswordForm && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSignInWithPassword()}
                    className="h-12 bg-background/50 backdrop-blur-sm border-border/60 focus-visible:ring-primary/20 rounded-xl px-4"
                  />
                </div>
                <Button
                  onClick={handleSignInWithPassword}
                  disabled={loading || !email || !password || !consentChecked}
                  className="w-full h-12 text-base font-semibold rounded-xl bg-amber-500 hover:bg-amber-500/90 text-white shadow-lg shadow-amber-500/20 hover:scale-[1.01] transition-all active:scale-95 group"
                >
                  {loading ? "Signing in..." : "Sign In with Password"}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}
          </div>

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
              I agree to the{" "}
              <Link href="/policies/terms" className="underline underline-offset-4 hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              {" "}and{" "}
              <Link href="/policies/privacy-policy" className="underline underline-offset-4 hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </label>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/5 mx-auto border border-primary/10 relative">
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl scale-125" />
            <CheckCircle2 className="h-10 w-10 text-primary relative z-10" />
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">
              Check your inbox
            </h2>
            <p className="text-muted-foreground font-light leading-relaxed italic font-serif">
              We&apos;ve sent a magic link to{" "}
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
              Change Email
            </Button>
            <p className="text-xs text-muted-foreground font-light">
              Didn&apos;t receive it? Check your spam folder or try again in a minute.
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
            <DrawerTitle>Login Modal</DrawerTitle>
            <DrawerDescription>mobile login modal</DrawerDescription>
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
      <DialogContent className="sm:max-w-105 rounded-2xl border-border/30 bg-card p-0 shadow-2xl shadow-black/10">
          <DialogHeader className="sr-only">
            <DialogTitle>Login Modal</DialogTitle>
            <DialogDescription>mobile login modal</DialogDescription>
          </DialogHeader>
        {innerContent}
      </DialogContent>
    </Dialog>
  )
}
