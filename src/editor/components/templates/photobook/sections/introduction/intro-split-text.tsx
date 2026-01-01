"use client"

import { motion } from "framer-motion"
import type { PhotobookSectionContent } from '@/editor/lib/types'
import type { ThemeConfig } from '@/editor/lib/themes'
import { cn } from '@/lib/utils'
import Image, { type ImageLoader } from 'next/image'

const passthroughLoader: ImageLoader = ({ src }) => src

interface IntroSplitTextProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function IntroSplitText({ sectionContent, theme }: IntroSplitTextProps) {
  const { introduction } = sectionContent
  const title = introduction.title || ''
  const quote = introduction.quote || ''
  const dedication = introduction.dedication || ''
  const imageUrl = introduction.images?.image || ''

  return (
    <section className="min-h-screen" style={{ backgroundColor: theme.background }}>
      <div className="grid md:grid-cols-2 min-h-screen">
        {/* Left - Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
          style={{ backgroundColor: theme.muted }}
        >
          {imageUrl ? (
            <Image
              loader={passthroughLoader}
              unoptimized
              src={imageUrl}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br" style={{ '--tw-gradient-from': theme.background, '--tw-gradient-to': theme.muted } as any} />
          )}
          <div className="absolute inset-0 bg-linear-to-r from-transparent to-white/20" />
        </motion.div>

        {/* Right - Text */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center p-12 lg:p-20"
        >
          <div className="max-w-md space-y-8">
            <div className="w-12 h-1" style={{ backgroundColor: theme.accent }} />

            <h2 className={cn("text-3xl md:text-4xl lg:text-5xl font-serif leading-tight", theme.fontTitle)} style={{ color: theme.foreground }}>{title}</h2>

            <p className={cn("text-lg leading-relaxed italic", theme.fontBody)} style={{ color: theme.mutedText }}>&quot;{quote}&quot;</p>

            <div className="pt-6 border-t" style={{ borderColor: theme.border }}>
              <p className="text-sm uppercase tracking-[0.2em]" style={{ color: theme.mutedText }}>{dedication}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
