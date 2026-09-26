'use client'

import { useSyncExternalStore } from 'react'

function subscribe(onChange: () => void) {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
  preference.addEventListener('change', onChange)
  document.addEventListener('visibilitychange', onChange)
  return () => {
    preference.removeEventListener('change', onChange)
    document.removeEventListener('visibilitychange', onChange)
  }
}

function getSnapshot() {
  return !document.hidden && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getServerSnapshot() { return false }

/** Stop movement in background tabs and react to preference changes without reloading. */
export function useMascotMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
