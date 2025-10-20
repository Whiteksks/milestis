"use client"

import { LogInIcon, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { signInWithEmail, sendPasswordReset } from "@/lib/auth";

type DialogSignInProps = {
  onBack?: () => void
}

const DialogSignIn = ({ onBack }: DialogSignInProps) => {
  const t = useTranslations("auth")

  const [forgot, setForgot] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [forgotEmail, setForgotEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { user, error } = await signInWithEmail(email, password);
    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { success, error } = await sendPasswordReset(forgotEmail);
    if (success) {
      setSent(true)
    } else if (error) {
      setError(error.message);
    }
    setLoading(false);
  }

  if (forgot) {
    return (
      <>
        {/* Заголовок с кнопкой назад */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => { setForgot(false); setError(null); }}
            className="p-2 rounded hover:bg-muted/40 transition-colors cursor-pointer"
            aria-label="Назад"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 flex flex-col items-center">
            <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
              <LogInIcon className="size-6 text-primary" />
            </div>
            <span className="text-lg font-semibold">{t("recoveryTitle")}</span>
          </div>
          <div style={{ width: 40 }} />
        </div>

        <p className="text-center text-muted-foreground text-sm">{t("recoveryDesc")}</p>
        {error && <p className="text-center text-red-500 text-sm mt-2">{error}</p>}

        {sent ? (
          <div className="text-center text-green-500 mb-4">{t("recoverySuccess")}</div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleForgotSubmit}>
            <div className="grid gap-3">
              <Label htmlFor="forgot-email">{t("email")}</Label>
              <Input
                type="email"
                id="forgot-email"
                name="forgot-email"
                placeholder="example@gmail.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full mt-4 bg-primary text-primary-foreground 
                         hover:bg-primary/90 focus-visible:ring-primary 
                         transition-colors duration-200 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Sending..." : t("sendRecovery")}
            </Button>
          </form>
        )}
      </>
    )
  }

  return (
    <>
      {/* Заголовок с кнопкой назад */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded hover:bg-muted/40 transition-colors cursor-pointer"
          aria-label="Назад"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 flex flex-col items-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
            <LogInIcon className="size-6 text-primary" />
          </div>
          <span className="text-lg font-semibold">{t("signInTitle")}</span>
        </div>
        <div style={{ width: 40 }} />
      </div>

      <p className="text-center text-muted-foreground text-sm">{t("subText")}</p>
      {error && <p className="text-center text-red-500 text-sm mt-2">{error}</p>}

      {/* Форма входа */}
      <form className="flex flex-col gap-4" onSubmit={handleSignIn}>
        <div className="grid gap-3">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            type="email"
            id="email"
            name="useremail"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="password">{t("password")}</Label>
          <Input
            type="password"
            id="password"
            name="userpassword"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="button"
          className="text-xs text-primary hover:underline self-center cursor-pointer"
          onClick={() => { setForgot(true); setError(null); }}
        >
          {t("forgot")}
        </button>

        <Button
          type="submit"
          className="w-full bg-primary text-primary-foreground 
                     hover:bg-primary/90 focus-visible:ring-primary 
                     transition-colors duration-200 cursor-pointer"
          disabled={loading}
        >
          {loading ? "Signing In..." : t("getStarted")}
        </Button>
      </form>
    </>
  )
}

export default DialogSignIn
