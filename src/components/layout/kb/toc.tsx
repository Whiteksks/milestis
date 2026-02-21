"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export interface TocItem {
  id: string
  label: string
  level?: 1 | 2 | 3
}

interface TocProps {
  items: TocItem[]
}

export function TableOfContents({ items }: TocProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "")
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[]

    observerRef.current?.disconnect()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0.1 },
    )

    headings.forEach((h) => observerRef.current!.observe(h))

    return () => observerRef.current?.disconnect()
  }, [items])

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const offset = 80
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: "smooth" })
  }

  return (
    <nav className="space-y-1">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        On this page
      </p>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => handleClick(item.id)}
          className={cn(
            "block w-full text-left text-sm transition-colors duration-150 rounded-md px-3 py-1.5",
            item.level === 3 ? "pl-6" : item.level === 2 ? "pl-3" : "pl-3",
            activeId === item.id
              ? "bg-primary/8 font-medium text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
          )}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}
