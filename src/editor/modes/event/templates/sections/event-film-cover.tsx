/** Lightweight cover used in the template picker preview card — no data deps. */
export function EventFilmCover() {
  return (
    <div className="flex h-full w-full bg-background p-px">
      <div className="grid w-full grid-cols-2 gap-px">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-muted" />
        ))}
      </div>
    </div>
  )
}
