"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  LayoutTemplate,
  Settings2,
  GripVertical,
  Edit3,
  Save,
  Share2,
  Image as ImageIcon,
  Type,
  Layers,
} from "lucide-react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import DraggablePreview from "@/editor/layout/DraggablePreview";
import useEditorDnDStore, {
  EditorBlock,
} from "@/editor/store/useEditorDnDStore";

const AVAILABLE_BLOCKS = [
  { id: "HeaderBlock", label: "Header", componentName: "HeaderBlock" },
  { id: "TestComponentA", label: "Text A", componentName: "TestComponentA" },
  { id: "TestComponentB", label: "Text B", componentName: "TestComponentB" },
];

type MobileSheetView = "blocks" | "inspector" | "settings";

const NAV_ITEMS: Array<{
  id: MobileSheetView;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}> = [
  { id: "blocks", label: "Блоки", icon: LayoutTemplate },
  { id: "inspector", label: "Слои", icon: Layers },
  { id: "settings", label: "Настройки", icon: Settings2 },
];

function SortableInspectorItem({ block }: { block: EditorBlock }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: block.id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="rounded-xl border border-border bg-card p-3 shadow-sm"
    >
      <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
        <GripVertical className="h-4 w-4 shrink-0" />
        <span className="truncate">{block.id}</span>
      </div>
      <div
        className="mt-3 overflow-hidden rounded-lg border border-border/50 bg-background"
        style={{ height: "64px" }}
      >
        <div
          style={{
            width: "250%",
            height: "250%",
            transform: "scale(0.4)",
            transformOrigin: "top left",
            pointerEvents: "none",
          }}
        >
          {block.component}
        </div>
      </div>
    </div>
  );
}

function BlocksSheetContent() {
  return (
    <div className="grid gap-3">
      {AVAILABLE_BLOCKS.map((block) => (
        <DraggablePreview
          key={block.id}
          id={`new:${block.componentName}`}
          label={block.label}
          componentName={block.componentName}
        />
      ))}
    </div>
  );
}

function InspectorSheetContent() {
  const { blocks, moveBlock } = useEditorDnDStore();

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const activeIndex = blocks.findIndex((block) => block.id === active.id);
      const overIndex = blocks.findIndex((block) => block.id === over.id);

      if (activeIndex !== -1 && overIndex !== -1) {
        moveBlock(activeIndex, overIndex);
      }
    },
    [blocks, moveBlock],
  );

  if (blocks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-6 text-center text-sm text-muted-foreground">
        Добавьте блоки, чтобы управлять порядком.
      </div>
    );
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={blocks} strategy={verticalListSortingStrategy}>
        <div className="grid gap-3">
          {blocks.map((block) => (
            <SortableInspectorItem key={block.id} block={block} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SettingsSheetContent() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Редактирование</h3>
        <div className="grid gap-2">
          <Button variant="outline" className="justify-start gap-2">
            <Type className="h-4 w-4" /> Изменить текст
          </Button>
          <Button variant="outline" className="justify-start gap-2">
            <ImageIcon className="h-4 w-4" /> Изменить изображение
          </Button>
          <Button variant="outline" className="justify-start gap-2">
            <Edit3 className="h-4 w-4" /> Дополнительные параметры
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Файл</h3>
        <div className="grid gap-2">
          <Button variant="outline" className="justify-start gap-2">
            <Save className="h-4 w-4" /> Сохранить проект
          </Button>
          <Button variant="outline" className="justify-start gap-2">
            <Share2 className="h-4 w-4" /> Экспортировать
          </Button>
        </div>
      </div>
    </div>
  );
}

export function MobileEditorNavigation() {
  const [activeSheet, setActiveSheet] = React.useState<MobileSheetView | null>(null);

  const handleSelect = React.useCallback((view: MobileSheetView) => {
    setActiveSheet((current) => (current === view ? null : view));
  }, []);

  const getSheetTitle = React.useCallback((view: MobileSheetView | null) => {
    switch (view) {
      case "blocks":
        return "Блоки";
      case "inspector":
        return "Инспектор";
      case "settings":
        return "Настройки";
      default:
        return "";
    }
  }, []);

  return (
    <div className="pointer-events-none lg:hidden">
      <Sheet
        open={Boolean(activeSheet)}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setActiveSheet(null);
          }
        }}
      >
        <SheetContent
          side="bottom"
          className="pointer-events-auto max-h-[80vh] overflow-hidden rounded-t-3xl border-border bg-popover px-4 pb-6 pt-4"
        >
          <SheetHeader className="px-2">
            <SheetTitle>{getSheetTitle(activeSheet)}</SheetTitle>
          </SheetHeader>
          <div className="mt-4 grid max-h-[60vh] gap-4 overflow-y-auto px-2">
            {activeSheet === "blocks" && <BlocksSheetContent />}
            {activeSheet === "inspector" && <InspectorSheetContent />}
            {activeSheet === "settings" && <SettingsSheetContent />}
          </div>
        </SheetContent>
      </Sheet>

      <nav className="pointer-events-auto fixed bottom-4 left-1/2 z-40 w-[min(100%-2rem,420px)] -translate-x-1/2 rounded-full border border-border bg-popover/95 px-3 py-2 shadow-xl backdrop-blur">
        <div className="flex items-center gap-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSheet === item.id;

            return (
              <Button
                key={item.id}
                type="button"
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "flex-1 rounded-full px-3 py-2 text-xs font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-accent"
                )}
                onClick={() => handleSelect(item.id)}
              >
                <div className="flex flex-col items-center gap-1">
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
              </Button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default MobileEditorNavigation;
