'use client'

import { useState, type ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { CheckCircle2, Copy, Check, Gift, Mail } from 'lucide-react'
import { FaWhatsapp, FaTelegram } from 'react-icons/fa6'
import { Button } from '@/components/ui/button'

// ─── Publish success pane ──────────────────────────────────────────────────────
// Shown right after a first publish: live link with copy, sharing shortcuts,
// and referral nudge. Formatted according to Milestis design system:
// quiet cards, serif title, mono metadata, olive secondary highlights.
// Strictly prevents horizontal overflow on any viewport.

export function PublishSuccessPane({
  siteUrl,
  t: customT,
  onInviteClick,
  title,
  description,
  shareMessage: customShareMessage,
  children,
}: {
  siteUrl: string
  t?: ReturnType<typeof useTranslations<'editor.modal.publish'>>
  onInviteClick?: () => void
  title?: string
  description?: string
  shareMessage?: string
  children?: ReactNode
}) {
  const defaultT = useTranslations('editor.modal.publish')
  const t = customT ?? defaultT
  const [copied, setCopied] = useState(false)

  const shareMessage = customShareMessage ?? t('success.shareMessage')
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
    <div className="w-full min-w-0 max-w-full overflow-hidden space-y-4 sm:space-y-5 py-1">
      {/* Header */}
      <div className="flex flex-col items-center gap-2.5 text-center">
        <div className="flex size-11 items-center justify-center rounded-full border border-border/40 bg-secondary/60 text-secondary-foreground shadow-2xs">
          <CheckCircle2 className="size-5" />
        </div>
        <div className="space-y-1">
          <h3 className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-foreground">
            {title ?? t('success.title')}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xs sm:max-w-sm mx-auto leading-relaxed">
            {description ?? t('success.description')}
          </p>
        </div>
      </div>

      {/* URL copy row */}
      <div className="w-full min-w-0 flex items-center gap-2 rounded-xl border border-border/60 bg-muted/20 p-1.5 pl-3 transition-colors focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 shadow-2xs">
        <span className="min-w-0 flex-1 truncate font-mono text-xs text-foreground/85 select-all tracking-tight">
          {siteUrl}
        </span>
        <Button
          size="sm"
          variant={copied ? 'default' : 'secondary'}
          onClick={handleCopy}
          disabled={!siteUrl}
          className="shrink-0 gap-1.5 rounded-lg h-8 px-3 text-xs font-medium transition-all"
        >
          {copied ? <Check className="size-3.5 text-emerald-300" /> : <Copy className="size-3.5" />}
          <span>{copied ? t('success.copied') : t('success.copy')}</span>
        </Button>
      </div>

      {/* Social share shortcuts */}
      <div className="grid grid-cols-3 gap-2 w-full min-w-0">
        {shareChannels.map(({ key, label, icon: Icon, href }) => (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className={`flex h-9 min-w-0 items-center justify-center gap-1.5 rounded-lg border px-2 text-xs font-medium transition-all shadow-2xs ${
              siteUrl
                ? 'border-border/50 bg-card hover:bg-muted/60 hover:border-border text-foreground'
                : 'border-transparent bg-muted/40 text-muted-foreground/40 pointer-events-none'
            }`}
          >
            <Icon className="size-3.5 shrink-0" />
            <span className="truncate text-[11px] sm:text-xs">{label}</span>
          </a>
        ))}
      </div>

      {/* Referral card */}
      {children}
      {onInviteClick && <div className="w-full min-w-0 space-y-2.5 rounded-2xl border border-border/50 bg-card p-3.5 sm:p-4 text-left shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary shrink-0">
            <Gift className="size-3.5" />
          </div>
          <p className="text-xs font-semibold text-foreground">{t('success.referralTitle')}</p>
        </div>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          {t('success.referralDescription')}
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={onInviteClick}
          className="w-full gap-1.5 rounded-lg text-xs h-8.5 font-medium border-border/60 hover:bg-muted/40"
        >
          <Gift className="size-3.5 text-primary" />
          {t('success.referralCta')}
        </Button>
      </div>}
    </div>
  )
}
