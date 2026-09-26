'use client'

import { useTranslations } from 'next-intl'
import { Type } from 'lucide-react'
import { useThemeSelector } from '@/editor/lib/store'
import type { MenuFontPair } from '@/editor/lib/store/theme'
import { menuFontClassName } from '@/editor/modes/menu/visual-style'
import { cn } from '@/lib/utils'

const FONT_PAIRS: MenuFontPair[] = ['signature', 'editorial', 'modern']

export function MenuTypographyPanel() {
  const t = useTranslations('editor.menu.typography')
  const { pair, update } = useThemeSelector((state) => ({
    pair: state.themeCustomizations.menuFontPair ?? 'signature',
    update: state.updateThemeCustomization,
  }))

  return <div className="h-full overflow-y-auto px-5 pb-6 pt-4 custom-scrollbar">
    <div className="mb-5 flex items-start gap-3">
      <div className="grid size-9 shrink-0 place-items-center rounded-lg border border-primary/20 bg-primary/10 text-primary"><Type className="size-4" /></div>
      <div><h3 className="text-sm font-semibold">{t('title')}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{t('hint')}</p></div>
    </div>
    <div className="space-y-3">
      {FONT_PAIRS.map((option) => <button key={option} type="button" aria-pressed={pair === option}
        onClick={() => update({ menuFontPair: option })}
        className={cn('w-full rounded-2xl border px-4 py-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2', menuFontClassName(option),
          pair === option ? 'border-primary bg-primary/10' : 'border-border/60 bg-muted/20 hover:bg-muted/50')}>
        <span className="text-xs font-semibold text-muted-foreground">{t(option)}</span>
        <h3 className="mt-3 text-2xl leading-tight text-foreground">{t('sample')}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{t('bodySample')}</p>
      </button>)}
    </div>
  </div>
}
