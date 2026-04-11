/**
 * Server-safe passthrough shim for framer-motion.
 *
 * Used via a webpack alias to replace framer-motion in the Next.js server
 * bundle (SSR + route handlers). This prevents "Attempted to call
 * MotionConfig() from the server" errors that React 19 throws when a server
 * route tries to render framer-motion client components via renderToStaticMarkup.
 *
 * All motion.* elements render as their plain HTML counterparts.
 * Client hydration still uses the real framer-motion from the client bundle.
 */
import React from 'react'

// ── Framer-motion props that should never reach the DOM ───────────────────────

const MOTION_KEYS = new Set([
  'initial', 'animate', 'exit', 'variants', 'transition',
  'whileInView', 'whileHover', 'whileTap', 'whileFocus', 'whileDrag',
  'viewport', 'layout', 'layoutId', 'layoutDependency',
  'onAnimationStart', 'onAnimationComplete', 'onUpdate',
  'drag', 'dragConstraints', 'dragElastic', 'dragMomentum',
  'onDragStart', 'onDrag', 'onDragEnd', 'dragListener',
  'transformTemplate', 'custom', 'inherit', 'ignoreStrict',
])

function stripMotionProps(props: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const key of Object.keys(props)) {
    if (!MOTION_KEYS.has(key)) out[key] = props[key]
  }
  return out
}

// ── motion element factory ────────────────────────────────────────────────────

type AnyProps = Record<string, unknown> & { children?: React.ReactNode }

function createMotionElement(tag: string | React.ComponentType<AnyProps>) {
  const displayName = typeof tag === 'string' ? `motion.${tag}` : `motion(${tag.displayName ?? tag.name})`
  const Comp = ({ children, ...props }: AnyProps) =>
    React.createElement(tag as string, stripMotionProps(props), children)
  Comp.displayName = displayName
  return Comp
}

// Callable function so `motion('div')` and `motion(Component)` both work
function motionFn(tagOrComponent: string | React.ComponentType<AnyProps>) {
  return createMotionElement(tagOrComponent)
}

// Proxy to handle `motion.div`, `motion.section`, etc.
export const motion = new Proxy(motionFn as typeof motionFn & Record<string, ReturnType<typeof createMotionElement>>, {
  get(_, prop: string) {
    return createMotionElement(prop)
  },
})

// ── Passthrough context providers ─────────────────────────────────────────────

export function MotionConfig({ children }: { children?: React.ReactNode }) {
  return <>{children}</>
}
MotionConfig.displayName = 'MotionConfig'

export function AnimatePresence({ children }: { children?: React.ReactNode }) {
  return <>{children}</>
}
AnimatePresence.displayName = 'AnimatePresence'

export function LazyMotion({ children }: { children?: React.ReactNode }) {
  return <>{children}</>
}

// ── Noop hooks ────────────────────────────────────────────────────────────────

export function useMotionValue(initial: number) {
  return { get: () => initial, set: () => {}, on: () => () => {} }
}

export function useTransform(val: unknown, ...rest: unknown[]) {
  void rest
  return val
}

export function useSpring(val: unknown) { return val }
export function useScroll() { return { scrollY: 0, scrollX: 0, scrollYProgress: 0, scrollXProgress: 0 } }
export function useInView() { return false }

export function useAnimation() {
  return { start: () => Promise.resolve(), stop: () => {}, set: () => {} }
}

// ── Type-only re-exports (erased at runtime, TS still picks up types from the real package) ──
export type { Transition, Variants, HTMLMotionProps, MotionProps, MotionValue } from 'framer-motion'
