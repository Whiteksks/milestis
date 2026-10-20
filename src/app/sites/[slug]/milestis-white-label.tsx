'use client'

import { siteConfig } from '@/config/site'

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

const BADGE_VARIANT: 'default' | 'invite' = 'invite'
const RUSSIAN_LOCALES = ['ru', 'kk', 'uk', 'be']

export function MilestisWhiteLabel({ clickable = true, referrerUid }: MilestisWhiteLabelProps) {
  const [isRussian, setIsRussian] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)

  useEffect(() => {
    const lang = navigator.language?.toLowerCase() ?? ''
    setIsRussian(RUSSIAN_LOCALES.some(l => lang.startsWith(l)))
  }, [])

  const FORCE_ALWAYS_INVITE = true
  const activeReferrerUid = referrerUid || 'promo'

  const showInvite = FORCE_ALWAYS_INVITE || (clickable && BADGE_VARIANT === 'invite' && !!referrerUid)

  const defaultText = showInvite
    ? (isRussian ? 'Вам подарок' : 'You have a gift')
    : (isRussian ? 'Сделано в Milestis' : 'Made with Milestis')
  const hoverText = showInvite
    ? (isRussian ? 'Открыть →' : 'Open →')
    : (isRussian ? 'Создать такой же сайт →' : 'Create yours free →')
  const ariaLabel = showInvite
    ? (isRussian ? 'Вам подарок' : 'You have a gift')
    : (isRussian ? 'Сделано в Milestis' : 'Made with Milestis')

  const registerLink = `${siteConfig.appUrl}/${isRussian ? 'ru' : 'en'}/auth/login?ref=${activeReferrerUid}`

  const containerClasses = 
    'group fixed bottom-5 left-5 z-[70] focus:outline-none transform transition-all duration-300 ease-out hover:scale-[1.04] active:scale-95'

  const renderContent = () => (
    <div
      className="relative h-9 overflow-hidden rounded-full p-[1px]
        bg-gradient-to-r from-stone-200 via-stone-400 to-stone-200
        shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1),0_2px_6px_-1px_rgba(0,0,0,0.06)]
        transition-all duration-300
        group-hover:shadow-[0_8px_25px_-4px_rgba(0,0,0,0.2),0_4px_10px_-2px_rgba(0,0,0,0.1)]
        group-hover:from-stone-400 group-hover:via-stone-200 group-hover:to-stone-400"
    >
      {/* Анимированный переливающийся блик на фоне */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.6),transparent)] 
          bg-[length:200%_100%] animate-[shimmer_3s_infinite_linear] pointer-events-none opacity-40 group-hover:opacity-75" 
      />

      {/* Мягкое пульсирующее внешнее свечение для инвайта */}
      {showInvite && (
        <span className="absolute -inset-0.5 rounded-full bg-stone-400/30 blur-sm animate-pulse pointer-events-none group-hover:bg-stone-500/40" />
      )}

      {/* Внутренняя подложка (плашка) */}
      <div className="relative h-full w-full rounded-full bg-[#FAF9F6]/90 backdrop-blur-md transition-colors duration-300 group-hover:bg-stone-900">
        <div className="relative z-10 flex items-center h-full px-3.5 gap-2.5">
          {showInvite ? (
            <div className="relative flex items-center justify-center">
              <Gift className="w-3.5 h-3.5 text-stone-800 transition-colors duration-300 group-hover:text-stone-100" />
            </div>
          ) : (
            <div className="relative flex items-center justify-center w-3 h-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-stone-400/40 animate-pulse group-hover:bg-stone-400/60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-stone-700 transition-colors duration-300 group-hover:bg-white" />
            </div>
          )}

          <div className="relative h-4 overflow-hidden min-w-[120px]">
            {/* Текст по умолчанию */}
            <div
              className="absolute inset-0 flex items-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                group-hover:-translate-y-full"
            >
              <span className="whitespace-nowrap text-[12px] font-medium tracking-wide text-stone-800">
                {defaultText}
              </span>
            </div>

            {/* Текст при наведении */}
            <div
              className="absolute inset-0 flex items-center translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                group-hover:translate-y-0"
            >
              <span className="whitespace-nowrap text-[12px] font-medium tracking-wide text-stone-100">
                {hoverText}
              </span>
            </div>
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
          <DialogTitle className="sr-only">
            {isRussian ? 'Приглашение в Milestis' : 'Milestis Invitation'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isRussian ? 'Вам передано персональное приглашение' : 'You have received a personal invitation'}
          </DialogDescription>
          
          <DialogContent 
            className="
              max-h-[85vh] flex flex-col p-0 overflow-hidden rounded-2xl 
              border border-stone-200/80 bg-[#FAF9F6] text-stone-900 
              shadow-2xl sm:max-w-[400px]
              will-change-transform transform-gpu subpixel-antialiased backface-hidden
              data-[state=open]:animate-in data-[state=closed]:animate-out 
              data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 
              data-[state=closed]:zoom-out-98 data-[state=open]:zoom-in-98
              duration-200 ease-out
            "
          >
            {/* Декоративная акцентная полоса */}
            <div className="h-1 w-full bg-gradient-to-r from-stone-300 via-stone-800 to-stone-300 opacity-60" />

            {/* Шапка карточки */}
            <div className="pt-6 px-8 pb-4 border-b border-stone-200/50 text-left flex-shrink-0 flex justify-between items-center">
              <span className="text-[10px] font-mono tracking-[0.25em] text-stone-400 uppercase">
                Milestis
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-200/60 px-2.5 py-0.5 text-[10px] font-medium text-stone-700 border border-stone-300/50">
                <Gift className="w-2.5 h-2.5 text-stone-600" />
                {isRussian ? 'Подарок' : 'Gift'}
              </span>
            </div>

            {/* Контент */}
            <div className="overflow-y-auto p-8 space-y-4 text-left flex-1 select-none">
              <h2 className="font-serif text-2xl md:text-[28px] font-normal tracking-tight text-stone-900 leading-[1.2] transform-gpu">
                {isRussian 
                  ? 'Вас пригласили в Milestis' 
                  : 'You have been invited to Milestis'}
              </h2>

              <p className="text-stone-600 text-sm leading-relaxed font-normal transform-gpu">
                {isRussian
                  ? 'Вам передан доступ с бонусными кредитами. Зарегистрируйтесь, чтобы использовать их при создании первого проекта.'
                  : 'You received an invite with bonus credits. Register to apply them to your first project.'}
              </p>
            </div>

            {/* Нижний блок */}
            <div className="p-8 pt-0 flex-shrink-0">
              <a href={registerLink} className="block w-full group">
                <Button className="w-full h-12 text-xs uppercase tracking-[0.15em] font-medium rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-50 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
                  <span>{isRussian ? 'Принять приглашение' : 'Accept invitation'}</span>
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
                </Button>
              </a>
              <span className="block text-center text-[11px] text-stone-400 mt-3 font-normal">
                {isRussian ? 'Бесплатная регистрация' : 'Free registration'}
              </span>
            </div>

          </DialogContent>
        </Dialog> 
      </>
    )
  }

  if (clickable) {
    return (
      <a
        href={`${siteConfig.appUrl}`}
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
      {renderContent()}
    </div>
  )
}