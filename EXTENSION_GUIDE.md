# Extension Guide: Adding New Control Types

This guide shows how to extend the dynamic header controls with new block types and controls.

## Adding a New Block Type

### 1. Update the BlockType enum

**File**: `src/editor/state/useEditorStore.ts`

```typescript
export type BlockType = 'text' | 'image' | 'header' | 'video' | 'button' | 'generic'
//                                                      ^^^^^^   ^^^^^^^^  (add new types)
```

### 2. Create the Control Component

**File**: `src/editor/panels/header/controls/VideoControls.tsx`

```tsx
'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Play, Pause, Volume2, Download } from 'lucide-react'

export const VideoControls = () => {
  return (
    <div className="flex items-center gap-2">
      {/* Play/Pause */}
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Play">
        <Play className="size-4" />
      </Button>

      {/* Volume */}
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Volume">
        <Volume2 className="size-4" />
      </Button>

      <Separator orientation="vertical" className="h-5" />

      {/* Download */}
      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5" title="Download">
        <Download className="size-3.5" />
        <span>Download</span>
      </Button>
    </div>
  )
}
```

### 3. Update the Block Type Detector

**File**: `src/editor/utils/blockTypeDetector.ts`

```typescript
export const getBlockType = (componentName?: string): BlockType => {
  if (!componentName) {
    return 'generic'
  }

  const name = componentName.toLowerCase()

  // Text blocks
  if (name.includes('text') || name.includes('paragraph') || name.includes('heading')) {
    return 'text'
  }

  // Image blocks
  if (name.includes('image') || name.includes('img') || name.includes('picture')) {
    return 'image'
  }

  // Video blocks - NEW
  if (name.includes('video') || name.includes('media') || name.includes('player')) {
    return 'video'
  }

  // Header blocks
  if (name.includes('header') || name.includes('hero')) {
    return 'header'
  }

  return 'generic'
}
```

### 4. Export the New Control

**File**: `src/editor/panels/header/controls/index.ts`

```typescript
export { TextControls } from './TextControls'
export { ImageControls } from './ImageControls'
export { GenericControls } from './GenericControls'
export { VideoControls } from './VideoControls' // NEW
```

### 5. Update the Header Component

**File**: `src/editor/panels/header/headerEditorFields.tsx`

```tsx
import { VideoControls } from './controls/VideoControls' // NEW

// In renderContextualControls():
const renderContextualControls = () => {
  if (!selectedBlock) {
    return null
  }

  switch (selectedBlock.type) {
    case 'text':
      return <TextControls />
    case 'image':
      return <ImageControls />
    case 'video':  // NEW
      return <VideoControls />
    case 'header':
      return <GenericControls />
    case 'generic':
    default:
      return <GenericControls />
  }
}
```

## Adding Controls to Existing Type

To add more controls to an existing control component:

### Example: Adding Line Height to TextControls

**File**: `src/editor/panels/header/controls/TextControls.tsx`

```tsx
import { LineHeight } from 'lucide-react' // Add icon

export const TextControls = () => {
  return (
    <div className="flex items-center gap-2">
      {/* ... existing controls ... */}

      <Separator orientation="vertical" className="h-5" />

      {/* Line Height - NEW */}
      <Select defaultValue="1.5">
        <SelectTrigger className="h-8 w-20 text-xs">
          <SelectValue placeholder="Line" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1.0</SelectItem>
          <SelectItem value="1.15">1.15</SelectItem>
          <SelectItem value="1.5">1.5</SelectItem>
          <SelectItem value="2">2.0</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
```

## Making Controls Functional

Currently, controls are UI-only. To make them functional:

### 1. Extend Block State to Include Styles

**File**: `src/editor/state/useEditorStore.ts`

```typescript
export interface Block {
  id: string;
  type?: BlockType;
  componentName?: string;
  styles?: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    textAlign?: string;
    // ... other style properties
  };
  // ... other properties
}
```

### 2. Add Update Methods to Store

