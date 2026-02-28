"use client"

import { motion } from "framer-motion"
import type { PortfolioTemplateProps } from "@/editor/components/editor/layout/portfolio-template-shell"
import { cn } from "@/lib/utils"
import { getAspectRatioClass } from "@/editor/lib/aspect-ratios"
import Image, { type ImageLoader } from 'next/image'

const passthroughLoader: ImageLoader = ({ src }) => src

interface ModernParallaxBioProps extends Pick<PortfolioTemplateProps, "theme" | "sectionContent"> {}

export function ModernParallaxBio({ theme, sectionContent }: ModernParallaxBioProps) {
  return (
    <motion.section
      id="bio"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="@container relative"
    >
      <div className="@lg:px-12 @md:px-8 px-4 @lg:py-20 @md:py-16 py-12 max-w-350 mx-auto relative z-10">
        <div className="grid @md:grid-cols-[2fr,3fr] grid-cols-1 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative group"
          >
            <div
              className={cn(
                "relative overflow-hidden rounded-2xl border shadow-lg",
                theme.border,
              )}
            >
              <div className={cn('relative w-full overflow-hidden', getAspectRatioClass(sectionContent.bio.imageAspectRatio))}>
                <Image
                  loader={passthroughLoader}
                  unoptimized
                  src={sectionContent.bio.image || "/placeholder.svg?height=600&width=600"}
                  alt={sectionContent.bio.title || "Profile image"}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {sectionContent.bio.subtitle && (
              <p className={cn("text-sm font-medium uppercase tracking-wider mb-4 opacity-60", theme.foreground)}>
                {sectionContent.bio.subtitle}
              </p>
            )}
            <h3
              className={cn(
                "@lg:text-5xl @md:text-4xl text-3xl font-semibold mb-6 tracking-tight",
                theme.foreground,
              )}
            >
              {sectionContent.bio.title}
            </h3>
            <p
              className={cn(
                "@md:text-lg text-base mb-8 leading-relaxed",
                theme.mutedText,
              )}
            >
              {sectionContent.bio.description}
            </p>
            {sectionContent.bio.achievements && sectionContent.bio.achievements.length > 0 && (
              <ul className="space-y-3">
                {sectionContent.bio.achievements.map((achievement, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                    className={cn("flex items-start gap-3 text-sm", theme.mutedText)}
                  >
                    <span
                      className={cn(
                        "mt-1 py-0.5 px-2 rounded-full border text-[11px] font-medium tracking-wide",
                        theme.primary,
                        theme.background,
                      )}
                    >
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{achievement}</span>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
