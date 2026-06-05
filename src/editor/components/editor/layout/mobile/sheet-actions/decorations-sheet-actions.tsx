"use client"

import { useTranslations } from 'next-intl'
import { useDecorationsToolbar } from "@/editor/hooks/use-decorations-toolbar"
import { DecorationToolbar } from "../../FloatingActions/decoration-toolbar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

/**
 * Mobile sheet snap-2 quick-actions for the Decorations tab.
 * Same logic as DecorationsFloatingToolbar — touch-friendly sizing only.
 * DecorationToolbar handles its own collapsed/expanded state and popovers.
 */
export function DecorationsSheetActions({
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

  if (!normalizedDecorations.length) {
    return (
      <div className="flex items-center px-3 py-2">
        <Button
          type="button"
          variant="ghost"
          onClick={handleAddDecoration}
          className="h-10 px-3.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors gap-2"
        >
          <Plus className="h-4 w-4" />
          {t('addNew')}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center px-3 py-2 overflow-x-auto no-scrollbar">
      <DecorationToolbar
        decorations={normalizedDecorations}
        activeDecorationId={activeDecorationId}
        onActiveDecorationChange={setPreferredDecorationId}
        decoration={selectedDecoration}
        onUpdate={selectedDecoration ? (u) => handleUpdate(selectedDecoration.id, u) : undefined}
        onDelete={selectedDecoration ? () => handleRemove(selectedDecoration.id) : undefined}
        onImageSelect={selectedDecoration ? handleImageSelect : undefined}
        onCloseSettings={() => setSelectedDecorationId(null)}
        onOpenSettings={() => activeDecorationId && setSelectedDecorationId(activeDecorationId)}
        onSelectDecoration={(id) => setSelectedDecorationId(id)}
        onLocate={selectedDecoration ? handleLocate : undefined}
        onAddDecoration={handleAddDecoration}
      />
    </div>
  )
}
