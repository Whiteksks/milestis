import { BlockType } from '@/editor/state/useEditorStore'

/**
 * Determines the block type based on the component name or other properties
 */
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

  // Header blocks
  if (name.includes('header') || name.includes('hero')) {
    return 'header'
  }

  // Default to generic for unknown types
  return 'generic'
}
