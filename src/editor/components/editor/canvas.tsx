'use client'

import { useUiSelector, useThemeSelector, useContentSelector } from '@/editor/lib/store'
import { getTheme } from '@/editor/lib/themes'
import { getDecorations } from '@/editor/lib/decorations'
import { cn } from '@/lib/utils'
import { ClassicTemplateDesign } from '../templates/portfolio/classic-template'
import { MinimalTemplateDesign } from '../templates/portfolio/minimal-template'
import { ElegantTemplateDesign } from '../templates/portfolio/elegant-template'
import { ModernParallaxTemplate } from '../templates/portfolio/modern-template'
import React from 'react'
import { PhotobookTimelineTemplate } from '../templates/photobook/photobook-timeline'
import PhotobookMasonryTemplate from '../templates/photobook/photobook-masonry'
import { TemplateClassic } from '../templates/photobook/template-classic'
import { TemplateCircle } from '../templates/photobook/template-circle'
import { TemplateMagazine } from '../templates/photobook/template-magazine'
import { TemplatePolaroid } from '../templates/photobook/template-polaroid'
import { TemplateSplit } from '../templates/photobook/template-split'
import { TemplateVertical } from '../templates/photobook/template-vertical'
import { PortfolioTemplateShell } from '@/editor/components/editor/ui/portfolio-template-shell'
import type { PortfolioTemplateProps, PhotobookTemplateProps } from '@/editor/lib/template-types'
import { DecorationsLayer } from '@/editor/components/editor/ui/decorations-layer'

export function Canvas() {
  const deviceView = useUiSelector(state => state.deviceView)
  const editorMode = useUiSelector(state => state.editorMode)
  const previewDecorations = useUiSelector(state => state.previewDecorations)
  const { currentTemplateId, currentTheme, customDecorations, themeCustomizations } = useThemeSelector(state => ({
    currentTemplateId: state.currentTemplateId,
    currentTheme: state.currentTheme,
    customDecorations: state.customDecorations,
    themeCustomizations: state.themeCustomizations,
    frameStyle: state.frameStyle,
  }))
  const frameStyle = useThemeSelector(s => s.frameStyle)

  const theme = getTheme(currentTheme)
  const themeDecorations = previewDecorations ?? getDecorations(currentTheme)
  const { photobookSectionContent, photobookSectionVisibility } = useContentSelector(state => ({
    photobookSectionContent: state.photobookSectionContent,
    photobookSectionVisibility: state.photobookSectionVisibility,
  }))

  const portfolioDesigns: Record<string, React.ComponentType<PortfolioTemplateProps>> = {
    classic: ClassicTemplateDesign,
    minimal: MinimalTemplateDesign,
    elegant: ElegantTemplateDesign,
    modern: ModernParallaxTemplate,
  }

  const photobookDesigns: Record<string, React.ComponentType<PhotobookTemplateProps>> = {
    'wedding-timeline': PhotobookTimelineTemplate,
    masonry: PhotobookMasonryTemplate,
    'photobook-classic': TemplateClassic,
    'photobook-circle': TemplateCircle,
    'photobook-magazine': TemplateMagazine,
    'photobook-polaroid': TemplatePolaroid,
    'photobook-split': TemplateSplit,
    'photobook-vertical': TemplateVertical,
  }
  
  const renderTemplate = () => {
    if (editorMode === 'photobook') {
      const PhotobookDesign = photobookDesigns[currentTemplateId] || PhotobookTimelineTemplate

      return (
        <PhotobookDesign
          theme={theme}
          sectionVisibility={photobookSectionVisibility}
          sectionContent={photobookSectionContent}
          frameStyle={frameStyle}
        />
      )
    }

    const Design = portfolioDesigns[currentTemplateId] ?? portfolioDesigns.classic
    return <PortfolioTemplateShell Design={Design} />
  }

  const allDecorations = [
    ...(themeDecorations?.elements || []),
    ...customDecorations
  ]

  const decorationAnimation = themeCustomizations.decorationAnimation || themeDecorations?.animation || 'fade'
  return (
    <div className="flex-1 bg-slate-100 p-1 md:p-2 lg:p-4 overflow-auto">
      <div
        className={cn(
          '@container mx-auto transition-all duration-300',
          deviceView === 'mobile' && 'max-w-sm w-full',
          deviceView === 'tablet' && 'w-full max-w-3xl',
          deviceView === 'desktop' && 'w-full max-w-7xl',
          deviceView === 'fullscreen' && 'w-screen h-[calc(100vh-4rem)] max-w-none fixed left-0 top-16 z-50 bg-white overflow-auto'
        )}
      >
        <div className={cn(
          'shadow-2xl overflow-hidden relative',
          theme.background,
          theme.foreground,
          theme.fontBody,
          theme.lineHeight,
          theme.letterSpacing,
          theme.radiusMedium,
          theme.shadow
        )}>
          {(themeCustomizations.customBackground || themeDecorations?.backgroundImage) && (
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{ 
                backgroundImage: `url(${themeCustomizations.customBackground || themeDecorations?.backgroundImage?.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: (themeCustomizations.backgroundImageType || themeDecorations?.backgroundImage?.type) === 'fixed' ? 'fixed' : 'scroll',
                opacity: themeCustomizations.backgroundImageOpacity ?? (themeDecorations?.backgroundImage?.opacity || 0.15)
              }}
            />
          )}

          <DecorationsLayer decorations={allDecorations} animation={decorationAnimation} />

          <div className="relative z-10">
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  )
}
