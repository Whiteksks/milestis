"use client"

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { 
  FaInstagram, 
  FaGithub, 
  FaFacebook, 
  FaXTwitter,
  FaYoutube, 
  FaGlobe, 
  FaLink, 
  FaEnvelope, 
  FaTwitch, 
  FaLinkedin,
  FaPixiv,
} from "react-icons/fa6"
import { IconType } from 'react-icons/lib'
// ─── Slug detection ─────────────────────────────────────────────────────────

/** Derives a platform slug from a raw URL string. */
export function detectSocialSlug(url: string): string {
  if (!url) return 'link'
  const u = url.toLowerCase()
  if (u.includes('instagram.com')) return 'instagram'
  if (u.includes('github.com')) return 'github'
  if (u.includes('facebook.com') || u.includes('fb.com')) return 'facebook'
  if (u.includes('twitter.com') || u.includes('x.com')) return 'twitter'
  if (u.includes('linkedin.com')) return 'linkedin'
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube'
  if (u.includes('twitch.tv')) return 'twitch'
  if (u.includes('mailto:') || (!u.includes('/') && u.includes('@'))) return 'email'
  if (u.includes('pixiv.net')) return 'pixiv'
  if (u.startsWith('http')) return 'website'
  return 'link'
}

const SLUG_ICONS: Record<string, IconType > = {
  instagram: FaInstagram,
  github: FaGithub,
  facebook: FaFacebook,
  twitter: FaXTwitter,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
  twitch: FaTwitch,
  email: FaEnvelope,
  website: FaGlobe,
  link: FaLink,
  pixiv: FaPixiv,
}

/** Returns the LucideIcon for a raw URL. */
export function getLinkIcon(url: string): IconType  {
  return SLUG_ICONS[detectSocialSlug(url)] ?? FaLink
}

/** Normalises a pasted URL — adds https:// prefix when missing. */
export function formatSocialUrl(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (/^(https?:\/\/|\/\/|mailto:)/i.test(trimmed)) return trimmed
  if (!trimmed.includes(' ') && trimmed.includes('@') && !trimmed.includes('/'))
    return `mailto:${trimmed}`
  return `https://${trimmed}`
}

// ─── Component ───────────────────────────────────────────────────────────────

export type SocialLinksTuple = [string, string, string, string]

interface SocialLinksEditorProps {
  /** Exactly 4 raw URL strings. */
  value: SocialLinksTuple
  onChange: (links: SocialLinksTuple) => void
  placeholders?: SocialLinksTuple
  className?: string
  /** Editorial flat style: border-b only inputs, no icon backgrounds. */
  editorial?: boolean
}

export function SocialLinksEditor({
  value,
  onChange,
  placeholders,
  className,
  editorial = false,
}: SocialLinksEditorProps) {
  const updateLink = (index: number, url: string) => {
    const next = [...value] as SocialLinksTuple
    next[index] = url
    onChange(next)
  }

  const handleBlur = (index: number, url: string) => {
    if (url.trim()) updateLink(index, formatSocialUrl(url))
  }

  return (
    <div className={cn('space-y-2', className)}>
      {value.map((link, index) => {
        const Icon = getLinkIcon(link)
          if (editorial) {
            const isFilled = link.length > 0;

            return (
              <div key={index} className="group relative flex items-center gap-3 py-1">
                {/* Иконка с динамическим цветом */}
                <Icon 
                  className={cn(
                    "size-3.5 shrink-0 transition-all duration-300",
                    isFilled 
                      ? "text-foreground/70" 
                      : "text-muted-foreground/25 group-focus-within:text-muted-foreground/60"
                  )} 
                />
                
                <Input
                  value={link}
                  onChange={(e) => updateLink(index, e.target.value)}
                  onBlur={(e) => handleBlur(index, e.target.value)}
                  placeholder={placeholders?.[index] ?? `Link ${index + 1}`}
                  className={cn(
                    "flex-1 border-0 border-b border-border/30 bg-transparent rounded-none px-0 py-2 h-auto",
                    "text-sm tracking-tight shadow-none transition-all duration-300",
                    "placeholder:text-muted-foreground/20 placeholder:font-light",
                    "focus-visible:ring-0 focus-visible:border-foreground/40 focus-visible:placeholder:text-muted-foreground/40"
                  )}
                />

                {/* Опционально: микро-индикатор протокола (https://) при фокусе */}
                {!isFilled && (
                  <span className="absolute right-0 text-[10px] text-muted-foreground/10 pointer-events-none uppercase tracking-widest opacity-0 group-focus-within:opacity-100 transition-opacity">
                    URL
                  </span>
                )}
              </div>
            )
          }
        return (
         <div 
          key={index} 
          className="flex items-center gap-3 group/link transition-colors p-1 rounded-2xl border border-transparent focus-within:bg-secondary/10"
        >
          {/* Контейнер иконки: плавно меняет фон при фокусе на инпут или ховере */}
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary/60 border border-border/40 transition-colors duration-300 group-focus-within/link:bg-primary/10 group-focus-within/link:border-primary/20 group-hover/link:bg-secondary">
            <Icon className="size-4 text-muted-foreground/80 transition-colors duration-300 group-focus-within/link:text-primary group-hover/link:text-foreground" />
          </div>
          
          {/* Инпут: аккуратная граница и мягкое свечение при фокусе */}
          <Input
            value={link}
            onChange={(e) => updateLink(index, e.target.value)}
            onBlur={(e) => handleBlur(index, e.target.value)}
            placeholder={placeholders?.[index] ?? `Social link ${index + 1}`}
            className="rounded-xl h-10 flex-1 border-border/80 bg-background/50 focus-visible:ring-primary/20 focus-visible:border-primary focus-visible:bg-background transition-all duration-200"
          />
        </div>
        )
      })}
    </div>
  )
}
