/** Lightweight cover used in the template picker preview card — no data deps. */
export function EventGalleryCover() {
  return (
    <div className="flex h-full w-full flex-col bg-background p-1.5">
      {/* Grid stub — mirrors the real columns-2/3/4 masonry layout */}
      <div className="grid flex-1 grid-cols-3 gap-0.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-sm bg-muted" />
        ))}
      </div>
    </div>
  )
}
