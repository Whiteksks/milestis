'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Coins, AlertTriangle, ImageIcon } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import type { AnalyzeProjectResult } from '@/lib/projects/analyze-project-api'
import type { usePublishModal } from '@/hooks/usePublishModal'

// ─── Review pane (step 2) ─────────────────────────────────────────────────────

export function ReviewPane({
  data,
  termsAccepted,
  onTermsChange,
  republishMode,
}: {
  data: ReturnType<typeof usePublishModal>
  termsAccepted: boolean
  onTermsChange: (v: boolean) => void
  republishMode?: boolean
}) {
  const { isAnalyzing, analyzeError, quoteData } = data

  if (isAnalyzing) return <ReviewSkeleton />
  if (analyzeError) return <ReviewError message={analyzeError} />
  if (!quoteData) return null

  return (
    <ReviewContent
      quoteData={quoteData}
      buyCreditsError={data.buyCreditsError}
      termsAccepted={termsAccepted}
      onTermsChange={onTermsChange}
      republishMode={republishMode}
    />
  )
}

// ─── Review content ───────────────────────────────────────────────────────────

function ReviewContent({
  quoteData,
  buyCreditsError,
  termsAccepted,
  onTermsChange,
  republishMode,
}: {
  quoteData: AnalyzeProjectResult
  buyCreditsError: string | null
  termsAccepted: boolean
  onTermsChange: (v: boolean) => void
  republishMode?: boolean
}) {
  const insufficient = quoteData.userBalance < quoteData.creditCost
  const isFreeRepublish = republishMode && quoteData.creditCost === 0
  const t = useTranslations('editor.modal.publish')

  // Cast to access republish-only fields
  const rq = quoteData as AnalyzeProjectResult & { previousCreditCost?: number; newCreditCost?: number }

  return (
    <div className="space-y-3 py-2">
      {/* Summary rows */}
      <div className="rounded-2xl border border-border/50 overflow-hidden">
        <ReviewRow label={t('review.project')} value={quoteData.projectName} />
        <ReviewRow label={t('review.address')} value={quoteData.domain} mono />
        <ReviewRow
          label={t('review.photos')}
          value={
            quoteData.photoCount === 0
              ? t('review.noPhotos')
              : t('review.uniquePhotos', { count: quoteData.photoCount })
          }
          icon={<ImageIcon className="size-3 text-muted-foreground/60" />}
        />
      </div>

      {/* Cost + balance */}
      {isFreeRepublish ? (
        <div className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 border border-emerald-500/20 bg-emerald-500/5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <Coins className="size-3.5 shrink-0" />
          <span>{t('review.freeRepublish')}</span>
        </div>
      ) : (
        <div
          className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 border text-xs font-medium ${
            insufficient ? 'border-destructive/30 bg-destructive/5' : 'border-border/50 bg-muted/30'
          }`}
        >
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Coins className="size-3.5" />
            {t('review.cost')}
          </span>
          <div className="flex items-center gap-2">
            {insufficient && <AlertTriangle className="size-3 text-destructive" />}
            <span className={insufficient ? 'text-destructive' : 'text-foreground'}>
              {quoteData.creditCost} {t('review.credits')}
              <span className="text-muted-foreground/60 ml-1.5 font-normal">
                ({t('review.balance', { balance: quoteData.userBalance })})
              </span>
            </span>
          </div>
        </div>
      )}

      {/* Notes */}
      {!insufficient && !isFreeRepublish && republishMode && rq.previousCreditCost !== undefined && rq.newCreditCost !== undefined && (
        <p className="text-[11px] text-muted-foreground/50 px-1">
          {t('review.deltaNote', {
            delta: quoteData.creditCost,
            prev: rq.previousCreditCost,
            new: rq.newCreditCost,
          })}
        </p>
      )}
      {!insufficient && !republishMode && (
        <p className="text-[11px] text-muted-foreground/50 px-1">
          {t('review.oneTimeNote')}
        </p>
      )}

      {insufficient && (
        <div className="space-y-1 px-1">
          <p className="text-xs text-destructive">{t('review.insufficient')}</p>
          {buyCreditsError && (
            <p className="text-xs text-destructive">{t('review.topupFailed')}</p>
          )}
        </div>
      )}

      {/* Terms consent — not shown for free republish */}
      {!isFreeRepublish && (
        <label
          htmlFor="publish-consent"
          className="flex items-start gap-3 p-4 rounded-2xl bg-primary/[0.02] border border-primary/5 shadow-inner cursor-pointer hover:bg-primary/[0.04] transition-colors"
        >
          <Checkbox
            id="publish-consent"
            checked={termsAccepted}
            onCheckedChange={(v) => onTermsChange(v === true)}
            className="mt-0.5 shrink-0"
          />
          <span className="text-[11px] leading-relaxed text-muted-foreground/80 font-medium pt-0.5">
            {t('review.terms')}{' '}
            <Link
              href="/policies/refund-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground/80 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {t('review.termsLink')}
            </Link>
            {' '}{t('review.termsAnd')}{' '}
            <Link
              href="/policies/acceptable-use-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground/80 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {t('review.aupLink')}
            </Link>
          </span>
        </label>
      )}
    </div>
  )
}
// ─── Row ──────────────────────────────────────────────────────────────────────

function ReviewRow({
  label,
  value,
  mono,
  icon,
}: {
  label: string
  value: string
  mono?: boolean
  icon?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border/40 last:border-b-0">
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
        {icon}
        {label}
      </span>
      <span
        className={`text-xs font-medium text-foreground truncate max-w-[55%] text-right ${mono ? 'font-mono' : ''}`}
      >
        {value}
      </span>
    </div>
  )
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function ReviewSkeleton() {
  return (
    <div className="space-y-3 py-2 animate-pulse">
      <div className="rounded-2xl border border-border/50 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-3.5 py-3 border-b border-border/40 last:border-b-0"
          >
            <div className="h-3 w-12 rounded bg-muted/70" />
            <div className={`h-3 rounded bg-muted/70 ${i === 1 ? 'w-40' : 'w-24'}`} />
          </div>
        ))}
      </div>
      <div className="h-10 rounded-xl bg-muted/40" />
      <div className="h-16 rounded-2xl bg-muted/20" />
    </div>
  )
}

// ─── Error state ──────────────────────────────────────────────────────────────

function ReviewError({ message }: { message: string }) {
  const t = useTranslations('editor.modal.publish')
  return (
    <div className="py-8 flex flex-col items-center gap-3 text-center">
      <div className="p-2.5 rounded-xl bg-destructive/10">
        <AlertTriangle className="size-5 text-destructive" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{t('review.analysisFailed')}</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">{message}</p>
      </div>
    </div>
  )
}
