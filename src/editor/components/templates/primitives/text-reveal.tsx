'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { useT, useDisabled } from './animation-context'

interface TextRevealProps {
  text: string
  className?: string
  delay?: number
  as?: React.ElementType
}

export function TextReveal({
  text,
  className,
  delay = 0,
  as: Component = 'span',
}: TextRevealProps) {
  const t = useT()
  const disabled = useDisabled()

  const lineVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: t(0.9, delay),
    },
  } as const

  if (disabled) {
    return <Component className={className}>{text}</Component>
  }

  return (
    <motion.span
      className={cn('inline-block overflow-hidden', className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={lineVariants}
    >
      {text}
    </motion.span>
  )
}