```typescript
interface EditorState {
  // ... existing state
  updateBlockStyle: (blockId: string, styles: Partial<Block['styles']>) => void
}

export const useEditorStore = create<EditorState>((set) => ({
  // ... existing state
  updateBlockStyle: (blockId, styles) => set((state) => {
    // Logic to update block styles in the blocks array
  }),
}))
```

### 3. Connect Controls to State

**File**: `src/editor/panels/header/controls/TextControls.tsx`

```tsx
export const TextControls = () => {
  const { selectedBlock, updateBlockStyle } = useEditorStore()

  const handleFontSizeChange = (value: string) => {
    if (selectedBlock) {
      updateBlockStyle(selectedBlock.id, { fontSize: `${value}px` })
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Select 
        defaultValue="16" 
        onValueChange={handleFontSizeChange} // CONNECTED
      >
        {/* ... options ... */}
      </Select>
      {/* ... other controls ... */}
    </div>
  )
}
```

## Advanced Patterns

### Conditional Controls Based on Block Properties

```tsx
const renderContextualControls = () => {
  if (!selectedBlock) return null

  // Show different controls based on block properties
  if (selectedBlock.type === 'image' && selectedBlock.isAnimated) {
    return <AnimatedImageControls />
  }

  switch (selectedBlock.type) {
    case 'text':
      return <TextControls />
    // ... other cases
  }
}
```

### Grouped Controls with Tabs

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const AdvancedTextControls = () => {
  return (
    <Tabs defaultValue="typography" className="w-full">
      <TabsList>
        <TabsTrigger value="typography">Typography</TabsTrigger>
        <TabsTrigger value="spacing">Spacing</TabsTrigger>
        <TabsTrigger value="effects">Effects</TabsTrigger>
      </TabsList>
      <TabsContent value="typography">
        <TextControls />
      </TabsContent>
      <TabsContent value="spacing">
        <SpacingControls />
      </TabsContent>
      <TabsContent value="effects">
        <EffectsControls />
      </TabsContent>
    </Tabs>
  )
}
```

### Responsive Controls

```tsx
export const ResponsiveControls = () => {
  const { activeDevice } = useEditorStore()

  return (
    <div className="flex items-center gap-2">
      {/* Show device-specific controls */}
      {activeDevice === 'mobile' ? (
        <MobileOnlyControls />
      ) : (
        <DesktopControls />
      )}
    </div>
  )
}
```

## Best Practices

1. **Keep controls modular** - One component per block type
2. **Use existing UI components** - Leverage shadcn/ui library
3. **Follow naming conventions** - Use descriptive names like `VideoControls`, `ButtonControls`
4. **Add TypeScript types** - Ensure type safety for all props and state
5. **Test block type detection** - Add tests for new block types in detector
6. **Document new controls** - Update this guide when adding new types
7. **Consider mobile view** - Hide complex controls on small screens
8. **Use icons consistently** - Stick with lucide-react icon set
9. **Maintain spacing** - Use separators between control groups
10. **Add tooltips** - Use `title` attribute for icon-only buttons

## Common Patterns

### Popover with Form Controls

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="ghost" size="icon" className="h-8 w-8">
      <Icon className="size-4" />
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-64">
    <div className="space-y-3">
      <Label>Setting Name</Label>
      {/* Form controls here */}
    </div>
  </PopoverContent>
</Popover>
```

### Dropdown Select

```tsx
<Select defaultValue="default">
  <SelectTrigger className="h-8 w-24 text-xs">
    <SelectValue placeholder="Choose" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Button Group

```tsx
<div className="flex items-center gap-1">
  <Button variant="ghost" size="icon" className="h-8 w-8">
    <Icon1 className="size-4" />
  </Button>
  <Button variant="ghost" size="icon" className="h-8 w-8">
    <Icon2 className="size-4" />
  </Button>
  <Button variant="ghost" size="icon" className="h-8 w-8">
    <Icon3 className="size-4" />
  </Button>
</div>
```
