'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useContactForm } from '@/editor/hooks/useContactForm'

interface EditorialContactProps
  extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function EditorialContact({ theme, sectionContent }: EditorialContactProps) {
  const { fields, status, handleChange, handleSubmit } = useContactForm(sectionContent.contact.email || '')
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
      <div className="@lg:px-20 @md:px-12 px-6 @lg:py-24 @md:py-20 py-14">
        <div className="max-w-7xl mx-auto">

          {/* Label row */}
          <div className="flex items-center gap-6 mb-14">
            <span
              className={cn(
                'text-[10px] uppercase opacity-30',
                theme.letterSpacing,
                theme.fontBody,
              )}
            >
              {sectionContent.contact.subtitle || 'Contact'}
            </span>
            <div className="flex-1 h-px bg-current opacity-10" />
          </div>

          {/* Asymmetric layout: big heading left, form right */}
          <div className="grid @lg:grid-cols-[2fr,3fr] @md:grid-cols-1 grid-cols-1 gap-16 items-start">

            {/* Left — headline */}
            <div className="space-y-6">
              <h3
                className={cn(
                  '@lg:text-5xl @md:text-4xl text-3xl font-bold uppercase leading-tight tracking-tight',
                  theme.fontTitle,
                )}
              >
                {sectionContent.contact.title}
              </h3>

              {sectionContent.contact.description && (
                <p
                  className={cn(
                    'text-sm opacity-50 font-light',
                    theme.lineHeight,
                    theme.fontBody,
                  )}
                >
                  {sectionContent.contact.description}
                </p>
              )}

              <div className="pt-4 space-y-1">
                <p className={cn('text-[10px] uppercase opacity-25', theme.letterSpacing, theme.fontBody)}>
                  Direct
                </p>
                <p className={cn('text-sm opacity-60 font-light', theme.fontBody)}>
                  {sectionContent.contact.email}
                </p>
              </div>
            </div>

            {/* Right — minimalist underline-only form */}
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
                  {status === 'sent' ? 'Message sent — check your email client.' : 'Please fill in all required fields.'}
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
          </div>
        </div>
      </div>
    </motion.section>
  )
}
