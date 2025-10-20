"use client"

import { useState } from "react"
import { ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { sendSignInLinkToEmail } from "@/lib/auth"

type DialogSignInMagicLinkProps = {
  onBack?: () => void
}

const DialogSignInMagicLink = ({ onBack }: DialogSignInMagicLinkProps) => {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { success, error } = await sendSignInLinkToEmail(email)
    if (success) {
      setSent(true)
    } else if (error) {
      setError(error.message)
    }
    setLoading(false)
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
            <Mail className="size-6 text-primary" />
          </div>
          <span className="text-lg font-semibold">Вход по ссылке</span>
        </div>

        <div style={{ width: 40 }} />
      </div>

      <p className="text-center text-muted-foreground text-sm">
        Введите свой email — мы отправим на него ссылку для входа или регистрации.
      </p>

      {error && <p className="text-center text-red-500 text-sm mt-2">{error}</p>}

      {sent ? (
        <div className="text-center text-green-500 mt-4">
          Ссылка отправлена! Проверьте почту и перейдите по ссылке для входа.
        </div>
      ) : (
        <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground 
                       hover:bg-primary/90 focus-visible:ring-primary 
                       transition-colors duration-200 cursor-pointer mt-2"
            disabled={loading}
          >
            {loading ? "Отправка..." : "Отправить ссылку"}
          </Button>
        </form>
      )}
    </>
  )
}

export default DialogSignInMagicLink
