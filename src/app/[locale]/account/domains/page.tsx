'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Share2, Globe } from 'lucide-react'

export default function DomainsSettingsPage() {

  const books = [
    { id: 1, title: "Свадьба в Алматы", date: "12.08.2024", slug: "wedding-almaty-2024" },
    { id: 2, title: "Путешествие в Турцию", date: "03.05.2024", slug: "travel-turkey-2024" },
    { id: 3, title: "Детский альбом", date: "20.02.2024", slug: "kids-album-2024" },
  ]

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8 mb-8 md:mb-0">
      <h2 className="text-2xl font-bold text-center">Домены и публикации</h2>

      <Card>
        <CardHeader>
          <CardTitle>Ваши фотокниги</CardTitle>
          <CardDescription>
            Каждая книга имеет свой уникальный адрес на основном домене.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {books.map((book) => (
            <div
              key={book.id}
              className="flex items-center justify-between border rounded-lg p-3"
            >
              <div>
                <p className="font-medium">{book.title}</p>
                <p className="text-sm text-muted-foreground">
                  memento-book.com/{book.slug}
                </p>
                <p className="text-xs text-muted-foreground">Создана: {book.date}</p>
              </div>
              <Button variant="secondary" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Поделиться
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
