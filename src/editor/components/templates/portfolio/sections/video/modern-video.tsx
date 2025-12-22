"use client"

import { motion } from "framer-motion"
import type { PortfolioTemplateProps } from "@/editor/components/editor/ui/portfolio-template-shell"
import { cn } from "@/lib/utils"

interface ModernVideoProps extends Pick<PortfolioTemplateProps, "theme" | "sectionContent"> {}

export function ModernVideo({ theme, sectionContent }: ModernVideoProps) {
  return (
    <motion.section
      id="video"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="@container"
    >
      <div className="@lg:px-12 @md:px-8 px-4 @lg:py-20 @md:py-16 py-12 max-w-300 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          {sectionContent.video.subtitle && (
            <p className={cn("text-sm font-medium uppercase tracking-wider mb-2 opacity-60", theme.foreground)}>
              {sectionContent.video.subtitle}
            </p>
          )}
          <h3
            className={cn(
              "@lg:text-5xl @md:text-4xl text-3xl font-semibold mb-4 tracking-tight",
              theme.foreground,
            )}
          >
            {sectionContent.video.title}
          </h3>
          <p
            className={cn(
              "@md:text-base text-sm max-w-2xl mx-auto",
              theme.mutedText,
            )}
          >
            {sectionContent.video.description}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative group"
        >
          <div
            className={cn(
              "absolute -inset-8 rounded-3xl blur-3xl opacity-50 group-hover:opacity-75 transition-opacity duration-700",
              theme.muted,
            )}
          />
          <div
            className={cn(
              "relative aspect-video w-full overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-xl",
              theme.border,
              theme.background,
            )}
          >
            {sectionContent.video.videoUrl && (
              <iframe
                src={sectionContent.video.videoUrl}
                title="Video"
                className="w-full h-full rounded-3xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
