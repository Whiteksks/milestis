import type {
  DecorationElement as BaseDecorationElement,
  DecorationPosition,
  DecorationTransform,
  DecorationUpdatePayload,
} from '@/editor/lib/types'

export type { DecorationPosition, DecorationTransform, DecorationUpdatePayload }

/**
 * Editor-side decoration — identical to the base type but with id guaranteed present.
 * All editor UI components (toolbar, drag layer) work with this form.
 */
export type DecorationElement = BaseDecorationElement & { id: string }

export type DragBox = {
  top: number
  left: number
  right: number
  bottom: number
}
