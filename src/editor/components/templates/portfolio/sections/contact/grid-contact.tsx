'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'

interface GridContactProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function GridContact({ theme, sectionContent }: GridContactProps) {
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

          {/* ── Row 1: CTA + Email cards ── */}
          <div className="grid @lg:grid-cols-[7fr,5fr] grid-cols-1 gap-3 mb-3">

            {/* CTA card */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className={cn(
                'rounded-2xl border border-current/8 p-8 @lg:p-10 flex flex-col justify-between min-h-[26vh]',
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
                <p className={cn('text-xs opacity-50 mt-3 max-w-sm leading-relaxed', theme.fontBody)}>
                  {sectionContent.contact.description}
                </p>
              )}
            </motion.div>

            {/* Email + CTA card */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.07 }}
              className={cn(
                'rounded-2xl border border-current/8 p-8 flex flex-col justify-between min-h-[26vh]',
                theme.card,
              )}
            >
              <p className={cn('text-[10px] uppercase tracking-widest opacity-35', theme.fontBody)}>
                Email
              </p>
              <div className="space-y-1">
                <p className={cn('@lg:text-lg @md:text-base text-sm font-medium opacity-75 break-all', theme.fontBody)}>
                  {sectionContent.contact.email}
                </p>
                {sectionContent.contact.phone && (
                  <p className={cn('text-xs opacity-40', theme.fontBody)}>
                    {sectionContent.contact.phone}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={`mailto:${sectionContent.contact.email}`}
                  className={cn(
                    'inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-full border border-current/15',
                    'hover:border-current/40 hover:bg-current/5 transition-all duration-200',
                    theme.fontBody,
                  )}
                >
                  Write ↗
                </a>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-current/10 opacity-45">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className={cn('text-[10px] uppercase tracking-wider', theme.fontBody)}>24h reply</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Row 2: Contact form ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={cn(
              'rounded-2xl border border-current/8 overflow-hidden',
              theme.card,
            )}
          >
            <form className="p-6 @lg:p-8">
              <div className="grid @md:grid-cols-3 grid-cols-1 gap-3 mb-3">
                {[
                  { type: 'text', placeholder: 'Your name' },
                  { type: 'email', placeholder: 'Email address' },
                  { type: 'text', placeholder: 'Subject' },
                ].map((field, i) => (
                  <input
                    key={i}
                    type={field.type}
                    placeholder={field.placeholder}
                    className={cn(
                      'w-full px-4 py-3 text-sm bg-current/5 border border-current/10 rounded-xl outline-none',
                      'focus:border-current/30 transition-colors placeholder:opacity-40',
                      theme.fontBody,
                    )}
                  />
                ))}
              </div>
              <textarea
                placeholder="Tell me about your project…"
                rows={4}
                className={cn(
                  'w-full px-4 py-3 text-sm bg-current/5 border border-current/10 rounded-xl outline-none',
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
