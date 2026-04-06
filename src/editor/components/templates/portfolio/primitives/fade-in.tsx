'use client'

import { useMemo } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useBaseTransition, useDisabled } from './animation-context'

interface FadeInProps extends HTMLMotionProps<'div'> {
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?: number
  scaleOffset?: number
  as?: React.ElementType
}

export function FadeIn({
  children,
  className,
  delay = 0,
  direction = 'up',
  distance = 30,
  scaleOffset,
  as: Component = 'div',
  ...props
}: FadeInProps) {
  // Memoize the motion component so React doesn't unmount/remount the DOM node
  // on every render — which would break animations during text input in the editor.
  const MotionComponent = useMemo(() => motion(Component as any) as any, [Component])

  const disabled = useDisabled()
  const transition = useBaseTransition(delay)

  if (disabled) {
    return <Component className={className} {...props as any}>{children}</Component>
  }

  const offset = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: { x: 0, y: 0 },
  }

  return (
    <MotionComponent
      className={className}
      initial={{ 
        opacity: 0, 
        ...offset[direction],
        ...(scaleOffset !== undefined ? { scale: scaleOffset } : {})
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0,
        ...(scaleOffset !== undefined ? { scale: 1 } : {})
      }}
      viewport={{ once: true, margin: '-50px' }}
      transition={transition as any}
      {...props}
    >
      {children}
    </MotionComponent>
  )
}



