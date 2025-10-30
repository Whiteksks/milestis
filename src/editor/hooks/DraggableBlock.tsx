"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/react";

interface DraggableBlockProps {
  id: string;
  children: React.ReactNode;
}

export const DraggableBlock: React.FC<DraggableBlockProps> = ({ id, children }) => {
  const { ref, isDragging } = useDraggable({ id });

  return (
    <div
      ref={ref}
      className={`
        cursor-grab select-none p-2 rounded-lg border
        ${isDragging ? "opacity-50 border-accent" : "border-transparent"}
        hover:bg-muted transition
      `}
    >
      {children}
    </div>
  );
};
