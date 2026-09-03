'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CheckCircle2, Copy, Check, Gift, Mail } from 'lucide-react'
import { FaWhatsapp, FaTelegram } from 'react-icons/fa6'
import { Button } from '@/components/ui/button'

// ─── Publish success pane ──────────────────────────────────────────────────────
// Shown right after a first publish: the live link, share shortcuts, and a soft
// referral nudge — the moment of highest satisfaction is the best time to ask.
// Shared by both the mobile drawer and desktop dialog. Follows the same quiet
// bordered-box + rounded-xs language as ReferralModal (no per-brand colors, no
// circular icon buttons) and avoids non-wrapping flex rows that can overflow
// the dialog on narrow viewports.

export function PublishSuccessPane({
  siteUrl,
  t,
  onInviteClick,
}: {
  siteUrl: string
  t: ReturnType<typeof useTranslations>
  onInviteClick: () => void
}) {
  const [copied, setCopied] = useState(false)

  const shareMessage = t('success.shareMessage')
  const encodedLink = encodeURIComponent(siteUrl)
  const encodedMessage = encodeURIComponent(shareMessage)

  const shareChannels = [
    {
      key: 'whatsapp',
      label: t('success.shareWhatsapp'),
      icon: FaWhatsapp,
      href: `https://wa.me/?text=${encodedMessage}%20${encodedLink}`,
    },
    {
      key: 'telegram',
      label: t('success.shareTelegram'),
      icon: FaTelegram,
      href: `https://t.me/share/url?url=${encodedLink}&text=${encodedMessage}`,
    },
    {
      key: 'email',
      label: t('success.shareEmail'),
      icon: Mail,
      href: `mailto:?subject=${encodeURIComponent(t('success.emailSubject'))}&body=${encodedMessage}%20${encodedLink}`,
    },
  ]

  const handleCopy = async () => {
    if (!siteUrl) return
    try {
      await navigator.clipboard.writeText(siteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable — user can still select the text manually.
    }
  }

  return (
    <div className="space-y-5 py-2">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-12 items-center justify-center rounded-xs border border-border bg-secondary/50">
          <CheckCircle2 className="size-5 text-foreground" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">{t('success.title')}</h3>
          <p className="text-sm text-muted-foreground">{t('success.description')}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xs border border-border bg-background/50 p-2">
        <span className="min-w-0 flex-1 truncate px-2 font-mono text-xs text-muted-foreground">{siteUrl}</span>
        <Button size="sm" variant="outline" onClick={handleCopy} disabled={!siteUrl} className="shrink-0 gap-1.5 rounded-xs">
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? t('success.copied') : t('success.copy')}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {shareChannels.map(({ key, label, icon: Icon, href }) => (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className={`flex h-9 min-w-0 items-center justify-center gap-1.5 rounded-xs border px-2 text-xs font-medium transition-colors ${
              siteUrl
                ? 'border-border bg-muted text-foreground hover:bg-muted/70'
                : 'border-transparent bg-muted text-muted-foreground/40 pointer-events-none'
            }`}
          >
            <Icon className="size-3.5 shrink-0" />
            <span className="truncate">{label}</span>
          </a>
        ))}
      </div>

      <div className="space-y-2 rounded-xs border border-border bg-card p-3.5 text-left">
        <div className="flex items-center gap-2">
          <Gift className="size-3.5 shrink-0 text-muted-foreground" />
          <p className="text-xs font-semibold text-foreground">{t('success.referralTitle')}</p>
        </div>
        <p className="text-[11px] leading-relaxed text-muted-foreground">{t('success.referralDescription')}</p>
        <Button size="sm" variant="outline" onClick={onInviteClick} className="w-full gap-1.5 rounded-xs">
          <Gift className="size-3.5" />
          {t('success.referralCta')}
        </Button>
      </div>
    </div>
  )
}
