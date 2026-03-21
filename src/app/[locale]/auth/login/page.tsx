"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import { Mail, CheckCircle2, ArrowLeft, Sparkles, Shield, Zap, Lock, ArrowRight, UserPlus } from "lucide-react"
import Link from "next/link"
import Header from "@/components/layout/header"
import { sendSignInLinkToEmail } from "@/lib/auth"

export default function LoginPage() {
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
      setError(error)
    }

    setLoading(false)
  }

  const features = [
    {
      icon: Zap,
      title: "Design in 5 Minutes",
      description: "No passwords required—just a single click to enter."
    },
    {
      icon: Shield,
      title: "Modern Security",
      description: "Passwordless authentication for the modern web."
    },
    {
      icon: Lock,
      title: "Your Legacy, Protected",
      description: "Your data and memories belong to you. Safe & secure."
    }
  ]

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/10 flex flex-col">
      <Header className="absolute top-0 w-full bg-transparent z-50" showAuthButton={false} />
      
      {/* ИНТЕРЕСНЫЙ ФОН:
        Мы используем псевдоэлементы для создания мягкого, абстрактного градиента.
        Radial-gradient создает "пятна" света, а backdrop-blur добавляет глубины.
      */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-muted rounded-full blur-[100px]" />
        
        {/* Subtle noise pattern (optional, requires a small noise png or svg) */}
        {/* <div className="absolute inset-0 bg-noise opacity-[0.02]" /> */}
      </div>

      {/* Основной контейнер, центрирующий карточку */}
      <main className="flex-1 flex items-center justify-center p-2 md:pt-28 relative z-10">
        
        {/* FLOATING CARD:
          Центральная карточка. Мы используем backdrop-blur для эффекта матового стекла,
          border-border/40 для очень тонкой границы и rounded-3xl для мягкости.
          Сетка разделяет её на две части на больших экранах.
        */}
        <Card className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 overflow-hidden bg-background/60 backdrop-blur-xl border-border/40 rounded-lg shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-300">
          
          {/* Левая часть (Split): Branding & Features */}
          <aside className="p-10 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border/40">
            <div className="space-y-8">
              <div className="space-y-5 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                  Effortless <span className="text-muted-foreground italic font-serif leading-tight">Creation</span>
                </h1>
                <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Join the community of creators building high-performance portfolios and digital memories.
                </p>
              </div>  

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-6 pt-6">
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
                Trusted by 5,000+ creators globally.
              </p>
            </div>
          </aside>

          {/* Правая часть (Split): Login Form */}
          <main className="flex-1 flex flex-col justify-center p-10 lg:p-16 relative bg-background/40">
            <div className="max-w-md w-full mx-auto">
              {!sent ? (
                <div className="space-y-8">
                  <div className="space-y-2 text-center">
                    <h2 className="text-3xl font-bold tracking-tight">Sign In</h2>
                    <p className="text-muted-foreground font-light italic font-serif">
                      Enter your email to start creating.
                    </p>
                  </div>

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
                        className="h-12 bg-background/50 backdrop-blur-sm border-border/60 focus-visible:ring-primary/20 rounded-xl px-4"
                      />
                      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
                    </div>

                    <Button 
                      onClick={handleSendMagicLink}
                      disabled={loading || !email}
                      className="w-full h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/5 hover:scale-[1.01] transition-all active:scale-95 group"
                    >
                      {loading ? "Sending..." : "Send Magic Link"}
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    <div className="relative py-4">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border/40" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-transparent px-4 text-muted-foreground/40 tracking-widest">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full h-12 rounded-xl border-border/60 bg-background/50 backdrop-blur-sm hover:bg-muted/30 transition-colors"
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Google Account
                    </Button>
                  </div>

                  <p className="text-center text-xs text-muted-foreground font-light leading-relaxed pt-6">
                    By signing in, you agree to our <br />
                    <a href="#" className="underline underline-offset-4 hover:text-foreground">Terms</a> and <a href="#" className="underline underline-offset-4 hover:text-foreground">Privacy Policy</a>.
                  </p>
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

      {/* Footer (outside card for more air) */}
      <footer className="text-center py-6 px-6 relative z-10">
        <p className="text-xs text-muted-foreground/60 font-light">
          © 2026 Milestis. Professional storytelling tools. All rights reserved.
        </p>
      </footer>
    </div>
  )
}