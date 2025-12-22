'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/components/editor/ui/portfolio-template-shell'
import { cn } from '@/lib/utils'

interface ClassicFooterProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function ClassicFooter({ theme, sectionContent }: ClassicFooterProps) {
  return (
    <motion.footer
      id="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 0.9 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn('@container opacity-90 border-t', theme.border)}
    >
      <div className="@lg:px-12 @md:px-8 px-4 @lg:py-12 @md:py-8 py-6 text-center">
        <p className="@md:text-sm text-xs opacity-60">
          {sectionContent.footer.copyright}
        </p>
      </div>
    </motion.footer>
  )
}
