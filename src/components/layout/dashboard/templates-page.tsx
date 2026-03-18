"use client"

import { useState } from "react"
import { Search, Eye, Sparkles, BookOpen, Layout, LayoutTemplate } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { useTranslations } from "next-intl"

interface Template {
  id: string
  name: string
  type: "photobook" | "site"
  category: string
  description: string
  image: string
  previewImages: string[]
}

const templates: Template[] = [
  { id: "1", name: "Elegant Wedding", type: "photobook", category: "weddings", description: "Timeless design for your special day", image: "/placeholder.svg?height=400&width=600", previewImages: Array(3).fill("/placeholder.svg?height=600&width=800") },
  { id: "2", name: "Modern Minimal", type: "site", category: "minimal", description: "Clean portfolio with focus on your work", image: "/placeholder.svg?height=400&width=600", previewImages: Array(3).fill("/placeholder.svg?height=600&width=800") },
  { id: "3", name: "First Birthday", type: "photobook", category: "birthdays", description: "Celebrate your little one's milestone", image: "/placeholder.svg?height=400&width=600", previewImages: Array(3).fill("/placeholder.svg?height=600&width=800") },
  { id: "4", name: "Creative Portfolio", type: "site", category: "minimal", description: "Bold layouts for creative professionals", image: "/placeholder.svg?height=400&width=600", previewImages: Array(3).fill("/placeholder.svg?height=600&width=800") },
  { id: "5", name: "Rustic Romance", type: "photobook", category: "weddings", description: "Warm, earthy tones for countryside weddings", image: "/placeholder.svg?height=400&width=600", previewImages: Array(3).fill("/placeholder.svg?height=600&width=800") },
  { id: "6", name: "Party Time", type: "photobook", category: "birthdays", description: "Fun and colorful for any celebration", image: "/placeholder.svg?height=400&width=600", previewImages: Array(3).fill("/placeholder.svg?height=600&width=800") },
]

const categories = [
  { id: "all", labelKey: "templates.categories.all" },
  { id: "photobooks", labelKey: "templates.categories.photobooks" },
  { id: "sites", labelKey: "templates.categories.sites" },
  { id: "weddings", labelKey: "templates.categories.weddings" },
  { id: "birthdays", labelKey: "templates.categories.birthdays" },
  { id: "minimal", labelKey: "templates.categories.minimal" },
]

export function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  const [previewIndex, setPreviewIndex] = useState(0)
  const t = useTranslations()

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase())
    if (activeCategory === "all") return matchesSearch
    if (activeCategory === "photobooks") return t.type === "photobook" && matchesSearch
    if (activeCategory === "sites") return t.type === "site" && matchesSearch
    return t.category === activeCategory && matchesSearch
  })

  return (
    <div className="mx-auto max-w-6xl space-y-10">

      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl md:text-3xl">{t('templates.title')}</h1>
        <p className="mt-1 text-muted-foreground">{t('templates.description')}</p>
      </div>

      {/* Filters row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "bg-card text-muted-foreground shadow-sm hover:text-foreground"
              }`}
            >
              {t(cat.labelKey)}
            </button>
          ))}
        </div>

        <div className="relative w-full shrink-0 sm:w-56">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('templates.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-full pl-10"
          />
        </div>
      </div>

      {/* Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="group overflow-hidden rounded-2xl shadow-sm transition-all hover:shadow-md"
            >
              <div className="relative aspect-[3/2] overflow-hidden rounded-t-2xl bg-muted">
                <Image
                  src={template.image || "/placeholder.svg"}
                  alt={template.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-3 bg-foreground/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="rounded-full"
                    onClick={() => { setPreviewTemplate(template); setPreviewIndex(0) }}
                  >
                    <Eye className="mr-1.5 size-3.5" />
                      {t('templates.preview')}
                  </Button>
                  <Button size="sm" className="rounded-full">
                    <Sparkles className="mr-1.5 size-3.5" />
                      {t('templates.use')}
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium">{template.name}</h3>
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                    {template.type === "photobook"
                      ? <><BookOpen className="size-3" /> {t('templates.type.photobook')}</>
                      : <><Layout className="size-3" /> {t('templates.type.site')}</>
                    }
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-secondary">
            <LayoutTemplate className="size-5 text-primary" />
          </div>
          <h3 className="mt-4 font-serif text-xl">{t('templates.noTemplatesFound')}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t('templates.tryAdjusting')}</p>
          <Button
            variant="outline"
            className="mt-6 rounded-full bg-transparent"
            onClick={() => { setActiveCategory("all"); setSearchQuery("") }}
          >
            {t('templates.clearFilters')}
          </Button>
        </div>
      )}

      {/* Preview dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-3xl overflow-hidden rounded-2xl p-0">
          {previewTemplate && (
            <>
              <div className="relative aspect-[4/3] bg-muted">
                <Image
                  src={previewTemplate.previewImages[previewIndex] || "/placeholder.svg"}
                  alt={`${previewTemplate.name} preview`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 768px"
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                  {previewTemplate.previewImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPreviewIndex(idx)}
                      className={`size-2 rounded-full transition-all ${
                        idx === previewIndex ? "w-6 bg-white" : "bg-white/50 hover:bg-white/75"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="p-6">
                <DialogHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <DialogTitle className="font-serif text-xl">{previewTemplate.name}</DialogTitle>
                      <p className="mt-1 text-sm text-muted-foreground">{previewTemplate.description}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                      {previewTemplate.type === "photobook" ? t('templates.type.photobook') : t('templates.type.portfolioSite')}
                    </span>
                  </div>
                </DialogHeader>
                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline" className="rounded-full bg-transparent" onClick={() => setPreviewTemplate(null)}>{t('templates.close')}</Button>
                  <Button className="rounded-full">
                    <Sparkles className="mr-2 size-4" />
                    {t('templates.useThis')}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}
