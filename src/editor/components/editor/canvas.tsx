'use client'

import { useRef, useMemo } from 'react'
import { useUiSelector, useThemeSelector, useContentSelector } from '@/editor/lib/store'
import { getTheme } from '@/editor/lib/themes'
import { getDecorations } from '@/editor/lib/decorations'
import { MODE_REGISTRY } from '@/editor/lib/mode-registry'
import { cn } from '@/lib/utils'
import { DecorationsLayer } from '@/editor/components/editor/ui/decorations-layer'
import { CanvasScrollProvider } from '@/editor/components/editor/canvas-scroll-context'
import { useCanvasBackground } from '@/editor/hooks/use-canvas-background'
import { BackgroundLayer } from './ui/background-layer'
import type { DeviceView } from '@/editor/lib/types'

const DEVICE_CLASSES: Record<DeviceView, string> = {
  mobile: 'max-w-sm w-full',
  tablet: 'w-full max-w-3xl',
  desktop: 'w-full max-w-7xl',
  fullscreen: 'w-screen h-[calc(100vh-4rem)] max-w-none fixed left-0 top-16 z-50 bg-white',
}

export function Canvas() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const { deviceView, editorMode, previewDecorations } = useUiSelector(state => ({
    deviceView: state.deviceView,
    editorMode: state.editorMode,
    previewDecorations: state.previewDecorations,
  }))

  const { currentTemplateId, currentTheme, customDecorations, themeCustomizations, frameStyle } = useThemeSelector(state => ({
    currentTemplateId: state.currentTemplateId,
    currentTheme: state.currentTheme,
    customDecorations: state.customDecorations,
    themeCustomizations: state.themeCustomizations,
    frameStyle: state.frameStyle,
  }))

  const theme = getTheme(currentTheme)
  const themeDecorations = previewDecorations ?? getDecorations(currentTheme)
  const { photobookSectionContent, photobookSectionVisibility } = useContentSelector(state => ({
    photobookSectionContent: state.photobookSectionContent,
    photobookSectionVisibility: state.photobookSectionVisibility,
  }))

  const templateNode = useMemo(() => {
    const modeEntry = MODE_REGISTRY[editorMode]

    return modeEntry.renderCanvas({
      templateId: currentTemplateId,
      theme,
      frameStyle,
      photobookSectionContent,
      photobookSectionVisibility,
    })
  }, [editorMode, currentTemplateId, theme, frameStyle, photobookSectionContent, photobookSectionVisibility])

  const allDecorations = useMemo(() => [
    ...(themeDecorations?.elements || []),
    ...customDecorations
  ], [themeDecorations, customDecorations])

  const decorationAnimation = themeCustomizations.decorationAnimation || themeDecorations?.animation || 'fade'

  const { resolvedBackground, contentBackgroundClass, viewportBackgroundClass } = useCanvasBackground(
    themeDecorations,
    themeCustomizations,
    theme.background
  )

  return (
    <div className="flex-1 min-h-0 bg-slate-100 p-1 md:p-2 lg:p-4 overflow-hidden">
      <div
        ref={viewportRef}
        className={cn(
          '@container mx-auto h-full relative overflow-hidden transition-all duration-300 transform-[translateZ(0)]',
          DEVICE_CLASSES[deviceView],
          viewportBackgroundClass
        )}
      >
        <BackgroundLayer
          config={resolvedBackground}
          placement="viewport"
          scrollContainerRef={scrollContainerRef}
          viewportRef={viewportRef}
        />

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
              <BackgroundLayer
                config={resolvedBackground}
                placement="content"
                scrollContainerRef={scrollContainerRef}
                viewportRef={viewportRef}
              />

              <DecorationsLayer decorations={allDecorations} animation={decorationAnimation} />

              <div className="relative z-10">
                {templateNode}
              </div>
            </div>
          </CanvasScrollProvider>
        </div>
      </div>
    </div>
  )
}
