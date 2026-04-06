import React from 'react'
import fastDeepEqual from 'fast-deep-equal'
import type { SectionContent } from '@/editor/lib/types'

/**
 * Wraps a template section (e.g. Hero, Bio) to prevent unnecessary re-renders.
 * Deeply compares the theme, the relevant section slice, and all other props.
 * This ensures that typing in the "Bio" editor doesn't cause the "Hero" to re-render.
 *
 * @param Component The section component
 * @param sectionKey The key in `sectionContent` this section cares about (e.g., 'hero')
 */
export function withSectionMemo<P extends { sectionContent: SectionContent; theme: any; [key: string]: any }>(
  Component: React.ComponentType<P>,
  sectionKey: keyof SectionContent
) {
  return React.memo(Component, (prevProps, nextProps) => {
    // Check the relevant section slice and theme first (cheap path for most keystrokes)
    if (
      !fastDeepEqual(prevProps.theme, nextProps.theme) ||
      !fastDeepEqual(prevProps.sectionContent[sectionKey], nextProps.sectionContent[sectionKey])
    ) {
      return false // must re-render
    }

    // Also check any extra props (e.g. handleAnchorClick on header sections)
    for (const key in nextProps) {
      if (key === 'theme' || key === 'sectionContent') continue
      if (!Object.is(prevProps[key], nextProps[key])) return false
    }

    return true // equal — skip re-render
  })
}
