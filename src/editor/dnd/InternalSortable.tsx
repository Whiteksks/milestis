"use client";

import React from "react";
import { DndContext, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type InternalItem = { id: string; content: React.ReactNode };

export const InternalSortable: React.FC<{ initial?: InternalItem[] }> = ({ initial = [] }) => {
  const [items, setItems] = React.useState<InternalItem[]>(initial.length ? initial : [
    { id: "item-1", content: <div className="p-4">Inner item 1</div> },
    { id: "item-2", content: <div className="p-4">Inner item 2</div> },
    { id: "item-3", content: <div className="p-4">Inner item 3</div> },
  ]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        setItems((prev) => arrayMove(prev, oldIndex, newIndex));
      }
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map((it) => (
            <InnerSortableItem key={it.id} id={it.id}>
              <div className="w-full bg-white/80 rounded shadow-sm">{it.content}</div>
            </InnerSortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

const InnerSortableItem: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.9 : 1,
    zIndex: isDragging ? 40 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3">
      <div {...attributes} {...listeners} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded cursor-grab">≡</div>
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default InternalSortable;
