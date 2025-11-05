"use client"

import type { CanvasBlock, NestedElement } from "@/editorPage/lib/block-types"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BottomSheet } from "./bottom-sheet"

interface SettingsBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  block?: CanvasBlock
  element?: NestedElement
  onUpdateBlock?: (blockId: string, updates: Partial<CanvasBlock>) => void
  onUpdateElement?: (blockId: string, elementId: string, updates: Partial<NestedElement>) => void
}

export function SettingsBottomSheet({
  isOpen,
  onClose,
  block,
  element,
  onUpdateBlock,
  onUpdateElement,
}: SettingsBottomSheetProps) {
  if (!block) return null

  if (element && onUpdateElement) {
    return (
      <BottomSheet isOpen={isOpen} onClose={onClose} title={`Edit ${element.type}`}>
        <div className="px-4 space-y-4 py-4">
          <div>
            <label className="text-xs font-medium text-foreground block mb-2">Content</label>
            <input
              type="text"
              value={element.content}
              onChange={(e) => onUpdateElement(block.id, element.id, { content: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground text-sm"
            />
          </div>

          {element.type !== "divider" && (
            <>
              <div>
                <label className="text-xs font-medium text-foreground block mb-2">Size</label>
                <select
                  value={element.style?.size || "medium"}
                  onChange={(e) =>
                    onUpdateElement(block.id, element.id, {
                      style: { ...element.style, size: e.target.value as any },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground text-sm"
                >
                  <option>small</option>
                  <option>medium</option>
                  <option>large</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-2">Alignment</label>
                <select
                  value={element.style?.align || "left"}
                  onChange={(e) =>
                    onUpdateElement(block.id, element.id, {
                      style: { ...element.style, align: e.target.value as any },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground text-sm"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </>
          )}

          <Button onClick={onClose} className="w-full bg-primary text-primary-foreground">
            Done
          </Button>
        </div>
      </BottomSheet>
    )
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={block.title}>
      <div className="px-4 py-4">
        <Tabs defaultValue="style" className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-muted mb-4">
            <TabsTrigger value="style" className="text-xs">
              Style
            </TabsTrigger>
            <TabsTrigger value="content" className="text-xs">
              Content
            </TabsTrigger>
            <TabsTrigger value="effects" className="text-xs">
              Effects
            </TabsTrigger>
          </TabsList>

          <div className="space-y-4">
            <TabsContent value="style" className="space-y-4 mt-0">
              <div>
                <label className="text-xs font-medium text-foreground block mb-2">Background</label>
                <input
                  type="text"
                  value={block.settings.background}
                  onChange={(e) =>
                    onUpdateBlock?.(block.id, {
                      settings: { ...block.settings, background: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-2">Text Color</label>
                <input
                  type="text"
                  value={block.settings.textColor}
                  onChange={(e) =>
                    onUpdateBlock?.(block.id, {
                      settings: { ...block.settings, textColor: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-2">Padding</label>
                <select
                  value={block.settings.padding}
                  onChange={(e) =>
                    onUpdateBlock?.(block.id, {
                      settings: { ...block.settings, padding: e.target.value as any },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground text-sm"
                >
                  <option>small</option>
                  <option>medium</option>
                  <option>large</option>
                </select>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4 mt-0">
              <div>
                <label className="text-xs font-medium text-foreground block mb-2">Title</label>
                <input
                  type="text"
                  value={block.title}
                  onChange={(e) => onUpdateBlock?.(block.id, { title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-2">Description</label>
                <textarea
                  value={block.description}
                  onChange={(e) => onUpdateBlock?.(block.id, { description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground text-sm h-24 resize-none"
                />
              </div>
            </TabsContent>

            <TabsContent value="effects" className="space-y-4 mt-0">
              <div>
                <label className="text-xs font-medium text-foreground block mb-2">Animation</label>
                <select
                  value={block.settings.animation}
                  onChange={(e) =>
                    onUpdateBlock?.(block.id, {
                      settings: { ...block.settings, animation: e.target.value as any },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground text-sm"
                >
                  <option>none</option>
                  <option>fade</option>
                  <option>slide</option>
                  <option>scale</option>
                </select>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex gap-2 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent hover:bg-muted/50">
            Close
          </Button>
          <Button onClick={onClose} className="flex-1 bg-primary text-primary-foreground">
            Done
          </Button>
        </div>
      </div>
    </BottomSheet>
  )
}
