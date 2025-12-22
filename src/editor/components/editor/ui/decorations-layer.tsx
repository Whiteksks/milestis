"use client"

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { DecorationElement } from '@/editor/lib/types'

interface DecorationsLayerProps {
  decorations: DecorationElement[]
  animation?: 'none' | 'fade' | 'slide-up' | 'slide-down' | string
}

const getAnimationVariants = (animation?: string) => {
  switch (animation) {
    case 'slide-up':
      return {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
      }
    case 'slide-down':
      return {
        initial: { opacity: 0, y: -30 },
        whileInView: { opacity: 1, y: 0 },
      }
    case 'fade':
    case 'none':
    default:
      return {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
      }
  }
}

const getSizeClass = (size: string | undefined) => {
  switch (size) {
    case 'small':
      return 'w-[100px] h-[100px]'
    case 'medium':
      return 'w-[150px] h-[150px]'
    case 'large':
      return 'w-[200px] h-[200px]'
    case 'xlarge':
      return 'w-[300px] h-[300px]'
    default:
      return size || 'w-40 h-40'
  }
}

export function DecorationsLayer({ decorations, animation }: DecorationsLayerProps) {
  if (!decorations.length) return null

  const animationVariants = getAnimationVariants(animation)

  return (
    <>
      {decorations.map((decoration, index) => (
        <motion.div
          key={`decoration-${index}`}
          initial={animationVariants.initial}
          whileInView={{
            ...animationVariants.whileInView,
            opacity: decoration.opacity,
          }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.15 }}
          className={cn('absolute pointer-events-none', getSizeClass(decoration.size))}
          style={{
            top: decoration.position?.top || 'auto',
            bottom: decoration.position?.bottom || 'auto',
            left: decoration.position?.left || 'auto',
            right: decoration.position?.right || 'auto',
            zIndex: decoration.zIndex || 0,
          }}
        >
          <img
            src={decoration.image || '/placeholder.svg'}
            alt=""
            className="w-full h-full object-contain"
          />
        </motion.div>
      ))}
    </>
  )
}

export default DecorationsLayer
