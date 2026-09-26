'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { changeMenuSelection, readMenuSelection, type MenuSelection, type MenuSelectionInteraction, type MenuSelectionReaction } from './guest-selection'

function storageKey(projectId: string) {
  return `milestis:menu-selection:${projectId}`
}

export function useGuestSelection(projectId?: string) {
  const [selection, setSelection] = useState<MenuSelection>({})
  const currentSelection = useRef<MenuSelection>({})
  const [interaction, setInteraction] = useState<MenuSelectionInteraction | null>(null)
  const interactionSequence = useRef(0)

  const reactTo = useCallback((kind: MenuSelectionReaction, dishId: string) => {
    interactionSequence.current += 1
    setInteraction({ kind, dishId, sequence: interactionSequence.current })
  }, [])

  useEffect(() => {
    if (!interaction) return
    const timeout = window.setTimeout(() => setInteraction(null), 1800)
    return () => window.clearTimeout(timeout)
  }, [interaction])

  const update = useCallback((next: MenuSelection) => {
    currentSelection.current = next
    setSelection(next)
    if (projectId) {
      try { window.localStorage.setItem(storageKey(projectId), JSON.stringify(next)) } catch { /* storage may be disabled */ }
    }
  }, [projectId])

  useEffect(() => {
    if (!projectId) return
    try {
      const stored = window.localStorage.getItem(storageKey(projectId))
      const next = stored ? readMenuSelection(JSON.parse(stored)) : {}
      currentSelection.current = next
      setSelection(next)
    } catch {
      currentSelection.current = {}
      setSelection({})
    }
  }, [projectId])

  const changeQuantity = useCallback((dishId: string, delta: -1 | 1) => {
    const next = changeMenuSelection(currentSelection.current, dishId, delta)
    if (next === currentSelection.current) return
    update(next)
    reactTo(delta === 1 ? 'added' : 'removed', dishId)
  }, [update, reactTo])

  const remove = useCallback((dishId: string) => {
    if (!(dishId in currentSelection.current)) return
    const next = { ...currentSelection.current }
    delete next[dishId]
    update(next)
    reactTo('removed', dishId)
  }, [update, reactTo])

  return { selection, interaction, changeQuantity, remove }
}
