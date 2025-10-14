'use client'

import { useId, useMemo, useState, useEffect } from 'react'
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type Props = {
  onValidChange?: (valid: boolean) => void
}

const InputPasswordStrength = ({ onValidChange }: Props) => {
  const t = useTranslations('Password')

  const [password, setPassword] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  const id = useId()

  const toggleVisibility = () => setIsVisible(prev => !prev)

  const requirements = [
    { regex: /.{8,}/, text: t('requirements.length') },
    { regex: /[a-zа-яё]/i, text: t('requirements.lowercase') },
    { regex: /[A-ZА-ЯЁ]/, text: t('requirements.uppercase') },
    { regex: /[0-9]/, text: t('requirements.number') },
  ]

  const strength = requirements.map(req => ({
    met: req.regex.test(password),
    text: req.text,
  }))

  const strengthScore = useMemo(() => {
    return strength.filter(req => req.met).length
  }, [strength])

  const isValid = strength.every(req => req.met)

  useEffect(() => {
    onValidChange?.(isValid)
  }, [isValid, onValidChange])

  const getColor = (score: number) => {
    if (score === 0) return 'bg-border'
    if (score <= 1) return 'bg-destructive'
    if (score <= 2) return 'bg-orange-500'
    if (score <= 3) return 'bg-amber-500'
    return 'bg-green-500'
  }

  const getText = (score: number) => {
    if (score === 0) return t('strength.empty')
    if (score <= 2) return t('strength.weak')
    if (score <= 3) return t('strength.medium')
    if (score === 4) return t('strength.strong')
    return t('strength.veryStrong')
  }

  return (
    <div className="w-full max-w-xs space-y-2">
      <div className="relative mb-3">
        <Input
          id={id}
          type={isVisible ? 'text' : 'password'}
          placeholder={t('placeholder')}
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="pe-9"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleVisibility}
          className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 end-0 rounded-s-none hover:bg-transparent"
        >
          {isVisible ? <EyeOffIcon /> : <EyeIcon />}
          <span className="sr-only">
            {isVisible ? t('hide') : t('show')}
          </span>
        </Button>
      </div>

      <div className="mb-4 flex h-1 w-full gap-1">
        {Array.from({ length: 4 }).map((_, index) => (
          <span
            key={index}
            className={cn(
              'h-full flex-1 rounded-full transition-all duration-500 ease-out',
              index < strengthScore ? getColor(strengthScore) : 'bg-border'
            )}
          />
        ))}
      </div>

      <p className="text-foreground text-sm font-medium">
        {getText(strengthScore)}
      </p>

      <ul className="mb-4 space-y-1.5">
        {strength.map((req, index) => (
          <li key={index} className="flex items-center gap-2">
            {req.met ? (
              <CheckIcon className="size-4 text-green-600 dark:text-green-400" />
            ) : (
              <XIcon className="text-muted-foreground size-4" />
            )}
            <span
              className={cn(
                'text-xs',
                req.met
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-muted-foreground'
              )}
            >
              {req.text}
              <span className="sr-only">
                {req.met ? t('met') : t('notMet')}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default InputPasswordStrength
