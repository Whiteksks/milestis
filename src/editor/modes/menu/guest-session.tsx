'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { createMenuGuestSession } from './guest-session-store'

const GuestSessionContext = createContext<ReturnType<typeof createMenuGuestSession> | null>(null)

export function MenuGuestSessionProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createMenuGuestSession)
  return <GuestSessionContext.Provider value={store}>{children}</GuestSessionContext.Provider>
}

export function useMenuGuestSession() {
  const shared = useContext(GuestSessionContext)
  // Standalone editor panels and previews have their own isolated session.
  const [local] = useState(createMenuGuestSession)
  return shared ?? local
}
