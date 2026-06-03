'use client'

import { motion } from 'framer-motion'
import { SectionWrapper } from '@/editor/components/templates/primitives/section-wrapper'
import { Animate } from '@/editor/components/templates/primitives/animate'
import { ArrowUpRight } from 'lucide-react'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { useContactForm } from '@/editor/hooks/useContactForm'

type ShowcaseContactProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> 

export function ShowcaseContact({ theme, sectionContent }: ShowcaseContactProps) {
  const { fields, status, handleChange, handleSubmit } = useContactForm(sectionContent.contact.email || '')
  return (
    <SectionWrapper
      id="contact"
      className={cn(theme.foreground)}
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
          {/* Left   statement */}
          <Animate direction="left" distance={20} delay={0.1} className="space-y-8">
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
          </Animate>

          {/* Right   form */}
          <Animate as="form" onSubmit={(e) => handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)} direction="right" distance={20} delay={0.2} className="space-y-0">
            {status !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  'mb-6 px-4 py-2.5 rounded-xl text-[11px] border',
                  status === 'sent'
                    ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-600'
                    : 'border-red-500/25 bg-red-500/10 text-red-500',
                  theme.fontBody,
                )}
              >
                {status === 'sent' ? 'Message sent   check your email client.' : 'Please fill in all required fields.'}
              </motion.div>
            )}

            {/* Name + Email row */}
            <div className="grid @sm:grid-cols-2 gap-0">
              <div className="border-b border-current/15 py-5">
                <input
                  type="text"
                  name="name"
                  value={fields.name}
                  onChange={handleChange}
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
                  name="email"
                  value={fields.email}
                  onChange={handleChange}
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
                name="subject"
                value={fields.subject}
                onChange={handleChange}
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
                name="message"
                value={fields.message}
                onChange={handleChange}
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
          </Animate>
        </div>
      </div>
    </SectionWrapper>
  )
}

