'use client'

import { motion } from 'motion/react'
import type { MascotCharacterProps } from '../../types'
import { MOCHI_POSES, MOCHI_STATIC_POSES } from './animations'

export function MochiCharacter({ mood, animated }: MascotCharacterProps) {
  const happy = mood === 'happy'
  const sad = mood === 'sad'
  const curious = mood === 'curious'
  return <svg viewBox="0 0 160 160" className="size-full overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="80" cy="140" rx="39" ry="5" fill="#583546" opacity=".1" />
    <motion.g initial={false} animate={animated ? MOCHI_POSES[mood] : MOCHI_STATIC_POSES[mood]}
      transition={animated ? { duration: mood === 'idle' ? 4 : .95, repeat: mood === 'idle' ? Infinity : 0, ease: 'easeInOut' } : { duration: 0 }}
      style={{ originX: .5, originY: 1 }} stroke="#633C50" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M59 126Q45 134 55 138Q64 141 71 131M92 130Q100 140 108 136Q114 132 101 125" fill="#EBAAC0" />
      <path d="M38 91Q22 87 26 99Q27 108 42 106M122 91Q138 87 135 100Q132 108 119 106" fill="#F6C9D9" />
      <path d="M29 107C29 78 44 47 80 47C115 47 132 77 132 107C132 126 115 133 81 133C47 133 29 126 29 107Z" fill="#F9D9E5" />
      <path d="M38 115Q52 127 82 125Q107 126 121 117" stroke="#EFBAD0" strokeWidth="5" />
      <path d="M46 78Q51 63 64 61" stroke="#FFF4F8" strokeWidth="6" />
      <motion.g initial={false} animate={{ rotate: animated && happy ? [0, -12, 10, 0] : sad ? -12 : 0 }}
        transition={{ duration: animated ? .8 : 0 }} style={{ originX: .5, originY: 1 }}>
        <path d="M80 49Q70 40 58 43Q53 24 70 28Q82 31 80 49Z" fill="#9BBC8E" stroke="#496B46" />
        <path d="M80 49Q80 26 103 25Q108 43 80 49Z" fill="#BCD39D" stroke="#496B46" />
        <path d="M81 46L96 32" stroke="#6F945F" strokeWidth="2" />
      </motion.g>
      <ellipse cx="48" cy="105" rx="8" ry="4.5" fill="#E991AE" stroke="none" opacity=".7" />
      <ellipse cx="113" cy="105" rx="8" ry="4.5" fill="#E991AE" stroke="none" opacity=".7" />
      {happy || mood === 'welcome' ? <path d="M55 94Q61 87 67 94M94 94Q100 87 106 94" /> : <motion.g initial={false}
        animate={{ scaleY: animated && mood === 'idle' ? [1, 1, .1, 1, 1] : 1 }}
        transition={{ duration: 5.4, times: [0, .82, .85, .88, 1], repeat: animated && mood === 'idle' ? Infinity : 0 }} style={{ originY: .5 }}>
        <ellipse cx={curious ? 58 : 61} cy="94" rx="3.5" ry={sad ? 3 : 4.5} fill="#633C50" stroke="none" />
        <ellipse cx={curious ? 97 : 100} cy="94" rx="3.5" ry={sad ? 3 : 4.5} fill="#633C50" stroke="none" />
      </motion.g>}
      {sad && <path d="M56 84L65 81M95 81L104 84" strokeWidth="2.5" />}
      {happy ? <path d="M73 103Q81 107 89 103Q89 116 81 116Q73 115 73 103Z" fill="#91556E" />
        : <path d={sad ? 'M75 113Q81 107 87 113' : curious ? 'M78 105Q85 102 85 108Q85 114 79 112Z' : 'M73 106Q77 112 81 106Q85 112 89 106'} />}
      {happy && <path d="M78 113Q81 110 85 113" stroke="#F3AFC8" />}
    </motion.g>
    {happy && <g fill="#DB83A4"><path d="M23 57C16 50 10 60 23 68C36 60 30 50 23 57Z" /><path d="M136 68C131 63 126 70 136 76C146 70 141 63 136 68Z" /></g>}
  </svg>
}
