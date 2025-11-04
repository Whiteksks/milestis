# Undo/Redo Quick Reference Guide

## User Guide

### How to Use Undo/Redo

#### Using Keyboard Shortcuts (Recommended)
- **Undo**: Press `Ctrl+Z` (Windows/Linux) or `Cmd+Z` (Mac)
- **Redo**: Press `Ctrl+Shift+Z` or `Ctrl+Y` (Windows/Linux) or `Cmd+Shift+Z` (Mac)

#### Using Toolbar Buttons
1. Look for the Undo (↶) and Redo (↷) buttons in the top header toolbar
2. Click the Undo button to revert the last action
3. Click the Redo button to reapply an undone action
4. Buttons are grayed out when no undo/redo is available

### What Actions Can Be Undone?
- ✅ Adding a new block
- ✅ Deleting a block
- ✅ Moving a block (drag and drop)
- ✅ Duplicating a block

### Important Notes
- ⚠️ Initial page load state cannot be undone
- ⚠️ After performing a new action, redo history is cleared
- ⚠️ Keyboard shortcuts are disabled when typing in text fields
- ℹ️ History is limited to the last 50 actions

## Developer Guide

### Using the History API

#### In Components
```typescript
import { useEditorDnDStore } from '@/editor/state/useEditorDnDStore';

function MyComponent() {
  const undo = useEditorDnDStore((state) => state.undo);
  const redo = useEditorDnDStore((state) => state.redo);
  const canUndo = useEditorDnDStore((state) => state.canUndo());
  const canRedo = useEditorDnDStore((state) => state.canRedo());

  return (
    <div>
      <button onClick={undo} disabled={!canUndo}>
        Undo
      </button>
      <button onClick={redo} disabled={!canRedo}>
        Redo
      </button>
    </div>
  );
}
```

#### Saving State Manually
```typescript
const saveState = useEditorDnDStore((state) => state.saveState);

// Manually save current state to history
saveState();
```

#### Setting Blocks Without History
```typescript
const setBlocks = useEditorDnDStore((state) => state.setBlocks);

// Don't save to history (e.g., for initial load)
setBlocks(newBlocks, false);

// Save to history (default)
setBlocks(newBlocks, true);
// or simply
setBlocks(newBlocks);
```

### Adding componentName to Blocks

For undo/redo to work correctly, blocks must have a `componentName`:

```typescript
const newBlock = {
  id: 'unique-id',
  component: <MyComponent />,
  componentName: 'MyComponent', // Required for undo/redo
};
```

### Registering New Components

Add your component to the block library:

```typescript
// src/editor/blocks/block-library.ts
export const BLOCK_LIBRARY: BlockLibraryItem[] = [
  // ... existing blocks
  {
    id: 'my-new-block',
    title: 'My New Block',
    description: 'Description of my block',
    componentName: 'MyComponent',
    component: MyComponent,
  },
];
```

### History State Structure

```typescript
{
  blocks: EditorBlock[],      // Current blocks
  past: BlockSnapshot[][],    // Array of previous states
  future: BlockSnapshot[][],  // Array of future states (for redo)
  
  // Actions
  undo: () => void,
  redo: () => void,
  saveState: () => void,
  canUndo: () => boolean,
  canRedo: () => boolean,
}
```

### Configuration

History limit can be adjusted in `useEditorDnDStore.ts`:

```typescript
const HISTORY_LIMIT = 50; // Change this value
```

## Troubleshooting

### Undo/Redo Not Working?

1. **Check componentName**: Ensure all blocks have a `componentName` property
2. **Check Block Library**: Verify component is registered in `block-library.ts`
3. **Check History**: Use `canUndo()` and `canRedo()` to verify history state
4. **Check saveToHistory**: Ensure `setBlocks` is called with `true` (or default)

### Keyboard Shortcuts Not Working?

1. **Check Focus**: Make sure you're not typing in a text input
2. **Check Browser**: Some browsers may override these shortcuts
3. **Check Event Listeners**: Verify `useEditorKeyboardShortcuts` is called

### Blocks Not Restoring Correctly?

1. **Check componentName**: Must match exactly with block library
2. **Check Block Library**: Component must be registered
3. **Check Snapshots**: Verify blocks include necessary metadata

## Examples

### Example 1: Custom Action with History

```typescript
function handleCustomAction() {
  const { blocks, setBlocks } = useEditorDnDStore.getState();
  
  // Perform your custom modification
  const modifiedBlocks = blocks.map(block => ({
    ...block,
    // your modifications
  }));
  
  // Save to history
  setBlocks(modifiedBlocks, true);
}
```

### Example 2: Batch Operations

```typescript
function handleBatchOperation() {
  const { blocks, setBlocks } = useEditorDnDStore.getState();
  
  // Do multiple operations
  let result = [...blocks];
  result = result.filter(/* ... */);
  result = result.map(/* ... */);
  result.push(/* ... */);
  
  // Save once at the end (single history entry)
  setBlocks(result, true);
}
```

### Example 3: Conditional History

```typescript
function handleAction(shouldSaveHistory: boolean) {
  const { blocks, setBlocks } = useEditorDnDStore.getState();
  
  const newBlocks = [...blocks, newBlock];
  
  // Conditionally save to history
  setBlocks(newBlocks, shouldSaveHistory);
}
```

## API Reference

### Store Actions

#### `undo()`
Reverts to the previous state.
- **Returns**: `void`
- **Side Effects**: Moves current state to future, restores previous state

#### `redo()`
Reapplies a previously undone action.
- **Returns**: `void`
- **Side Effects**: Moves current state to past, restores next state

#### `saveState()`
Manually saves current state to history.
- **Returns**: `void`
- **Side Effects**: Adds current state snapshot to past, clears future

#### `canUndo()`
Checks if undo is available.
- **Returns**: `boolean`
- **Note**: Returns `true` if past history exists

#### `canRedo()`
Checks if redo is available.
- **Returns**: `boolean`
- **Note**: Returns `true` if future history exists

#### `setBlocks(blocks, saveToHistory?)`
Sets blocks with optional history saving.
- **Parameters**:
  - `blocks: EditorBlock[]` - The new blocks array
  - `saveToHistory?: boolean` - Whether to save to history (default: `true`)
- **Returns**: `void`
