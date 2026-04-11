
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'       
import { cn } from '@/lib/utils'
import { useContactForm } from '@/editor/hooks/useContactForm'
import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'

type GridContactProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> 

export function GridContact({ theme, sectionContent }: GridContactProps) {      
  const { fields, status, handleChange, handleSubmit } = useContactForm(sectionContent.contact.email || '')
  return (
    <SectionWrapper
      id="contact"
      themeForeground={theme.foreground}
      padded={false}
      className="@container py-16"
    >
        <div className="max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6 items-stretch">
            
            {/* Р›Р•Р’РђРЇ РЎРўРћР РћРќРђ: РРЅС„Рѕ Рё РљРѕРЅС‚Р°РєС‚С‹ */}
            <div className="flex flex-col gap-6">
              <Animate
                direction="up"
                distance={20}
                className={cn(
                  'flex-1 rounded-3xl border border-current/10 p-8 @lg:p-12 flex flex-col justify-between',
                  theme.card
                )}
              >
                <div>
                  <span className={cn('text-[10px] uppercase tracking-[0.2em] opacity-40', theme.fontBody)}>
                    {sectionContent.contact.subtitle || 'Get in touch'}
                  </span>
                  <h2 className={cn('mt-4 @lg:text-5xl text-3xl font-bold leading-tight', theme.fontTitle)}>
                    {sectionContent.contact.title}
                  </h2>
                  {sectionContent.contact.description && (
                    <p className={cn('mt-6 text-sm opacity-60 leading-relaxed max-w-md', theme.fontBody)}>
                      {sectionContent.contact.description}
                    </p>
                  )}
                </div>

                <div className="mt-12 space-y-6">
                  <div>
                    <p className={cn('text-[10px] uppercase tracking-widest opacity-30 mb-2', theme.fontBody)}>Email</p>
                    <a 
                      href={`mailto:${sectionContent.contact.email}`}
                      className={cn('text-xl @lg:text-2xl font-medium hover:opacity-70 transition-opacity', theme.fontBody)}
                    >
                      {sectionContent.contact.email}
                    </a>
                  </div>
                  

                </div>
              </Animate>
            </div>

            {/* РџР РђР’РђРЇ РЎРўРћР РћРќРђ: Р¤РѕСЂРјР° */}
            <Animate
              direction="up"
              distance={20}
              delay={0.1}
              className={cn(
                'rounded-3xl border border-current/10 p-8 @lg:p-12',
                theme.card
              )}
            >
              <form onSubmit={handleSubmit} className="h-full flex flex-col">
                {status !== 'idle' && (
                  <Animate
                    direction="up"
                    distance={8}
                    scaleOffset={0.97}
                    className={cn(
                      'mb-4 px-4 py-2.5 rounded-xl text-[11px] border',
                      status === 'sent'
                        ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-600'
                        : 'border-red-500/25 bg-red-500/10 text-red-500',       
                      theme.fontBody,
                    )}
                  >
                    {status === 'sent' ? 'Message sent вЂ” check your email client.' : 'Please fill in all required fields.'}
                  </Animate>
                )}
                <div className="space-y-4 flex-1">
                  <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase ml-4 opacity-40 font-bold">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={fields.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className={cn(
                          'w-full px-6 py-4 bg-current/5 border border-current/5 rounded-2xl outline-none focus:border-current/20 transition-all placeholder:opacity-20',
                          theme.fontBody
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase ml-4 opacity-40 font-bold">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={fields.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className={cn(
                          'w-full px-6 py-4 bg-current/5 border border-current/5 rounded-2xl outline-none focus:border-current/20 transition-all placeholder:opacity-20',
                          theme.fontBody
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase ml-4 opacity-40 font-bold">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={fields.subject}
                      onChange={handleChange}
                      placeholder="Subject"
                      className={cn(
                        'w-full px-6 py-4 bg-current/5 border border-current/5 rounded-2xl outline-none focus:border-current/20 transition-all placeholder:opacity-20',
                        theme.fontBody
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase ml-4 opacity-40 font-bold">Message</label>
                    <textarea
                      name="message"
                      value={fields.message}
                      onChange={handleChange}
                      placeholder="Tell me more..."
                      rows={5}
                      className={cn(
                        'w-full px-6 py-4 bg-current/5 border border-current/5 rounded-2xl outline-none focus:border-current/20 transition-all placeholder:opacity-20 resize-none',
                        theme.fontBody
                      )}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={cn(
                    'mt-8 w-full py-5 text-sm font-bold rounded-2xl hover:opacity-90 transition-all active:scale-[0.98]',
                    theme.fontBody,
                    theme.primary,
                    theme.primaryText
                  )}
                >
                  Send Message
                </button>
              </form>
            </Animate>

          </div>
        </div>
    </SectionWrapper>
  )
}