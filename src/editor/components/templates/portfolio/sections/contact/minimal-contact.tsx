'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/components/editor/ui/portfolio-template-shell'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface MinimalContactProps
  extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function MinimalContact({ theme, sectionContent }: MinimalContactProps) {
  return (
    <motion.section
      id="contact"
      data-section-id="contact"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      className={cn('@container', theme.background, theme.foreground)}
    >
      <div className="@lg:px-20 @md:px-12 px-6 @lg:py-32 @md:py-24 py-16">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="space-y-3">
            <p className={cn('text-xs uppercase opacity-40', theme.letterSpacing)}>
              {sectionContent.contact.subtitle || 'Contact'}
            </p>
            <h3
              className={cn(
                '@lg:text-5xl @md:text-4xl text-3xl font-light',
                theme.fontTitle,
              )}
            >
              {sectionContent.contact.title}
            </h3>
            {sectionContent.contact.description && (
              <p
                className={cn(
                  '@md:text-base text-sm opacity-60 font-light',
                  theme.lineHeight,
                  theme.fontBody,
                )}
              >
                {sectionContent.contact.description}
              </p>
            )}
          </div>

          <form className="space-y-4">
            <div className="grid @md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                className={cn(
                  'w-full px-3 py-2 text-sm bg-transparent border border-current/10 outline-none',
                  theme.radiusMedium,
                  theme.fontBody,
                )}
              />
              <input
                type="email"
                placeholder="Email"
                className={cn(
                  'w-full px-3 py-2 text-sm bg-transparent border border-current/10 outline-none',
                  theme.radiusMedium,
                  theme.fontBody,
                )}
              />
            </div>
            <textarea
              placeholder="Tell me about your project"
              className={cn(
                'w-full px-3 py-2 text-sm bg-transparent border border-current/10 min-h-30 outline-none resize-none',
                theme.radiusMedium,
                theme.fontBody,
              )}
            />
            <div className="flex items-center justify-between pt-2">
              <p className={cn('text-xs opacity-40', theme.fontBody)}>
                Or email directly at {sectionContent.contact.email}
              </p>
              <Button
                type="submit"
                className={cn(
                  'px-6 py-2 text-xs uppercase tracking-[0.2em]',
                  theme.letterSpacing,
                )}
              >
                Send Inquiry
              </Button>
            </div>
          </form>
        </div>
      </div>
    </motion.section>
  )
}
