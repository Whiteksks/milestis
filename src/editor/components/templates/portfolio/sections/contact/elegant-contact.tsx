'use client'

import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { useContactForm } from '@/editor/hooks/useContactForm'
import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'

type ElegantContactProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> 

export function ElegantContact({ theme, sectionContent }: ElegantContactProps) {
  const { fields, status, handleChange, handleSubmit } = useContactForm(sectionContent.contact.email || '')
  return (
    <SectionWrapper
      id="contact"
      themeForeground={theme.foreground}
      padded={false}
      className="@container"
    >
      <div className="max-w-3xl mx-auto px-6 @md:px-10 @lg:px-16 py-20 @md:py-28">
        <div className="space-y-14">
          {/* Heading */}
          <div className="text-center space-y-4">
            <Animate
              direction="up"
              distance={10}
              className={cn('text-[10px] uppercase tracking-[0.3em] opacity-35', theme.fontBody)}
            >
              <p>{sectionContent.contact.subtitle || 'Contact'}</p>
            </Animate>
            <Animate
              direction="up"
              distance={16}
            >
              <h2 className={cn('@lg:text-6xl @md:text-5xl text-4xl font-extralight tracking-tight', theme.fontTitle)}>
                {sectionContent.contact.title}
              </h2>
            </Animate>
            {sectionContent.contact.description && (
              <Animate
                direction="up"
                distance={10}
                delay={0.2}
                className={cn('@md:text-base text-sm font-light opacity-55', theme.lineHeight, theme.fontBody)}
              >
                <p>{sectionContent.contact.description}</p>
              </Animate>
            )}
            <Animate
              direction="up"
              delay={0.25}
              className="w-16 h-px bg-current opacity-20 mx-auto origin-center mt-6"
            />
          </div>

          {/* Form */}
          <Animate
            direction="up"
            distance={16}
            delay={0.15}
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              {status !== 'idle' && (
                <Animate
                  direction="up"
                  distance={8}
                  className={cn(
                    'mb-6 px-4 py-2.5 rounded-xl text-[11px] text-center border',
                    status === 'sent'
                      ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-600'
                      : 'border-red-500/25 bg-red-500/10 text-red-500',
                    theme.fontBody,
                  )}
                >
                  <p>{status === 'sent' ? 'Message sent — check your email client.' : 'Please fill in all required fields.'}</p>
                </Animate>
              )}
              <div className="grid @md:grid-cols-2 grid-cols-1 gap-8">
                <input
                  type="text"
                  name="name"
                  value={fields.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className={cn(
                    'px-0 py-4 bg-transparent border-b border-current/10 focus:border-current/30 outline-none transition-colors w-full',
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
                    'px-0 py-4 bg-transparent border-b border-current/10 focus:border-current/30 outline-none transition-colors w-full',
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
            </form>
          </Animate>
        </div>
      </div>
    </SectionWrapper>
  )
}
 