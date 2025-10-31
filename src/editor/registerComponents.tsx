"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";

interface SortableProps {
  id: string | number;
  index: number;
  children: React.ReactNode;
}

export const Sortable: React.FC<SortableProps> = ({ id, index, children }) => {
  const { setNodeRef } = useSortable({ id });

  return (
    <div ref={setNodeRef as any} className="m-4">
      {children}
    </div>
  );
};
