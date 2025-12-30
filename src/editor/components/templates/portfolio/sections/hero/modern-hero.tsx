"use client"

import { motion } from "framer-motion"
import type { PortfolioTemplateProps } from "@/editor/components/editor/layout/portfolio-template-shell"
import { cn } from "@/lib/utils"

interface ModernParallaxHeroProps
  extends Pick<PortfolioTemplateProps, "theme" | "sectionContent"> {}

export function ModernParallaxHero({ theme, sectionContent }: ModernParallaxHeroProps) {
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
      <div className="@lg:px-12 @md:px-8 px-4 @lg:py-24 @md:py-16 py-12 text-center relative z-10 max-w-7xl mx-auto">
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
            "@lg:text-2xl @md:text-xl text-lg max-w-2xl mx-auto mb-6 leading-relaxed opacity-90",
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
            "@md:text-base text-sm max-w-xl mx-auto opacity-80",
            theme.mutedText,
          )}
        >
          {sectionContent.hero.description}
        </motion.p>
      </div>
    </motion.section>
  )
}
