'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'

interface MinimalContactProps
  extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function MinimalContact({ theme, sectionContent }: MinimalContactProps) {
  return (
    <section
      id="contact"
      data-section-id="contact"
      className={cn('@container', theme.foreground)}
    >
      <div className="max-w-6xl mx-auto px-6 @md:px-10 @lg:px-16 py-20 @md:py-28">
        {/* Section header */}
        <div className="flex items-center justify-between mb-16 border-t border-current/10 pt-8">
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={cn('text-[9px] uppercase tracking-[0.4em] opacity-30', theme.letterSpacing, theme.fontBody)}
          >
            {sectionContent.contact.subtitle || 'Contact'}
          </motion.p>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={cn('text-[9px] tabular-nums opacity-20', theme.fontBody)}
          >
            05
          </motion.span>
        </div>

        <div className="grid @lg:grid-cols-2 grid-cols-1 gap-16 @lg:gap-24">
          {/* Left: title + email CTA */}
          <div className="space-y-10">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className={cn('@lg:text-5xl @md:text-4xl text-3xl font-extralight leading-tight', theme.fontTitle)}
            >
              {sectionContent.contact.title}
            </motion.h2>

            {sectionContent.contact.description && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className={cn('@md:text-base text-sm opacity-45 font-light leading-relaxed', theme.lineHeight, theme.fontBody)}
              >
                {sectionContent.contact.description}
              </motion.p>
            )}

            {sectionContent.contact.email && (
              <motion.a
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.15 }}
                href={`mailto:${sectionContent.contact.email}`}
                className={cn(
                  'group inline-flex items-start gap-2 border-b border-current/20 pb-1 hover:border-current/60 transition-colors duration-300 break-all',
                  theme.fontBody,
                )}
              >
                <span className="text-sm @md:text-base font-light opacity-60 group-hover:opacity-100 transition-opacity">
                  {sectionContent.contact.email}
                </span>
                <ArrowUpRight size={13} className="shrink-0 mt-1 opacity-30 group-hover:opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </motion.a>
            )}
          </div>

          {/* Right: minimal form */}
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-0"
          >
            {[{ label: 'Name', type: 'text', placeholder: 'Your name' }, { label: 'Email', type: 'email', placeholder: 'your@email.com' }].map((field) => (
              <div key={field.label} className="border-b border-current/10 py-4">
                <label className={cn('block text-[9px] uppercase tracking-[0.3em] opacity-25 mb-2', theme.fontBody)}>{field.label}</label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className={cn('w-full bg-transparent outline-none text-sm font-light opacity-70 placeholder:opacity-20', theme.fontBody)}
                />
              </div>
            ))}
            <div className="border-b border-current/10 py-4">
              <label className={cn('block text-[9px] uppercase tracking-[0.3em] opacity-25 mb-2', theme.fontBody)}>Message</label>
              <textarea
                placeholder="Tell me about your project…"
                rows={4}
                className={cn('w-full bg-transparent outline-none text-sm font-light opacity-70 placeholder:opacity-20 resize-none', theme.fontBody)}
              />
            </div>
            <div className="pt-7">
              <button
                type="submit"
                className={cn(
                  'group inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity duration-300 border-b border-current/20 pb-1',
                  theme.fontBody,
                )}
              >
                Send Inquiry
                <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
