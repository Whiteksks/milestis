'use client'

import { useTranslations } from 'next-intl'
import { getTheme } from '@/editor/lib/config/themes'
import { MENU_TEMPLATES } from '@/editor/modes/menu/templates/registry'
import { MENU_TEMPLATE_IDS } from '@/editor/modes/menu/template-ids'

export function RestaurantTemplateGallery() {
  const t = useTranslations('restaurants')
  const names = useTranslations()
  return <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-5">
    {MENU_TEMPLATE_IDS.map((id, index) => {
      const { previewComponent: Preview, nameKey } = MENU_TEMPLATES[id]
      return <figure key={id} className="group w-[78%] min-w-0 shrink-0 snap-start sm:w-auto">
        <div className={`relative aspect-[4/5] overflow-hidden rounded-2xl border border-[#d7cbb8] shadow-[0_8px_24px_-15px_#594734] transition-transform motion-safe:group-hover:-translate-y-2 ${index % 2 ? 'lg:mt-8' : ''}`}>
          <div className="absolute inset-0 select-none [container-type:size]"><Preview theme={getTheme('parchment')} title="Café Milestis" /></div>
        </div>
        <figcaption className="mt-4 flex items-center justify-between gap-2 border-b border-[#d7cbb8] pb-3 text-sm font-medium"><span>{names(nameKey)}</span><span className="font-mono text-xs text-[#8c7663]">0{index + 1}</span></figcaption>
        <p className="mt-2 text-xs leading-5 text-[#776456]">{t(`templates.${id}`)}</p>
      </figure>
    })}
  </div>
}
