'use client'

/** Lightweight cover for the template picker — hints at 3D coverflow carousel */
export function EventCoverflowCover() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-background select-none p-[4%]">
      
      {/* 3D сцена — теперь высота и ширина адаптивны под размеры карточки */}
      <div 
        className="relative flex items-center justify-center w-full h-[60%]" 
        style={{ perspective: '300px' }} // Относительная глубина для миниатюр
      >
        {/* Контейнер для правильного отображения 3D-слоев и отражений */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
          
          {/* Дальняя левая карточка */}
          <div
            className="absolute aspect-square w-[20%] rounded-[12%] bg-muted/20 border border-white/5"
            style={{ transform: 'translateX(-160%) rotateY(60deg) translateZ(-40px)' }}
          />
          
          {/* Ближняя левая карточка */}
          <div
            className="absolute aspect-square w-[26%] rounded-[12%] bg-muted/50 border border-white/10"
            style={{ transform: 'translateX(-90%) rotateY(45deg) translateZ(-20px)' }}
          />
          
          {/* ЦЕНТРАЛЬНАЯ КАРТОЧКА — Огромная, на переднем плане, с кольцом */}
          <div
            className="relative z-10 aspect-square w-[38%] rounded-[14%] bg-muted shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
            style={{ transform: 'translateZ(10px)' }}
          >
            <span className="pointer-events-none absolute inset-0 rounded-[14%] ring-1 ring-white/30" />
            
            {/* Встроенное в карточку отражение (двигается и масштабируется вместе с ней) */}
            <div
              className="absolute left-0 top-[105%] h-full w-full bg-muted opacity-15 rounded-[14%]"
              style={{
                transform: 'scaleY(-1)',
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 50%)',
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 50%)',
              }}
            />
          </div>
          
          {/* Ближняя правая карточка */}
          <div
            className="absolute aspect-square w-[26%] rounded-[12%] bg-muted/50 border border-white/10"
            style={{ transform: 'translateX(90%) rotateY(-45deg) translateZ(-20px)' }}
          />
          
          {/* Дальняя правая карточка */}
          <div
            className="absolute aspect-square w-[20%] rounded-[12%] bg-muted/20 border border-white/5"
            style={{ transform: 'translateX(160%) rotateY(-60deg) translateZ(-40px)' }}
          />
          
        </div>
      </div>

      {/* Точки-индикаторы (полностью в процентах от высоты/ширины превью) */}
      <div className="mt-[8%] flex gap-[2%] items-center justify-center w-full h-[6%]">
        {[0, 1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className="h-full rounded-full bg-muted/80 transition-all" 
            style={{ width: i === 2 ? '15%' : '4%' }} 
          />
        ))}
      </div>

    </div>
  )
}