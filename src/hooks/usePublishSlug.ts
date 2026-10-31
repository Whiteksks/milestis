'use client'

import { useEffect, useState } from 'react'
import { getSlugValidationError, isSlugBlocked, normalizeSlug, normalizeSlugInput, setStoredPublishSlug, type SlugMode } from '@/lib/slug'

export type SlugStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid' | 'reserved' | 'error'

export function usePublishSlug(projectId: string, mode: SlugMode, initialSlug = '', fixed = false) {
  // input is what the user is typing and may end with a hyphen; slug is the value that is validated, checked and published.
  const [input, setInput] = useState(initialSlug)
  const slug = normalizeSlug(input)
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<{ slug: string; projectId: string; mode: SlugMode; attempt: number; status: SlugStatus } | null>(null)
  useEffect(() => { setInput(initialSlug) }, [initialSlug])
  const localStatus: SlugStatus | null = !slug ? 'idle' : getSlugValidationError(slug) ? 'invalid' : isSlugBlocked(slug) ? 'reserved' : null
  const currentResult = result?.slug === slug && result.projectId === projectId && result.mode === mode && result.attempt === attempt
  const slugStatus: SlugStatus = localStatus ?? (fixed ? 'available' : currentResult ? result.status : 'checking')

  useEffect(() => {
    if (localStatus || fixed) return
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ slug, excludeProjectId: projectId, mode })
        const response = await fetch(`/api/projects/check-slug?${params}`, { signal: controller.signal })
        if (!response.ok) throw new Error('Availability check failed')
        const data = await response.json()
        const status: SlugStatus = data.error === 'RESERVED_SLUG' ? 'reserved' : data.error === 'INVALID_SLUG' ? 'invalid'
          : data.error || typeof data.available !== 'boolean' ? 'error' : data.available ? 'available' : 'taken'
        if (!controller.signal.aborted) setResult({ slug, projectId, mode, attempt, status })
      } catch {
        if (!controller.signal.aborted) setResult({ slug, projectId, mode, attempt, status: 'error' })
      }
    }, 500)
    return () => { clearTimeout(timer); controller.abort() }
  }, [slug, projectId, mode, localStatus, fixed, attempt])

  function handleSlugChange(value: string) {
    if (fixed) return
    const next = normalizeSlugInput(value)
    if (next === input) return
    setInput(next)
    // A trailing hyphen does not change the address, so the finished check stays valid.
    if (normalizeSlug(next) !== slug) setResult(null)
    if (next.length >= 3) setStoredPublishSlug(projectId, next)
  }
  function retryAvailability() { setResult(null); setAttempt((value) => value + 1) }
  function resetSlug(value = initialSlug) { setInput(value); retryAvailability() }
  return { slug, input, slugStatus, handleSlugChange, resetSlug, retryAvailability }
}
