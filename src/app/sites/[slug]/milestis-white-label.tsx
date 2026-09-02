'use client'

import { useState, useEffect } from 'react'
import { Gift } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface MilestisWhiteLabelProps {
  /** Управляет тем, будет ли плашка кликабельной ссылкой. По умолчанию true. */
  clickable?: boolean
  /** uid владельца проекта — нужен только для варианта "invite", чтобы засчитать реферала. */
  referrerUid?: string
}

// Внутренний переключатель варианта плашки (не для пользователя, просто флаг в коде).
// 'default' — обычная пассивная плашка "Made with Milestis".
// 'invite' — иконка подарка, открывающая модалку с приглашением зарегистрироваться.
const BADGE_VARIANT: 'default' | 'invite' = 'invite'

const RUSSIAN_LOCALES = ['ru', 'kk', 'uk', 'be']

export function MilestisWhiteLabel({ clickable = true, referrerUid }: MilestisWhiteLabelProps) {
  const [isRussian, setIsRussian] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)

  useEffect(() => {
    const lang = navigator.language?.toLowerCase() ?? ''
    setIsRussian(RUSSIAN_LOCALES.some(l => lang.startsWith(l)))
  }, [])

  const showInvite = clickable && BADGE_VARIANT === 'invite' && !!referrerUid

  const defaultText = showInvite
    ? (isRussian ? 'Вам подарок' : 'You have a gift')
    : (isRussian ? 'Сделано в Milestis' : 'Made with Milestis')
  const hoverText = showInvite
    ? (isRussian ? 'Открыть →' : 'Open →')
    : (isRussian ? 'Создать такой же сайт →' : 'Create yours free →')
  const ariaLabel = showInvite
    ? (isRussian ? 'Вам подарок' : 'You have a gift')
    : (isRussian ? 'Сделано в Milestis' : 'Made with Milestis')

  const registerLink = `https://milestis.com/${isRussian ? 'ru' : 'en'}/auth/login?ref=${referrerUid}`

  // Плавное, мягкое увеличение, подходящее под спокойный интерфейс
  const containerClasses = 
    'group fixed bottom-5 left-5 z-[70] focus:outline-none transform transition-all duration-500 ease-[cubic-bezier(0.215,0.61,0.355,1)] hover:scale-[1.03]'

  const renderContent = () => (
    <div
      className="relative h-8 overflow-hidden rounded-full
        border border-stone-200/80 bg-stone-50/90 backdrop-blur-md
        shadow-[0_4px_18px_rgba(44,42,38,0.06),0_1px_3px_rgba(0,0,0,0.02)]
        transition-all duration-300
        group-hover:border-amber-400/40
        group-hover:shadow-[0_6px_24px_rgba(217,119,6,0.12)]"
    >
      {/* Мягкий, обволакивающий янтарно-песочный градиент при наведении (эффект тепла/солнца) */}
      <div
        className="absolute inset-0 opacity-0 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700
          transition-opacity duration-500 ease-out
          group-hover:opacity-100"
      />

      {/* Внутренний контейнер */}
      <div className="relative z-10 flex items-center h-full px-2 gap-2">
        
        {/* Иконка: подарок (invite) либо тёплый пульсирующий маркер (default) */}
        {showInvite ? (
          <Gift className="w-3.5 h-3.5 text-amber-600 transition-colors duration-300 group-hover:text-white" />
        ) : (
          <div className="relative flex items-center justify-center w-3 h-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-amber-500/40 animate-pulse dynamic-pulse group-hover:bg-white/40" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-600 transition-colors duration-300 group-hover:bg-white" />
          </div>
        )}

        {/* Слайдер текста */}
        <div className="relative h-4 overflow-hidden w-full min-w-[130px]">
          {/* Дефолтный текст — благородный графитовый (stone-800) */}
          <div
            className="absolute inset-0 flex items-center transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
              group-hover:-translate-y-full"
          >
            <span className="whitespace-nowrap text-[12px] font-medium tracking-wide text-stone-700">
              {defaultText}
            </span>
          </div>

          {/* Текст при наведении — чистый белый на тёплом фоне */}
          <div
            className="absolute inset-0 flex items-center translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
              group-hover:translate-y-0"
          >
            <span className="whitespace-nowrap text-[12px] font-semibold tracking-wide text-white">
              {hoverText}
            </span>
          </div>
        </div>
        
      </div>
    </div>
  )

  if (showInvite) {
    return (
      <>
        <button
          type="button"
          onClick={() => setInviteOpen(true)}
          className={containerClasses}
          aria-label={ariaLabel}
        >
          {renderContent()}
        </button>

        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTitle className="sr-only">{isRussian ? 'Вам подарок' : 'You have a gift'}</DialogTitle>
          <DialogDescription className="sr-only">
            {isRussian ? 'Зарегистрируйтесь в Milestis и получите бонусные кредиты' : 'Register on Milestis and get bonus credits'}
          </DialogDescription>
          <DialogContent className="overflow-hidden rounded-2xl border border-stone-200/80 bg-background p-0 sm:max-w-md">
            <div className="p-6 md:p-8 text-center space-y-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 mx-auto">
                <Gift className="h-8 w-8 text-amber-600" />
              </div>

              <div className="space-y-2">
                <h2 className="font-serif text-2xl font-medium tracking-tight">
                  {isRussian ? 'Кто-то поделился с вами Milestis' : 'Someone shared Milestis with you'}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {isRussian
                    ? 'Milestis — сервис для создания красивых фотокниг и портфолио. Зарегистрируйтесь и получите бонусные кредиты на первый проект.'
                    : 'Milestis is a tool for creating beautiful photobooks and portfolios. Register now and get bonus credits toward your first project.'}
                </p>
              </div>

              <a href={registerLink}>
                <Button className="w-full h-12 text-base font-semibold rounded-xl">
                  {isRussian ? 'Зарегистрироваться и получить бонус' : 'Register and get your bonus'}
                </Button>
              </a>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  if (clickable) {
    return (
      <a
        href="https://milestis.com"
        target="_blank"
        rel="noreferrer"
        className={containerClasses}
        aria-label={ariaLabel}
      >
        {renderContent()}
      </a>
    )
  }

  return (
    <div className={`${containerClasses} cursor-default`} aria-label={ariaLabel}>
      {/* На неклиopening плашке убираем анимацию пульсации, чтобы не кликали зря */}
      {renderContent()}
    </div>
  )
}