"use client"

import { useTranslations } from 'next-intl'
import { useDecorationsToolbar } from "@/editor/hooks/use-decorations-toolbar"
import { DecorationToolbar } from "./decoration-toolbar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function DecorationsFloatingToolbar({
  scrollContainerRef,
}: {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
}) {
  const t = useTranslations('editor.controls.decorations')
  const {
    normalizedDecorations,
    activeDecorationId,
    selectedDecoration,
    setPreferredDecorationId,
    handleUpdate,
    handleRemove,
    handleImageSelect,
    handleLocate,
    handleAddDecoration,
    setSelectedDecorationId,
  } = useDecorationsToolbar(scrollContainerRef)

  // When there are no decorations yet, show a minimal "add" prompt
  if (!normalizedDecorations.length) {
    return (
      <div className="h-10 px-1.5 flex items-center">
        <Button
          type="button"
          variant="ghost"
          onClick={handleAddDecoration}
          className="h-8 px-3 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          {t('addNew')}
        </Button>
      </div>
    )
  }

  return (
    <DecorationToolbar
      decorations={normalizedDecorations}
      activeDecorationId={activeDecorationId}
      onActiveDecorationChange={(id) => setPreferredDecorationId(id)}
      decoration={selectedDecoration}
      onUpdate={selectedDecoration ? (updates) => handleUpdate(selectedDecoration.id, updates) : undefined}
      onDelete={selectedDecoration ? () => handleRemove(selectedDecoration.id) : undefined}
      onImageSelect={selectedDecoration ? handleImageSelect : undefined}
      onCloseSettings={() => setSelectedDecorationId(null)}
      onOpenSettings={() => activeDecorationId && setSelectedDecorationId(activeDecorationId)}
      onSelectDecoration={(id) => setSelectedDecorationId(id)}
      onLocate={selectedDecoration ? handleLocate : undefined}
      onAddDecoration={handleAddDecoration}
    />
  )
}
