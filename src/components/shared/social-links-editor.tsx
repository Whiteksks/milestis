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

const SLUG_ICONS: Record<string, IconType> = {
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

/** Returns the IconType for a raw URL. */
export function getLinkIcon(url: string): IconType {
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
        const isFilled = link.length > 0

        if (editorial) {
          return (
            <div key={index} className="group relative flex items-center gap-3 py-1">
              {/* Dynamic Icon */}
              <Icon 
                className={cn(
                  "size-3.5 shrink-0 transition-colors duration-200",
                  isFilled 
                    ? "text-foreground" 
                    : "text-muted-foreground/30 group-focus-within:text-foreground/80"
                )} 
              />
              
              <Input
                value={link}
                onChange={(e) => updateLink(index, e.target.value)}
                onBlur={(e) => handleBlur(index, e.target.value)}
                placeholder={placeholders?.[index] ?? `Link ${index + 1}`}
                className={cn(
                  "flex-1 border-0 border-b border-border/40 bg-transparent rounded-none px-0 py-1.5 h-auto",
                  "font-sans text-xs tracking-tight shadow-none transition-colors duration-200",
                  "placeholder:text-muted-foreground/30",
                  "focus-visible:ring-0 focus-visible:border-foreground"
                )}
              />

              {!isFilled && (
                <span className="absolute right-0 font-mono text-[9px] text-muted-foreground/30 pointer-events-none uppercase tracking-widest opacity-0 group-focus-within:opacity-100 transition-opacity">
                  URL
                </span>
              )}
            </div>
          )
        }

        // Standard Swiss-Style (Clean & Flat, No Glow / Roundness)
        return (
          <div 
            key={index} 
            className="group/link flex items-center gap-2.5"
          >
            {/* Square Low-profile Icon Container */}
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xs border border-border bg-muted/30 transition-colors duration-200 group-focus-within/link:border-foreground/40 group-focus-within/link:bg-background">
              <Icon className="size-3.5 text-muted-foreground transition-colors duration-200 group-focus-within/link:text-foreground" />
            </div>
            
            {/* Clean Input with Subtle Focus Ring */}
            <Input
              value={link}
              onChange={(e) => updateLink(index, e.target.value)}
              onBlur={(e) => handleBlur(index, e.target.value)}
              placeholder={placeholders?.[index] ?? `Social link ${index + 1}`}
              className="h-9 flex-1 rounded-xs border-border bg-background px-3 font-sans text-xs focus-visible:ring-1 focus-visible:ring-foreground transition-colors"
            />
          </div>
        )
      })}
    </div>
  )
}