"use client"

import { useMemo } from 'react'
import { useContentSelector, useThemeSelector } from '@/editor/lib/store'
import { getTheme } from '@/editor/lib/themes'
import type { PhotobookTemplateProps } from '@/editor/lib/template-types'
import { PhotobookTextureOverlay, getMoodFilter } from '@/editor/components/editor/layout/background-layers/overlays/photobook-overlay'

interface PhotobookTemplateShellProps {
  Design: React.ComponentType<PhotobookTemplateProps>
}

export function PhotobookTemplateShell({ Design }: PhotobookTemplateShellProps) {
  const { photobookSectionVisibility, photobookSectionContent } = useContentSelector((state) => ({
    photobookSectionVisibility: state.photobookSectionVisibility,
    photobookSectionContent: state.photobookSectionContent,
  }))

  const { currentTheme, themeCustomizations } = useThemeSelector((state) => ({
    currentTheme: state.currentTheme,
    themeCustomizations: state.themeCustomizations,
  }))

  const theme = useMemo(() => getTheme(currentTheme), [currentTheme])

  const texture = themeCustomizations.photobookTexture ?? 'none'
  const mood    = themeCustomizations.photobookMood    ?? 'none'
  const moodFilter = getMoodFilter(mood)

  return (
    <div
      // overflow-hidden + relative so the absolute texture overlay is clipped
      // to the template bounds and composites over all child sections.
      className="relative overflow-hidden"
      style={moodFilter !== 'none' ? { filter: moodFilter } : undefined}
    >
      <Design
        theme={theme}
        sectionVisibility={photobookSectionVisibility}
        sectionContent={photobookSectionContent}
      />
      <PhotobookTextureOverlay texture={texture} />
    </div>
  )
}
