'use client'

import { useState, useCallback, useRef } from 'react'

type SlugStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid'

const SLUG_REGEX = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/

function normSlug(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
}

function generateToken(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

export function usePublishModal(projectId: string, mode: 'portfolio' | 'photobook') {
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
      if (value.length > 63 || !SLUG_REGEX.test(value)) {
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
      const normalized = normSlug(value)
      setSlug(normalized)
      setSlugStatus('idle')
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => checkAvailability(normalized), 500)
    },
    [checkAvailability],
  )

  const portfolioUrl =
    mode === 'portfolio' && slug
      ? `https://${slug}.milestis.site`
      : null

  const photobookUrl =
    mode === 'photobook' && slug
      ? `https://milestis.site/${slug}?token=${accessToken}`
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
