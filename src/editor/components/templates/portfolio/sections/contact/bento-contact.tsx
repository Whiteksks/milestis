'use client'

import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { useContactForm } from '@/editor/hooks/useContactForm'

import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'

type BentoContactProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> 

export function BentoContact({ theme, sectionContent }: BentoContactProps) {
  const { fields, status, handleChange, handleSubmit } = useContactForm(sectionContent.contact.email || '')
  return (
    <SectionWrapper
      id="contact"
      themeForeground={theme.foreground}
      className="@lg:px-6 @md:px-5 px-4 py-3"
    >
      <div className="max-w-6xl mx-auto w-full">

        {/* РІвЂќР‚РІвЂќР‚ Row 1: CTA cells РІвЂќР‚РІвЂќР‚ */}
        <div className="grid @lg:grid-cols-12 @md:grid-cols-6 grid-cols-1 gap-3 mb-3">

          {/* [A] Headline card РІР‚вЂќ 7/12 */}
          <Animate
            delay={0}
            direction="up"
            distance={14}
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
          </Animate>

          {/* [B] Email card РІР‚вЂќ 5/12 */}
          <Animate
            delay={0.07}
            direction="up"
            distance={14}
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
                Write РІвЂ вЂ”
              </a>
            </div>
          </Animate>

        </div>

        {/* РІвЂќР‚РІвЂќР‚ Row 2: Form card РІвЂќР‚РІвЂќР‚ */}
        <Animate
          delay={0.1}
          direction="up"
          distance={12}
          className={cn(
            'rounded-3xl border border-current/8 overflow-hidden',
            theme.card,
          )}
        >
          <form onSubmit={handleSubmit} className="p-6 @lg:p-8">
            {status !== 'idle' && (
              <div
                className={cn(
                  'mb-4 px-4 py-2.5 rounded-xl text-[11px] border transition-all duration-300 transform',
                  status === 'sent'
                    ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-600'
                    : 'border-red-500/25 bg-red-500/10 text-red-500',
                  theme.fontBody,
                )}
              >
                {status === 'sent' ? 'Message sent РІР‚вЂќ check your email client.' : 'Please fill in all required fields.'}
              </div>
            )}
            <div className="grid @md:grid-cols-3 grid-cols-1 gap-3 mb-3">
              <input
                type="text"
                name="name"
                value={fields.name}
                onChange={handleChange}
                placeholder="Your name"
                className={cn(
                  'w-full px-4 py-3 text-sm bg-current/5 border border-current/10 rounded-2xl outline-none',
                  'focus:border-current/30 transition-colors placeholder:opacity-40',
                  theme.fontBody,
                )}
              />
              <input
                type="email"
                name="email"
                value={fields.email}
                onChange={handleChange}
                placeholder="Email address"
                className={cn(
                  'w-full px-4 py-3 text-sm bg-current/5 border border-current/10 rounded-2xl outline-none',
                  'focus:border-current/30 transition-colors placeholder:opacity-40',
                  theme.fontBody,
                )}
              />
              <input
                type="text"
                name="subject"
                value={fields.subject}
                onChange={handleChange}
                placeholder="Subject"
                className={cn(
                  'w-full px-4 py-3 text-sm bg-current/5 border border-current/10 rounded-2xl outline-none',
                  'focus:border-current/30 transition-colors placeholder:opacity-40',
                  theme.fontBody,
                )}
              />
            </div>
            <textarea
              name="message"
              value={fields.message}
              onChange={handleChange}
              placeholder="Tell me about your projectРІР‚В¦"
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
                Send message РІвЂ вЂ™
              </button>
            </div>
          </form>
        </Animate>

      </div>
    </SectionWrapper>
  )
}
