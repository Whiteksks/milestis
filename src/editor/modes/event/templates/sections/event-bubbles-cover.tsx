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
    <div className="relative h-full w-full overflow-hidden bg-[#121214] select-none">
      {bubbles.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.4)] backdrop-blur-[3px] overflow-hidden"
          style={{
            width: b.size,
            aspectRatio: '1 / 1', // Гарантирует идеальный круг при любых пропорциях экрана
            left: b.x,
            top: b.y,
            // Сложный базовый градиент: от полупрозрачного графита к глубокому темному тону
            background: 'linear-gradient(135deg, rgba(39, 39, 42, 0.6) 0%, rgba(15, 15, 17, 0.8) 100%)',
          }}
        >
          {/* Эффект бензинового/перламутрового перелива (неоновый интерес) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.18),transparent_60%)]" /> {/* Фиолетовый отсвет снизу-справа */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(45,212,191,0.15),transparent_50%)]" /> {/* Бирюзовый отсвет сверху-слева */}

          {/* Имитация объемного внутреннего свечения по контуру */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/40" />

          {/* Яркий 3D-блик сверху */}
          <div
            className="absolute rounded-full bg-gradient-to-br from-white/60 to-white/0"
            style={{ 
              width: '28%', 
              height: '28%', 
              top: '12%', 
              left: '12%', 
              filter: 'blur(0.5px)',
              transform: 'rotate(-15deg)'
            }}
          />
        </div>
      ))}
    </div>
  )
}