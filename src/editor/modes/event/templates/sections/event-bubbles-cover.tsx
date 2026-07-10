'use client'

/** Lightweight cover for the template picker — hints at floating physics bubbles */
export function EventBubblesCover() {
  // Задаем только размер (по ширине) и координаты
  const bubbles = [
    { size: '26%', x: '10%', y: '12%' },
    { size: '16%', x: '58%', y: '8%'  },
    { size: '32%', x: '32%', y: '44%' },
    { size: '18%', x: '8%',  y: '62%' },
    { size: '22%', x: '64%', y: '58%' },
  ]

  return (
    <div className="relative h-full w-full overflow-hidden bg-background select-none">
      {bubbles.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-muted/60 border border-white/20 shadow-md backdrop-blur-[1px] overflow-hidden"
          style={{
            width: b.size,
            aspectRatio: '1 / 1', // Гарантирует идеальный круг при любых пропорциях экрана
            left: b.x,
            top: b.y,
          }}
        >
          {/* Имитация объемного внутреннего свечения */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10" />

          {/* Блик (specular highlight dot) */}
          <div
            className="absolute rounded-full bg-white/70"
            style={{ 
              width: '25%', 
              height: '25%', 
              top: '15%', 
              left: '15%', 
              filter: 'blur(0.5px)' 
            }}
          />
        </div>
      ))}
    </div>
  )
}