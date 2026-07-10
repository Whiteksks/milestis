'use client'

/** Lightweight cover for the template picker — hints at 3D coverflow carousel */
export function EventCoverflowCover() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-zinc-950 select-none p-[4%]">
      
      {/* 3D сцена — теперь высота и ширина адаптивны под размеры карточки */}
      <div 
        className="relative flex items-center justify-center w-full h-[60%]" 
        style={{ perspective: '300px' }} // Относительная глубина для миниатюр
      >
        {/* Контейнер для правильного отображения 3D-слоев и отражений */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
          
          {/* Дальняя левая карточка */}
          <div
            className="absolute aspect-square w-[20%] rounded-[12%] bg-gradient-to-br from-zinc-800/20 to-zinc-900/10 border border-white/5 backdrop-blur-sm"
            style={{ transform: 'translateX(-160%) rotateY(60deg) translateZ(-40px)' }}
          />
          
          {/* Ближняя левая карточка */}
          <div
            className="absolute aspect-square w-[26%] rounded-[12%] bg-gradient-to-br from-zinc-800/40 to-zinc-900/30 border border-white/10 backdrop-blur-sm"
            style={{ transform: 'translateX(-90%) rotateY(45deg) translateZ(-20px)' }}
          />
          
          {/* ЦЕНТРАЛЬНАЯ КАРТОЧКА — Огромная, на переднем плане, с кольцом */}
          <div
            className="relative z-10 aspect-square w-[38%] rounded-[14%] bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-[0_12px_32px_rgba(0,0,0,0.7)]"
            style={{ transform: 'translateZ(10px)' }}
          >
            <span className="pointer-events-none absolute inset-0 rounded-[14%] ring-1 ring-white/20" />
            
            {/* Встроенное в карточку отражение (двигается и масштабируется вместе с ней) */}
            <div
              className="absolute left-0 top-[105%] h-full w-full bg-gradient-to-b from-zinc-800 to-zinc-900 opacity-20 rounded-[14%]"
              style={{
                transform: 'scaleY(-1)',
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent 40%)',
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent 40%)',
              }}
            />
          </div>
          
          {/* Ближняя правая карточка */}
          <div
            className="absolute aspect-square w-[26%] rounded-[12%] bg-gradient-to-br from-zinc-800/40 to-zinc-900/30 border border-white/10 backdrop-blur-sm"
            style={{ transform: 'translateX(90%) rotateY(-45deg) translateZ(-20px)' }}
          />
          
          {/* Дальняя правая карточка */}
          <div
            className="absolute aspect-square w-[20%] rounded-[12%] bg-gradient-to-br from-zinc-800/20 to-zinc-900/10 border border-white/5 backdrop-blur-sm"
            style={{ transform: 'translateX(160%) rotateY(-60deg) translateZ(-40px)' }}
          />
          
        </div>
      </div>

      {/* Точки-индикаторы (полностью в процентах от высоты/ширины превью) */}
      <div className="mt-[8%] flex gap-[2%] items-center justify-center w-full h-[6%]">
        {[0, 1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className="h-full rounded-full transition-all duration-300" 
            style={{ 
              width: i === 2 ? '15%' : '4%',
              backgroundColor: i === 2 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.15)'
            }} 
          />
        ))}
      </div>

    </div>
  )
}