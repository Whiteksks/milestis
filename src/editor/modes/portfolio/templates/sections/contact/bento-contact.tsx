'use client'

import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { useContactForm } from '@/editor/hooks/useContactForm'

import { SectionWrapper } from '@/editor/components/templates/primitives/section-wrapper'
import { Animate } from '@/editor/components/templates/primitives/animate'

type BentoContactProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> 

export function BentoContact({ theme, sectionContent }: BentoContactProps) {
  const { fields, status, handleChange, handleSubmit } = useContactForm(sectionContent.contact.email || '')

  return (
    <SectionWrapper
      id="contact"
      themeForeground={theme.foreground}
      className="@lg:px-8 @md:px-6 px-4 py-6"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 @md:grid-cols-6 @lg:grid-cols-12 gap-4">
          <div className="grid grid-cols-1 @md:grid-cols-6 @lg:col-span-7 gap-4 @md:col-span-6">
            <Animate
              delay={0}
              direction="up"
              distance={14}
              className={cn(
                '@md:col-span-6 flex flex-col justify-between p-6 @md:p-8 @lg:p-10',
                'rounded-3xl border border-current/8 overflow-hidden min-h-[26vh]',
                theme.card,
              )}
            >
              <div>
                <p className={cn('text-[10px] uppercase tracking-widest opacity-40 mb-3 block', theme.fontBody)}>
                  {sectionContent.contact.subtitle || 'Contact'}
                </p>
                <h2 className={cn('@lg:text-4xl @md:text-3xl text-2xl font-bold leading-tight tracking-tight', theme.fontTitle)}>
                  {sectionContent.contact.title}
                </h2>
              </div>
              {sectionContent.contact.description && (
                <p className={cn('text-xs @md:text-sm opacity-60 mt-6 max-w-md leading-relaxed', theme.fontBody)}>
                  {sectionContent.contact.description}
                </p>
              )}
            </Animate>

            <Animate
              delay={0.07}
              direction="up"
              distance={14}
              className={cn(
                '@md:col-span-6 flex flex-col sm:flex-row @md:flex-col @lg:flex-row justify-between items-start sm:items-center @md:items-start @lg:items-center gap-4 p-6 @md:p-8',
                'rounded-3xl border border-current/8 overflow-hidden',
                theme.card,
              )}
            >
              <div className="space-y-1">
                <p className={cn('text-[10px] uppercase tracking-widest opacity-40', theme.fontBody)}>
                  Direct Email
                </p>
                <p className={cn('@lg:text-lg @md:text-base text-sm font-medium opacity-90 break-all', theme.fontBody)}>
                  {sectionContent.contact.email}
                </p>
              </div>
              <a
                href={`mailto:${sectionContent.contact.email}`}
                className={cn(
                  'inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-full border border-current/15',
                  'hover:border-current/40 hover:bg-current/5 transition-all duration-300 shrink-0 project-btn-glow',
                  theme.fontBody,
                )}
              >
                Write to me ↗
              </a>
            </Animate>
          </div>

          <Animate
            delay={0.14}
            direction="up"
            distance={12}
            className={cn(
              '@md:col-span-6 @lg:col-span-5 rounded-3xl border border-current/8 overflow-hidden h-full',
              theme.card,
            )}
          >
            <form onSubmit={handleSubmit} className="p-6 @md:p-8 flex flex-col h-full justify-between gap-6">
              <div className="w-full">
                <p className={cn('text-[10px] uppercase tracking-widest opacity-40 mb-4 block', theme.fontBody)}>
                  Send a Message
                </p>
                
                {status !== 'idle' && (
                  <div
                    className={cn(
                      'mb-4 px-4 py-3 rounded-xl text-xs border transition-all duration-300',
                      theme.fontBody,
                    )}
                    style={{
                      borderColor: status === 'sent' ? `${theme.success}33` : `${theme.warning}33`,
                      backgroundColor: status === 'sent' ? `${theme.success}0d` : `${theme.warning}0d`,
                      color: status === 'sent' ? theme.success : theme.warning,
                    }}
                  >
                    {status === 'sent' ? 'Message sent! Check your email client.' : 'Please fill in all required fields.'}
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-1 @sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="name"
                      value={fields.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className={cn(
                        'w-full px-4 py-3 text-sm border border-current/8 rounded-xl outline-none backdrop-blur-sm',
                        'focus:border-current/25 focus:bg-current/5 transition-all placeholder:opacity-35',
                        theme.fontBody,
                      )}
                      style={{ backgroundColor: theme.input, caretColor: theme.caretColor }}
                    />
                    <input
                      type="email"
                      name="email"
                      value={fields.email}
                      onChange={handleChange}
                      placeholder="Email address"
                      className={cn(
                        'w-full px-4 py-3 text-sm border border-current/8 rounded-xl outline-none backdrop-blur-sm',
                        'focus:border-current/25 focus:bg-current/5 transition-all placeholder:opacity-35',
                        theme.fontBody,
                      )}
                      style={{ backgroundColor: theme.input, caretColor: theme.caretColor }}
                    />
                  </div>
                  <input
                    type="text"
                    name="subject"
                    value={fields.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    className={cn(
                      'w-full px-4 py-3 text-sm border border-current/8 rounded-xl outline-none backdrop-blur-sm',
                      'focus:border-current/25 focus:bg-current/5 transition-all placeholder:opacity-35',
                      theme.fontBody,
                    )}
                    style={{ backgroundColor: theme.input, caretColor: theme.caretColor }}
                  />
                  <textarea
                    name="message"
                    value={fields.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project..."
                    rows={5}
                    className={cn(
                      'w-full px-4 py-3 text-sm border border-current/8 rounded-xl outline-none backdrop-blur-sm',
                      'focus:border-current/25 focus:bg-current/5 transition-all placeholder:opacity-35 resize-none',
                      theme.fontBody,
                    )}
                    style={{ backgroundColor: theme.input, caretColor: theme.caretColor }}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className={cn(
                    'px-6 py-3 text-xs font-semibold rounded-full border border-current/15',
                    'hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 w-full @sm:w-auto text-center',
                    theme.fontBody,
                  )}
                  style={{
                    backgroundColor: theme.primary,
                    color: theme.primaryText
                  }}
                >
                  Send message ➔
                </button>
              </div>
            </form>
          </Animate>

        </div>
      </div>
    </SectionWrapper>
  )
}