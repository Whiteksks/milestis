'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { useBaseTransition, useDisabled } from './animation-context'

interface SectionWrapperProps extends HTMLMotionProps<'section'> {
  id: string
  children: React.ReactNode
  className?: string
  themeForeground?: string
  as?: React.ElementType
}

export function SectionWrapper({
  id,
  children,
  className,
  themeForeground,
  as: Component = 'section',
  ...props
}: SectionWrapperProps) {
  // Build a stable motion-capable component for the given `as` element type.
  const MotionComponent = useMemo(
    () =>
      (typeof Component === 'string'
        ? motion.create(Component)
        : Component) as React.ComponentType<Record<string, unknown>>,
    [Component],
  )

  const disabled = useDisabled()
  const transition = useBaseTransition()

  // Footers are always the last element on the page.
  // Framer Motion's whileInView uses IntersectionObserver against the window
  // viewport, which can silently fail to fire inside overflow:auto containers
  // (e.g. the editor PreviewOverlay), leaving the footer at opacity:0 forever.
  // Footers are small utility strips — no entrance animation needed.
  const isFooter = id === 'footer'

  const animationProps =
    !disabled && !isFooter
      ? {
          initial: { opacity: 0, y: 30 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-80px' } as const,
          transition,
        }
      : {}

  if (disabled) {
    return (
      <Component
        id={id}
        data-section-id={id}
        className={cn('@container w-full relative', themeForeground, className)}
        {...props}
      >
        {children}
      </Component>
    )
  }

  return (
    <MotionComponent
      id={id}
      data-section-id={id}
      className={cn('@container w-full relative', themeForeground, className)}
      {...animationProps}
      {...props}
    >
      {children}
    </MotionComponent>
  )
}

