"use client"

import { QueryClientProvider, type QueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { makeQueryClient } from '@/lib/firebase'

export function Providers({ children }: { children: React.ReactNode }) {
  const clientRef = useRef<QueryClient | null>(null)
  if (!clientRef.current) {
    clientRef.current = makeQueryClient()
  }

  return (
    <QueryClientProvider client={clientRef.current}>
      {children}
    </QueryClientProvider>
  )
}
