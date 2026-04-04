"use client"

import { motion } from "framer-motion"
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'

interface EndingLumiereProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function EndingLumiere({ sectionContent, theme }: EndingLumiereProps) {
  const { ending } = sectionContent
  const imageUrl = ending.images?.image ?? ''
  const hasImage = Boolean(imageUrl)

  return (
    <section
      className={cn(
        '@container overflow-x-hidden min-h-screen flex flex-col',
        theme.background,
        theme.foreground,
      )}
    >
      {/* Top decorative rule */}
      <div className="px-8 @md:px-16 pt-10 @md:pt-14">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-current opacity-10" />
          <span className={cn('text-[8px] uppercase tracking-[0.45em] opacity-20 shrink-0', theme.fontBody)}>
            06  ·  Fin
          </span>
          <div className="h-px flex-1 bg-current opacity-10" />
        </div>
      </div>

      {/* Central colophon */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16 text-center space-y-8 @md:space-y-10">

        {/* "Fin." */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1 }}
          className={cn(
            'text-[4rem] @sm:text-[5.5rem] @md:text-[7rem] font-light italic leading-none tracking-tight opacity-75',
            theme.fontTitle,
          )}
        >
          Fin.
        </motion.p>

        {/* Decorative rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="origin-center w-12 h-px bg-current opacity-15"
        />

        {/* Closing message */}
        {ending.text && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className={cn(
              'text-sm font-light italic opacity-45 max-w-[38ch] leading-relaxed',
              theme.fontBody,
              theme.lineHeight,
            )}
          >
            {ending.text}
          </motion.p>
        )}

        {/* Signature */}
        {ending.signature && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className={cn('text-[10px] uppercase tracking-[0.35em] opacity-30', theme.fontBody)}
          >
            {ending.signature}
          </motion.p>
        )}

        {/* Date */}
        {ending.date && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className={cn('text-[9px] uppercase tracking-[0.38em] opacity-20', theme.fontBody)}
          >
            {ending.date}
          </motion.p>
        )}

        {/* Optional closing photograph */}
        {hasImage && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="w-full max-w-[180px] @sm:max-w-[220px] mx-auto pt-2"
          >
            <div className="border border-current/10 p-[3px]">
              <div className="relative overflow-hidden aspect-square">
                <SiteImage
                  fillParent
                  unoptimized
                  src={imageUrl}
                  alt="Closing photograph"
                  sizes="220px"
                  imageClassName="object-cover"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom decorative rule */}
      <div className="px-8 @md:px-16 pb-10 @md:pb-14">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-current opacity-10" />
          <div className="w-1 h-1 rounded-full bg-current opacity-15" />
          <div className="h-px flex-1 bg-current opacity-10" />
        </div>
      </div>
    </section>
  )
}
