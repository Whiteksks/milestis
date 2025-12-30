import { useMemo } from 'react'
import { resolveBackgroundImage, getBackgroundLayerProps } from '@/editor/lib/background'
import type { DecorationsConfig } from '@/editor/lib/types'
import type { ThemeStore } from '@/editor/lib/store-theme'

export function useCanvasBackground(
  themeDecorations: DecorationsConfig | null | undefined,
  themeCustomizations: ThemeStore['themeCustomizations'],
  themeBackground: string
) {
  const resolvedBackground = useMemo(() => resolveBackgroundImage({
    decorations: themeDecorations,
    overrides: {
      customBackground: themeCustomizations.customBackground,
      backgroundImageType: themeCustomizations.backgroundImageType,
      backgroundImageOpacity: themeCustomizations.backgroundImageOpacity,
    },
  }), [themeDecorations, themeCustomizations])

  const backgroundLayerProps = useMemo(() => getBackgroundLayerProps(resolvedBackground), [resolvedBackground])

  const contentBackgroundClass =
    backgroundLayerProps?.placement === 'viewport' ? 'bg-transparent' : themeBackground

  const viewportBackgroundClass =
    backgroundLayerProps?.placement === 'viewport' ? themeBackground : undefined

  return {
    resolvedBackground,
    backgroundLayerProps,
    contentBackgroundClass,
    viewportBackgroundClass
  }
}
