"use client"

import { useMemo } from 'react'
import { useContentSelector, useThemeSelector } from '@/editor/lib/store'
import { getTheme } from '@/editor/lib/themes'
import type { PhotobookTemplateProps } from '@/editor/lib/template-types'

interface PhotobookTemplateShellProps {
  Design: React.ComponentType<PhotobookTemplateProps>
}

export function PhotobookTemplateShell({ Design }: PhotobookTemplateShellProps) {
  const { photobookSectionVisibility, photobookSectionContent } = useContentSelector((state) => ({
    photobookSectionVisibility: state.photobookSectionVisibility,
    photobookSectionContent: state.photobookSectionContent,
  }))

  const { currentTheme, frameStyle } = useThemeSelector((state) => ({
    currentTheme: state.currentTheme,
    frameStyle: state.frameStyle,
  }))

  const theme = useMemo(() => getTheme(currentTheme), [currentTheme])

  return (
    <Design
      theme={theme}
      sectionVisibility={photobookSectionVisibility}
      sectionContent={photobookSectionContent}
      frameStyle={frameStyle}
    />
  )
}
