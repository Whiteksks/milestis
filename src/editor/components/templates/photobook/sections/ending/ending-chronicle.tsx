"use client"

import { motion } from "framer-motion"
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'

interface EndingChronicleProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function EndingChronicle({ sectionContent, theme }: EndingChronicleProps) {
  const { ending } = sectionContent
  const imageBlock = ending.images
  const imageUrl = imageBlock?.image ?? ''
  const aspectRatio = imageBlock?.imageSettings?.[0]?.aspectRatio ?? 'square'
  const frameStyle = imageBlock?.imageSettings?.[0]?.frameStyle ?? 'none'

  return (
    <section
      className={cn(
        '@container overflow-x-hidden min-h-screen flex flex-col py-12 @md:py-16',
        theme.muted,
        theme.foreground,
      )}
    >
      <div className="flex-1 max-w-7xl mx-auto w-full px-8 @md:px-14 @lg:px-20 flex flex-col gap-10 @md:gap-14">

        {/* Top editorial header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className={cn('border-t-2', theme.border)} />
          <div className="flex items-center justify-between mt-3">
            <span className={cn('text-[9px] uppercase tracking-[0.3em] opacity-35', theme.fontBody)}>
              Chronicle
            </span>
            <span className={cn('text-[9px] uppercase tracking-[0.2em] opacity-20', theme.fontBody)}>
              Fin
            </span>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="flex-1 flex flex-col @md:flex-row gap-12 @md:gap-20 items-start @md:items-center">

          {/* Left — typographic closing */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9 }}
            className="flex-1 space-y-6 @md:space-y-8"
          >
            {/* "The End" masthead */}
            <h2
              className={cn(
                'text-[3.5rem] @sm:text-[5rem] @md:text-[7rem] @lg:text-[9rem]',
                'font-bold leading-none tracking-tighter',
                theme.fontTitle,
              )}
            >
              The<br />End
            </h2>

            {ending.text && (
              <p
                className={cn(
                  'text-base @md:text-lg font-light opacity-55 max-w-[40ch]',
                  theme.lineHeight,
                  theme.fontBody,
                )}
              >
                {ending.text}
              </p>
            )}

            <div className="space-y-1.5 pt-2">
              {ending.signature && (
                <p className={cn('text-sm italic opacity-45', theme.fontBody)}>
                  — {ending.signature}
                </p>
              )}
              {ending.date && (
                <p className={cn('text-[10px] uppercase tracking-widest opacity-25', theme.letterSpacing, theme.fontBody)}>
                  {ending.date}
                </p>
              )}
            </div>
          </motion.div>

          {/* Right — optional closing photo */}
          {imageUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full @md:w-64 @lg:w-80 shrink-0"
            >
              <SiteImage
                src={imageUrl}
                alt={ending.signature ?? 'Ending'}
                aspectRatio={aspectRatio}
                frameStyle={frameStyle}
                cropData={imageBlock?.imageSettings?.[0]?.cropData}
                unoptimized
                sizes="(max-width: 768px) 80vw, 320px"
                className={theme.shadow}
              />
            </motion.div>
          )}
        </div>

        {/* Bottom closing accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className={cn('h-[2px] origin-left', theme.accent)}
        />
      </div>
    </section>
  )
}
