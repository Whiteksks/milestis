'use client'

import { Film, Image as ImageIcon } from 'lucide-react'

/** Lightweight cover used in the template picker preview card — mirrors the real filmstrip design */
export function EventFilmCover() {
  return (
    // Убран класс scale-300, чтобы контейнер не ломал обрезку по краям карточки
    <div className="relative flex h-full w-full items-center justify-center bg-zinc-950 overflow-hidden select-none group">
      {/* Фоновый декоративный элемент / Атмосферный свет */}
      <div className="absolute inset-0 bg-radial-gradient from-zinc-900 via-transparent to-transparent opacity-50" />

      {/* Filmstrip body — увеличены отступы для имитации зума */}
      <div className="relative w-full bg-zinc-900 py-3 shadow-[0_0_25px_rgba(0,0,0,0.6)] border-y border-zinc-800/60 z-0">
        
        {/* Sprocket holes — top row (увеличили количество/размер, чтобы заполнить ширину при зуме) */}
        <div className="flex justify-between gap-1 px-1 pb-2 border-b border-zinc-800/40">
          {Array.from({ length: 12 }).map((_, i) => (
            <div 
              key={i} 
              className="h-3 w-5 flex-shrink-0 rounded-[2px] bg-zinc-950 shadow-inner border border-zinc-800/30 opacity-80" 
            />
          ))}
        </div>

        {/* Horizontal frames track */}
        <div className="flex items-center justify-center gap-4 overflow-hidden px-2 py-4 bg-zinc-950/40">
          {Array.from({ length: 3 }).map((_, i) => {
            // Центрируем средний кадр, делаем его доминирующим
            const isCenter = i === 1;
            return (
              <div
                key={i}
                className="relative aspect-[4/3] flex-shrink-0 rounded-sm border border-zinc-700/50 bg-zinc-900 overflow-hidden shadow-md transition-transform duration-500 group-hover:scale-[1.02]"
                style={{
                  // Центральный кадр занимает 75% ширины, боковые аккуратно поджимаются
                  width: isCenter ? '75%' : '35%',
                  opacity: isCenter ? 1 : 0.25,
                  transform: !isCenter ? 'scale(0.85)' : undefined,
                }}
              >
                {/* Имитация изображения внутри кадра */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                  {isCenter ? (
                    // Иконка покрупнее, так как кадр стал больше
                    <ImageIcon className="w-8 h-8 text-zinc-500 opacity-60 animate-pulse" />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-zinc-800" />
                  )}
                </div>
                {/* Полупрозрачный глянец на кадре */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.08]" />
              </div>
            );
          })}
        </div>

        {/* Sprocket holes — bottom row */}
        <div className="flex justify-between gap-1 px-1 pt-2 border-t border-zinc-800/40">
          {Array.from({ length: 12 }).map((_, i) => (
            <div 
              key={i} 
              className="h-3 w-5 flex-shrink-0 rounded-[2px] bg-zinc-950 shadow-inner border border-zinc-800/30 opacity-80" 
            />
          ))}
        </div>
      </div>

      {/* Edge fades — Градиентное размытие теперь работает корректно, так как края не улетели */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-zinc-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-zinc-950 to-transparent" />

      {/* Маленькая иконка типа шаблона в углу превью */}
      <div className="absolute bottom-2 right-2 p-1 rounded bg-zinc-900/80 border border-zinc-800 text-zinc-500 backdrop-blur-sm z-20">
        <Film className="w-3.5 h-3.5" />
      </div>
    </div>
  )
}