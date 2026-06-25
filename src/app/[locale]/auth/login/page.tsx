"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox" // Импортировано из UI
import { CheckCircle2, ArrowLeft, Zap, ArrowRight, Share, Palette, FlaskConical } from "lucide-react"
import Header from "@/components/layout/header"
import { AuthenticatedRedirect } from "@/components/auth/authenticated-redirect"
import { sendSignInLinkToEmail, signInWithPassword } from "@/lib/auth"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [password, setPassword] = useState("")
  const [consentChecked, setConsentChecked] = useState(false) // Стейт чекбокса

  // Логика интеграции с Iubenda
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

  const features = [
    {
      icon: Zap,
      title: "Instant creation",
      description: "From a collection of moments to a finished story in just five minutes."
    },
    {
      icon: Palette,
      title: "Rigid design",
      description: "Pre-defined aesthetic structures ensure a professional look every single time."
    },
    {
      icon: Share,
      title: "Shareable link",
      description: "Transform your memories into an interactive experience ready for the web."
    }
  ]
  
  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/10 flex flex-col">
      <AuthenticatedRedirect />
      <Header className="absolute top-0 w-full bg-transparent z-50" showAuthButton={false} />
      
      <div className="hidden md:flex absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-muted rounded-full blur-[100px]" />
      </div>

      <main className="flex-1 flex items-center justify-center p-2 md:pt-28 relative z-10">
        
        <Card className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 overflow-hidden bg-background/60 backdrop-blur-xl border-border/40 rounded-lg shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-300">
          
          {/* Левая часть (Split): Branding & Features */}
          <aside className="hidden lg:flex lg:p-16 flex-col justify-between border-b lg:border-b-0 lg:border-r border-border/40">
            <div className="space-y-8">
              <div className="space-y-5 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                  Effortless <span className="text-muted-foreground italic font-serif leading-tight">Creation</span>
                </h1>
                <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Join the community of creators building high-performance portfolios and digital memories.
                </p>
              </div>  

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-4 pt-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-4 items-start group p-4 rounded-2xl border border-border/20 bg-background/30 hover:bg-background/50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-background border border-border/60 flex items-center justify-center text-primary shrink-0 transition-colors group-hover:border-primary/40">
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground font-light leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-10 mt-10 lg:mt-0 border-t border-border/40 text-center lg:text-left">
              <p className="text-xs text-muted-foreground font-light italic font-serif">
                Built for digital photobooks, gift links, and client-ready portfolios with a clear visual standard.
              </p>
            </div>
          </aside>

          {/* Правая часть (Split): Login Form */}
          <main className="flex-1 flex flex-col justify-center p-10 lg:p-16 relative bg-background/40">
            <div className="max-w-md w-full mx-auto">
              {!sent ? (
                <div className="space-y-8">
                  <div className="space-y-2 text-center">
                    <h2 className="text-3xl font-bold tracking-tight">Sign In To Milestis</h2>
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
                      <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
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
                      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
                    </div>

                    {!showPasswordForm && (
                    <Button 
                      onClick={handleSendMagicLink}
                      disabled={loading || !email || !consentChecked} // Добавлено согласие
                      className="w-full h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/5 hover:scale-[1.01] transition-all active:scale-95 group"
                    >
                      {loading ? "Sending..." : "Send Magic Link"}
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    )}

                    {showPasswordForm && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
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
                          disabled={loading || !email || !password || !consentChecked} // Добавлено согласие
                          className="w-full h-12 text-base font-semibold rounded-xl bg-amber-500 hover:bg-amber-500/90 text-white shadow-lg shadow-amber-500/20 hover:scale-[1.01] transition-all active:scale-95 group"
                        >
                          {loading ? "Signing in..." : "Sign In with Password"}
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Блок согласия с чекбоксом */}
                  <div className="flex items-start gap-3 pt-2">
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
                /* Success State: Airy & Focused */
                <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/5 mx-auto border border-primary/10 relative">
                     <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl scale-125" />
                    <CheckCircle2 className="h-10 w-10 text-primary relative z-10" />
                  </div>
                  
                  <div className="space-y-3 pt-4">
                    <h2 className="text-3xl font-bold tracking-tight">Check your inbox</h2>
                    <p className="text-muted-foreground font-light leading-relaxed italic font-serif text-lg">
                      We&apos;ve sent a magic link to <br />
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
                      Change Email
                    </Button>
                    <p className="text-xs text-muted-foreground font-light max-w-sm mx-auto">
                      Didn&apos;t receive it? Check your spam folder or try again in a minute.
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
          © 2026 Milestis. Professional storytelling tools. All rights reserved.
        </p>
      </footer>
    </div>
  )
}