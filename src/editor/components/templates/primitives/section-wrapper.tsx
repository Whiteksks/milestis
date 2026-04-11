'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { motion, HTMLMotionProps } from 'framer-motion'
import { useBaseTransition, useDisabled } from './animation-context'

interface SectionWrapperProps extends HTMLMotionProps<'section'> {
  id: string
  children: React.ReactNode
  className?: string
  containerClassName?: string
  themeForeground?: string
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
  // Always produce a motion-capable component so framer props never end up on a plain DOM element.
  const MotionComponent = useMemo(
    () => (typeof Component === 'string' ? motion(Component) : Component) as React.ComponentType<Record<string, unknown>>,
    [Component],
  )
  const disabled = useDisabled()
  const transition = useBaseTransition()

  return (
    <MotionComponent
      id={id}
      data-section-id={id}
      className={cn('@container w-full relative', themeForeground, className)}
      {...(!disabled
        ? {
            initial: { opacity: 0, y: 30 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: '-80px' },
            transition,
          }
        : {
            initial: { opacity: 1, y: 0 },
          })}
      {...props}
    >
      <div
        className={cn(
          'max-w-7xl mx-auto',
          padded && '@lg:px-20 @md:px-12 px-6 @lg:py-16 @md:py-14 py-10',
          containerClassName
        )}
      >
        {children}
      </div>
    </MotionComponent>
  )
}

