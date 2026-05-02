'use client'

import { useRef, useLayoutEffect, useState, useEffect, memo, type CSSProperties } from 'react'
import { useUiSelector, useThemeSelector, useContentSelector } from '@/editor/lib/store'
import { useUiStore } from '@/editor/lib/store-ui'
import { getTheme } from '@/editor/lib/themes'
import { MODE_REGISTRY } from '@/editor/lib/mode-registry'
import { cn } from '@/lib/utils'
import { DecorationsLayer } from '@/editor/components/editor/layout/decorationEdit/decorations-layer'
import { BackgroundLayers } from './layout/background-layers'
import type { DeviceView } from '@/editor/lib/types'
import { FloatingToolbar } from '@/editor/components/editor/layout/FloatingActions/floating-toolbar'
import { DecorationsFloatingToolbar } from '@/editor/components/editor/layout/FloatingActions/decorations-floating-toolbar'
import { SectionsToolbarPanel } from '@/editor/components/editor/layout/FloatingActions/sections-floating-menu'
import { ThemeFloatingToolbar } from '@/editor/components/editor/layout/FloatingActions/theme-floating-toolbar'
import { useIsMobile } from '@/hooks/use-mobile'
import { SectionRegistryProvider } from '@/editor/lib/section-registry-context'

// Stable panel components — defined outside Canvas so they are never recreated on re-render.
// SectionsToolbarPanel and ThemeFloatingToolbar have no props that change per Canvas render.
const StableSectionsPanel = memo(function StableSectionsPanel() {
  return <SectionsToolbarPanel />
})
const StableThemePanel = memo(function StableThemePanel() {
  return <ThemeFloatingToolbar />
})

const DEVICE_CLASSES: Record<DeviceView, string> = {
  // 'mobile' preview on desktop: constrain to phone width for realistic preview.
  // On a real mobile device (isMobile=true) the canvas uses w-full without a max-width
  // cap so it fills the screen rather than being narrower than the actual device.
  mobile: 'max-w-sm w-full',
  tablet: 'w-full max-w-4xl',
  desktop: 'w-full max-w-7xl',
  fullscreen: 'w-screen h-[calc(100vh-4rem)] max-w-none fixed left-0 top-16 z-50 bg-white',
}

export function Canvas({
  scrollContainerRef: externalScrollContainerRef,
  desktopActiveTab,
}: {
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>
  desktopActiveTab?: import('@/editor/lib/editor-tabs').DesktopEditorTab
}) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const internalScrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = externalScrollContainerRef ?? internalScrollContainerRef
  const [scrollbarWidth, setScrollbarWidth] = useState(0)

  const isMobile = useIsMobile()
  const setDeviceView = useUiStore((s) => s.setDeviceView)

  // On a real mobile device, auto-switch deviceView to 'mobile' on first load.
  // This ensures responsiveScale decorations apply the correct scale factor,
  // and prevents the canvas from being narrower than the actual screen.
  useEffect(() => {
    if (isMobile === true) {
      setDeviceView('mobile')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile])

  const { deviceView, editorMode, previewDecorations } = useUiSelector(state => ({
    deviceView: state.deviceView,
    editorMode: state.editorMode,
    previewDecorations: state.previewDecorations,
  }))

  const { currentTemplateId, currentTheme, customDecorations, themeCustomizations } = useThemeSelector(state => ({
    currentTemplateId: state.currentTemplateId,
    currentTheme: state.currentTheme,
    customDecorations: state.customDecorations,
    themeCustomizations: state.themeCustomizations,
  }))

  const theme = getTheme(currentTheme)
  // Each mode's canvasDataSelector subscribes only to its own content slices.
  // Adding a new mode never causes canvas to re-render on unrelated store changes.
  const modeEntry = MODE_REGISTRY[editorMode]
  const modeCanvasData = useContentSelector(modeEntry.canvasDataSelector)

  const templateNode = modeEntry.renderCanvas({
    templateId: currentTemplateId,
    theme,
    ...modeCanvasData,
  })

  const allDecorations = [
    ...(previewDecorations?.elements || []),
    ...customDecorations
  ]

  const decorationAnimation = themeCustomizations.decorationAnimation ?? previewDecorations?.animation ?? 'fade'

  const floatingToolbarPanels = {
    decorations: (
      <DecorationsFloatingToolbar
        scrollContainerRef={scrollContainerRef}
      />
    ),
    sections: <StableSectionsPanel />,
    background: <StableThemePanel />,
  }

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
    <div className="flex-1 min-h-0 bg-editor-workspace p-0 md:p-2 lg:p-4 overflow-hidden">
      <div
        ref={viewportRef}
        className={cn(
          // transition-all would animate every CSS property; restrict to max-width only.
          // will-change-transform promotes to compositor layer for smooth device-view switching.
          '@container mx-auto h-full relative overflow-hidden transition-[max-width] duration-300 will-change-transform',
          // On a real mobile device in 'mobile' view: fill the full screen width.
          // On desktop in 'mobile' preview: use max-w-sm to simulate phone dimensions.
          deviceView === 'mobile' && isMobile === true ? 'w-full' : DEVICE_CLASSES[deviceView],
          // Background always lives on the viewport div so decorative layers (z-0 absolute)
          // remain BEHIND content in both fixed and scroll modes.
          theme.background,
        )}
        style={{ '--canvas-scrollbar-width': `${scrollbarWidth}px` } as CSSProperties}
      >
        <FloatingToolbar
          tab={(desktopActiveTab ?? 'sections')}
          panels={floatingToolbarPanels}
        />

        <BackgroundLayers
          placement="viewport"
          scrollContainerRef={scrollContainerRef}
          viewportRef={viewportRef}
        />

        <div ref={scrollContainerRef} className="h-full overflow-auto relative z-10">
            <SectionRegistryProvider>
            <div
              data-canvas-content-root="true"
              className={cn(
                'overflow-hidden relative',
                'bg-transparent',
                theme.foreground,
                theme.fontBody,
                theme.lineHeight,
                theme.letterSpacing,
                theme.shadow
              )}
            >
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
            </SectionRegistryProvider>
        </div>
      </div>
    </div>
  )
}
