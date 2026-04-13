'use client'

import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'

interface CoverSoleilProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function CoverSoleil({ sectionContent, theme }: CoverSoleilProps) {
  const { cover } = sectionContent
  const imageUrl = cover.images?.image ?? ''
  const hasImage = Boolean(imageUrl)
  const imageSettings = cover.images?.imageSettings?.[0]
  const aspectRatio = imageSettings?.aspectRatio ?? 'portrait'
  const frameStyle = imageSettings?.frameStyle ?? 'none'

  return (
    <SectionWrapper
      id="cover"
      themeForeground={theme.foreground}
      className={cn(
        'min-h-[100dvh] flex flex-col',
        theme.background,
      )}
    >
      {/* 1. Верхний бар: Дата и Локация */}
      <Animate
        trigger="mount"
        direction="none"
        delay={0.6}
        className="flex items-center justify-center gap-6 py-10"
      >
        <div className="h-px w-12 bg-current opacity-10" />
        {(cover.date || cover.location) && (
          <p className={cn('text-[9px] uppercase tracking-[0.6em] opacity-30', theme.fontBody)}>
            {[cover.date, cover.location].filter(Boolean).join('  \u2014  ')}
          </p>
        )}
        <div className="h-px w-12 bg-current opacity-10" />
      </Animate>

      {/* 2. Основной контент */}
      <div className="flex-1 flex items-center justify-center px-6 @md:px-12">
        {hasImage ? (
          <div className="flex flex-col @md:flex-row items-center justify-center gap-12 @md:gap-20 @lg:gap-32 w-full max-w-7xl">
            
            {/* Контейнер с фото (Уменьшен и отцентрован) */}
            <Animate
              trigger="mount"
              delay={0.1}
              distance={30}
              direction="up"
              className="w-full @sm:w-[70%] @md:w-[40%] @lg:w-[35%] shrink-0"
            >
              <div className={cn(
                'relative w-full aspect-[3/4] overflow-hidden rounded-[2px] ring-1 ring-current/5',
                theme.shadow
              )}>
                <SiteImage
                  src={imageUrl}
                  alt={cover.title ?? 'Cover'}
                  aspectRatio={aspectRatio}
                  frameStyle={frameStyle}
                  cropData={imageSettings?.cropData}
                  unoptimized
                  sizes="(max-width: 768px) 80vw, 30vw"
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
            </Animate>

            {/* Текстовый блок */}
            <Animate
              trigger="mount"
              delay={0.3}
              className="flex flex-col items-center @md:items-start text-center @md:text-left space-y-8 max-w-[450px]"
            >
              <div className="space-y-4">
                <h1 className={cn(
                  'text-5xl @sm:text-6xl @lg:text-7xl font-light leading-[0.95] tracking-tighter',
                  theme.fontTitle
                )}>
                  {cover.title}
                </h1>
                
                {cover.subtitle && (
                  <p className={cn(
                    'text-base @lg:text-lg font-light opacity-50 max-w-[30ch]',
                    theme.fontBody
                  )}>
                    {cover.subtitle}
                  </p>
                )}
                {cover.tagline && (
                  <p className={cn(
                    'text-sm font-light italic opacity-35 max-w-[30ch]',
                    theme.fontBody
                  )}>
                    {cover.tagline}
                  </p>
                )}
              </div>

              {/* Декоративный элемент */}
              <div className="flex items-center gap-4 opacity-20">
                <div className="h-px w-8 bg-current" />
                <div className="w-1 h-1 rounded-full bg-current" />
                <div className="h-px w-8 bg-current" />
              </div>
            </Animate>
          </div>
        ) : (
          /* Вариант без изображения (Поэтичный центр) */
          <Animate trigger="mount" delay={0.1} className="text-center space-y-8">
            <h1 className={cn('text-6xl @md:text-8xl font-light tracking-tighter', theme.fontTitle)}>
              {cover.title}
            </h1>
            <div className="h-px w-20 bg-current opacity-20 mx-auto" />
            {cover.subtitle && (
              <p className={cn('text-lg opacity-50 max-w-[35ch] mx-auto font-light', theme.fontBody)}>
                {cover.subtitle}
              </p>
            )}
            {cover.tagline && (
              <p className={cn('text-base opacity-35 max-w-[35ch] mx-auto font-light italic', theme.fontBody)}>
                {cover.tagline}
              </p>
            )}
          </Animate>
        )}
      </div>

      {/* 3. Нижняя линия */}
      <Animate
        trigger="mount"
        direction="none"
        delay={0.8}
        className="px-8 @md:px-20 py-10"
      >
        <div className="h-[0.5px] w-full bg-current opacity-10" />
      </Animate>
    </SectionWrapper>
  )
}