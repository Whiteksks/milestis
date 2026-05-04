'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useContactForm } from '@/editor/hooks/useContactForm'

import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'
import { EditorialLabel, EditorialTitle, EditorialParagraph } from '../../../primitives/portfolio/typography'

type EditorialContactProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> 

export function EditorialContact({ theme, sectionContent }: EditorialContactProps) {
  const { fields, status, handleChange, handleSubmit } = useContactForm(sectionContent.contact.email || '')
  return (
    <SectionWrapper id="contact" themeForeground={theme.foreground}>
      <div className="@lg:px-20 @md:px-12 px-6 @lg:py-24 @md:py-20 py-14">
        <div className="max-w-7xl mx-auto">

          {/* Label row */}
          <EditorialLabel themeFont={theme.fontBody} className="mb-14">
            {sectionContent.contact.subtitle || 'Contact'}
          </EditorialLabel>

          {/* Asymmetric layout: big heading left, form right */}
          <div className="grid @lg:grid-cols-[2fr,3fr] @md:grid-cols-1 grid-cols-1 gap-16 items-start">

            {/* Left   headline */}
            <div className="space-y-6">
              <Animate direction="left" delay={0.1}>
                <EditorialTitle themeFont={theme.fontTitle} className="@lg:text-5xl @md:text-4xl text-3xl tracking-tight">
                  {sectionContent.contact.title}
                </EditorialTitle>
              </Animate>

              {sectionContent.contact.description && (
                <Animate direction="up" delay={0.2}>
                  <EditorialParagraph themeFont={theme.fontBody} themeLineHeight={theme.lineHeight} className="opacity-50">
                    {sectionContent.contact.description}
                  </EditorialParagraph>
                </Animate>
              )}

              <Animate direction="up" delay={0.3} className="pt-4 space-y-1">
                <p className={cn('text-[10px] uppercase opacity-25', theme.letterSpacing, theme.fontBody)}>
                  Direct
                </p>
                <p className={cn('text-sm opacity-60 font-light', theme.fontBody)}>
                  {sectionContent.contact.email}
                </p>
              </Animate>
            </div>

            {/* Right   minimalist underline-only form */}
            <Animate direction="up" delay={0.2} as="div">
              <form onSubmit={handleSubmit} className="space-y-0">
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
                <div className="grid @md:grid-cols-2 gap-0">
                  <div className="border-b border-current/15 py-4">
                    <input
                      type="text"
                      name="name"
                      value={fields.name}
                      onChange={handleChange}
                      placeholder="Name"
                      className={cn(
                        'w-full bg-transparent outline-none text-sm placeholder:opacity-30',
                        theme.fontBody,
                      )}
                    />
                  </div>
                  <div className="border-b border-current/15 py-4 @md:border-l border-l-0 @md:pl-6">
                    <input
                      type="email"
                      name="email"
                      value={fields.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className={cn(
                        'w-full bg-transparent outline-none text-sm placeholder:opacity-30',
                        theme.fontBody,
                      )}
                    />
                  </div>
                </div>

                <div className="border-b border-current/15 py-4">
                  <input
                    type="text"
                    name="subject"
                    value={fields.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    className={cn(
                      'w-full bg-transparent outline-none text-sm placeholder:opacity-30',
                      theme.fontBody,
                    )}
                  />
                </div>

                <div className="border-b border-current/15 py-4">
                  <textarea
                    name="message"
                    value={fields.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project"
                    className={cn(
                      'w-full bg-transparent outline-none text-sm min-h-28 resize-none placeholder:opacity-30',
                      theme.fontBody,
                    )}
                  />
                </div>

                <div className="pt-8">
                  <Button
                    type="submit"
                    variant="outline"
                    className={cn(
                      'px-8 py-2 text-[10px] uppercase tracking-[0.25em] border-current/25 hover:bg-current hover:text-current-foreground transition-all duration-300',
                      theme.letterSpacing,
                      theme.fontBody,
                    )}
                  >
                    Send Inquiry
                  </Button>
                </div>
              </form>
            </Animate>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

