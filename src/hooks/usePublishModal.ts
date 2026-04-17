'use client'

import { useState, useCallback, useRef } from 'react'
import {
  buildPublishedProjectUrl,
  getSlugValidationError,
  normalizeSlug,
} from '@/lib/slug'
import type { SlugMode } from '@/lib/slug'

type SlugStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid'

function generateToken(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

export function usePublishModal(projectId: string, mode: SlugMode) {
  const [slug, setSlug] = useState('')
  const [slugStatus, setSlugStatus] = useState<SlugStatus>('idle')
  // Stable token per modal instance — generated once for photobooks
  const [accessToken] = useState<string>(() =>
    mode === 'photobook' ? generateToken() : '',
  )
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
        const data = await res.json()
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

  const portfolioUrl =
    mode === 'portfolio' && slug
      ? buildPublishedProjectUrl(mode, slug)
      : null

  const photobookUrl =
    mode === 'photobook' && slug
      ? buildPublishedProjectUrl(mode, slug, accessToken)
      : null

  // Client-side check is UX feedback only — server always validates uniqueness.
  // Block only on explicit 'taken' or 'invalid' statuses.
  const canPublish =
    slug.length >= 3 &&
    slugStatus !== 'taken' &&
    slugStatus !== 'invalid' &&
    slugStatus !== 'checking'

  return {
    slug,
    handleSlugChange,
    slugStatus,
    accessToken,
    portfolioUrl,
    photobookUrl,
    canPublish,
  }
}
