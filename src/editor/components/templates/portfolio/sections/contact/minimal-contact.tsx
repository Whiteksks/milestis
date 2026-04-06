'use client'

import { motion } from 'framer-motion'
import { useT, useDisabled } from '../../primitives/animation-context'
import { ArrowUpRight } from 'lucide-react'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { useContactForm } from '@/editor/hooks/useContactForm'
import { SectionWrapper } from '../../primitives/section-wrapper'
import { FadeIn } from '../../primitives/fade-in'

interface MinimalContactProps
  extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function MinimalContact({ theme, sectionContent }: MinimalContactProps) {
  const t = useT()
  const disabled = useDisabled()
  const { fields, status, handleChange, handleSubmit } = useContactForm(sectionContent.contact.email || '')
  return (
    <SectionWrapper
      id="contact"
      themeForeground={theme.foreground}
      padded={false}
    >
      <div className="max-w-6xl mx-auto px-6 @md:px-10 @lg:px-16 py-20 @md:py-28">
        {/* Section header */}
        <div className="flex items-center justify-between mb-16 border-t border-current/10 pt-8">
          <FadeIn
            direction="left"
            distance={10}
            as="p"
            className={cn('text-[9px] uppercase tracking-[0.4em] opacity-30', theme.letterSpacing, theme.fontBody)}
          >
            {sectionContent.contact.subtitle || 'Contact'}
          </FadeIn>
        </div>

        <div className="grid @lg:grid-cols-2 grid-cols-1 gap-16 @lg:gap-24">
          {/* Left: title + email CTA */}
          <div className="space-y-10">
            <FadeIn direction="up" distance={16} delay={0.05} as="h2"
              className={cn('@lg:text-5xl @md:text-4xl text-3xl font-extralight leading-tight', theme.fontTitle)}
            >
              {sectionContent.contact.title}
            </FadeIn>

            {sectionContent.contact.description && (
              <FadeIn direction="up" distance={10} delay={0.1} as="p"
                className={cn('@md:text-base text-sm opacity-45 font-light leading-relaxed', theme.lineHeight, theme.fontBody)}
              >
                {sectionContent.contact.description}
              </FadeIn>
            )}

            {sectionContent.contact.email && (
              <FadeIn direction="up" distance={10} delay={0.15}
                as="a"
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
              </FadeIn>
            )}
          </div>

          {/* Right: minimal form */}
          <FadeIn
            direction="up"
            distance={16}
            delay={0.1}
            as="form"
            onSubmit={handleSubmit}
            className="space-y-0"
          >
            {status !== 'idle' && (
              <motion.div
                initial={disabled ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={disabled ? undefined : t(0.3)}
                className={cn(
                  'mb-6 px-4 py-2.5 rounded-xl text-[11px] border',
                  status === 'sent'
                    ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-600'
                    : 'border-red-500/25 bg-red-500/10 text-red-500',
                  theme.fontBody,
                )}
              >
                {status === 'sent' ? 'Message sent вЂ” check your email client.' : 'Please fill in all required fields.'}
              </motion.div>
            )}
            <div className="border-b border-current/10 py-4">
              <label className={cn('block text-[9px] uppercase tracking-[0.3em] opacity-25 mb-2', theme.fontBody)}>Name</label>
              <input
                type="text"
                name="name"
                value={fields.name}
                onChange={handleChange}
                placeholder="Your name"
                className={cn('w-full bg-transparent outline-none text-sm font-light opacity-70 placeholder:opacity-20', theme.fontBody)}
              />
            </div>
            <div className="border-b border-current/10 py-4">
              <label className={cn('block text-[9px] uppercase tracking-[0.3em] opacity-25 mb-2', theme.fontBody)}>Email</label>
              <input
                type="email"
                name="email"
                value={fields.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={cn('w-full bg-transparent outline-none text-sm font-light opacity-70 placeholder:opacity-20', theme.fontBody)}
              />
            </div>
            <div className="border-b border-current/10 py-4">
              <label className={cn('block text-[9px] uppercase tracking-[0.3em] opacity-25 mb-2', theme.fontBody)}>Subject</label>
              <input
                type="text"
                name="subject"
                value={fields.subject}
                onChange={handleChange}
                placeholder="Subject"
                className={cn('w-full bg-transparent outline-none text-sm font-light opacity-70 placeholder:opacity-20', theme.fontBody)}
              />
            </div>
            <div className="border-b border-current/10 py-4">
              <label className={cn('block text-[9px] uppercase tracking-[0.3em] opacity-25 mb-2', theme.fontBody)}>Message</label>
              <textarea
                name="message"
                value={fields.message}
                onChange={handleChange}
                placeholder="Tell me about your projectвЂ¦"
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
          </FadeIn>
        </div>
      </div>
    </SectionWrapper>
  )
}
