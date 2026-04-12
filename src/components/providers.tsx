"use client"

import { QueryClientProvider, type QueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { makeQueryClient } from '@/lib/firebase'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState<QueryClient>(() => makeQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
