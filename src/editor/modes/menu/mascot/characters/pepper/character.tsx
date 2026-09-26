'use client'

import { motion } from 'motion/react'
import type { MascotCharacterProps } from '../../types'
import { PEPPER_POSES, PEPPER_STATIC_POSES } from './animations'

export function PepperCharacter({ mood, animated }: MascotCharacterProps) {
  const happy = mood === 'happy'
  const sad = mood === 'sad'
  const curious = mood === 'curious'
  return <svg viewBox="0 0 160 160" className="size-full overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="81" cy="143" rx="31" ry="4" fill="#533126" opacity=".1" />
    <motion.g initial={false} animate={animated ? PEPPER_POSES[mood] : PEPPER_STATIC_POSES[mood]}
      transition={animated ? { duration: mood === 'idle' ? 3.6 : .9, repeat: mood === 'idle' ? Infinity : 0, ease: 'easeInOut' } : { duration: 0 }}
      style={{ originX: .5, originY: .85 }} stroke="#623A2E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M73 126L67 137L77 138M94 122L100 135L109 132" fill="#DF7056" />
      <path d={happy ? 'M53 76Q34 61 34 74Q35 85 53 89' : 'M53 79Q35 78 39 90Q44 97 54 91'} fill="#EF8065" />
      <motion.g initial={false} animate={{ rotate: animated && mood === 'welcome' ? [0, -35, 5, -30, 0] : happy ? -25 : 0 }}
        transition={{ duration: animated ? 1 : 0 }} style={{ originX: 0, originY: .6 }}>
        <path d="M113 77Q132 62 135 75Q139 87 114 91" fill="#EF8065" />
      </motion.g>
      <path d="M52 66C54 45 75 38 96 43C124 49 128 72 115 96C101 122 78 133 49 133C45 133 44 130 48 127C63 116 51 94 52 66Z" fill="#F18569" />
      <path d="M108 69C119 89 97 119 61 126" stroke="#DB654F" strokeWidth="6" />
      <path d="M62 66Q64 54 77 52" stroke="#FFC4A4" strokeWidth="5" />
      <motion.g initial={false} animate={{ rotate: animated && happy ? [0, -8, 12, -5, 0] : sad ? 12 : 0 }}
        transition={{ duration: animated ? .85 : 0 }} style={{ originX: .5, originY: 1 }}>
        <path d="M80 43Q72 28 80 20Q83 17 86 21Q79 28 88 40" fill="#7FA55C" stroke="#40583C" strokeWidth="4" />
        <path d="M58 47L71 38L81 43L92 36L96 44L111 47L99 54L88 50L78 57L74 49Z" fill="#9DBC73" stroke="#40583C" />
      </motion.g>
      <ellipse cx="63" cy="92" rx="6" ry="3.5" fill="#F7B08E" stroke="none" />
      <ellipse cx="109" cy="92" rx="6" ry="3.5" fill="#F7B08E" stroke="none" />
      {happy ? <path d="M68 80Q73 73 78 80M93 80Q98 73 103 80" /> : <motion.g initial={false}
        animate={{ scaleY: animated && mood === 'idle' ? [1, 1, .1, 1, 1] : 1 }}
        transition={{ duration: 4.2, times: [0, .8, .83, .86, 1], repeat: animated && mood === 'idle' ? Infinity : 0 }} style={{ originY: .5 }}>
        <ellipse cx={curious ? 75 : 72} cy="82" rx="3" ry={sad ? 3 : 4.5} fill="#623A2E" stroke="none" />
        <ellipse cx={curious ? 101 : 98} cy="82" rx="3" ry={sad ? 3 : 4.5} fill="#623A2E" stroke="none" />
      </motion.g>}
      <path d={sad ? 'M68 72L77 69M94 69L103 72' : curious ? 'M68 70L76 70M94 67L103 70' : 'M67 72L77 70M94 70L103 72'} strokeWidth="2.5" />
      {happy ? <path d="M76 92Q86 98 95 91Q93 107 85 107Q78 106 76 92Z" fill="#824535" />
        : <path d={sad ? 'M80 101Q86 95 92 101' : curious ? 'M84 95Q88 92 91 96Q93 102 87 103Q83 102 84 95Z' : 'M77 96Q87 105 97 93'} />}
      {happy && <path d="M83 104Q87 100 91 104" stroke="#F3A48C" />}
    </motion.g>
    {happy && <g stroke="#D39A38" strokeWidth="3" strokeLinecap="round"><path d="M30 39L25 48L34 46L29 56M131 108L126 116L135 114L131 123" /></g>}
  </svg>
}
