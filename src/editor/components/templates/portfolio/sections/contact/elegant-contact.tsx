'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { useContactForm } from '@/editor/hooks/useContactForm'

interface ElegantContactProps
  extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function ElegantContact({ theme, sectionContent }: ElegantContactProps) {
  const { fields, status, handleChange, handleSubmit } = useContactForm(sectionContent.contact.email || '')
  return (
    <section
      id="contact"
      data-section-id="contact"
      className={cn('@container', theme.foreground)}
    >
      <div className="max-w-3xl mx-auto px-6 @md:px-10 @lg:px-16 py-20 @md:py-28">
        <div className="space-y-14">
          {/* Heading */}
          <div className="text-center space-y-4">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 0.35, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className={cn('text-[10px] uppercase tracking-[0.3em]', theme.fontBody)}
            >
              {sectionContent.contact.subtitle || 'Contact'}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={cn('@lg:text-6xl @md:text-5xl text-4xl font-extralight tracking-tight', theme.fontTitle)}
            >
              {sectionContent.contact.title}
            </motion.h2>
            {sectionContent.contact.description && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 0.55, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className={cn('@md:text-base text-sm font-light', theme.lineHeight, theme.fontBody)}
              >
                {sectionContent.contact.description}
              </motion.p>
            )}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="w-16 h-px bg-current/20 mx-auto origin-center"
            />
          </div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="space-y-8"
          >
            {status !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  'mb-6 px-4 py-2.5 rounded-xl text-[11px] text-center border',
                  status === 'sent'
                    ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-600'
                    : 'border-red-500/25 bg-red-500/10 text-red-500',
                  theme.fontBody,
                )}
              >
                {status === 'sent' ? 'Message sent — check your email client.' : 'Please fill in all required fields.'}
              </motion.div>
            )}
            <div className="grid @md:grid-cols-2 grid-cols-1 gap-8">
              <input
                type="text"
                name="name"
                value={fields.name}
                onChange={handleChange}
                placeholder="Name"
                className={cn(
                  'px-0 py-4 bg-transparent border-b border-current/10 focus:border-current/30 outline-none transition-colors',
                  'placeholder:opacity-25 placeholder:uppercase placeholder:text-xs placeholder:tracking-widest',
                  theme.fontBody,
                )}
              />
              <input
                type="email"
                name="email"
                value={fields.email}
                onChange={handleChange}
                placeholder="Email"
                className={cn(
                  'px-0 py-4 bg-transparent border-b border-current/10 focus:border-current/30 outline-none transition-colors',
                  'placeholder:opacity-25 placeholder:uppercase placeholder:text-xs placeholder:tracking-widest',
                  theme.fontBody,
                )}
              />
            </div>
            <input
              type="text"
              name="subject"
              value={fields.subject}
              onChange={handleChange}
              placeholder="Subject"
              className={cn(
                'w-full px-0 py-4 bg-transparent border-b border-current/10 focus:border-current/30 outline-none transition-colors',
                'placeholder:opacity-25 placeholder:uppercase placeholder:text-xs placeholder:tracking-widest',
                theme.fontBody,
              )}
            />
            <textarea
              name="message"
              value={fields.message}
              onChange={handleChange}
              placeholder="Message"
              rows={5}
              className={cn(
                'w-full px-0 py-4 bg-transparent border-b border-current/10 focus:border-current/30 outline-none transition-colors resize-none',
                'placeholder:opacity-25 placeholder:uppercase placeholder:text-xs placeholder:tracking-widest',
                theme.fontBody,
              )}
            />
            <div className="pt-4 text-center">
              <button
                type="submit"
                className={cn(
                  'px-16 py-4 border border-current/15 hover:border-current/35 hover:bg-current/5 transition-all duration-300',
                  'text-[10px] uppercase tracking-[0.3em] opacity-60 hover:opacity-100',
                  theme.fontBody,
                )}
              >
                Send Message
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
 