"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, GripVertical, Settings2 } from "lucide-react";
import React from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import useEditorDnDStore, { EditorBlock } from "@/editor/store/useEditorDnDStore";
import { cn } from "@/lib/utils";

// DnD элемент
function SortableItem({ block }: { block: EditorBlock }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: block.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-2 bg-card rounded-lg border border-border shadow-sm cursor-grab mb-3 hover:bg-accent/40 transition-colors"
    >
      <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
        <GripVertical className="w-3 h-3" /> {block.id}
      </div>
      <div className="bg-background p-2 rounded-md" style={{ height: "60px", overflow: "hidden" }}>
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

// Док-инспектор (в стиле Figma)
export function SidebarRightDnD() {
  const [open, setOpen] = React.useState(false);
  const { blocks, moveBlock } = useEditorDnDStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      moveBlock(oldIndex, newIndex);
    }
  };

  return (
    <>
      {/* Кнопка-инспектор по центру справа */}
      <motion.button
        onClick={() => setOpen((prev) => !prev)}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed right-6 top-1/2 -translate-y-1/2 z-40 p-3 rounded-l-lg shadow-lg bg-popover text-white hover:bg-accent transition"
        )}
      >
        <Settings2 className="w-5 h-5" />
      </motion.button>

      {/* Док-инспектор с отступами */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="dock-inspector"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
            className={cn(
              "fixed top-[108px] bottom-4 right-[20px] z-50 bg-popover/95 backdrop-blur-xl border border-border shadow-xl rounded-xl flex flex-col overflow-hidden w-80"
            )}
          >

            {/* Заголовок */}
            <div className="flex items-center justify-between p-3 border-b bg-background/70 backdrop-blur-sm">
              <h2 className="text-sm font-semibold text-foreground">Инспектор</h2>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-md hover:bg-accent transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Контент */}
            <div className="flex-1 overflow-y-auto p-3">
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
              >
                <SortableContext items={blocks} strategy={verticalListSortingStrategy}>
                  {blocks.map((block) => (
                    <SortableItem key={block.id} block={block} />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
