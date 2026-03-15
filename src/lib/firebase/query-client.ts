import { QueryClient } from '@tanstack/react-query'

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60_000,  // 5 min — no refetch on navigation within this window
        gcTime: 10 * 60_000,    // 10 min — cache survives unmount
        retry: 1,
      },
    },
  })
}
