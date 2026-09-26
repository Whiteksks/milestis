import { createStore } from 'zustand/vanilla'
import { changeMenuSelection, readMenuSelection, type MenuSelection, type MenuSelectionInteraction } from './guest-selection'
import { INITIAL_GAME, pairGameReducer, type PairGame } from './mascot/game/model'

type GameAction = Parameters<typeof pairGameReducer>[1]
interface GuestSession {
  projectId?: string
  initialized: boolean
  selection: MenuSelection
  interaction: MenuSelectionInteraction | null
  game: PairGame
  initialize: (projectId?: string) => void
  changeQuantity: (dishId: string, delta: -1 | 1) => void
  remove: (dishId: string) => void
  dispatchGame: (action: GameAction) => void
}

const storageKey = (projectId: string) => `milestis:menu-selection:${projectId}`

/** One store per menu visit, never a server/module singleton. */
export function createMenuGuestSession() {
  return createStore<GuestSession>((set, get) => {
    function update(selection: MenuSelection, dishId: string, kind: 'added' | 'removed') {
      const { projectId, interaction } = get()
      set({ selection, interaction: { dishId, kind, sequence: (interaction?.sequence ?? 0) + 1 } })
      if (projectId) {
        try { window.localStorage.setItem(storageKey(projectId), JSON.stringify(selection)) } catch { /* Storage is optional. */ }
      }
    }
    return {
      initialized: false, selection: {}, interaction: null, game: INITIAL_GAME,
      initialize(projectId) {
        if (get().initialized && get().projectId === projectId) return
        let selection: MenuSelection = {}
        if (projectId) {
          try { selection = readMenuSelection(JSON.parse(window.localStorage.getItem(storageKey(projectId)) ?? '{}')) } catch { /* Storage is optional. */ }
        }
        set({ projectId, initialized: true, selection, interaction: null, game: INITIAL_GAME })
      },
      changeQuantity(dishId, delta) {
        const current = get().selection
        const next = changeMenuSelection(current, dishId, delta)
        if (next !== current) update(next, dishId, delta === 1 ? 'added' : 'removed')
      },
      remove(dishId) {
        const next = { ...get().selection }
        if (!(dishId in next)) return
        delete next[dishId]
        update(next, dishId, 'removed')
      },
      dispatchGame(action) { set((state) => ({ game: pairGameReducer(state.game, action) })) },
    }
  })
}
