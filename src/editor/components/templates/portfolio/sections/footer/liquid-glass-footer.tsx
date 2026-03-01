'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'

interface LiquidGlassFooterProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function LiquidGlassFooter({ theme, sectionContent }: LiquidGlassFooterProps) {
  const { primary, secondary, accent2 } = theme.bgEffectColors

  return (
    <footer
      id="footer"
      data-section-id="footer"
      className="@container relative overflow-hidden py-10"
      style={{ background: `radial-gradient(ellipse at 50% 0%, ${primary}30 0%, transparent 60%), #090910`, borderTop: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Subtle top glow line */}
      <div
        className="absolute top-0 left-1/4 right-1/4 h-px pointer-events-none"
        style={{ background: `linear-gradient(to right, transparent, ${primary}70 30%, ${secondary}60 70%, transparent)` }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 @md:px-12 @lg:px-20">
        {/* Glass card */}
        <div
          className="relative rounded-2xl @md:rounded-3xl px-6 @md:px-10 py-7 @md:py-8 flex flex-col @md:flex-row items-center justify-between gap-6"
          style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(24px) saturate(160%)',
            WebkitBackdropFilter: 'blur(24px) saturate(160%)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.14)',
          }}
        >
          {/* Inner glare */}
          <div className="absolute inset-0 rounded-2xl @md:rounded-3xl pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)' }} />

          {/* Brand + colored dots */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <div className="flex gap-1.5">
              {[primary, secondary, accent2].map((c, i) => (
                <div key={i} className="w-2 h-2 rounded-full" style={{ background: c, boxShadow: `0 0 5px ${c}` }} />
              ))}
            </div>
            <p className={cn('text-sm font-bold uppercase tracking-[0.35em] text-white/70', theme.fontTitle)}>
              {sectionContent.header.title}
            </p>
          </motion.div>

          {/* Nav links */}
          {(sectionContent.header.links ?? []).length > 0 && (
            <nav className="flex flex-wrap justify-center gap-6">
              {(sectionContent.header.links ?? []).map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className={cn(
                    'text-[10px] uppercase tracking-[0.2em] text-white/30 hover:text-white/70 transition-colors',
                    theme.fontBody,
                  )}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {/* Copyright */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={cn('text-[10px] uppercase tracking-[0.15em] text-white/20', theme.fontBody)}
          >
            © {new Date().getFullYear()}
          </motion.p>
        </div>
      </div>
    </footer>
  )
}
