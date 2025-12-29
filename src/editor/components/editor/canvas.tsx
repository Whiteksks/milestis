'use client'

import { useRef } from 'react'
import { useUiSelector, useThemeSelector, useContentSelector } from '@/editor/lib/store'
import { getTheme } from '@/editor/lib/themes'
import { getDecorations } from '@/editor/lib/decorations'
import { MODE_REGISTRY } from '@/editor/lib/mode-registry'
import { getBackgroundLayerProps, resolveBackgroundImage } from '@/editor/lib/background'
import { cn } from '@/lib/utils'
import { DecorationsLayer } from '@/editor/components/editor/ui/decorations-layer'
import { CanvasScrollProvider } from '@/editor/components/editor/canvas-scroll-context'
import { useParallaxLayer } from '@/editor/hooks/use-parallax-layer'

export function Canvas() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const viewportBackgroundRef = useRef<HTMLDivElement>(null)
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

  const renderTemplate = () => {
    const modeEntry = MODE_REGISTRY[editorMode]

    return modeEntry.renderCanvas({
      templateId: currentTemplateId,
      theme,
      frameStyle,
      photobookSectionContent,
      photobookSectionVisibility,
    })
  }

  const allDecorations = [
    ...(themeDecorations?.elements || []),
    ...customDecorations
  ]

  const decorationAnimation = themeCustomizations.decorationAnimation || themeDecorations?.animation || 'fade'
  const resolvedBackground = resolveBackgroundImage({
    decorations: themeDecorations,
    overrides: {
      customBackground: themeCustomizations.customBackground,
      backgroundImageType: themeCustomizations.backgroundImageType,
      backgroundImageOpacity: themeCustomizations.backgroundImageOpacity,
    },
  })
  const backgroundLayer = getBackgroundLayerProps(resolvedBackground)

  const contentBackgroundClass =
    backgroundLayer?.placement === 'viewport' ? 'bg-transparent' : theme.background

  useParallaxLayer({
    enabled: resolvedBackground?.mode === 'parallax',
    scrollContainerRef,
    viewportRef,
    layerRef: viewportBackgroundRef,
    strength: resolvedBackground?.parallaxStrength ?? 1,
    scale: resolvedBackground?.parallaxScale ?? 1.12,
  })

  return (
    <div className="flex-1 min-h-0 bg-slate-100 p-1 md:p-2 lg:p-4 overflow-hidden">
      <div
        ref={viewportRef}
        className={cn(
          '@container mx-auto h-full relative overflow-hidden transition-all duration-300 transform-[translateZ(0)]',
          deviceView === 'mobile' && 'max-w-sm w-full',
          deviceView === 'tablet' && 'w-full max-w-3xl',
          deviceView === 'desktop' && 'w-full max-w-7xl',
          deviceView === 'fullscreen' && 'w-screen h-[calc(100vh-4rem)] max-w-none fixed left-0 top-16 z-50 bg-white'
        )}
      >
        {backgroundLayer?.placement === 'viewport' && (
          <div
            ref={viewportBackgroundRef}
            className={cn(backgroundLayer.className, 'z-0')}
            style={backgroundLayer.style}
          />
        )}

        <div ref={scrollContainerRef} className="h-full overflow-auto relative z-10">
          <CanvasScrollProvider value={scrollContainerRef}>
            <div className={cn(
              'shadow-2xl overflow-hidden relative',
              contentBackgroundClass,
              theme.foreground,
              theme.fontBody,
              theme.lineHeight,
              theme.letterSpacing,
              theme.shadow
            )}>
              {backgroundLayer?.placement === 'content' && (
                <div className={backgroundLayer.className} style={backgroundLayer.style} />
              )}

              <DecorationsLayer decorations={allDecorations} animation={decorationAnimation} />

              <div className="relative z-10">
                {renderTemplate()}
              </div>
            </div>
          </CanvasScrollProvider>
        </div>
      </div>
    </div>
  )
}
