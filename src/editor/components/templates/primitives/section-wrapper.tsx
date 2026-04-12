'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { useBaseTransition, useDisabled } from './animation-context'

interface SectionWrapperProps extends HTMLMotionProps<'section'> {
  id: string
  children: React.ReactNode
  className?: string
  /**
   * Extra classes applied to the inner max-width container.
   * Only has effect when padded={true} (the default).
   */
  containerClassName?: string
  themeForeground?: string
  /**
   * When true (default) wraps children in a max-width container with
   * standard horizontal and vertical padding.
   * Set to false for sections that control their own layout (footers, etc.).
   */
  padded?: boolean
  as?: React.ElementType
}

export function SectionWrapper({
  id,
  children,
  className,
  containerClassName,
  themeForeground,
  padded = true,
  as: Component = motion.section,
  ...props
}: SectionWrapperProps) {
  // Build a stable motion-capable component for the given `as` element type.
  const MotionComponent = useMemo(
    () =>
      (typeof Component === 'string'
        ? motion(Component)
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

  return (
    <MotionComponent
      id={id}
      data-section-id={id}
      className={cn('@container w-full relative', themeForeground, className)}
      {...animationProps}
      {...props}
    >
      {padded ? (
        <div
          className={cn(
            'max-w-7xl mx-auto',
            '@lg:px-20 @md:px-12 px-6 @lg:py-16 @md:py-14 py-10',
            containerClassName,
          )}
        >
          {children}
        </div>
      ) : (
        children
      )}
    </MotionComponent>
  )
}

