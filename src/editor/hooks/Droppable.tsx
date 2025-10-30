"use client";

import React, { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/react";
import { useEditorStore } from "@/hooks/store/useEditorStore";

interface DroppableProps {
  id: string;
  children?: ReactNode;
}

export const Droppable: React.FC<DroppableProps> = ({ id, children }) => {
  const { ref } = useDroppable({
    id,
  });

  const { activeDevice } = useEditorStore();
  
  const getWidthClass = () => {
    switch (activeDevice) {
      case "tablet":
        return "max-w-3xl scale-[0.9]";
      case "mobile":
        return "max-w-sm scale-[0.85]";
      default:
        return "max-w-7xl scale-100";
    }
  };

  return (
      <div
        ref={ref}
        className={`
          w-full min-h-full h-fit
          bg-card/50 rounded-xl shadow-xl outline-none
          p-8 sm:p-12 lg:p-16 ring-2 ring-transparent
          focus:ring-accent transition-all duration-300
          relative group
          ${getWidthClass()}
        `}
      >
      {children}
    </div>
  );
};
