"use client";

import React from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import SortableItem from "./SortableItem";

export interface EditorBlock {
  id: string;
  component: React.ReactNode;
}

/**
 * WorkspaceDnDInternal — stateless: renders SortableContext and items.
 * DndContext (sensors, onDragEnd) should be initialized by the caller (for example the page)
 * when multiple parts of the editor (sidebar + workspace) must share the same context.
 */
const WorkspaceDnD: React.FC<{ items: EditorBlock[]; overId?: string | null }> = ({ items, overId = null }) => {
  return (
    <SortableContext items={items.map((b) => b.id)} strategy={verticalListSortingStrategy}>
      <div className="space-y-4">
        {items.map((block) => (
          <div key={block.id} className="relative">
            {/* insertion indicator above the item when overId matches */}
            {overId === block.id && (
              <div className="absolute -top-2 left-0 right-0 flex justify-center" aria-hidden>
                <div className="w-3/4 h-0.5 bg-accent rounded" />
              </div>
            )}
            <SortableItem id={block.id} className="cursor-grab">
              {block.component}
            </SortableItem>
          </div>
        ))}

        {/* if overId is null and there are items, show an end placeholder when dragging new item to end */}
        {overId === null && items.length > 0 && (
          <div className="flex justify-center">
            <div className="w-3/4 h-0.5 bg-transparent" />
          </div>
        )}
      </div>
    </SortableContext>
  );
};

export default WorkspaceDnD;
