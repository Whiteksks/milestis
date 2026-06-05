"use client"

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { themes, type ThemeConfig } from '@/editor/lib/config/themes'
import { BACKGROUND_PRESETS, type BackgroundPreset } from '@/editor/lib/config/background-presets'
import { PHOTOBOOK_PRESETS, type PhotobookPreset } from '@/editor/lib/config/photobook-presets'

type TranslatableOption = {
  label: string
  labelKey?: string
}

type TranslatableNamedItem = {
  name: string
  description: string
  nameKey?: string
  descriptionKey?: string
}

export function useEditorTranslationResolver() {
  const t = useTranslations()

  return (key: string | undefined, fallback: string) => {
    if (!key) {
      return fallback
    }

    try {
      return t(key)
    } catch {
      return fallback
    }
  }
}

export function localizeOptions<T extends TranslatableOption>(
  options: readonly T[],
  resolveLabel: (key: string | undefined, fallback: string) => string,
): T[] {
  return options.map((option) => ({
    ...option,
    label: resolveLabel(option.labelKey, option.label),
  }))
}

function localizeNamedItems<T extends TranslatableNamedItem>(
  items: readonly T[],
  resolveLabel: (key: string | undefined, fallback: string) => string,
): T[] {
  return items.map((item) => ({
    ...item,
    name: resolveLabel(item.nameKey, item.name),
    description: resolveLabel(item.descriptionKey, item.description),
  }))
}

export function useLocalizedThemes(): ThemeConfig[] {
  const resolveLabel = useEditorTranslationResolver()

  return useMemo(
    () =>
      localizeNamedItems(themes, resolveLabel).map((theme) => ({
        ...theme,
        tags: theme.tags?.map((tag) => resolveLabel(`editor.paletteLabels.themeTags.${tag}`, tag)),
      })),
    [resolveLabel],
  )
}

export function useLocalizedBackgroundPresets(): BackgroundPreset[] {
  const resolveLabel = useEditorTranslationResolver()

  return useMemo(() => localizeNamedItems(BACKGROUND_PRESETS, resolveLabel), [resolveLabel])
}

export function useLocalizedPhotobookPresets(): PhotobookPreset[] {
  const resolveLabel = useEditorTranslationResolver()

  return useMemo(() => localizeNamedItems(PHOTOBOOK_PRESETS, resolveLabel), [resolveLabel])
}
