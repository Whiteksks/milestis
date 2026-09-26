import type { CSSProperties } from 'react'
import type { ThemeConfig } from '@/editor/lib/config/themes'
import type { MenuFontPair } from '@/editor/lib/store/theme'

type RGB = [number, number, number]

function rgb(hex: string): RGB {
  const match = /^#([\da-f]{6})$/i.exec(hex)
  if (!match) return [201, 164, 108]
  return [0, 2, 4].map((offset) => Number.parseInt(match[1].slice(offset, offset + 2), 16)) as RGB
}

function hex([red, green, blue]: RGB): string {
  return `#${[red, green, blue].map((channel) => Math.round(channel).toString(16).padStart(2, '0')).join('')}`
}

function mix(first: string, second: string, amount: number): string {
  const a = rgb(first)
  const b = rgb(second)
  return hex(a.map((channel, index) => channel * (1 - amount) + b[index] * amount) as RGB)
}

function alpha(color: string, opacity: number): string {
  return `rgba(${rgb(color).join(',')},${opacity})`
}

function luminance(color: string): number {
  const channels = rgb(color).map((channel) => {
    const value = channel / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
}

function readableAccent(source: string): string {
  const background = luminance('#faf7f0')
  for (let step = 0; step <= 10; step++) {
    const candidate = mix(source, '#252b24', step * 0.09)
    if ((background + 0.05) / (luminance(candidate) + 0.05) >= 5) return candidate
  }
  return '#354334'
}

/** Warm paper surfaces and a readable ink accent derived from the selected theme. */
export function getMenuVisualStyle(theme: ThemeConfig): CSSProperties {
  const accent = readableAccent(theme.bgEffectColors.primary)
  const surface = mix('#faf7f0', theme.bgEffectColors.primary, 0.025)
  const raised = '#fffdf8'
  const stage = mix('#ebe6db', theme.bgEffectColors.secondary, 0.045)

  return {
    '--menu-accent': accent,
    '--menu-accent-ink': '#fffdf8',
    '--menu-accent-soft': alpha(accent, 0.07),
    '--menu-accent-line': alpha(accent, 0.16),
    '--menu-surface': surface,
    '--menu-surface-raised': raised,
    '--menu-glass': alpha(surface, 0.96),
    '--menu-stage': stage,
    '--menu-photo-veil': alpha(stage, 0.8),
    '--menu-text': '#292d27',
    '--menu-muted-text': '#696b60',
  } as CSSProperties
}

const FONT_CLASSES: Record<MenuFontPair, string> = {
  lora: 'menu-font-lora',
  onest: 'menu-font-onest',
  signature: 'menu-font-signature',
  editorial: 'menu-font-editorial',
  modern: 'menu-font-modern',
}

/** Shared controls use semantic menu colors in either template, including portals. */
export function getMenuPalette(theme: ThemeConfig, fontClass: string): ThemeConfig {
  return {
    ...theme,
    foreground: 'text-[var(--menu-text)]', mutedText: 'text-[var(--menu-muted-text)]', border: 'border-[var(--menu-accent-line)]',
    primary: 'bg-[var(--menu-accent)]', primaryText: 'text-[var(--menu-accent-ink)]', muted: 'bg-[var(--menu-accent-soft)]',
    card: 'bg-[var(--menu-surface-raised)]', cardForeground: 'text-[var(--menu-text)]', glassPanel: 'bg-[var(--menu-glass)] backdrop-blur-xl',
    fontTitle: '', fontBody: fontClass,
  }
}

export function getBistroVisualStyle(theme: ThemeConfig): CSSProperties {
  const accent = mix(theme.bgEffectColors.primary, '#f4ead2', 0.65)
  const surface = '#191c1a'
  return {
    '--menu-accent': accent,
    '--menu-accent-ink': '#191c1a',
    '--menu-accent-soft': alpha(accent, 0.09),
    '--menu-accent-line': alpha(accent, 0.2),
    '--menu-surface': surface,
    '--menu-surface-raised': '#242824',
    '--menu-glass': alpha(surface, 0.97),
    '--menu-stage': '#111411',
    '--menu-photo-veil': 'rgba(17,20,17,0.88)',
    '--menu-text': '#f4f0e6',
    '--menu-muted-text': '#b7b8ab',
  } as CSSProperties
}

export function menuFontClassName(value: unknown): string {
  return typeof value === 'string' && Object.hasOwn(FONT_CLASSES, value) ? FONT_CLASSES[value as MenuFontPair] : FONT_CLASSES.signature
}

export function getPicnicVisualStyle(theme: ThemeConfig): CSSProperties {
  const ink = mix('#233d30', theme.bgEffectColors.primary, 0.12)
  const surface = '#fbfaef'
  return {
    '--menu-accent': ink,
    '--menu-accent-ink': surface,
    '--menu-accent-soft': alpha(ink, 0.07),
    '--menu-accent-line': alpha(ink, 0.28),
    '--menu-surface': surface,
    '--menu-surface-raised': '#fffef7',
    '--menu-glass': alpha(surface, 0.98),
    '--menu-stage': mix('#e1e9d5', theme.bgEffectColors.secondary, 0.08),
    '--menu-photo-veil': 'rgba(251,250,239,0.88)',
    '--menu-text': ink,
    '--menu-muted-text': '#606855',
    '--menu-banner': mix('#f5dc73', theme.bgEffectColors.primary, 0.12),
    '--menu-leaf': mix('#e2eacb', theme.bgEffectColors.secondary, 0.08),
  } as CSSProperties
}

export function getGalleryVisualStyle(theme: ThemeConfig): CSSProperties {
  const ink = mix('#29375d', theme.bgEffectColors.primary, 0.12)
  const surface = '#f6f6fa'
  return {
    '--menu-accent': ink,
    '--menu-accent-ink': '#ffffff',
    '--menu-accent-soft': alpha(ink, 0.06),
    '--menu-accent-line': alpha(ink, 0.18),
    '--menu-surface': surface,
    '--menu-surface-raised': '#ffffff',
    '--menu-glass': alpha(surface, 0.98),
    '--menu-stage': mix('#e4e7ef', theme.bgEffectColors.secondary, 0.05),
    '--menu-photo-veil': 'rgba(228,231,239,0.9)',
    '--menu-text': '#282d3b',
    '--menu-muted-text': '#626776',
  } as CSSProperties
}

export function getPulseVisualStyle(theme: ThemeConfig): CSSProperties {
  const accent = mix('#ff926d', theme.bgEffectColors.primary, 0.1)
  const surface = '#1c1c20'
  return {
    '--menu-accent': accent,
    '--menu-accent-ink': '#202024',
    '--menu-accent-soft': alpha(accent, 0.12),
    '--menu-accent-line': alpha(accent, 0.27),
    '--menu-surface': surface,
    '--menu-surface-raised': '#29292e',
    '--menu-glass': alpha(surface, 0.98),
    '--menu-stage': '#111114',
    '--menu-photo-veil': 'rgba(17,17,20,0.88)',
    '--menu-text': '#f7f3ea',
    '--menu-muted-text': '#bdbab6',
    '--menu-paper': '#f2f0e8',
    '--menu-paper-muted': '#5f5c58',
  } as CSSProperties
}
