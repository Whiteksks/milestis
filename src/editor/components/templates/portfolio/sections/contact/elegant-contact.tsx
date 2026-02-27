'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'

interface ElegantContactProps
  extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function ElegantContact({ theme, sectionContent }: ElegantContactProps) {
  return (
    <motion.section
      id="contact"
      data-section-id="contact-form"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.9 }}
      className={cn('@container', theme.foreground)}
    >
      <div className="@lg:px-16 @md:px-10 px-6 @lg:py-32 @md:py-24 py-16">
        <div className="max-w-3xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <p
              className={cn(
                '@md:text-xs text-[10px] uppercase tracking-[0.3em] opacity-40',
                theme.fontBody,
              )}
            >
              {sectionContent.contact.subtitle || 'Contact'}
            </p>
            <h3
              className={cn(
                '@lg:text-6xl @md:text-5xl text-4xl tracking-tight',
                theme.fontTitle,
              )}
            >
              {sectionContent.contact.title}
            </h3>
            {sectionContent.contact.description && (
              <p
                className={cn(
                  '@md:text-base text-sm opacity-60',
                  theme.lineHeight,
                )}
              >
                {sectionContent.contact.description}
              </p>
            )}
          </div>

          <form className="space-y-8">
            <div className="grid @md:grid-cols-2 grid-cols-1 gap-8">
              <input
                type="text"
                placeholder="Name"
                className={cn(
                  'px-0 py-4 bg-transparent border-b border-current/10 focus:border-current/30 outline-none transition-colors',
                  'placeholder:opacity-30 placeholder:uppercase placeholder:text-xs placeholder:tracking-widest',
                  theme.fontBody,
                )}
              />
              <input
                type="email"
                placeholder="Email"
                className={cn(
                  'px-0 py-4 bg-transparent border-b border-current/10 focus:border-current/30 outline-none transition-colors',
                  'placeholder:opacity-30 placeholder:uppercase placeholder:text-xs placeholder:tracking-widest',
                  theme.fontBody,
                )}
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              className={cn(
                'w-full px-0 py-4 bg-transparent border-b border-current/10 focus:border-current/30 outline-none transition-colors',
                'placeholder:opacity-30 placeholder:uppercase placeholder:text-xs placeholder:tracking-widest',
                theme.fontBody,
              )}
            />
            <textarea
              placeholder="Message"
              rows={6}
              className={cn(
                'w-full px-0 py-4 bg-transparent border-b border-current/10 focus:border-current/30 outline-none transition-colors resize-none',
                'placeholder:opacity-30 placeholder:uppercase placeholder:text-xs placeholder:tracking-widest',
                theme.fontBody,
              )}
            />
            <div className="pt-6 text-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className={cn(
                  'px-16 py-5 border border-current/20 hover:bg-current/10 transition-all duration-300',
                  'text-xs uppercase tracking-[0.3em]',
                  theme.fontBody,
                )}
              >
                Send Message
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </motion.section>
  )
}
