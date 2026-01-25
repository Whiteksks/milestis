"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, CheckCircle2, ArrowLeft, Sparkles, Shield, Zap, Lock } from "lucide-react"
import Header from "@/components/layout/header"

// Stub function for sending magic link
async function sendMagicLink(email: string): Promise<{ success: boolean; error?: string }> {
  // TODO: Implement real magic link logic
  // const { success, error } = await sendSignInLinkToEmail(email)
  console.log("[v0] Sending magic link to:", email)
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Stub: always return success for now
  return { success: true }
}

// Stub function for Google sign-in
function handleGoogleSignIn() {
  // TODO: Implement real Google OAuth logic
  // await signInWithGoogle()
  console.log("[v0] Google sign-in initiated")
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSendMagicLink = async () => {
    if (!email) return
    setLoading(true)
    setError(null)

    const { success, error: sendError } = await sendMagicLink(email)

    if (success) {
      setSent(true)
    } else if (sendError) {
      setError(sendError)
    }

    setLoading(false)
  }

  const handleChangeEmail = () => {
    setSent(false)
    setError(null)
  }

  const features = [
    {
      icon: Zap,
      title: "Мгновенный доступ",
      description: "Никаких паролей — просто кликните по ссылке в письме"
    },
    {
      icon: Shield,
      title: "Безопасность",
      description: "Современная аутентификация без риска утечки паролей"
    },
    {
      icon: Lock,
      title: "Приватность",
      description: "Ваши данные защищены и принадлежат только вам"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header className="bg-transparent" showAuthButton={false} />
      <div className="flex min-h-screen">
        {/* Left side - Branding & Features */}
        <div className="relative hidden w-1/2 bg-muted lg:flex lg:flex-col lg:justify-between">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-foreground/5" />
            <div className="absolute bottom-40 right-20 h-60 w-60 rounded-full bg-foreground/5" />
            <div className="absolute bottom-20 left-40 h-40 w-40 rounded-full bg-foreground/5" />
          </div>
          
          <div className="relative z-10 p-12">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground">
                <Sparkles className="h-5 w-5 text-background" />
              </div>
              <span className="text-xl font-semibold text-foreground">Milestis</span>
            </div>
          </div>

          <div className="relative z-10 px-12 pb-12">
            {/* Main heading */}
            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground">
              Добро пожаловать в мир продуктивности
            </h1>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              Присоединяйтесь к тысячам пользователей, которые уже упростили свою работу с нашим сервисом.
            </p>

            {/* Features list */}
            <div className="mt-10 space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground/10">
                    <feature.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{feature.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 border-t border-border/50 px-12 py-6">
            <p className="text-sm text-muted-foreground">
              © 2026 Milestis. Все права защищены.
            </p>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2 lg:px-12">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground">
                <Sparkles className="h-5 w-5 text-background" />
              </div>
              <span className="text-xl font-semibold text-foreground">Milestis</span>
            </div>

            <Card className="border-border/50 shadow-xl shadow-foreground/5">
              <CardContent className="p-8">
                {!sent ? (
                  <>
                    {/* Header */}
                    <div className="mb-8 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
                        <Sparkles className="h-7 w-7 text-foreground" />
                      </div>
                      <h2 className="mt-6 text-2xl font-semibold text-foreground">
                        Войти в аккаунт
                      </h2>
                      <p className="mt-2 text-muted-foreground">
                        Введите email для входа или регистрации
                      </p>
                    </div>

                    {/* Form */}
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-foreground">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSendMagicLink()}
                          className="h-12 rounded-xl border-border/60 bg-background px-4"
                        />
                        {error && (
                          <p className="text-sm text-destructive">{error}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Пароль не требуется — мы отправим вам ссылку для входа
                        </p>
                      </div>

                      <Button
                        onClick={handleSendMagicLink}
                        disabled={loading || !email}
                        className="h-12 w-full rounded-xl font-medium disabled:opacity-50"
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        {loading ? "Отправляем..." : "Отправить ссылку"}
                      </Button>

                      <div className="relative flex items-center py-2">
                        <Separator className="flex-1" />
                        <span className="px-4 text-xs text-muted-foreground">
                          или
                        </span>
                        <Separator className="flex-1" />
                      </div>

                      <Button
                        variant="outline"
                        onClick={handleGoogleSignIn}
                        className="h-12 w-full rounded-xl border-border/60 bg-background font-medium"
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
                        Войти через Google
                      </Button>
                    </div>

                    {/* Terms */}
                    <p className="mt-6 text-center text-xs text-muted-foreground">
                      Продолжая, вы соглашаетесь с{" "}
                      <a href="#" className="underline underline-offset-2 hover:text-foreground">
                        условиями использования
                      </a>{" "}
                      и{" "}
                      <a href="#" className="underline underline-offset-2 hover:text-foreground">
                        политикой конфиденциальности
                      </a>
                    </p>
                  </>
                ) : (
                  /* Success state */
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                      <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>

                    <h2 className="mt-6 text-2xl font-semibold text-foreground">
                      Проверьте почту
                    </h2>

                    <p className="mt-3 text-muted-foreground">
                      Мы отправили ссылку для входа на{" "}
                      <span className="font-medium text-foreground">{email}</span>
                    </p>

                    <p className="mt-4 text-xs text-muted-foreground/70">
                      Не видите письмо? Проверьте папку «Спам»
                    </p>

                    <div className="mt-8 w-full space-y-3">
                      <Button
                        onClick={handleSendMagicLink}
                        disabled={loading}
                        className="h-11 w-full rounded-xl font-medium"
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Отправить повторно
                      </Button>

                      <Button
                        variant="ghost"
                        onClick={handleChangeEmail}
                        className="h-11 w-full rounded-xl"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Изменить email
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mobile features - shown below the card on smaller screens */}
            <div className="mt-8 space-y-4 lg:hidden">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <feature.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">{feature.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
