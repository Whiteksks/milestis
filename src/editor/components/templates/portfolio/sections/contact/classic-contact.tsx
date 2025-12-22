'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/components/editor/ui/portfolio-template-shell'
import { cn } from '@/lib/utils'

interface ClassicContactProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function ClassicContact({ theme, sectionContent }: ClassicContactProps) {
  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      className="@container"
    >
      <div className="@lg:px-12 @md:px-8 px-4 @lg:py-20 @md:py-16 py-12">
        <div className="max-w-2xl mx-auto">
          {sectionContent.contact.subtitle && (
            <p className={cn('text-sm font-medium uppercase tracking-wider text-center mb-2 opacity-60', theme.fontTitle)}>
              {sectionContent.contact.subtitle}
            </p>
          )}
          <h3
            className={cn(
              '@lg:text-4xl @md:text-3xl text-2xl font-bold text-center mb-4',
              theme.fontTitle,
            )}
          >
            {sectionContent.contact.title}
          </h3>
          <p className="@md:text-base text-sm opacity-60 text-center mb-10">
            {sectionContent.contact.description}
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                className={cn(
                  'w-full px-4 py-3 border transition-colors',
                  theme.background,
                  theme.border,
                  theme.radiusMedium,
                  'focus:outline-none focus:border-opacity-50',
                )}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className={cn(
                  'w-full px-4 py-3 border transition-colors',
                  theme.background,
                  theme.border,
                  theme.radiusMedium,
                  'focus:outline-none focus:border-opacity-50',
                )}
                placeholder={sectionContent.contact.email}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                rows={5}
                className={cn(
                  'w-full px-4 py-3 border transition-colors resize-none',
                  theme.background,
                  theme.border,
                  theme.radiusMedium,
                  'focus:outline-none focus:border-opacity-50',
                )}
                placeholder="Your message..."
              />
            </div>
            <button
              className={cn(
                'w-full @md:py-3 py-2.5 transition-opacity hover:opacity-90 @md:text-base text-sm font-medium',
                theme.primary,
                theme.primaryText,
                theme.radiusMedium,
                theme.shadow,
              )}
            >
              Send Message
            </button>
          </div>
          {sectionContent.contact.phone && (
            <p className="text-center text-sm opacity-60 mt-6">
              Or call us at{' '}
              <span className="font-medium">
                {sectionContent.contact.phone}
              </span>
            </p>
          )}
        </div>
      </div>
    </motion.section>
  )
}
