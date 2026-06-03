"use client"

import { useMemo, useCallback } from 'react'
import { useContentSelector, useThemeSelector } from '@/editor/lib/store'
import { getTheme } from '@/editor/lib/config/themes'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'

// PortfolioTemplateProps is defined in @/editor/lib/template-types — import from there directly.
// This file is the runtime shell only.

interface PortfolioTemplateShellProps {
  Design: React.ComponentType<PortfolioTemplateProps>
}

export function PortfolioTemplateShell({ Design }: PortfolioTemplateShellProps) {
  const { sectionVisibility, sectionContent, portfolioImageContent } = useContentSelector(state => ({
    sectionVisibility: state.sectionVisibility,
    sectionContent: state.sectionContent,
    portfolioImageContent: state.portfolioImageContent,
  }))
  const { currentTheme } = useThemeSelector(state => ({
    currentTheme: state.currentTheme,
  }))

  const theme = useMemo(() => getTheme(currentTheme), [currentTheme])

  const handleAnchorClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault()
      const element = document.getElementById(href.slice(1))
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }, [])

  return (
    <Design
      theme={theme}
      sectionVisibility={sectionVisibility}
      sectionContent={sectionContent}
      imageContent={portfolioImageContent}
      handleAnchorClick={handleAnchorClick}
    />
  )
}
