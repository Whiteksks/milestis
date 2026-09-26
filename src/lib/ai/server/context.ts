import 'server-only'
import { AsyncLocalStorage } from 'node:async_hooks'

export const aiRequestContext = new AsyncLocalStorage<{
  signal: AbortSignal
  resolvePhoto: (id: string) => Promise<string>
}>()
