import type {
  EditorDecorationElement,
  EditorDecorationPosition,
  EditorDecorationTransform,
  EditorDecorationUpdatePayload,
} from '@/editor/lib/types'

export type DecorationPosition = EditorDecorationPosition

export type DecorationTransform = EditorDecorationTransform

export type DecorationElement = EditorDecorationElement

export type DragBox = {
  top: number
  left: number
  right: number
  bottom: number
}

export type DecorationUpdatePayload = EditorDecorationUpdatePayload
