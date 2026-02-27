'use client'

import { useRef, useMemo, useLayoutEffect, useState, memo } from 'react'
import { useUiSelector, useThemeSelector, useContentSelector } from '@/editor/lib/store'
import { getTheme } from '@/editor/lib/themes'
import { getDecorations } from '@/editor/lib/decorations'
import { MODE_REGISTRY } from '@/editor/lib/mode-registry'
import { cn } from '@/lib/utils'
import { DecorationsLayer } from '@/editor/components/editor/layout/decorationEdit/decorations-layer'
import { BackgroundLayers } from './layout/background-layers'
import type { DeviceView } from '@/editor/lib/types'
import { FloatingToolbar } from '@/editor/components/editor/layout/FloatingActions/floating-toolbar'
import { DecorationsFloatingToolbar } from '@/editor/components/editor/layout/FloatingActions/decorations-floating-toolbar'
import { SectionsToolbarPanel } from '@/editor/components/editor/layout/FloatingActions/sections-floating-menu'
import { ThemeFloatingToolbar } from '@/editor/components/editor/layout/FloatingActions/theme-floating-toolbar'

// Stable panel components — defined outside Canvas so they are never recreated on re-render.
// SectionsToolbarPanel and ThemeFloatingToolbar have no props that change per Canvas render.
const StableSectionsPanel = memo(function StableSectionsPanel() {
  return <SectionsToolbarPanel />
})
const StableThemePanel = memo(function StableThemePanel() {
  return <ThemeFloatingToolbar />
})

const DEVICE_CLASSES: Record<DeviceView, string> = {
  mobile: 'max-w-sm w-full',
  tablet: 'w-full max-w-3xl',
  desktop: 'w-full max-w-7xl',
  fullscreen: 'w-screen h-[calc(100vh-4rem)] max-w-none fixed left-0 top-16 z-50 bg-white',
}

export function Canvas({
  scrollContainerRef: externalScrollContainerRef,
  desktopActiveTab,
}: {
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>
  desktopActiveTab?: 'sections' | 'theme' | 'decorations'
}) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const internalScrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = externalScrollContainerRef ?? internalScrollContainerRef
  const [scrollbarWidth, setScrollbarWidth] = useState(0)

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

  // Memoize so the theme object reference is stable — prevents templateNode from
  // re-rendering when unrelated state (e.g. deviceView) changes.
  const theme = useMemo(() => getTheme(currentTheme), [currentTheme])
  const themeDecorations = useMemo(
    () => previewDecorations ?? getDecorations(currentTheme),
    [previewDecorations, currentTheme],
  )
  // Each mode's canvasDataSelector subscribes only to its own content slices.
  // Adding a new mode never causes canvas to re-render on unrelated store changes.
  const modeEntry = MODE_REGISTRY[editorMode]
  const modeCanvasData = useContentSelector(modeEntry.canvasDataSelector)

  const templateNode = useMemo(() => {
    return modeEntry.renderCanvas({
      templateId: currentTemplateId,
      theme,
      frameStyle,
      ...modeCanvasData,
    })
  }, [modeEntry, currentTemplateId, theme, frameStyle, modeCanvasData])

  const allDecorations = useMemo(() => [
    ...(themeDecorations?.elements || []),
    ...customDecorations
  ], [themeDecorations, customDecorations])

  const decorationAnimation = themeCustomizations.decorationAnimation ?? themeDecorations?.animation ?? 'fade'
  const isFixedBg = (themeCustomizations.backgroundScrollMode ?? 'fixed') === 'fixed'

  // Only the decorations panel depends on runtime data; sections and theme panels
  // are now stable memo components, so this object only updates when decorations change.
  const floatingToolbarPanels = useMemo(
    () => ({
      decorations: (
        <DecorationsFloatingToolbar
          decorations={allDecorations}
          scrollContainerRef={scrollContainerRef}
        />
      ),
      sections: <StableSectionsPanel />,
      theme: <StableThemePanel />,
    }),
    [allDecorations, scrollContainerRef]
  )

  useLayoutEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const measure = () => {
      // In Chrome/Windows the scrollbar takes layout space; on overlay scrollbars this is 0.
      const width = Math.max(0, container.offsetWidth - container.clientWidth)
      setScrollbarWidth(prev => (prev === width ? prev : width))
    }

    measure()

    const resizeObserver = new ResizeObserver(() => measure())
    resizeObserver.observe(container)

    window.addEventListener('resize', measure)
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [scrollContainerRef])

  return (
    <div className="flex-1 min-h-0 bg-background p-0 md:p-2 lg:p-4 overflow-hidden">
      <div
        ref={viewportRef}
        className={cn(
          // transition-all would animate every CSS property; restrict to max-width only.
          // will-change-transform promotes to compositor layer for smooth device-view switching.
          '@container mx-auto h-full relative overflow-hidden transition-[max-width] duration-300 will-change-transform',
          DEVICE_CLASSES[deviceView],
          isFixedBg ? theme.background : undefined,
        )}
        style={{ ['--canvas-scrollbar-width' as any]: `${scrollbarWidth}px` }}
      >
        <FloatingToolbar
          tab={(desktopActiveTab ?? 'sections')}
          panels={floatingToolbarPanels}
        />

        <BackgroundLayers placement="viewport" />

        <div ref={scrollContainerRef} className="h-full overflow-auto relative z-10">
            <div
              data-canvas-content-root="true"
              className={cn(
                // shadow-2xl removed: box-shadow on the full-page scroll container forces
                // a repaint on every scroll frame. Use a ring or border if an outline is needed.
                'overflow-hidden relative',
                isFixedBg ? 'bg-transparent' : theme.background,
                theme.foreground,
                theme.fontBody,
                theme.lineHeight,
                theme.letterSpacing,
                theme.shadow
              )}
            >
              <BackgroundLayers placement="content" />
              <DecorationsLayer decorations={allDecorations} animation={decorationAnimation} />

              <div className="relative z-10">
                {templateNode}
              </div>

              {/*
                Bottom spacer — reserves space so floating bars never cover canvas content.
                Height matches the bar height: ~64px on mobile (MobileBottomNav),
                ~56px on desktop (FloatingToolbar). pointer-events-none so it's invisible.
              */}
              <div className="h-20 md:h-12 pointer-events-none select-none" aria-hidden="true" />
            </div>
        </div>
      </div>
    </div>
  )
}
