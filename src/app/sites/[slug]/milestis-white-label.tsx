'use client'

import { useState, useEffect } from 'react'

interface MilestisWhiteLabelProps {
  /** Управляет тем, будет ли плашка кликабельной ссылкой. По умолчанию true. */
  clickable?: boolean
}

const RUSSIAN_LOCALES = ['ru', 'kk', 'uk', 'be']

export function MilestisWhiteLabel({ clickable = true }: MilestisWhiteLabelProps) {
  const [isRussian, setIsRussian] = useState(false)

  useEffect(() => {
    const lang = navigator.language?.toLowerCase() ?? ''
    setIsRussian(RUSSIAN_LOCALES.some(l => lang.startsWith(l)))
  }, [])

  const defaultText = isRussian ? 'Сделано в Milestis' : 'Made with Milestis'
  const hoverText = isRussian ? 'Создать такой же сайт →' : 'Create yours free →'
  const ariaLabel = isRussian ? 'Сделано в Milestis' : 'Made with Milestis'

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
        
        {/* Иконка: Тёплый маркер, который плавно пульсирует (привлекает внимание, но не раздражает) */}
        <div className="relative flex items-center justify-center w-3 h-3">
          <span className="absolute inline-flex h-full w-full rounded-full bg-amber-500/40 animate-pulse dynamic-pulse group-hover:bg-white/40" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-600 transition-colors duration-300 group-hover:bg-white" />
        </div>

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