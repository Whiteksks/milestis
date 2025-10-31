'use client';

import React from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";

export interface EditorBlock {
  id: string;
  component: React.ReactNode;
}

/**
 * WorkspaceDnD — чисто визуальный слой.
 * DndContext должен быть инициализирован выше по дереву.
 */
const WorkspaceDnD: React.FC<{ items: EditorBlock[]; overId?: string | null }> = ({ items, overId = null }) => {
  return (
    <div
      className="
        fixed top-0 left-0 right-0
        bg-background/50 backdrop-blur-sm
        px-6 py-8
        flex justify-center
      "
    >
      <div className="w-full space-y-0">
        <SortableContext items={items.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          {items.map((block) => (
            <div key={block.id} className="relative group">
              {/* Линия-подсказка при наведении */}
              {overId === block.id && (
                <div
                  className="
                    absolute -top-3 left-0 right-0 flex justify-center
                    pointer-events-none
                  "
                  aria-hidden
                >
                  <div className="w-3/4 h-0.5 bg-accent rounded-full shadow-sm transition-all" />
                </div>
              )}

              <SortableItem id={block.id}>
                <div
                  className="
                    border border-border rounded-2xl bg-card shadow-sm
                    hover:shadow-md transition-all duration-150
                  "
                >
                  {block.component}
                </div>
              </SortableItem>
            </div>
          ))}

          {/* Если перетаскивание ниже последнего элемента */}
          {overId === null && items.length > 0 && (
            <div className="flex justify-center pt-4">
              <div className="w-3/4 h-0.5 bg-accent/40 rounded-full" />
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};

export default WorkspaceDnD;
