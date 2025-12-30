"use client"

import { useContentSelector, useThemeSelector } from '@/editor/lib/store'
import { getTheme } from '@/editor/lib/themes'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'

export type { PortfolioTemplateProps }

interface PortfolioTemplateShellProps {
  Design: React.ComponentType<PortfolioTemplateProps>
}

export function PortfolioTemplateShell({ Design }: PortfolioTemplateShellProps) {
  const { sectionVisibility, sectionContent } = useContentSelector(state => ({
    sectionVisibility: state.sectionVisibility,
    sectionContent: state.sectionContent,
  }))
  const { currentTheme, frameStyle } = useThemeSelector(state => ({
    currentTheme: state.currentTheme,
    frameStyle: state.frameStyle,
  }))

  const theme = getTheme(currentTheme)

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault()
      const element = document.getElementById(href.slice(1))
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }

  return (
    <Design
      theme={theme}
      sectionVisibility={sectionVisibility}
      sectionContent={sectionContent}
      frameStyle={frameStyle}
      handleAnchorClick={handleAnchorClick}
    />
  )
}
