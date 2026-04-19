"use client"

import { useThemeSelector, useUiSelector, useUiStore, type ThemeCustomDecorations } from '@/editor/lib/store'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MediaPickerModal } from '@/editor/components/editor/layout/Modals/media-picker-modal'
import { Plus, Trash2, Image as ImageIcon, Sparkles, Shuffle } from 'lucide-react'
import { useCallback, useId, MouseEvent } from 'react'
import { cn } from '@/lib/utils'
import { useCanvasScrollContainer } from '@/editor/components/editor/canvas-scroll-context'
import { decorationAnimationOptions, type DecorationAnimation } from '@/editor/lib/decoration-animations'
import { loadImageAspectRatio } from '@/editor/components/editor/layout/decorationEdit/utils'
import { LIMITS } from '@/editor/components/editor/section-settings/ui/panel-ui'
import { DecorationVisual } from '@/editor/components/editor/layout/decorationEdit/decoration-visual'

const DEFAULT_BUBBLE_STYLES = ['soft', 'glass', 'memory'] as const

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const createDecorationId = (prefix = 'decoration') => {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return `${prefix}-${crypto.randomUUID()}`
    }
  } catch {}
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export function DecorationsSettingsPanel() {
  const canvasScrollRef = useCanvasScrollContainer()
  const quickPlacementOwnerId = useId()
  const openMediaPicker = useUiStore((s) => s.openMediaPicker)
  
  const {
    themeCustomizations,
    updateThemeCustomization,
    customDecorations,
    addDecoration,
    updateDecoration,
    removeDecoration,
    resetDecorations,
  } = useThemeSelector((state) => ({
    themeCustomizations: state.themeCustomizations,
    updateThemeCustomization: state.updateThemeCustomization,
    customDecorations: state.customDecorations,
    addDecoration: state.addDecoration,
    updateDecoration: state.updateDecoration,
    removeDecoration: state.removeDecoration,
    resetDecorations: state.resetDecorations,
  }))

  const { selectedDecorationId, setSelectedDecorationId } = useUiSelector((state) => ({
    selectedDecorationId: state.selectedDecorationId,
    setSelectedDecorationId: state.setSelectedDecorationId,
  }))

  const decorations = customDecorations

  const handleQuickPlacement = useCallback(
    async (urls: string[]) => {
      if (!urls.length || !decorations.length) return
      await Promise.all(
        decorations.map(async (decoration, index) => {
          const url = urls[index % urls.length]
          const aspectRatio = await loadImageAspectRatio(url)
          updateDecoration(decoration.id, { kind: 'image', image: url, aspectRatio })
        }),
      )
    },
    [decorations, updateDecoration],
  )

  const handleAddDecoration = useCallback(() => {
    if (decorations.length >= LIMITS.decorations) return
    const scroller = canvasScrollRef?.current
    const contentRoot = scroller?.querySelector<HTMLElement>('[data-canvas-content-root="true"]')

    const position = (() => {
      if (!scroller || !contentRoot) return { top: '10%', left: '10%' }
      const scrollerRect = scroller.getBoundingClientRect()
      const contentRect = contentRoot.getBoundingClientRect()
      if (contentRect.width <= 0 || contentRect.height <= 0) return { top: '10%', left: '10%' }

      const xInContent = (scrollerRect.left + scroller.clientWidth / 2) - contentRect.left
      const yInContent = (scrollerRect.top + scroller.clientHeight / 2) - contentRect.top

      return {
        top: `${clamp((yInContent / contentRect.height) * 95, 0, 100).toFixed(2)}%`,
        left: `${clamp((xInContent / contentRect.width) * 90, 0, 100).toFixed(2)}%`,
      }
    })()

    const id = createDecorationId('decoration')

    const newDecoration: ThemeCustomDecorations = {
      id,
      kind: 'bubble',
      bubbleSeed: id,
      bubbleStyle: DEFAULT_BUBBLE_STYLES[decorations.length % DEFAULT_BUBBLE_STYLES.length],
      position,
      opacity: 1,
      scale: 1,
      responsiveScale: true,
      zIndex: 20,
      name: `Decoration ${decorations.length + 1}`,
      aspectRatio: 1,
    }

    addDecoration(newDecoration)
    setSelectedDecorationId(newDecoration.id)
  }, [canvasScrollRef, decorations, addDecoration, setSelectedDecorationId])

  const handleRemoveDecoration = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const id = event.currentTarget.dataset.decorationRemoveId
    if (!id) return
    event.stopPropagation()
    removeDecoration(id)
    if (selectedDecorationId === id) setSelectedDecorationId(null)
  }, [removeDecoration, selectedDecorationId, setSelectedDecorationId])

  return (
    <div className="h-full flex flex-col">
      <MediaPickerModal ownerId={quickPlacementOwnerId} onSelectImages={handleQuickPlacement} />
      
      <div className="px-5 pb-4 pt-2">
        <div className="flex items-center gap-3 p-1">
          <div className="flex items-center justify-center w-8 h-8 rounded-xs bg-primary/10 border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-tight">Decorations</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {decorations.length > 0 ? (
                <span className="text-primary">{decorations.length} element{decorations.length > 1 ? 's' : ''}</span>
              ) : 'Visual accents'}
            </p>
          </div>
        </div>
      </div>

      <div className="h-px bg-border/40 mx-5" />

      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
        {/* Animation & Add Button */}
        <div className="flex items-end gap-3 mt-4">
          <div className="flex-1 space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Animation</Label>
            <Select
              value={themeCustomizations.decorationAnimation || 'fade'}
              onValueChange={(value) => updateThemeCustomization({ decorationAnimation: value as DecorationAnimation })}
            >
              <SelectTrigger className="h-9 rounded-sm border-border/20 bg-muted/20 hover:bg-muted/30 transition-colors text-[12px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {decorationAnimationOptions.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id} className="text-[12px]">{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            size="sm"
            onClick={handleAddDecoration}
            disabled={decorations.length >= LIMITS.decorations}
            className="h-9 px-4 text-[12px] font-medium rounded-sm active:scale-[0.98] transition-transform"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add New
          </Button>
        </div>

        {decorations.length > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => openMediaPicker(quickPlacementOwnerId)}
            className="w-full h-9 text-[12px] border-border/30 hover:bg-muted/40 transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5 mr-1.5" />
            Quick Placement
          </Button>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
              Elements ({decorations.length}/{LIMITS.decorations})
            </Label>
            {decorations.length > 0 && (
              <button
                onClick={() => { resetDecorations(); setSelectedDecorationId(null); }}
                className="text-[10px] text-muted-foreground/60 hover:text-destructive transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-2">
            {decorations.map((decoration) => {
              const isSelected = selectedDecorationId === decoration.id;
              return (
                <div
                  key={decoration.id}
                  onClick={() => setSelectedDecorationId(decoration.id)}
                  className={cn(
                    'group relative rounded-xs border overflow-hidden cursor-pointer transition-colors',
                    isSelected ? 'bg-background border-border/80 shadow-sm' : 'bg-muted/5 border-border/10 hover:bg-muted/20'
                  )}
                >
                  <div className="flex items-center p-2 gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 relative border border-border/10">
                      <DecorationVisual decoration={decoration} imageClassName="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <Input
                        value={decoration.name || ''}
                        onChange={(e) => updateDecoration(decoration.id, { name: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Unnamed"
                        className="h-6 px-1 -ml-1 text-[12px] font-medium bg-transparent border-transparent shadow-none hover:bg-muted/40 focus-visible:bg-background transition-colors"
                      />
                      <div className="flex items-center gap-2 mt-0.5 text-[9px] text-muted-foreground/60 font-medium uppercase tracking-tight">
                        <span>S: {Math.round((decoration.scale ?? 1) * 100)}%</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-border" />
                        <span>O: {Math.round(decoration.opacity * 100)}%</span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      data-decoration-remove-id={decoration.id}
                      onClick={handleRemoveDecoration}
                      className={cn(
                        "h-8 w-8 p-0 rounded-full shrink-0 transition-opacity",
                        "text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10",
                        isSelected || "group-hover:opacity-100 opacity-0"
                      )}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}