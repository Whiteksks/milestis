'use client'

import { useState, useRef } from 'react'
import {
  buildPublishedProjectUrl,
  getSlugValidationError,
  normalizeSlug,
} from '@/lib/slug'
import type { SlugMode } from '@/lib/slug'
import { analyzeProject, type AnalyzeProjectResult } from '@/lib/projects/analyze-project-api'
import { getProjectConfig } from '@/lib/projects/project-type-config'

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
  // Stable token per modal instance — generated once for modes that require access tokens
  const [accessToken] = useState<string>(() =>
    getProjectConfig(mode).hasAccessToken ? generateToken() : '',
  )

  // Step 2 state
  const [quoteData, setQuoteData] = useState<AnalyzeProjectResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzeError, setAnalyzeError] = useState<string | null>(null)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
    const normalized = normalizeSlug(value)
    setSlug(normalized)
    setSlugStatus('idle')
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => checkAvailability(normalized), 500)
  }

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
  const advanceToReview = async () => {
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
  }

  const goBack = () => {
    setStep('slug')
    setQuoteData(null)
    setAnalyzeError(null)
  }

  // Reset all state — called when the modal closes
  const reset = () => {
    setStep('slug')
    setSlug('')
    setSlugStatus('idle')
    setQuoteData(null)
    setIsAnalyzing(false)
    setAnalyzeError(null)
    if (debounceRef.current) clearTimeout(debounceRef.current)
  }

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
    quoteData,
    goBack,
    reset,
    canPublish,
  }
}
