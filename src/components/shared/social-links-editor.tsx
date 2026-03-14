"use client"

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import {
  Instagram, Github, Facebook, Twitter, Linkedin,
  Youtube, Globe, Link, Mail, Twitch,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

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
  if (u.startsWith('http')) return 'website'
  return 'link'
}

const SLUG_ICONS: Record<string, LucideIcon> = {
  instagram: Instagram,
  github: Github,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  twitch: Twitch,
  email: Mail,
  website: Globe,
  link: Link,
}

/** Returns the LucideIcon for a raw URL. */
export function getLinkIcon(url: string): LucideIcon {
  return SLUG_ICONS[detectSocialSlug(url)] ?? Link
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
}

export function SocialLinksEditor({
  value,
  onChange,
  placeholders,
  className,
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
        return (
          <div key={index} className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary transition-colors">
              <Icon className="size-4 text-primary transition-all" />
            </div>
            <Input
              value={link}
              onChange={(e) => updateLink(index, e.target.value)}
              onBlur={(e) => handleBlur(index, e.target.value)}
              placeholder={placeholders?.[index] ?? `Social link ${index + 1}`}
              className="rounded-xl flex-1"
            />
          </div>
        )
      })}
    </div>
  )
}
