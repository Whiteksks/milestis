'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'

interface ShowcaseContactProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function ShowcaseContact({ theme, sectionContent }: ShowcaseContactProps) {
  return (
    <motion.section
      id="contact"
      data-section-id="contact"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8 }}
      className={cn('@container', theme.foreground)}
    >
      <div className="max-w-7xl mx-auto @lg:px-20 @md:px-12 px-6 @lg:py-28 @md:py-20 py-16">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-10 @md:mb-16">
          <span className={cn('text-[10px] uppercase tracking-[0.3em] opacity-35', theme.fontBody)}>
            {sectionContent.contact.subtitle || 'Contact'}
          </span>
          <div className="w-10 h-px bg-current opacity-15" />
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 @lg:grid-cols-2 gap-16 @lg:gap-24 items-start">
          {/* Left — statement */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-8"
          >
            <h2
              className={cn(
                'font-black uppercase leading-[0.88] tracking-tighter',
                '@lg:text-6xl @md:text-5xl text-4xl',
                theme.fontTitle,
              )}
            >
              {sectionContent.contact.title}
            </h2>

            {sectionContent.contact.description && (
              <p
                className={cn(
                  'max-w-sm text-sm opacity-50 font-light leading-relaxed',
                  theme.lineHeight,
                  theme.fontBody,
                )}
              >
                {sectionContent.contact.description}
              </p>
            )}

            {/* Email link */}
            {sectionContent.contact.email && (
              <a
                href={`mailto:${sectionContent.contact.email}`}
                className={cn(
                  'group inline-flex items-start gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity break-all',
                  theme.fontBody,
                )}
              >
                <span className="border-b border-current/30 group-hover:border-current transition-colors pb-0.5 min-w-0 break-all">
                  {sectionContent.contact.email}
                </span>
                <ArrowUpRight
                  size={14}
                  className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                />
              </a>
            )}
          </motion.div>

          {/* Right — form */}
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-0"
          >
            {/* Name + Email row */}
            <div className="grid @sm:grid-cols-2 gap-0">
              <div className="border-b border-current/15 py-5">
                <input
                  type="text"
                  placeholder="Name"
                  className={cn(
                    'w-full bg-transparent outline-none text-sm placeholder:opacity-25 focus:placeholder:opacity-10 transition-all',
                    theme.fontBody,
                  )}
                />
              </div>
              <div className="border-b border-current/15 py-5 @sm:border-l border-l-0 @sm:pl-6">
                <input
                  type="email"
                  placeholder="Email address"
                  className={cn(
                    'w-full bg-transparent outline-none text-sm placeholder:opacity-25 focus:placeholder:opacity-10 transition-all',
                    theme.fontBody,
                  )}
                />
              </div>
            </div>

            {/* Subject */}
            <div className="border-b border-current/15 py-5">
              <input
                type="text"
                placeholder="Subject"
                className={cn(
                  'w-full bg-transparent outline-none text-sm placeholder:opacity-25 focus:placeholder:opacity-10 transition-all',
                  theme.fontBody,
                )}
              />
            </div>

            {/* Message */}
            <div className="border-b border-current/15 py-5">
              <textarea
                placeholder="Your message"
                rows={4}
                className={cn(
                  'w-full bg-transparent outline-none text-sm resize-none placeholder:opacity-25 focus:placeholder:opacity-10 transition-all',
                  theme.fontBody,
                )}
              />
            </div>

            {/* Submit */}
            <div className="pt-8">
              <button
                type="submit"
                className={cn(
                  'group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] opacity-70 hover:opacity-100 transition-opacity',
                  theme.fontBody,
                )}
              >
                <span>Send Message</span>
                <ArrowUpRight
                  size={14}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </motion.section>
  )
}
