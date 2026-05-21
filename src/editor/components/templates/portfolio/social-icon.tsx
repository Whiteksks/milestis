'use client'
/**
 * social-icon.tsx
 * Single source of truth for social platform icons used in portfolio footers.
 * Add new platforms here ” all footer files pick them up automatically.
 */

import { Mail, Globe } from 'lucide-react'

import {
  FaFacebook,
  FaInstagram,
  FaXTwitter,
  FaLinkedin,
  FaGithub,
  FaYoutube,
} from 'react-icons/fa6'

import type { SVGProps } from 'react'

// в”Ђв”Ђв”Ђ Custom SVGs for platforms not in Lucide в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ

function DribbbleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.605 4.61a8.502 8.502 0 0 1 1.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.42 25.42 0 0 0-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.686 8.686 0 0 1 12 3.475zm-3.633.803a53.896 53.896 0 0 1 3.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 0 1 4.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 0 1-2.19-5.705zM12 20.547a8.482 8.482 0 0 1-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.32 35.32 0 0 1 1.823 6.475 8.4 8.4 0 0 1-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 0 1-3.655 5.715z" />
    </svg>
  )
}

function BehanceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029H23.7zM15.87 13h4.917c-.048-1.741-1.249-2.93-2.undle-2.487-1.238-.208-2.486.896-2.869 2.487H15.87zm-6.177.557h-2.47c-1.184 0-1.79.678-1.79 1.467 0 .792.622 1.468 1.79 1.468h2.47c1.177 0 1.79-.692 1.79-1.468 0-.789-.613-1.467-1.79-1.467zm0-5.093H7.58c-1.07 0-1.667.556-1.667 1.338 0 .78.613 1.337 1.667 1.337h2.113c1.068 0 1.681-.556 1.681-1.337 0-.782-.613-1.338-1.681-1.338zM1 5h8.413c2.87 0 4.898 1.297 4.898 3.854C14.311 10.507 13.518 11.463 12.36 12c1.606.467 2.64 1.674 2.64 3.5 0 2.956-2.29 4.5-5.5 4.5H1V5z" />
    </svg>
  )
}

function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34l-.01-8.66a8.26 8.26 0 0 0 4.84 1.55V4.75a4.85 4.85 0 0 1-1.06-.06z" />
    </svg>
  )
}

// в”Ђв”Ђв”Ђ Icon map в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ

const ICON_MAP: Record<string, React.ComponentType<SVGProps<SVGSVGElement>>> = {
  facebook:  FaFacebook,
  instagram: FaInstagram,
  twitter:   FaXTwitter,
  x:         FaXTwitter,
  linkedin:  FaLinkedin,
  github:    FaGithub,
  email:     Mail,
  mail:      Mail,
  youtube:   FaYoutube,
  dribbble:  DribbbleIcon,
  behance:   BehanceIcon,
  tiktok:    TikTokIcon,
  website:   Globe,
}

// в”Ђв”Ђв”Ђ Components в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ

interface SocialIconProps {
  /** Platform slug: "instagram", "github", etc. */
  slug: string
  size?: number
  className?: string
}

/** Renders the icon for a given platform slug. Falls back to Globe. */
export function SocialIcon({ slug, size = 15, className }: SocialIconProps) {
  const Icon = ICON_MAP[slug.toLowerCase()] ?? Globe
  return <Icon width={size} height={size} className={className} />
}

interface SocialIconLinkProps {
  href: string
  slug: string
  /** Extra classes on the <a> wrapper */
  className?: string
  iconClassName?: string
  iconSize?: number
  label?: string
}

/**
 * A single social link rendered as an icon button.
 * Use this in every footer ” no need to import individual icons there.
 */
export function SocialIconLink({
  href,
  slug,
  className,
  iconClassName,
  iconSize = 15,
  label,
}: SocialIconLinkProps) {
  const resolvedHref = slug === 'email' && href && !href.startsWith('mailto:')
    ? `mailto:${href}`
    : href

  return (
    <a
      href={resolvedHref}
      target={slug === 'email' ? undefined : '_blank'}
      rel={slug === 'email' ? undefined : 'noopener noreferrer'}
      aria-label={label ?? slug}
      title={label ?? slug}
      className={className}
    >
      <SocialIcon slug={slug} size={iconSize} className={iconClassName} />
    </a>
  )
}
