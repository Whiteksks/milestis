"use client"

import React, { useRef, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react"
import { sendSignInLinkToEmail, signInWithPassword } from "@/lib/auth"
import Link from "next/link"
import { useIsMobile } from "@/hooks/use-mobile"
import { Checkbox } from "@/components/ui/checkbox"
import { useTranslations } from "next-intl"

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

  const recordIubendaConsent = (email: string) => {
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
      setPassword("")
      setConsentChecked(false)
      setNewsletterChecked(false)
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
                <p className="text-xs text-destructive mt-1">{t(error as Parameters<typeof t>[0])}</p>
              )}
            </div>

            <Button
              onClick={handleSendMagicLink}
              disabled={loading || !email || !consentChecked}
              className="w-full h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/5 hover:scale-[1.01] transition-all active:scale-95 group"
            >
              {loading ? "Sending..." : "Send Magic Link"}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="relative flex items-center gap-3">
              <div className="h-px flex-1 bg-border/40" />
              <span className="text-xs text-muted-foreground/50 font-light">or</span>
              <div className="h-px flex-1 bg-border/40" />
            </div>

            <div className="space-y-3">
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
                variant="outline"
                onClick={handleSignInWithPassword}
                disabled={loading || !email || !password || !consentChecked}
                className="w-full h-10 text-sm font-medium rounded-xl border-border/60 hover:border-border hover:bg-muted/30 transition-all group"
              >
                {loading ? "Signing in..." : "Sign in with Password"}
                <ArrowRight className="ml-2 w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>
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
                I&apos;d like to receive product news and updates from Milestis (optional)
              </label>
            </div>
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
