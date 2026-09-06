'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import {
  buildPublishedProjectUrl,
  getSlugValidationError,
  getStoredPublishSlug,
  normalizeSlugInput,
  setStoredPublishSlug,
} from '@/lib/slug'
import type { SlugMode } from '@/lib/slug'
import { analyzeProject, type AnalyzeProjectResult } from '@/lib/projects/analyze-project-api'
import { analyzeRepublish } from '@/lib/projects/analyze-republish-api'
import { getProjectConfig } from '@/lib/projects/project-type-config'

type SlugStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid' | 'reserved'
export type PublishStep = 'slug' | 'review' | 'success'

function generateToken(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

export function usePublishModal(projectId: string, mode: SlugMode, options?: { initialSlug?: string; initialAccessToken?: string; ratePerDollar?: number; republishMode?: boolean }) {
  // Remembered slug takes priority over any project-name-derived guess, and — unlike the
  // afterTopup URL echo, which only arrives via an effect after the first render — is
  // available synchronously here, so the very first render already shows the right value.
  const initialSlug = options?.initialSlug ?? getStoredPublishSlug(projectId) ?? ''
  const ratePerDollar = options?.ratePerDollar ?? 1
  const republishMode = options?.republishMode ?? false
  const [step, setStep] = useState<PublishStep>('slug')
  const [slug, setSlug] = useState(initialSlug)
  const [slugStatus, setSlugStatus] = useState<SlugStatus>(() =>
    initialSlug.length >= 3 ? 'available' : 'idle',
  )
  // Stable token per modal instance — generated once for modes that require access tokens
  const [accessToken, setAccessToken] = useState<string>(() =>
    getProjectConfig(mode).hasAccessToken ? options?.initialAccessToken ?? generateToken() : '',
  )

  // Step 2 state
  const [quoteData, setQuoteData] = useState<AnalyzeProjectResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzeError, setAnalyzeError] = useState<string | null>(null)
  const [analyzeErrorCode, setAnalyzeErrorCode] = useState<string | null>(null)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!options?.initialSlug) return
    setSlug(options.initialSlug)
    setSlugStatus(options.initialSlug.length >= 3 ? 'available' : 'idle')
  }, [options?.initialSlug])

  useEffect(() => {
    if (!options?.initialAccessToken || !getProjectConfig(mode).hasAccessToken) return
    setAccessToken(options.initialAccessToken)
  }, [mode, options?.initialAccessToken])

  const checkAvailability = async (value: string) => {
    if (!value || value.length < 3) {
      setSlugStatus('idle')
      return
    }
    if (getSlugValidationError(value)) {
      setSlugStatus('invalid')
      return
    }
    // Photobooks: uniqueness is checked within the photobook namespace
    setSlugStatus('checking')
    try {
      const params = new URLSearchParams({ slug: value, excludeProjectId: projectId, mode })
      const res = await fetch(`/api/projects/check-slug?${params}`)
      if (!res.ok) {
        setSlugStatus('idle')
        return
      }
      const data = await res.json()
      if (data.error === 'RESERVED_SLUG') {
        setSlugStatus('reserved')
        return
      }
      setSlugStatus(data.available ? 'available' : 'taken')
    } catch {
      setSlugStatus('idle')
    }
  }

  const handleSlugChange = (value: string) => {
    const normalized = normalizeSlugInput(value)
    setSlug(normalized)
    setSlugStatus('idle')
    if (normalized.length >= 3) setStoredPublishSlug(projectId, normalized)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => checkAvailability(normalized), 500)
  }

  // Step 1: ready to proceed to review
  // In republishMode the slug is fixed — skip all slug validation
  const canProceedToReview =
    republishMode
      ? !isAnalyzing
      : (
          slug.length >= 3 &&
          slugStatus !== 'taken' &&
          slugStatus !== 'invalid' &&
          slugStatus !== 'reserved' &&
          slugStatus !== 'checking' &&
          !isAnalyzing
        )

  // Transition to step 2: immediately show review pane with loading state,
  // then populate with server response. Also used for retry on error.
  // Wrapped in useCallback so publish-modal can safely include it in effect deps.
  const advanceToReview = useCallback(async () => {
    if (!canProceedToReview) return
    setStep('review')
    setIsAnalyzing(true)
    setAnalyzeError(null)
    setAnalyzeErrorCode(null)
    setQuoteData(null)
    try {
      const result = republishMode
        ? await analyzeRepublish(projectId)
        : await analyzeProject(projectId, slug)
      setQuoteData(result)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze project. Please try again.'
      const code = (err as { code?: string }).code ?? null
      setAnalyzeError(message)
      setAnalyzeErrorCode(code)
    } finally {
      setIsAnalyzing(false)
    }
  }, [canProceedToReview, projectId, slug, republishMode])

  const goBack = () => {
    setStep('slug')
    setQuoteData(null)
    setAnalyzeError(null)
    setAnalyzeErrorCode(null)
  }

  // Shown after a successful publish/republish — link + share prompt.
  const showSuccess = useCallback(() => setStep('success'), [])

  // Reset all state — called when the modal closes
  const reset = () => {
    setStep('slug')
    setSlug(initialSlug)
    setSlugStatus(initialSlug.length >= 3 ? 'available' : 'idle')
    setQuoteData(null)
    setIsAnalyzing(false)
    setAnalyzeError(null)
    setAnalyzeErrorCode(null)
    setAccessToken(getProjectConfig(mode).hasAccessToken ? generateToken() : '')
    if (debounceRef.current) clearTimeout(debounceRef.current)
  }

  // ── Pay & Publish flow ────────────────────────────────────────────────────
  const [isBuyingCredits, setIsBuyingCredits] = useState(false)
  const [buyCreditsError, setBuyCreditsError] = useState<string | null>(null)

  const initiateBuyAndPublish = useCallback(async () => {
    if (!quoteData) return
    const deficit = quoteData.creditCost - quoteData.userBalance
    if (deficit <= 0) return

    // Enforce minimum $10 purchase so amounts are always above Polar/Stripe floor.
    // ratePerDollar comes from the user's subscription tier (passed in from publish-modal).
    const MIN_TOPUP_DOLLARS = 10
    const minCredits = Math.ceil(MIN_TOPUP_DOLLARS * ratePerDollar)
    const toTopup = Math.max(deficit, minCredits)

    const returnParams = new URLSearchParams({ afterTopup: '1', slug })
    if (accessToken) returnParams.set('accessToken', accessToken)
    const returnTo = `/design/${projectId}/edit?${returnParams.toString()}`

    setIsBuyingCredits(true)
    setBuyCreditsError(null)
    try {
      const res = await fetch('/api/billing/buy-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ credits: toTopup, returnTo }),
      })
      if (!res.ok) {
        setBuyCreditsError('topupFailed')
        return
      }
      const data = await res.json() as { checkoutUrl?: string }
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        setBuyCreditsError('topupFailed')
      }
    } catch {
      setBuyCreditsError('topupFailed')
    } finally {
      setIsBuyingCredits(false)
    }
  }, [quoteData, projectId, slug, accessToken, ratePerDollar])

  const portfolioUrl =
    !getProjectConfig(mode).hasAccessToken && slug
      ? buildPublishedProjectUrl(mode, slug)
      : null

  const photobookUrl =
    getProjectConfig(mode).hasAccessToken && slug
      ? buildPublishedProjectUrl(mode, slug, accessToken)
      : null

  // Step 2: ready to publish — requires a valid quote with sufficient balance
  const canPublish =
    step === 'review' &&
    quoteData !== null &&
    !isAnalyzing &&
    quoteData.userBalance >= quoteData.creditCost

  return {
    step,
    slug,
    handleSlugChange,
    slugStatus,
    accessToken,
    portfolioUrl,
    photobookUrl,
    canProceedToReview,
    advanceToReview,
    isAnalyzing,
    analyzeError,
    analyzeErrorCode,
    quoteData,
    goBack,
    reset,
    canPublish,
    isBuyingCredits,
    buyCreditsError,
    initiateBuyAndPublish,
    showSuccess,
  }
}
