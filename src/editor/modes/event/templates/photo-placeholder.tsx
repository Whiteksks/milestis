import { ImageIcon } from 'lucide-react'
import type { ThemeConfig } from '@/editor/lib/config/themes'

/** Fallback gradients (dark/space palette) — used when no theme is passed. */
const FALLBACK_GRADIENTS = [
  'linear-gradient(150deg, #1a1a2e 0%, #16213e 100%)',
  'linear-gradient(150deg, #0d1520 0%, #1b2a4a 100%)',
  'linear-gradient(150deg, #160d26 0%, #2a1040 100%)',
  'linear-gradient(150deg, #0a1f1a 0%, #0f332a 100%)',
  'linear-gradient(150deg, #1f1a0d 0%, #342a10 100%)',
  'linear-gradient(150deg, #0d0d1f 0%, #1a1a38 100%)',
  'linear-gradient(150deg, #1a0d0d 0%, #2e1616 100%)',
  'linear-gradient(150deg, #0d1a12 0%, #12302a 100%)',
]

/**
 * Reusable placeholder card shown when no guest photo is available yet.
 * Pass `theme` to get a theme-aware gradient; omit for the dark/space fallback.
 */
export function PhotoPlaceholder({
  index,
  w,
  h,
  className,
  theme,
}: {
  index: number
  w: number
  h: number
  className?: string
  theme?: ThemeConfig
}) {
  let bg: string
  if (theme) {
    const { primary, secondary, subtle, ray } = theme.bgEffectColors
    const variants = [
      `linear-gradient(150deg, ${subtle}55 0%, ${primary}30 100%)`,
      `linear-gradient(150deg, ${primary}25 0%, ${subtle}45 100%)`,
      `linear-gradient(150deg, ${secondary}20 0%, ${subtle}50 100%)`,
      `linear-gradient(150deg, ${subtle}40 0%, ${ray}35 100%)`,
      `linear-gradient(150deg, ${ray}30 0%, ${primary}35 100%)`,
      `linear-gradient(150deg, ${secondary}30 0%, ${ray}25 100%)`,
    ]
    bg = variants[Math.abs(index) % variants.length]
  } else {
    bg = FALLBACK_GRADIENTS[Math.abs(index) % FALLBACK_GRADIENTS.length]
  }

  const iconSize = Math.max(12, Math.round(Math.min(w, h) * 0.18))
  return (
    <div
      className={`flex items-center justify-center rounded-md ${className ?? ''}`}
      style={{ width: w, height: h, background: bg }}
    >
      <ImageIcon
        size={iconSize}
        className={theme ? theme.mutedText : 'text-white/20'}
        strokeWidth={1.5}
        style={{ opacity: 0.35 }}
      />
    </div>
  )
}
