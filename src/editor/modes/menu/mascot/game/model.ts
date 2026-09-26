export const TREATS = ['cherry', 'cookie', 'iceCream'] as const
export type Treat = typeof TREATS[number]
export interface PairGame {
  deck: Treat[]
  flipped: number[]
  matched: number[]
  moves: number
  interest: number
  turn: number
}
export const INITIAL_GAME: PairGame = { deck: [], flipped: [], matched: [], moves: 0, interest: 0, turn: 0 }

export function shuffledTreats(random = Math.random): Treat[] {
  const deck = [...TREATS, ...TREATS]
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    const treat = deck[i]
    deck[i] = deck[j]
    deck[j] = treat
  }
  return deck
}

export function isMismatch(state: PairGame) {
  return state.flipped.length === 2 && state.deck[state.flipped[0]] !== state.deck[state.flipped[1]]
}

export function pairGameReducer(state: PairGame, action:
  | { type: 'start'; deck: Treat[] }
  | { type: 'flip'; index: number }
  | { type: 'conceal'; turn: number },
): PairGame {
  if (action.type === 'start') return { ...INITIAL_GAME, deck: action.deck, interest: state.interest, turn: state.turn + 1 }
  if (action.type === 'conceal') return action.turn === state.turn && isMismatch(state) ? { ...state, flipped: [] } : state
  const index = action.index
  if (!Number.isInteger(index) || index < 0 || index >= state.deck.length || isMismatch(state) || state.matched.includes(index) || state.flipped.includes(index)) return state
  const flipped = [...state.flipped, index]
  if (flipped.length === 1) return { ...state, flipped }
  const match = state.deck[flipped[0]] === state.deck[index]
  return {
    ...state, flipped: match ? [] : flipped, moves: state.moves + 1, turn: state.turn + 1,
    matched: match ? [...state.matched, ...flipped] : state.matched,
    interest: match ? Math.min(100, state.interest + 34) : state.interest,
  }
}
