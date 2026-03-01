'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'

interface BentoContactProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function BentoContact({ theme, sectionContent }: BentoContactProps) {
  return (
    <motion.section
      id="contact"
      data-section-id="contact"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      className={cn('@container', theme.foreground)}
    >
      <div className="@lg:px-6 @md:px-5 px-4 py-3">
        <div className="max-w-6xl mx-auto">

          {/* ── Row 1: CTA cells ── */}
          <div className="grid @lg:grid-cols-12 @md:grid-cols-6 grid-cols-1 gap-3 mb-3">

            {/* [A] Headline card — 7/12 */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className={cn(
                '@lg:col-span-7 @md:col-span-4 col-span-1',
                'rounded-3xl border border-current/8 overflow-hidden p-7 @lg:p-9 flex flex-col justify-between min-h-[22vh]',
                theme.card,
              )}
            >
              <p className={cn('text-[10px] uppercase tracking-widest opacity-35 mb-2', theme.fontBody)}>
                {sectionContent.contact.subtitle || 'Contact'}
              </p>
              <h2 className={cn('@lg:text-4xl @md:text-3xl text-2xl font-bold leading-tight', theme.fontTitle)}>
                {sectionContent.contact.title}
              </h2>
              {sectionContent.contact.description && (
                <p className={cn('text-xs opacity-50 mt-3 max-w-sm', theme.fontBody)}>
                  {sectionContent.contact.description}
                </p>
              )}
            </motion.div>

            {/* [B] Email card — 5/12 */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.07 }}
              className={cn(
                '@lg:col-span-5 @md:col-span-2 col-span-1',
                'rounded-3xl border border-current/8 overflow-hidden p-7 flex flex-col justify-between min-h-[22vh]',
                theme.card,
              )}
            >
              <p className={cn('text-[10px] uppercase tracking-widest opacity-35', theme.fontBody)}>
                Email
              </p>
              <div className="space-y-1">
                <p className={cn('@lg:text-lg @md:text-base text-sm font-medium opacity-80 break-all', theme.fontBody)}>
                  {sectionContent.contact.email}
                </p>

              </div>
              <div>
                <a
                  href={`mailto:${sectionContent.contact.email}`}
                  className={cn(
                    'inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full border border-current/15 hover:border-current/40 hover:bg-current/5 transition-all duration-200',
                    theme.fontBody,
                  )}
                >
                  Write ↗
                </a>
              </div>
            </motion.div>

          </div>

          {/* ── Row 2: Form card ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={cn(
              'rounded-3xl border border-current/8 overflow-hidden',
              theme.card,
            )}
          >
            <form className="p-6 @lg:p-8">
              <div className="grid @md:grid-cols-3 grid-cols-1 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Your name"
                  className={cn(
                    'w-full px-4 py-3 text-sm bg-current/5 border border-current/10 rounded-2xl outline-none',
                    'focus:border-current/30 transition-colors placeholder:opacity-40',
                    theme.fontBody,
                  )}
                />
                <input
                  type="email"
                  placeholder="Email address"
                  className={cn(
                    'w-full px-4 py-3 text-sm bg-current/5 border border-current/10 rounded-2xl outline-none',
                    'focus:border-current/30 transition-colors placeholder:opacity-40',
                    theme.fontBody,
                  )}
                />
                <input
                  type="text"
                  placeholder="Subject"
                  className={cn(
                    'w-full px-4 py-3 text-sm bg-current/5 border border-current/10 rounded-2xl outline-none',
                    'focus:border-current/30 transition-colors placeholder:opacity-40',
                    theme.fontBody,
                  )}
                />
              </div>
              <textarea
                placeholder="Tell me about your project…"
                rows={4}
                className={cn(
                  'w-full px-4 py-3 text-sm bg-current/5 border border-current/10 rounded-2xl outline-none',
                  'focus:border-current/30 transition-colors placeholder:opacity-40 resize-none mb-3',
                  theme.fontBody,
                )}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className={cn(
                    'px-6 py-2.5 text-xs font-semibold rounded-full border border-current/20',
                    'hover:bg-current hover:text-current-foreground transition-all duration-200',
                    theme.fontBody,
                  )}
                >
                  Send message →
                </button>
              </div>
            </form>
          </motion.div>

        </div>
      </div>
    </motion.section>
  )
}
