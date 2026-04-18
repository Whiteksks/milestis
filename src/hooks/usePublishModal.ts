'use client'

import { useState, useCallback, useRef } from 'react'
import {
  buildPublishedProjectUrl,
  getSlugValidationError,
  normalizeSlug,
} from '@/lib/slug'
import type { SlugMode } from '@/lib/slug'
import { analyzeProject, type AnalyzeProjectResult } from '@/lib/projects/analyze-project-api'

type SlugStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid' | 'reserved'
export type PublishStep = 'slug' | 'review'

function generateToken(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

export function usePublishModal(projectId: string, mode: SlugMode) {
  const [step, setStep] = useState<PublishStep>('slug')
  const [slug, setSlug] = useState('')
  const [slugStatus, setSlugStatus] = useState<SlugStatus>('idle')
  // Stable token per modal instance — generated once for photobooks
  const [accessToken] = useState<string>(() =>
    mode === 'photobook' ? generateToken() : '',
  )

  // Step 2 state
  const [quoteData, setQuoteData] = useState<AnalyzeProjectResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzeError, setAnalyzeError] = useState<string | null>(null)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const checkAvailability = useCallback(
    async (value: string) => {
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
    },
    [projectId, mode],
  )

  const handleSlugChange = useCallback(
    (value: string) => {
      const normalized = normalizeSlug(value)
      setSlug(normalized)
      setSlugStatus('idle')
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => checkAvailability(normalized), 500)
    },
    [checkAvailability],
  )

  // Step 1: ready to proceed to review
  const canProceedToReview =
    slug.length >= 3 &&
    slugStatus !== 'taken' &&
    slugStatus !== 'invalid' &&
    slugStatus !== 'reserved' &&
    slugStatus !== 'checking' &&
    !isAnalyzing

  // Transition to step 2: immediately show review pane with loading state,
  // then populate with server response. Also used for retry on error.
  const advanceToReview = useCallback(async () => {
    if (!canProceedToReview) return
    setStep('review')
    setIsAnalyzing(true)
    setAnalyzeError(null)
    setQuoteData(null)
    try {
      const result = await analyzeProject(projectId, slug)
      setQuoteData(result)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze project. Please try again.'
      setAnalyzeError(message)
    } finally {
      setIsAnalyzing(false)
    }
  }, [canProceedToReview, projectId, slug])

  const goBack = useCallback(() => {
    setStep('slug')
    setQuoteData(null)
    setAnalyzeError(null)
  }, [])

  // Reset all state — called when the modal closes
  const reset = useCallback(() => {
    setStep('slug')
    setSlug('')
    setSlugStatus('idle')
    setQuoteData(null)
    setIsAnalyzing(false)
    setAnalyzeError(null)
    if (debounceRef.current) clearTimeout(debounceRef.current)
  }, [])

  const portfolioUrl =
    mode === 'portfolio' && slug
      ? buildPublishedProjectUrl(mode, slug)
      : null

  const photobookUrl =
    mode === 'photobook' && slug
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
    quoteData,
    goBack,
    reset,
    canPublish,
  }
}
