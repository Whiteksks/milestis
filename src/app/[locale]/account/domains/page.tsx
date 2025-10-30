'use client'

import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'

export default function DomainsSettingsPage() {

  const books = [
    { id: 1, title: "Свадьба в Алматы", date: "12.08.2024", slug: "wedding-almaty-2024" },
    { id: 2, title: "Путешествие в Турцию", date: "03.05.2024", slug: "travel-turkey-2024" },
    { id: 3, title: "Детский альбом", date: "20.02.2024", slug: "kids-album-2024" },
  ]

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8 mb-8 md:mb-0">
      <header className="text-center">
        <h2 className="text-2xl font-bold mb-1">Домены и публикации</h2>
        <p className="text-sm text-muted-foreground">
          Каждая книга имеет свой уникальный адрес на основном домене.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        {books.map((book) => (
          <div
            key={book.id}
            className="flex items-center justify-between bg-card border rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div>
              <p className="font-semibold">{book.title}</p>
              <p className="text-sm text-muted-foreground">
                milestis.site/{book.slug}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Создана: {book.date}
              </p>
            </div>

            <Button variant="secondary" size="sm" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Поделиться
            </Button>
          </div>
        ))}
      </section>
    </div>
  )
}
