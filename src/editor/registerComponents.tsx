"use client";

import React from "react";
import { useSortable } from "@dnd-kit/react/sortable";

interface SortableProps {
  id: string | number;
  index: number;
  children: React.ReactNode;
}

export const Sortable: React.FC<SortableProps> = ({ id, index, children }) => {
  const { ref } = useSortable({ id, index });

  return (
    <div ref={ref} className="m-4">
      {children}
    </div>
  );
};
