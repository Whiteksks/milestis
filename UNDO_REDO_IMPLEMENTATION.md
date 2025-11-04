# Undo/Redo Implementation Summary

## Overview
This document describes the implementation of Undo/Redo functionality for the editor using Zustand state management.

## Implementation Details

### 1. History State Structure
The editor now tracks history with three key arrays:
- **`past`**: Array of previous block snapshots
- **`present`**: Current state (implicitly stored in `blocks`)
- **`future`**: Array of future states (for redo after undo)

### 2. Files Created/Modified

#### Created Files:
1. **`src/editor/state/historyMiddleware.ts`**
   - Utility function `areBlocksEqual()` to compare block arrays
   - Used to prevent duplicate states in history

2. **`src/editor/hooks/useEditorKeyboardShortcuts.ts`**
   - Custom hook for keyboard shortcuts
   - Handles `Ctrl+Z` (undo) and `Ctrl+Shift+Z` / `Ctrl+Y` (redo)
   - Works on both Windows/Linux (Ctrl) and Mac (Cmd)
   - Ignores shortcuts when user is typing in inputs/textareas

#### Modified Files:
1. **`src/editor/state/useEditorDnDStore.ts`**
   - Extended with history state (`past`, `future`)
   - Added history actions: `undo()`, `redo()`, `canUndo()`, `canRedo()`, `saveState()`
   - Updated `setBlocks()` to accept optional `saveToHistory` parameter
   - Modified `addBlock()`, `removeBlock()`, `moveBlock()` to automatically save to history
   - Implemented snapshot system to serialize block state without React components
   - Added `restoreFromSnapshot()` to recreate blocks from snapshots

2. **`src/editor/panels/header/header.tsx`**
   - Connected Undo/Redo buttons to store actions
   - Added `disabled` state based on `canUndo()` and `canRedo()`
   - Added tooltips with keyboard shortcuts

3. **`src/app/[locale]/design/[projectId]/edit/page.tsx`**
   - Integrated `useEditorKeyboardShortcuts()` hook
   - Updated initial block creation to not save to history
   - Added `componentName` to all blocks for proper restoration
   - Updated `handleDragEnd()` to save new blocks to history
   - Updated `handleDuplicateBlock()` to preserve `componentName`

## Features

### Keyboard Shortcuts
- **Undo**: `Ctrl+Z` (Windows/Linux) or `Cmd+Z` (Mac)
- **Redo**: `Ctrl+Shift+Z` or `Ctrl+Y` (Windows/Linux) or `Cmd+Shift+Z` (Mac)
- Shortcuts are disabled when typing in input fields

### UI Integration
- Header toolbar buttons for Undo/Redo
- Buttons are automatically disabled when no undo/redo is available
- Visual feedback with disabled state

### Performance Optimizations
1. **History Limit**: Maximum 50 states stored in history
2. **Duplicate Prevention**: Consecutive identical states are not saved
3. **Snapshot System**: Only essential data (id, type, componentName) is stored, not React components
4. **Lazy Restoration**: Components are recreated only when needed during undo/redo

## How It Works

### Save State Flow
1. User performs action (add, delete, move, or update block)
2. Current blocks are compared with previous state
3. If changed, current state snapshot is pushed to `past` array
4. `future` array is cleared (new actions invalidate redo)
5. History is trimmed if it exceeds limit (50 states)

### Undo Flow
1. User triggers undo (button or keyboard)
2. Last state from `past` is retrieved
3. Current state is pushed to `future` (for redo)
4. Blocks are restored from snapshot using `createBlockElement()`
5. UI updates automatically via Zustand reactivity

### Redo Flow
1. User triggers redo (button or keyboard)
2. First state from `future` is retrieved
3. Current state is pushed to `past`
4. Blocks are restored from snapshot
5. UI updates automatically

## Block Snapshot System

### Why Snapshots?
React components cannot be serialized/stored directly. The snapshot system stores only the essential metadata:
```typescript
type BlockSnapshot = {
  id: string;
  type?: BlockType;
  componentName?: string;
}
```

### Restoration Process
When restoring from a snapshot:
1. System looks for existing block with same ID
2. If found and unchanged, preserves the React component
3. If not found or changed, uses `createBlockElement(componentName)` to recreate
4. Falls back to placeholder if component not found

## Edge Cases Handled

1. **Initial State**: Initial blocks don't save to history (prevents undo to empty state)
2. **No Consecutive Duplicates**: Identical consecutive states are filtered out
3. **Empty History**: Undo/redo buttons disabled when no history available
4. **Typing Prevention**: Keyboard shortcuts ignored when focused on text inputs
5. **Component Recreation**: Blocks properly recreated even after being removed from DOM
6. **Memory Management**: History limited to 50 states to prevent memory issues

## Testing Checklist

- [x] Undo button works after adding a block
- [x] Undo button works after deleting a block
- [x] Undo button works after moving a block
- [x] Undo button works after duplicating a block
- [x] Redo button works after undo
- [x] Ctrl+Z triggers undo
- [x] Ctrl+Shift+Z triggers redo
- [x] Ctrl+Y triggers redo
- [x] Shortcuts don't work when typing in input
- [x] Buttons are disabled when appropriate
- [x] History is limited to 50 states
- [x] Identical consecutive states are not saved
- [x] Components are properly recreated after undo/redo

## Future Enhancements

Possible improvements for the future:
1. **Debouncing**: Group rapid changes into single history entry
2. **Selective History**: Allow certain operations to skip history
3. **History Persistence**: Save history to localStorage for recovery
4. **Visual Timeline**: Show history as visual timeline in UI
5. **Branching**: Support branching history (multiple redo paths)
6. **Diff Visualization**: Show what changed between states

## Technical Notes

- Uses Zustand for state management (no Redux/Context needed)
- Leverages React's reconciliation for efficient updates
- Snapshots use structural cloning (no deep cloning libraries needed)
- Keyboard detection works cross-platform (Mac/Windows/Linux)
- Block library lookup ensures components are correctly recreated
