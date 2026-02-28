"use client"

import { motion } from "framer-motion"
import type { PortfolioTemplateProps } from "@/editor/components/editor/layout/portfolio-template-shell"
import { cn } from "@/lib/utils"
import { getAspectRatioClass } from "@/editor/lib/aspect-ratios"
import { getFrameStyle } from "@/editor/lib/frame-styles"
import Image, { type ImageLoader } from "next/image"

const passthroughLoader: ImageLoader = ({ src }) => src

interface ModernParallaxHeroProps
  extends Pick<PortfolioTemplateProps, "theme" | "sectionContent"> {}

export function ModernParallaxHero({ theme, sectionContent }: ModernParallaxHeroProps) {
  const heroImage = sectionContent.hero.image
  return (
    <motion.section
      id="hero"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="@container pt-32 relative overflow-hidden"
    >
      {/* --- Decorative Background --- */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Subtle layered light gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_70%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.10),transparent_65%)]" />

        {/* Accent glow 1 */}
        <div
          className={cn(
            "absolute -top-28 left-1/3 w-120 h-120 rounded-full blur-[120px] opacity-50 mix-blend-overlay",
            theme.primary,
          )}
        />

        {/* Accent glow 2 */}
        <div
          className={cn(
            "absolute -bottom-36 right-1/4 w-135 h-135 rounded-full blur-[130px] opacity-40 mix-blend-overlay",
            theme.muted,
          )}
        />
      </div>

      {/* --- Hero Content --- */}
      <div
        className={cn(
          "@lg:px-12 @md:px-8 px-4 @lg:py-24 @md:py-16 py-12 relative z-10 max-w-7xl mx-auto",
          heroImage ? "grid @md:grid-cols-2 grid-cols-1 gap-12 items-center" : "text-center",
        )}
      >
        <div className={heroImage ? "" : ""}>
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="@lg:text-7xl @md:text-6xl text-5xl font-semibold mb-8 leading-tight tracking-tight"
          >
            <span
              className={cn(
                "bg-clip-text drop-shadow-[0_0_25px_rgba(0,0,0,0.15)]",
                theme.primary,
              )}
            >
              {sectionContent.hero.title}
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "@lg:text-2xl @md:text-xl text-lg max-w-2xl mb-6 leading-relaxed opacity-90",
              heroImage ? "" : "mx-auto",
              theme.mutedText,
            )}
          >
            {sectionContent.hero.subtitle}
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "@md:text-base text-sm max-w-xl opacity-80",
              heroImage ? "" : "mx-auto",
              theme.mutedText,
            )}
          >
            {sectionContent.hero.description}
          </motion.p>
        </div>

        {heroImage && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className={cn(
                'relative w-full overflow-hidden',
                getAspectRatioClass(sectionContent.hero.imageAspectRatio || 'portrait'),
                theme.shadow,
                getFrameStyle(sectionContent.hero.imageFrameStyle || 'soft'),
              )}
            >
              <Image
                loader={passthroughLoader}
                unoptimized
                src={heroImage}
                alt={sectionContent.hero.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}
