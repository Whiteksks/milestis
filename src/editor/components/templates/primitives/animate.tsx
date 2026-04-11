'use client'

import { useMemo } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { useBaseTransition, useDisabled } from './animation-context'

// РІвЂќР‚РІвЂќР‚РІвЂќР‚ Types РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚

/**
 * How the animation entry is triggered:
 *  - 'scroll'  РІР‚вЂќ fires when the element enters the viewport (whileInView). Default.
 *  - 'mount'   РІР‚вЂќ fires immediately on component mount (animate). Use for above-the-fold
 *                content (cover sections, hero) that is visible before any scrolling.
 */
export type AnimateTrigger = 'scroll' | 'mount'

/**
 * Visual style of the entrance animation.
 * Add new values here as the design system evolves РІР‚вЂќ all existing usages
 * keep working because they don't pass `type` explicitly (defaults to 'fade').
 *
 *  - 'fade'   РІР‚вЂќ opacity + optional translate/scale. Current behaviour.
 *  - 'rise'   РІР‚вЂќ stronger translate-up, no opacity change (decorative text, big numbers).
 *  - 'scale'  РІР‚вЂќ scale from scaleOffset to 1 at origin-center, mild opacity.
 *  - 'blur'   РІР‚вЂќ opacity + blur(8pxРІвЂ вЂ™0). Soft, editorial.
 *  - 'slide'  РІР‚вЂќ pure translate, no opacity. Bold, magazine-like.
 */
export type AnimateType = 'fade' | 'rise' | 'scale' | 'blur' | 'slide'

interface AnimateProps extends Omit<HTMLMotionProps<'div'>, 'direction'> {
  /** Entry delay in seconds. */
  delay?: number
  /** Translate direction for fade/slide/rise. */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  /** Translate distance in px. */
  distance?: number
  /**
   * Initial scale for 'fade' (when scaleOffset is set) and 'scale' type.
   * Defaults to undefined (no scale) for 'fade', 0.92 for 'scale'.
   */
  scaleOffset?: number
  /** Render as a different HTML element. */
  as?: React.ElementType
  /** When the entrance fires. Default: 'scroll'. */
  trigger?: AnimateTrigger
  /** Animation style. Default: 'fade'. */
  type?: AnimateType
  [key: string]: unknown
}

// РІвЂќР‚РІвЂќР‚РІвЂќР‚ Derive initial/animate variants from type РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚

function buildVariants(
  type: AnimateType,
  direction: AnimateProps['direction'],
  distance: number,
  scaleOffset?: number,
): { initial: object; target: object } {
  const translateOffset = {
    up:    { y: distance },
    down:  { y: -distance },
    left:  { x: distance },
    right: { x: -distance },
    none:  {},
  }[direction ?? 'up']

  switch (type) {
    case 'rise':
      return {
        initial: { opacity: 0.0, ...translateOffset },
        target:  { opacity: 1, x: 0, y: 0 },
      }
    case 'scale': {
      const s = scaleOffset ?? 0.92
      return {
        initial: { opacity: 0, scale: s },
        target:  { opacity: 1, scale: 1 },
      }
    }
    case 'blur':
      return {
        initial: { opacity: 0, filter: 'blur(8px)', ...translateOffset },
        target:  { opacity: 1, filter: 'blur(0px)', x: 0, y: 0 },
      }
    case 'slide':
      return {
        initial: { ...translateOffset },
        target:  { x: 0, y: 0 },
      }
    case 'fade':
    default:
      return {
        initial: {
          opacity: 0,
          ...translateOffset,
          ...(scaleOffset !== undefined ? { scale: scaleOffset } : {}),
        },
        target: {
          opacity: 1,
          x: 0,
          y: 0,
          ...(scaleOffset !== undefined ? { scale: 1 } : {}),
        },
      }
  }
}

// РІвЂќР‚РІвЂќР‚РІвЂќР‚ Component РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚

export function Animate({
  children,
  className,
  delay = 0,
  direction = 'up',
  distance = 30,
  scaleOffset,
  as: Component = 'div',
  trigger = 'scroll',
  type = 'fade',
  ...props
}: AnimateProps) {
  // Memoize so React doesn't unmount/remount the DOM node on every render РІР‚вЂќ
  // which would break animations during text input in the editor.
  const MotionComponent = useMemo(
    () => motion(Component as React.ComponentType<Record<string, unknown>>) as React.ComponentType<Record<string, unknown>>,
    [Component]
  )

  const disabled = useDisabled()
  const transition = useBaseTransition(delay)

  if (disabled) {
    return <Component className={className} {...(props as Record<string, unknown>)}>{children}</Component>
  }

  const { initial, target } = buildVariants(type, direction, distance, scaleOffset)

  if (trigger === 'mount') {
    return (
      <MotionComponent
        className={className}
        initial={initial}
        animate={target}
        transition={transition}
        {...props}
      >
        {children}
      </MotionComponent>
    )
  }

  // Default: scroll
  return (
    <MotionComponent
      className={className}
      initial={initial}
      whileInView={target}
      viewport={{ once: true, margin: '-50px' }}
      transition={transition}
      {...props}
    >
      {children}
    </MotionComponent>
  )
}
