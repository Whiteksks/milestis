"use client"

import { motion } from "framer-motion"
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'

interface EndingMagazineProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function EndingMagazine({ sectionContent, theme }: EndingMagazineProps) {
  const { ending } = sectionContent
  const imageUrl = ending.images?.image ?? ''
  const hasImage = Boolean(imageUrl)

  return (
    <section
      className={cn(
        '@container overflow-hidden py-20 @md:py-32 px-6 @md:px-12',
        theme.background,
        theme.foreground,
      )}
    >
      <div className="max-w-5xl mx-auto">
        {/* Верхняя линия с номером страницы или пометкой "FIN" */}
        <div className="flex justify-between items-baseline mb-12 border-b border-current/10 pb-4">
          <span className="text-[10px] uppercase tracking-[0.3em] opacity-50">Editorial Archive</span>
          <span className={cn("text-xs italic", theme.fontBody)}>Finis</span>
        </div>

        <div className="grid grid-cols-1 @lg:grid-cols-12 gap-12 items-start">
          
          {/* Левая колонка: Текст */}
          <div className="@lg:col-span-7 flex flex-col">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={cn(
                'text-5xl @md:text-6xl @lg:text-7xl font-bold leading-[0.9] tracking-tighter mb-8 uppercase',
                theme.fontTitle,
              )}
            >
              {ending.text || "The End"}
              <span className={cn("block text-xl @md:text-2xl mt-4 font-light normal-case tracking-normal italic opacity-70", theme.fontBody)}>
                of this chapter
              </span>
            </motion.h2>

            <div className="max-w-sm">
              {ending.signature && (
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={cn('text-lg leading-relaxed mb-6 opacity-80', theme.fontBody)}
                >
                  {ending.signature}
                </motion.p>
              )}
              
              {ending.date && (
                <div className="flex items-center gap-4">
                   <div className={cn('h-px w-8', theme.accent)} />
                   <span className="text-[10px] uppercase tracking-widest opacity-40">{ending.date}</span>
                </div>
              )}
            </div>
          </div>

          {/* Правая колонка: Изображение */}
          {hasImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="@lg:col-span-5 relative"
            >
              <div className="relative aspect-[3/4] @lg:aspect-[4/5] overflow-hidden bg-current/5 shadow-2xl">
                <SiteImage
                  fillParent
                  unoptimized
                  src={imageUrl}
                  alt={ending.text ?? 'Closing'}
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  imageClassName="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              {/* Декоративный элемент "Magazine" */}
              <div className={cn(
                "absolute -bottom-6 -right-4 text-6xl opacity-10 pointer-events-none select-none font-serif italic",
                theme.fontTitle
              )}>
                &
              </div>
            </motion.div>
          )}
        </div>

        {/* Нижний колонтитул */}
        <div className="mt-20 flex justify-center">
           <div className={cn('h-1.5 w-1.5 rounded-full mx-1', theme.accent)} />
           <div className={cn('h-1.5 w-1.5 rounded-full mx-1 opacity-40', theme.accent)} />
           <div className={cn('h-1.5 w-1.5 rounded-full mx-1 opacity-20', theme.accent)} />
        </div>
      </div>
    </section>
  )
}