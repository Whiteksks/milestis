'use client'

import { motion } from 'motion/react'
import type { MascotCharacterProps } from '../../types'
import { BUN_POSES, BUN_STATIC_POSES } from './animations'

export function BunCharacter({ mood, animated }: MascotCharacterProps) {
  const happy = mood === 'happy'
  const sad = mood === 'sad'
  const waving = mood === 'welcome'
  return <svg viewBox="0 0 160 160" className="size-full overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="80" cy="141" rx="35" ry="5" fill="#402C27" opacity=".1" />
    <motion.g initial={animated ? { y: 0, rotate: 0, scaleX: 1, scaleY: 1 } : false} animate={animated ? BUN_POSES[mood] : BUN_STATIC_POSES[mood]}
      transition={animated ? { duration: mood === 'idle' ? 3.5 : 0.95, repeat: mood === 'idle' ? Infinity : 0, ease: 'easeInOut' } : { duration: 0 }}
      style={{ originX: '50%', originY: '85%' }} stroke="#493128" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M60 126L57 136Q63 140 70 136L71 128M89 128L90 136Q99 140 104 136L100 126" fill="#D99A57" />
      <path d={sad ? 'M38 95Q22 102 32 114Q38 116 43 106' : 'M39 88Q22 84 25 98Q28 106 41 104'} fill="#F3BF79" />
      <motion.g initial={animated ? { rotate: 0 } : false} animate={{ rotate: animated && waving ? [0, -25, 10, -25, 0] : waving ? -20 : happy ? -15 : 0 }}
        transition={{ duration: animated ? 1.2 : 0 }} style={{ originX: 0, originY: 0.5 }}>
        <path d="M120 90Q136 76 139 89Q144 99 121 105" fill="#F3BF79" />
      </motion.g>
      <path d="M36 90C36 62 52 48 80 48C108 48 124 65 124 91C124 119 106 133 80 133C53 133 36 119 36 90Z" fill="#F5CA88" />
      <path d="M45 98C49 119 70 127 95 121" stroke="#E6AD67" strokeWidth="5" />
      <path d="M52 68Q59 58 67 58M73 61Q80 56 87 60" stroke="#FFF0C9" strokeWidth="5" />
      <path d="M56 48C45 45 46 31 57 28C60 13 78 13 84 23C96 12 113 22 108 35C122 42 114 55 103 55L58 55Z" fill="#FFFAEC" />
      <path d="M57 48H103V59Q80 64 57 58Z" fill="#F0E6D0" />
      <path d="M72 28L73 38M93 29L91 39" stroke="#DECFB4" strokeWidth="2.5" />
      <ellipse cx="53" cy="101" rx="7" ry="4" fill="#ED947B" stroke="none" opacity=".65" />
      <ellipse cx="108" cy="101" rx="7" ry="4" fill="#ED947B" stroke="none" opacity=".65" />
      {happy ? <g><path d="M59 89Q65 81 71 89M90 89Q96 81 102 89" /></g> : <motion.g initial={animated ? { scaleY: 1 } : false}
        animate={{ scaleY: animated && mood === 'idle' ? [1, 1, 0.1, 1, 1] : 1 }}
        transition={{ duration: 4.8, times: [0, .85, .88, .91, 1], repeat: animated && mood === 'idle' ? Infinity : 0 }} style={{ originY: 0.5 }}>
        <ellipse cx={mood === 'curious' ? 68 : 65} cy="89" rx="3.5" ry={sad ? 3 : 5} fill="#493128" stroke="none" />
        <ellipse cx={mood === 'curious' ? 99 : 96} cy="89" rx="3.5" ry={sad ? 3 : 5} fill="#493128" stroke="none" />
      </motion.g>}
      {sad && <path d="M60 79L70 76M91 76L101 79" strokeWidth="2.5" />}
      {happy ? <path d="M71 99Q81 104 91 99Q89 115 81 115Q73 114 71 99Z" fill="#704137" />
        : <path d={sad ? 'M74 109Q81 102 88 109' : mood === 'curious' ? 'M78 101Q84 98 85 104Q85 111 79 108Z' : 'M73 102Q81 110 89 102'} />}
      {happy && <path d="M77 112Q81 108 86 112" stroke="#EF9D92" strokeWidth="3" />}
    </motion.g>
    {happy && <g stroke="#D48A37" strokeWidth="2.5" strokeLinecap="round"><path d="M24 52V62M19 57H29M133 42V50M129 46H137" /><circle cx="135" cy="118" r="2" fill="#D48A37" stroke="none" /></g>}
  </svg>
}
