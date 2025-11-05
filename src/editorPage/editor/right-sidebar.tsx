"use client"

import { motion } from "framer-motion"
import type { CanvasBlock } from "@/editorPage/lib/block-types"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight } from "lucide-react"
import { NAVBAR_PRESETS } from "@/editorPage/lib/presets/navbarPresets"
import { HERO_PRESETS } from "@/editorPage/lib/presets/heroPresets"
import { GALLERY_PRESETS } from "@/editorPage/lib/presets/galleryPresets"
import { TEXT_PRESETS } from "@/editorPage/lib/presets/textPresets"
import { CTA_PRESETS } from "@/editorPage/lib/presets/ctaPresets"
import { FEATURES_PRESETS } from "@/editorPage/lib/presets/featuresPresets"
import { CONTACT_PRESETS } from "@/editorPage/lib/presets/contactPresets"
import { TESTIMONIALS_PRESETS } from "@/editorPage/lib/presets/testimonialsPresets"
import { QUOTE_PRESETS } from "@/editorPage/lib/presets/quotePresets"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"

interface RightSidebarProps {
  block: CanvasBlock
  onUpdateBlock: (blockId: string, updates: Partial<CanvasBlock>) => void
  onClose: () => void
}

export function RightSidebar({ block, onUpdateBlock, onClose }: RightSidebarProps) {
  const handleReset = () => {
    if (block && onUpdateBlock) {
      onUpdateBlock(block.id, {
        settings: {
          background: block.settings.background,
          textColor: block.settings.textColor,
          padding: "medium",
          animation: "fade",
        },
      })
    }
  }

  const getPresets = () => {
    switch (block.type) {
      case "navbar":
        return NAVBAR_PRESETS
      case "hero":
        return HERO_PRESETS
      case "gallery":
        return GALLERY_PRESETS
      case "text":
        return TEXT_PRESETS
      case "cta":
        return CTA_PRESETS
      case "features":
        return FEATURES_PRESETS
      case "contact":
        return CONTACT_PRESETS
      case "testimonials":
        return TESTIMONIALS_PRESETS
      case "quote":
        return QUOTE_PRESETS
      default:
        return null
    }
  }

  const presets = getPresets()
  const hasPresets = presets !== null

  return (
    <motion.div
      className="relative w-72 h-screen border-l border-border bg-card flex flex-col"
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={onClose}
        className="absolute -left-6 top-1/2 -translate-y-1/2 w-6 h-12 bg-card border border-r-0 border-border rounded-l-md flex items-center justify-center hover:bg-muted transition-colors group"
      >
        <ChevronRight
          size={14}
          className="text-muted-foreground group-hover:text-foreground transition-colors"
          strokeWidth={2}
        />
      </button>

      <div className="flex flex-col border-b border-border bg-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground mb-1">Selected Block</p>
            <p className="text-base font-medium text-primary">{block.title}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue={hasPresets ? "design" : "style"} className="w-full p-4">
          <TabsList className={`w-full grid ${hasPresets ? "grid-cols-2" : "grid-cols-3"} bg-muted`}>
            {hasPresets && (
              <TabsTrigger value="design" className="text-xs">
                Design
              </TabsTrigger>
            )}
            {!hasPresets && (
              <TabsTrigger value="style" className="text-xs">
                Style
              </TabsTrigger>
            )}
            <TabsTrigger value="content" className="text-xs">
              Content
            </TabsTrigger>
            {!hasPresets && (
              <TabsTrigger value="effects" className="text-xs">
                Effects
              </TabsTrigger>
            )}
          </TabsList>

          {hasPresets && presets && (
            <TabsContent value="design" className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-medium text-foreground block mb-3">Choose Design Preset</label>
                <div className="space-y-2">
                  {Object.entries(presets).map(([key, preset]) => (
                    <button
                      key={key}
                      onClick={() =>
                        onUpdateBlock?.(block.id, {
                          settings: { ...block.settings, preset: key },
                        })
                      }
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        block.settings?.preset === key
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="font-medium text-sm">{preset.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{preset.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>
          )}

          {!hasPresets && (
            <TabsContent value="style" className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-medium text-foreground block mb-2">Background</label>
                <input
                  type="text"
                  value={block.settings.background}
                  onChange={(e) =>
                    onUpdateBlock(block.id, {
                      settings: { ...block.settings, background: e.target.value },
                    })
                  }
                  className="w-full px-2 py-1.5 rounded border border-border bg-input text-foreground text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-2">Text Color</label>
                <input
                  type="text"
                  value={block.settings.textColor}
                  onChange={(e) =>
                    onUpdateBlock(block.id, {
                      settings: { ...block.settings, textColor: e.target.value },
                    })
                  }
                  className="w-full px-2 py-1.5 rounded border border-border bg-input text-foreground text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-2">Padding</label>
                <select
                  value={block.settings.padding}
                  onChange={(e) =>
                    onUpdateBlock(block.id, {
                      settings: { ...block.settings, padding: e.target.value as any },
                    })
                  }
                  className="w-full px-2 py-1.5 rounded border border-border bg-input text-foreground text-sm"
                >
                  <option>small</option>
                  <option>medium</option>
                  <option>large</option>
                </select>
              </div>
            </TabsContent>
          )}

          <TabsContent value="content" className="space-y-4 mt-4">
            {block.type === "navbar" && (
              <div>
                <label className="text-xs font-medium text-foreground block mb-2">Navigation Items</label>
                <div className="space-y-2">
                  {(block.settings?.navItems || []).map((item: any, index: number) => (
                    <div key={index} className="p-2 border border-border rounded space-y-1">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const newItems = [...(block.settings?.navItems || [])]
                          newItems[index] = { ...item, title: e.target.value }
                          onUpdateBlock?.(block.id, {
                            settings: { ...block.settings, navItems: newItems },
                          })
                        }}
                        className="w-full px-2 py-1 rounded border border-border bg-input text-foreground text-xs"
                        placeholder="Title"
                      />
                      <input
                        type="text"
                        value={item.href}
                        onChange={(e) => {
                          const newItems = [...(block.settings?.navItems || [])]
                          newItems[index] = { ...item, href: e.target.value }
                          onUpdateBlock?.(block.id, {
                            settings: { ...block.settings, navItems: newItems },
                          })
                        }}
                        className="w-full px-2 py-1 rounded border border-border bg-input text-foreground text-xs"
                        placeholder="URL"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newItems = (block.settings?.navItems || []).filter((_: any, i: number) => i !== index)
                          onUpdateBlock?.(block.id, {
                            settings: { ...block.settings, navItems: newItems },
                          })
                        }}
                        className="w-full text-xs"
                      >
                        <Trash2 className="mr-2 h-3 w-3" />
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newItems = [...(block.settings?.navItems || []), { title: "New Item", href: "#" }]
                      onUpdateBlock?.(block.id, {
                        settings: { ...block.settings, navItems: newItems },
                      })
                    }}
                    className="w-full text-xs"
                  >
                    <Plus className="mr-2 h-3 w-3" />
                    Add Nav Item
                  </Button>
                </div>
              </div>
            )}

            {block.type === "hero" && (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Title</Label>
                  <Input
                    value={block.settings.heroTitle || ""}
                    onChange={(e) =>
                      onUpdateBlock(block.id, {
                        settings: { ...block.settings, heroTitle: e.target.value },
                      })
                    }
                    className="text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Subtitle</Label>
                  <Textarea
                    value={block.settings.heroSubtitle || ""}
                    onChange={(e) =>
                      onUpdateBlock(block.id, {
                        settings: { ...block.settings, heroSubtitle: e.target.value },
                      })
                    }
                    className="text-xs"
                    rows={3}
                  />
                </div>
                <div>
                  <Label className="text-xs">Image URL</Label>
                  <Input
                    value={block.settings.heroImage || ""}
                    onChange={(e) =>
                      onUpdateBlock(block.id, {
                        settings: { ...block.settings, heroImage: e.target.value },
                      })
                    }
                    className="text-xs"
                  />
                </div>
              </div>
            )}

            {block.type === "gallery" && (
              <div>
                <Label className="text-xs">Images</Label>
                <div className="mt-2 space-y-2">
                  {(block.settings.galleryImages || []).map((img: any, idx: number) => (
                    <div key={img.id} className="space-y-1 rounded border p-2">
                      <Input
                        placeholder="Image URL"
                        value={img.url}
                        onChange={(e) => {
                          const newImages = [...(block.settings.galleryImages || [])]
                          newImages[idx] = { ...img, url: e.target.value }
                          onUpdateBlock(block.id, {
                            settings: { ...block.settings, galleryImages: newImages },
                          })
                        }}
                        className="text-xs"
                      />
                      <Input
                        placeholder="Caption"
                        value={img.caption}
                        onChange={(e) => {
                          const newImages = [...(block.settings.galleryImages || [])]
                          newImages[idx] = { ...img, caption: e.target.value }
                          onUpdateBlock(block.id, {
                            settings: { ...block.settings, galleryImages: newImages },
                          })
                        }}
                        className="text-xs"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newImages = (block.settings.galleryImages || []).filter(
                            (_: any, i: number) => i !== idx,
                          )
                          onUpdateBlock(block.id, {
                            settings: { ...block.settings, galleryImages: newImages },
                          })
                        }}
                        className="w-full text-xs"
                      >
                        <Trash2 className="mr-2 h-3 w-3" />
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newImages = [
                        ...(block.settings.galleryImages || []),
                        {
                          id: Date.now().toString(),
                          url: "/placeholder.svg?height=300&width=400",
                          caption: "New Image",
                        },
                      ]
                      onUpdateBlock(block.id, {
                        settings: { ...block.settings, galleryImages: newImages },
                      })
                    }}
                    className="w-full text-xs"
                  >
                    <Plus className="mr-2 h-3 w-3" />
                    Add Image
                  </Button>
                </div>
              </div>
            )}

            {block.type === "text" && (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Heading</Label>
                  <Input
                    value={block.settings.textHeading || ""}
                    onChange={(e) =>
                      onUpdateBlock(block.id, {
                        settings: { ...block.settings, textHeading: e.target.value },
                      })
                    }
                    className="text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Content</Label>
                  <Textarea
                    rows={6}
                    value={block.settings.textContent || ""}
                    onChange={(e) =>
                      onUpdateBlock(block.id, {
                        settings: { ...block.settings, textContent: e.target.value },
                      })
                    }
                    className="text-xs"
                  />
                </div>
              </div>
            )}

            {block.type === "cta" && (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Title</Label>
                  <Input
                    value={block.settings.ctaTitle || ""}
                    onChange={(e) =>
                      onUpdateBlock(block.id, {
                        settings: { ...block.settings, ctaTitle: e.target.value },
                      })
                    }
                    className="text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Description</Label>
                  <Textarea
                    value={block.settings.ctaDescription || ""}
                    onChange={(e) =>
                      onUpdateBlock(block.id, {
                        settings: { ...block.settings, ctaDescription: e.target.value },
                      })
                    }
                    className="text-xs"
                    rows={3}
                  />
                </div>
                <div>
                  <Label className="text-xs">Button Text</Label>
                  <Input
                    value={block.settings.ctaButton?.text || ""}
                    onChange={(e) =>
                      onUpdateBlock(block.id, {
                        settings: {
                          ...block.settings,
                          ctaButton: {
                            ...block.settings.ctaButton,
                            text: e.target.value,
                            href: block.settings.ctaButton?.href || "#",
                          },
                        },
                      })
                    }
                    className="text-xs"
                  />
                </div>
              </div>
            )}

            {block.type === "features" && (
              <div>
                <div className="mb-3">
                  <Label className="text-xs">Title</Label>
                  <Input
                    value={block.settings.featuresTitle || ""}
                    onChange={(e) =>
                      onUpdateBlock(block.id, {
                        settings: { ...block.settings, featuresTitle: e.target.value },
                      })
                    }
                    className="text-xs"
                  />
                </div>
                <Label className="text-xs">Features</Label>
                <div className="mt-2 space-y-2">
                  {(block.settings.featuresItems || []).map((item: any, idx: number) => (
                    <div key={item.id} className="space-y-1 rounded border p-2">
                      <Input
                        placeholder="Icon (emoji)"
                        value={item.icon}
                        onChange={(e) => {
                          const newItems = [...(block.settings.featuresItems || [])]
                          newItems[idx] = { ...item, icon: e.target.value }
                          onUpdateBlock(block.id, {
                            settings: { ...block.settings, featuresItems: newItems },
                          })
                        }}
                        className="text-xs"
                      />
                      <Input
                        placeholder="Title"
                        value={item.title}
                        onChange={(e) => {
                          const newItems = [...(block.settings.featuresItems || [])]
                          newItems[idx] = { ...item, title: e.target.value }
                          onUpdateBlock(block.id, {
                            settings: { ...block.settings, featuresItems: newItems },
                          })
                        }}
                        className="text-xs"
                      />
                      <Textarea
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => {
                          const newItems = [...(block.settings.featuresItems || [])]
                          newItems[idx] = { ...item, description: e.target.value }
                          onUpdateBlock(block.id, {
                            settings: { ...block.settings, featuresItems: newItems },
                          })
                        }}
                        className="text-xs"
                        rows={2}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newItems = (block.settings.featuresItems || []).filter((_: any, i: number) => i !== idx)
                          onUpdateBlock(block.id, {
                            settings: { ...block.settings, featuresItems: newItems },
                          })
                        }}
                        className="w-full text-xs"
                      >
                        <Trash2 className="mr-2 h-3 w-3" />
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newItems = [
                        ...(block.settings.featuresItems || []),
                        { id: Date.now().toString(), icon: "⭐", title: "New Feature", description: "Description" },
                      ]
                      onUpdateBlock(block.id, {
                        settings: { ...block.settings, featuresItems: newItems },
                      })
                    }}
                    className="w-full text-xs"
                  >
                    <Plus className="mr-2 h-3 w-3" />
                    Add Feature
                  </Button>
                </div>
              </div>
            )}

            {block.type === "contact" && (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Title</Label>
                  <Input
                    value={block.settings.contactTitle || ""}
                    onChange={(e) =>
                      onUpdateBlock(block.id, {
                        settings: { ...block.settings, contactTitle: e.target.value },
                      })
                    }
                    className="text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Description</Label>
                  <Textarea
                    value={block.settings.contactDescription || ""}
                    onChange={(e) =>
                      onUpdateBlock(block.id, {
                        settings: { ...block.settings, contactDescription: e.target.value },
                      })
                    }
                    className="text-xs"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {block.type === "testimonials" && (
              <div>
                <div className="mb-3">
                  <Label className="text-xs">Title</Label>
                  <Input
                    value={block.settings.testimonialsTitle || ""}
                    onChange={(e) =>
                      onUpdateBlock(block.id, {
                        settings: { ...block.settings, testimonialsTitle: e.target.value },
                      })
                    }
                    className="text-xs"
                  />
                </div>
                <Label className="text-xs">Testimonials</Label>
                <div className="mt-2 space-y-2">
                  {(block.settings.testimonialsItems || []).map((item: any, idx: number) => (
                    <div key={item.id} className="space-y-1 rounded border p-2">
                      <Input
                        placeholder="Name"
                        value={item.name}
                        onChange={(e) => {
                          const newItems = [...(block.settings.testimonialsItems || [])]
                          newItems[idx] = { ...item, name: e.target.value }
                          onUpdateBlock(block.id, {
                            settings: { ...block.settings, testimonialsItems: newItems },
                          })
                        }}
                        className="text-xs"
                      />
                      <Input
                        placeholder="Role"
                        value={item.role}
                        onChange={(e) => {
                          const newItems = [...(block.settings.testimonialsItems || [])]
                          newItems[idx] = { ...item, role: e.target.value }
                          onUpdateBlock(block.id, {
                            settings: { ...block.settings, testimonialsItems: newItems },
                          })
                        }}
                        className="text-xs"
                      />
                      <Textarea
                        placeholder="Testimonial"
                        value={item.content}
                        onChange={(e) => {
                          const newItems = [...(block.settings.testimonialsItems || [])]
                          newItems[idx] = { ...item, content: e.target.value }
                          onUpdateBlock(block.id, {
                            settings: { ...block.settings, testimonialsItems: newItems },
                          })
                        }}
                        className="text-xs"
                        rows={2}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newItems = (block.settings.testimonialsItems || []).filter(
                            (_: any, i: number) => i !== idx,
                          )
                          onUpdateBlock(block.id, {
                            settings: { ...block.settings, testimonialsItems: newItems },
                          })
                        }}
                        className="w-full text-xs"
                      >
                        <Trash2 className="mr-2 h-3 w-3" />
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newItems = [
                        ...(block.settings.testimonialsItems || []),
                        {
                          id: Date.now().toString(),
                          name: "Name",
                          role: "Role",
                          content: "Testimonial",
                          avatar: "/placeholder.svg?height=80&width=80",
                        },
                      ]
                      onUpdateBlock(block.id, {
                        settings: { ...block.settings, testimonialsItems: newItems },
                      })
                    }}
                    className="w-full text-xs"
                  >
                    <Plus className="mr-2 h-3 w-3" />
                    Add Testimonial
                  </Button>
                </div>
              </div>
            )}

            {block.type === "quote" && (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Quote Text</Label>
                  <Textarea
                    rows={4}
                    value={block.settings.quoteText || ""}
                    onChange={(e) =>
                      onUpdateBlock(block.id, {
                        settings: { ...block.settings, quoteText: e.target.value },
                      })
                    }
                    className="text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Author</Label>
                  <Input
                    value={block.settings.quoteAuthor || ""}
                    onChange={(e) =>
                      onUpdateBlock(block.id, {
                        settings: { ...block.settings, quoteAuthor: e.target.value },
                      })
                    }
                    className="text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Role</Label>
                  <Input
                    value={block.settings.quoteRole || ""}
                    onChange={(e) =>
                      onUpdateBlock(block.id, {
                        settings: { ...block.settings, quoteRole: e.target.value },
                      })
                    }
                    className="text-xs"
                  />
                </div>
              </div>
            )}
          </TabsContent>

          {!hasPresets && (
            <TabsContent value="effects" className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-medium text-foreground block mb-2">Animation</label>
                <select
                  value={block.settings.animation}
                  onChange={(e) =>
                    onUpdateBlock(block.id, {
                      settings: { ...block.settings, animation: e.target.value as any },
                    })
                  }
                  className="w-full px-2 py-1.5 rounded border border-border bg-input text-foreground text-sm"
                >
                  <option>none</option>
                  <option>fade</option>
                  <option>slide</option>
                  <option>scale</option>
                </select>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>

      <div className="border-t border-border p-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 bg-transparent text-xs hover:bg-muted"
          onClick={handleReset}
        >
          Reset
        </Button>
        <Button
          size="sm"
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
          onClick={onClose}
        >
          Done
        </Button>
      </div>
    </motion.div>
  )
}
