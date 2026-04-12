'use client'

import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'
import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'

interface CoverChronicleProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function CoverChronicle({ sectionContent, theme }: CoverChronicleProps) {
  const { cover } = sectionContent
  const imageUrl = cover.images?.image ?? ''
  const hasImage = Boolean(imageUrl)

  // Константы стилей для уменьшения вложенности в JSX
  const textContrast = hasImage ? 'text-white' : ''
  const subTextContrast = hasImage ? 'text-white/50' : 'opacity-50'
  const paddingX = 'px-8 @md:px-14 @lg:px-20'

  return (
    <SectionWrapper
      id="cover"
      themeForeground={!hasImage ? theme.foreground : undefined}
      className={cn(
        'relative min-h-screen flex flex-col overflow-hidden',
        !hasImage && theme.background
      )}
    >
      {/* Background Layer */}
      {hasImage && (
        <div className="absolute inset-0 z-0">
          <SiteImage
            fillParent
            unoptimized
            src={imageUrl}
            alt={cover.title ?? 'Cover'}
            sizes="100vw"
            imageClassName="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        </div>
      )}

      {/* Header */}
      <Animate 
        trigger="mount" 
        className={cn('relative z-10 flex items-center justify-between pt-8 @md:pt-10', paddingX)}
      >
        <div className="flex items-center gap-4">
          <div className={cn('h-[1px] w-10 transition-all', hasImage ? 'bg-white/40' : theme.accent)} />
          <span className={cn('text-[10px] uppercase tracking-[0.4em]', subTextContrast, theme.fontBody)}>
            Chronicle
          </span>
        </div>
        
        {(cover.date || cover.location) && (
          <p className={cn('text-[10px] uppercase tracking-widest', subTextContrast, theme.fontBody)}>
            {[cover.date, cover.location].filter(Boolean).join('  •  ')}
          </p>
        )}
      </Animate>

      {/* Hero Content */}
      <div className={cn('relative z-10 flex-1 flex flex-col justify-end pb-12 @md:pb-20 @lg:pb-28', paddingX)}>
        <Animate trigger="mount" direction="none" className="w-full">
          <div className={cn('h-[2px] w-24 mb-10', hasImage ? 'bg-white/30' : theme.accent)} />
        </Animate>

        <Animate trigger="mount" delay={0.2} distance={30} className="space-y-6">
          <h1 className={cn(
            'text-5xl @sm:text-6xl @md:text-7xl @lg:text-[8rem]',
            'font-bold tracking-tighter leading-[0.85] max-w-[15ch]',
            textContrast,
            theme.fontTitle
          )}>
            {cover.title}
          </h1>

          {(cover.subtitle || cover.tagline) && (
            <p className={cn(
              'text-base @md:text-lg font-light max-w-[40ch] border-l border-white/10 pl-6',
              subTextContrast,
              theme.lineHeight,
              theme.fontBody
            )}>
              {cover.subtitle || cover.tagline}
            </p>
          )}
        </Animate>
      </div>
    </SectionWrapper>
  )
}