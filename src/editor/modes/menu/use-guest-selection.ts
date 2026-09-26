'use client'

import { useEffect } from 'react'
import { useStore } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { useMenuGuestSession } from './guest-session'

export function useGuestSelection(projectId?: string) {
  const store = useMenuGuestSession()
  useEffect(() => { store.getState().initialize(projectId) }, [store, projectId])
  return useStore(store, useShallow((state) => ({
    selection: state.selection,
    interaction: state.interaction,
    changeQuantity: state.changeQuantity,
    remove: state.remove,
  })))
}
