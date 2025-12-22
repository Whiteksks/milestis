"use client"

import { useState } from "react"
import { Search, Eye, Sparkles, BookOpen, Layout, LayoutTemplate } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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
  {
    id: "1",
    name: "Elegant Wedding",
    type: "photobook",
    category: "weddings",
    description: "Timeless design for your special day",
    image: "/placeholder.svg?height=400&width=600",
    previewImages: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
  },
  {
    id: "2",
    name: "Modern Minimal",
    type: "site",
    category: "minimal",
    description: "Clean portfolio with focus on your work",
    image: "/placeholder.svg?height=400&width=600",
    previewImages: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
  },
  {
    id: "3",
    name: "First Birthday",
    type: "photobook",
    category: "birthdays",
    description: "Celebrate your little one's milestone",
    image: "/placeholder.svg?height=400&width=600",
    previewImages: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
  },
  {
    id: "4",
    name: "Creative Portfolio",
    type: "site",
    category: "minimal",
    description: "Bold layouts for creative professionals",
    image: "/placeholder.svg?height=400&width=600",
    previewImages: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
  },
  {
    id: "5",
    name: "Rustic Romance",
    type: "photobook",
    category: "weddings",
    description: "Warm, earthy tones for countryside weddings",
    image: "/placeholder.svg?height=400&width=600",
    previewImages: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
  },
  {
    id: "6",
    name: "Party Time",
    type: "photobook",
    category: "birthdays",
    description: "Fun and colorful for any celebration",
    image: "/placeholder.svg?height=400&width=600",
    previewImages: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
  },
]

const categories = [
  { id: "all", label: "All" },
  { id: "photobooks", label: "Photobooks" },
  { id: "sites", label: "Portfolio Sites" },
  { id: "weddings", label: "Weddings" },
  { id: "birthdays", label: "Birthdays" },
  { id: "minimal", label: "Minimal" },
]

export function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  const [previewIndex, setPreviewIndex] = useState(0)

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeCategory === "all") return matchesSearch
    if (activeCategory === "photobooks") return template.type === "photobook" && matchesSearch
    if (activeCategory === "sites") return template.type === "site" && matchesSearch
    return template.category === activeCategory && matchesSearch
  })

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Templates</h1>
        <p className="text-muted-foreground">Choose a preset to start your photo book or portfolio</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="h-auto flex-wrap gap-1 bg-transparent p-0">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="rounded-full border border-transparent bg-muted/50 px-4 py-2 text-sm data-[state=active]:border-primary/20 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search templates"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-full border-muted-foreground/20 bg-card/80 pl-10 backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="group overflow-hidden rounded-3xl border-muted-foreground/10 bg-card/80 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                <img
                  src={template.image || "/placeholder.svg"}
                  alt={template.name}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-3 bg-foreground/60 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="rounded-full"
                    onClick={() => {
                      setPreviewTemplate(template)
                      setPreviewIndex(0)
                    }}
                  >
                    <Eye className="mr-2 size-4" />
                    Preview
                  </Button>
                  <Button size="sm" className="rounded-full">
                    <Sparkles className="mr-2 size-4" />
                    Use
                  </Button>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-foreground">{template.name}</h3>
                  <Badge variant="secondary" className="shrink-0 rounded-full bg-primary/10 text-primary">
                    {template.type === "photobook" ? (
                      <>
                        <BookOpen className="mr-1 size-3" />
                        Photobook
                      </>
                    ) : (
                      <>
                        <Layout className="mr-1 size-3" />
                        Site
                      </>
                    )}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card className="rounded-3xl border-dashed border-muted-foreground/20 bg-card/50 py-16 text-center backdrop-blur-sm">
          <CardContent className="space-y-3">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-muted">
              <LayoutTemplate className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">No templates found</h3>
            <p className="mx-auto max-w-sm text-sm text-muted-foreground">
              Try adjusting your search or filter to find what you&apos;re looking for
            </p>
            <Button
              variant="outline"
              className="mt-4 rounded-full bg-transparent"
              onClick={() => {
                setActiveCategory("all")
                setSearchQuery("")
              }}
            >
              Clear filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Preview Modal */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-3xl overflow-hidden rounded-3xl p-0">
          {previewTemplate && (
            <>
              <div className="relative aspect-[4/3] bg-muted">
                <img
                  src={previewTemplate.previewImages[previewIndex] || "/placeholder.svg"}
                  alt={`${previewTemplate.name} preview`}
                  className="size-full object-cover"
                />
                {/* Preview Navigation Dots */}
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
                    <div className="space-y-1">
                      <DialogTitle className="text-xl">{previewTemplate.name}</DialogTitle>
                      <p className="text-sm text-muted-foreground">{previewTemplate.description}</p>
                    </div>
                    <Badge variant="secondary" className="shrink-0 rounded-full bg-primary/10 text-primary">
                      {previewTemplate.type === "photobook" ? "Photobook" : "Portfolio Site"}
                    </Badge>
                  </div>
                </DialogHeader>
                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    className="rounded-full bg-transparent"
                    onClick={() => setPreviewTemplate(null)}
                  >
                    Close
                  </Button>
                  <Button className="rounded-full">
                    <Sparkles className="mr-2 size-4" />
                    Use this template
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
