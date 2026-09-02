'use client'

import { motion } from 'motion/react'
import { Image as ImageIcon } from 'lucide-react'

/** Lightweight cover for the template picker — 2 tall, prominent vertical tracks */
export function EventCosmosCover() {
  // Две симметричные колонки, смещенные по вертикали для динамики
  const COLS = [
    { left: '15%', duration: 8,  startY: 0,    rot: -3 },
    { left: '55%', duration: 11, startY: -140, rot: 3 },
  ] as const

  // Размеры вытянутых вертикальных фото для мелкого превью
  const ITEM_W = '30%'   // Достаточно широкие для 2-х колонок
  const ITEM_H = '300px'  // Длинные (высокие) карточки
  const PREVIEW_GAP = 24 // Небольшой зазор, чтобы в экран помещалось больше длинных карточек
  const CYCLE_H = (80 + PREVIEW_GAP) * 2 // Высота цикла для бесшовного loop

  return (
    <div className="relative h-full w-full overflow-hidden bg-zinc-950 select-none group">
      {/* Мягкое космическое свечение на фоне */}
      <div className="absolute inset-0 bg-radial-gradient from-zinc-900 via-transparent to-transparent opacity-60" />

      {/* Контейнер треков */}
      <div className="absolute inset-0 w-full h-full">
        {COLS.map((col, colIdx) => (
          <div 
            key={colIdx} 
            className="absolute top-0 flex flex-col items-center" 
            style={{ left: col.left, width: ITEM_W }}
          >
            <motion.div
              style={{ willChange: 'transform' }}
              animate={{ y: [col.startY, col.startY - CYCLE_H] }}
              transition={{
                duration: col.duration,
                repeat: Infinity,
                ease: 'linear',
                repeatType: 'loop',
              }}
              className="flex flex-col w-full"
            >
              {/* 6 элементов гарантируют, что лента не прервется при движении */}
              {Array.from({ length: 6 }).map((_, i) => {
                const opacityStep = ((colIdx * 3 + i * 2) % 4) * 0.12;
                const bgOpacity = 0.2 + opacityStep;
                const hasIcon = (colIdx + i) % 2 === 0;

                return (
                  <div
                    key={i}
                    className="relative w-full rounded-md border border-zinc-800/80 shadow-2xl flex items-center justify-center bg-zinc-900/90"
                    style={{
                      height: ITEM_H,
                      marginBottom: PREVIEW_GAP,
                      transform: `rotate(${col.rot}deg)`,
                      background: `rgba(20, 20, 23, ${bgOpacity + 0.5})`,
                      boxShadow: '0 8px 20px rgba(0,0,0,0.7)',
                    }}
                  >
                    {/* Иконка внутри вытянутого кадра */}
                    {hasIcon ? (
                      <ImageIcon className="w-5 h-5 text-zinc-500/70 group-hover:text-zinc-400 transition-colors" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-zinc-800" />
                    )}
                    
                    {/* Легкий внутренний глянец */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.01] to-white/[0.04] rounded-md" />
                  </div>
                );
              })}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Затемнения сверху и снизу для эффекта ухода в бесконечность */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-zinc-950 via-zinc-950/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
    </div>
  )
}