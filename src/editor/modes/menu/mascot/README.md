# Menu mascots and game

The characters `bun`, `mochi` and `pepper` react to the dishes a guest picks and to the game. Only `enabled`, `characterId` and `animations` from `MenuContent.mascot` are saved. The contract and validation are in `functions/src/domain/menu/mascot.ts`.

| Module | Responsibility |
| --- | --- |
| `characters/` | SVG components, animations and static poses |
| `registry.ts` | Components and translation keys |
| `behavior.ts` | Events, moods, durations and transitions |
| `use-mascot.ts` | Shared reaction controller |
| `mascot.tsx` | Character and speech bubble |
| `use-mascot-motion.ts` | Reduced motion; pauses in hidden tabs |
| `settings-panel.tsx` | Settings and an isolated demo |
| `game/model.ts`, `game/pair-game.tsx` | Memory game rules and UI |

- Mood, reaction queue and timers exist only in the UI. A new reaction replaces the current one.
- With animations off, facial expressions still change. With the mascot off, the game is hidden but recommendations stay visible.
- The guest session belongs to the shared menu layout, so game progress survives page navigation and resets on a full reload. The preview and the sidebar demo have their own sessions.
- The game has six cards. Each match adds 34 interest points, up to 100. A mismatched pair closes after one second.

**SVG animation note.** On each reaction the character component is remounted so the animation replays. Animated groups set an explicit initial pose. `initial={false}` is used only when animations are off. To check that an animation actually plays, compare frames; a change in `data-mood` alone does not prove it.
