'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TextRevealProps {
  text: string
  className?: string
  delay?: number
  disableAnimations?: boolean
  as?: React.ElementType
}

export function TextReveal({
  text,
  className,
  delay = 0,
  disableAnimations = false,
  as: Component = 'span',
}: TextRevealProps) {
  const lineVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
        delay,
      },
    },
  } as const

  if (disableAnimations) {
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
