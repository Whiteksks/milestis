'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { useContactForm } from '@/editor/hooks/useContactForm'

interface LiquidGlassContactProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function LiquidGlassContact({ theme, sectionContent }: LiquidGlassContactProps) {
  const { primary, secondary, accent2 } = theme.bgEffectColors
  const { fields, status, handleChange, handleSubmit } = useContactForm(sectionContent.contact.email || '')

  return (
    <section
      id="contact"
      data-section-id="contact"
      className="@container relative overflow-hidden py-24 @md:py-32"
      style={{ background: `radial-gradient(ellipse at 30% 60%, ${primary}40 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, ${secondary}38 0%, transparent 50%), radial-gradient(ellipse at 60% 90%, ${accent2}28 0%, transparent 50%), #090910` }}
    >
      {/* Blobs */}
      <motion.div
        animate={{ x: [0, 35, 0], y: [0, -25, 0] }}
        transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
        className="absolute rounded-full pointer-events-none"
        style={{ width: 380, height: 380, top: '-5%', left: '-8%', background: `radial-gradient(circle, ${accent2}40 0%, transparent 70%)`, filter: 'blur(70px)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 @md:px-12 @lg:px-20">
        {/* Label pill */}
        <div className="flex items-center gap-4 mb-12">
          <div
            className="px-3 py-1.5 rounded-full border border-white/15 text-[10px] uppercase tracking-[0.28em] text-white/50"
            style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
          >
            {sectionContent.contact.subtitle || 'Contact'}
          </div>
        </div>

        {/* Main glass panel */}
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(36px) saturate(180%) brightness(1.06)',
            WebkitBackdropFilter: 'blur(36px) saturate(180%) brightness(1.06)',
            border: '1px solid rgba(255,255,255,0.14)',
            boxShadow: '0 24px 70px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.24), inset 0 -1px 0 rgba(0,0,0,0.08)',
          }}
        >
          {/* Glare */}
          <div className="absolute inset-0 pointer-events-none rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 55%)' }} />
          <div className="absolute top-0 left-8 right-8 h-px pointer-events-none" style={{ background: `linear-gradient(to right, transparent, ${primary}85, ${secondary}70, transparent)` }} />

          <div className="relative grid grid-cols-1 @lg:grid-cols-2 gap-0">
            {/* Left — headline */}
            <div className="p-8 @md:p-12 @lg:p-14 flex flex-col justify-center gap-6 @lg:border-r border-r-0 border-b @lg:border-b-0 border-white/8">
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
                className={cn(
                  'font-black uppercase leading-[0.88] tracking-tighter text-white',
                  '@lg:text-5xl @md:text-4xl text-3xl',
                  theme.fontTitle,
                )}
                style={{ textShadow: '0 2px 20px rgba(0,0,0,0.35)' }}
              >
                {sectionContent.contact.title}
              </motion.h2>

              {sectionContent.contact.description && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.08 }}
                  className={cn('max-w-sm text-sm text-white/48 font-light leading-relaxed', theme.lineHeight, theme.fontBody)}
                >
                  {sectionContent.contact.description}
                </motion.p>
              )}

              {sectionContent.contact.email && (
                <a
                  href={`mailto:${sectionContent.contact.email}`}
                  className={cn('group inline-flex items-start gap-2 text-sm text-white/55 hover:text-white transition-colors break-all', theme.fontBody)}
                >
                  <span className="border-b border-white/20 group-hover:border-white/60 transition-colors pb-0.5 break-all">
                    {sectionContent.contact.email}
                  </span>
                  <ArrowUpRight size={14} className="shrink-0 mt-0.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              )}

              {/* Decorative colored dots */}
              <div className="flex gap-2 pt-2">
                {[primary, secondary, accent2].map((c, i) => (
                  <div
                    key={i}
                    className="w-8 h-1 rounded-full"
                    style={{ background: c, opacity: 0.7, boxShadow: `0 0 8px ${c}` }}
                  />
                ))}
              </div>
            </div>

            {/* Right — form */}
            <form onSubmit={handleSubmit} className="p-8 @md:p-12 @lg:p-14 space-y-0">
              {status !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    'mb-4 px-4 py-2.5 rounded-xl text-[11px] border',
                    status === 'sent'
                      ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-400'
                      : 'border-red-400/25 bg-red-400/10 text-red-400',
                    theme.fontBody,
                  )}
                >
                  {status === 'sent' ? 'Message sent — check your email client.' : 'Please fill in all required fields.'}
                </motion.div>
              )}
              {/* Name + Email */}
              <div className="grid @sm:grid-cols-2 gap-0">
                <div className="py-5 border-b border-white/10 @sm:pr-6">
                  <label className={cn('block text-[9px] uppercase tracking-widest text-white/30 mb-2', theme.fontBody)}>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={fields.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={cn('w-full bg-transparent outline-none text-sm text-white placeholder:text-white/20', theme.fontBody)}
                  />
                </div>
                <div className="py-5 border-b border-white/10 @sm:pl-6 @sm:border-l border-l-0">
                  <label className={cn('block text-[9px] uppercase tracking-widest text-white/30 mb-2', theme.fontBody)}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={fields.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={cn('w-full bg-transparent outline-none text-sm text-white placeholder:text-white/20', theme.fontBody)}
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="py-5 border-b border-white/10">
                <label className={cn('block text-[9px] uppercase tracking-widest text-white/30 mb-2', theme.fontBody)}>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={fields.subject}
                  onChange={handleChange}
                  placeholder="Project inquiry"
                  className={cn('w-full bg-transparent outline-none text-sm text-white placeholder:text-white/20', theme.fontBody)}
                />
              </div>

              {/* Message */}
              <div className="py-5 border-b border-white/10">
                <label className={cn('block text-[9px] uppercase tracking-widest text-white/30 mb-2', theme.fontBody)}>Message</label>
                <textarea
                  name="message"
                  value={fields.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project…"
                  rows={4}
                  className={cn('w-full bg-transparent outline-none text-sm text-white resize-none placeholder:text-white/20', theme.fontBody)}
                />
              </div>

              {/* Submit — glass button */}
              <div className="pt-7">
                <button
                  type="submit"
                  className="group relative inline-flex items-center gap-3 px-7 py-3 rounded-full border border-white/20 text-[11px] uppercase tracking-[0.22em] text-white/75 hover:text-white transition-all duration-300 overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
                  }}
                >
                  {/* Hover fill */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(135deg, ${primary}50, ${secondary}40)` }}
                  />
                  <span className="relative">Send Message</span>
                  <ArrowUpRight size={13} className="relative group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
