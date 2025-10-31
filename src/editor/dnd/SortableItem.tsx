"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const SortableItem: React.FC<SortableItemProps> = ({
  id,
  children,
  className,
  disabled = true,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.95 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className={className}>
      <div className="flex items-start gap-3">
        {/* Показываем drag handle только если не disabled */}
        {!disabled && (
          <div
            {...attributes}
            {...listeners}
            className="w-8 h-8 flex items-center justify-center rounded border bg-white/80 text-sm text-muted-foreground cursor-grab"
            aria-hidden
          >
            ☰
          </div>
        )}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default SortableItem;
