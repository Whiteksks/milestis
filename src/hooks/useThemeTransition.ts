'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

const HC_KEY = 'high-contrast'

/**
 * Drop-in replacement for `useTheme()`.
 * Wraps `setTheme` with a view-transition ripple reveal so switching
 * light / dark / cozy feels smooth on all screen sizes.
 * Also manages `highContrast` preference persisted in localStorage.
 */
export function useThemeTransition() {
  const { theme, setTheme: _setTheme, resolvedTheme, themes } = useTheme()

  const [highContrast, _setHighContrast] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(HC_KEY) === 'true'
  })

  useEffect(() => {
    const stored = localStorage.getItem(HC_KEY) === 'true'
    if (stored) document.documentElement.setAttribute('data-high-contrast', 'true')
  }, [])

  function setHighContrast(value: boolean) {
    _setHighContrast(value)
    if (value) {
      localStorage.setItem(HC_KEY, 'true')
      document.documentElement.setAttribute('data-high-contrast', 'true')
    } else {
      localStorage.removeItem(HC_KEY)
      document.documentElement.removeAttribute('data-high-contrast')
    }
  }

  function setTheme(newTheme: string) {
    if (
      typeof document === 'undefined' ||
      typeof document.startViewTransition !== 'function'
    ) {
      _setTheme(newTheme)
      return
    }

    document.documentElement.setAttribute('data-theme-transition', 'true')

    const transition = document.startViewTransition(() => {
      _setTheme(newTheme)
    })

    transition.finished.finally(() => {
      document.documentElement.removeAttribute('data-theme-transition')
    })
  }

  return { theme, setTheme, resolvedTheme, themes, highContrast, setHighContrast }
}
