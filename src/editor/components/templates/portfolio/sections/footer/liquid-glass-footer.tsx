
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { SocialIconLink } from '@/editor/components/templates/portfolio/social-icon'
import { Animate } from '../../../primitives/animate'

type LiquidGlassFooterProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> 

export function LiquidGlassFooter({ theme, sectionContent }: LiquidGlassFooterProps) {
  const { primary, secondary, accent2 } = theme.bgEffectColors
  const socialLinks = sectionContent.footer.socialLinks ?? []

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

          {/* Left: colored dots + copyright */}
          <Animate direction="up" distance={8} className="flex items-center gap-4">
            <div className="flex gap-1.5">
              {[primary, secondary, accent2].map((c, i) => (
                <div key={i} className="w-2 h-2 rounded-full" style={{ background: c, boxShadow: `0 0 5px ${c}` }} />
              ))}
            </div>
            <p className={cn('text-[10px] uppercase tracking-[0.2em] text-white/30', theme.fontBody)}>
              В© {new Date().getFullYear()} {sectionContent.footer.copyright}
            </p>
          </Animate>

          {/* Right: social icons */}
          {socialLinks.length > 0 && (
            <Animate direction="none" delay={0.1} className="flex items-center gap-5">
              {socialLinks.map((link, i) => (
                <SocialIconLink
                  key={i}
                  href={link.href}
                  slug={link.icon}
                  iconSize={15}
                  className="text-white/30 hover:text-white/70 transition-colors duration-200"
                />
              ))}
            </Animate>
          )}
        </div>
      </div>
    </footer>
  )
}
