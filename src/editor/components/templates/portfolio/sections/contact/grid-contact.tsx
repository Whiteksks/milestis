'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'

interface GridContactProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function GridContact({ theme, sectionContent }: GridContactProps) {
  return (
    <motion.section
      id="contact"
      data-section-id="contact"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={cn('@container py-16', theme.foreground)}
    >
      <div className="@lg:px-8 @md:px-6 px-4">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6 items-stretch">
            
            {/* ЛЕВАЯ СТОРОНА: Инфо и Контакты */}
            <div className="flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
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
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className={cn('text-[10px] font-bold uppercase tracking-wider text-emerald-600/80', theme.fontBody)}>
                        Available for projects
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ПРАВАЯ СТОРОНА: Форма */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={cn(
                'rounded-3xl border border-current/10 p-8 @lg:p-12',
                theme.card
              )}
            >
              <form className="h-full flex flex-col">
                <div className="space-y-4 flex-1">
                  <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase ml-4 opacity-40 font-bold">Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
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
                        placeholder="hello@example.com"
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
                      placeholder="Project Inquiry"
                      className={cn(
                        'w-full px-6 py-4 bg-current/5 border border-current/5 rounded-2xl outline-none focus:border-current/20 transition-all placeholder:opacity-20',
                        theme.fontBody
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase ml-4 opacity-40 font-bold">Message</label>
                    <textarea
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
            </motion.div>

          </div>
        </div>
      </div>
    </motion.section>
  )
}