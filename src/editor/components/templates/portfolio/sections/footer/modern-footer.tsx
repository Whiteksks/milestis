"use client"

import { motion } from "framer-motion"
import type { PortfolioTemplateProps } from "@/editor/components/editor/ui/portfolio-template-shell"
import { cn } from "@/lib/utils"

interface ModernFooterProps extends Pick<PortfolioTemplateProps, "theme" | "sectionContent"> {}

export function ModernFooter({ theme, sectionContent }: ModernFooterProps) {
  return (
    <motion.footer
      id="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 0.9 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn("@container border-t", theme.border)}
    >
      <div className="@lg:px-12 @md:px-8 px-4 @lg:py-12 @md:py-8 py-6 text-center max-w-350 mx-auto">
        <div
          className={cn(
            "h-px w-28 mx-auto mb-6 rounded-full bg-linear-to-r from-transparent via-primary/70 to-transparent",
            theme.muted,
          )}
        />
        <p
          className={cn("@md:text-sm text-xs", theme.mutedText)}
        >
          {sectionContent.footer.copyright}
        </p>
      </div>
    </motion.footer>
  )
}
