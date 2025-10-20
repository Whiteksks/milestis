'use client'

import { useState } from 'react'
import { LogInIcon, ArrowLeft, MailIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { sendSignInLinkToEmail } from '@/lib/auth'

type DialogSignUpProps = {
  onBack?: () => void
}

const DialogSignUp = ({ onBack }: DialogSignUpProps) => {
  const t = useTranslations('signupauth')

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)
    setLoading(true)

    try {
      await sendSignInLinkToEmail(email)
      setEmailSent(true)
    } catch (err: any) {
      setAuthError(err.message || 'Ошибка при отправке письма')
    } finally {
      setLoading(false)
    }
  }

  // Если письмо уже отправлено — показываем сообщение вместо формы
  if (emailSent) {
    return (
      <div className="flex flex-col items-center text-center gap-3">
        <div
          className={cn(
            'flex size-12 items-center justify-center rounded-full bg-sky-600/10 dark:bg-sky-400/10'
          )}
        >
          <MailIcon className="text-sky-600 dark:text-sky-400" strokeWidth={1.5} />
        </div>

        <h2 className="text-lg font-semibold">{t('checkEmailTitle') || 'Проверьте вашу почту'}</h2>
        <p className="text-muted-foreground text-sm">
          Мы отправили ссылку для входа на адрес <strong>{email}</strong>.  
          Откройте письмо и перейдите по ссылке, чтобы подтвердить аккаунт.
        </p>

        <p className="text-sm mt-2">
          Не получили письмо?{' '}
          <a href="#" className="text-sky-600 hover:underline dark:text-sky-400">
            Отправить ещё раз
          </a>
        </p>
      </div>
    )
  }

  // Основная форма (до отправки письма)
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded hover:bg-muted/40 transition-colors"
          aria-label="Назад"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 flex flex-col items-center">
          <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <LogInIcon className="size-6 text-primary" />
          </div>
          <span className="text-lg font-semibold">{t('signUpTitle')}</span>
        </div>

        <div style={{ width: 40 }} />
      </div>

      <p className="text-center text-muted-foreground text-sm mb-4">
        {t('subTextSignUp')}
      </p>

      {authError && (
        <p className="text-center text-red-500 text-sm mt-2">{authError}</p>
      )}

      <form className="flex flex-col gap-4" onSubmit={handleSignUp}>
        <div className="grid gap-3">
          <Label htmlFor="email">{t('email')}</Label>
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

        <Button
          type="submit"
          className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary transition-colors"
          disabled={loading || !email}
        >
          {loading ? 'Отправляем...' : t('getStarted') || 'Зарегистрироваться'}
        </Button>
      </form>
    </>
  )
}

export default DialogSignUp
