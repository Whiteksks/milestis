'use client'

/** Lightweight cover for the template picker — hints at multi-lane horizontal parallax */
export function EventParallaxCover() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-background select-none flex flex-col justify-center gap-[6%] p-[4%]">
      
      {/* Линия 1: 3 огромных блока (занимают ~38% высоты карточки) */}
      <div className="flex gap-[4%] items-center -ml-[20%] opacity-80 h-[38%]">
        <div className="h-full w-[45%] flex-shrink-0 rounded-[10%] bg-muted -rotate-1 shadow-md" />
        <div className="h-full w-[55%] flex-shrink-0 rounded-[10%] bg-muted -rotate-1 shadow-md" />
        <div className="h-full w-[45%] flex-shrink-0 rounded-[10%] bg-muted -rotate-1 shadow-md" />
      </div>

      {/* Линия 2: 2 гигантских блока (занимают ~44% высоты карточки) */}
      <div className="flex gap-[4%] items-center -ml-[5%] h-[44%]">
        <div className="h-full w-[65%] flex-shrink-0 rounded-[10%] bg-muted rotate-1 shadow-lg" />
        <div className="h-full w-[60%] flex-shrink-0 rounded-[10%] bg-muted rotate-1 shadow-lg" />
      </div>

      {/* Мягкое размытие по бокам (тоже в процентах от ширины) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[12%] bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[12%] bg-gradient-to-l from-background to-transparent" />
    </div>
  )
}