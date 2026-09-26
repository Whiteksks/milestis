import { useContentStore } from '@/editor/lib/store/content'
import { useThemeStore } from '@/editor/lib/store/theme'
import { useUiStore } from '@/editor/lib/store/ui'

/** Invalidated immediately by navigation, manual edits, cancellation or the deadline. */
export function createAiOperation(projectId: string, signal?: AbortSignal, timeoutMs = 120_000) {
  const controller = new AbortController()
  let active = true
  let applying = false
  let reason = new Error('AI_CANCELLED')
  let reject!: (error: Error) => void
  const interrupted = new Promise<never>((_, fail) => { reject = fail })
  // A caller may be doing synchronous preparation before it starts awaiting this promise.
  void interrupted.catch(() => undefined)
  const invalidate = (message: string) => {
    if (!active) return
    active = false
    reason = new Error(message)
    controller.abort(reason)
    reject(reason)
  }
  const changed = () => { if (!applying) invalidate('AI_PROJECT_CHANGED') }
  const unsubscribers = [useContentStore.subscribe(changed), useThemeStore.subscribe(changed),
    useUiStore.subscribe((state, previous) => {
      if (state.projectId !== previous.projectId || state.editorMode !== previous.editorMode) invalidate('AI_PROJECT_CHANGED')
    })]
  const cancel = () => invalidate('AI_CANCELLED')
  signal?.addEventListener('abort', cancel, { once: true })
  const timer = setTimeout(() => invalidate('AI_TIMEOUT'), timeoutMs)
  if (signal?.aborted) cancel()
  if (useUiStore.getState().projectId !== projectId) invalidate('AI_PROJECT_CHANGED')
  const check = () => { if (!active) throw reason }
  return {
    signal: controller.signal,
    interrupted,
    isCurrent: () => active,
    check,
    apply(action: () => void) {
      check()
      const content = useContentStore.getState()
      const theme = useThemeStore.getState()
      applying = true
      try { action() } catch (error) {
        // A malformed response must not leave a half-applied synchronous commit.
        useContentStore.setState(content, true)
        useThemeStore.setState(theme, true)
        throw error
      } finally { applying = false }
    },
    dispose() {
      active = false
      controller.abort()
      clearTimeout(timer)
      signal?.removeEventListener('abort', cancel)
      unsubscribers.forEach((unsubscribe) => unsubscribe())
    },
  }
}
