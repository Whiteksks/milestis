"use client";

import React from "react";
import { useEditorStore } from "@/hooks/store/useEditorStore";

export const Workspace: React.FC = () => {
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
    <div className="flex-1 flex justify-center p-4 overflow-y-auto transition-all duration-300">
      <div
        contentEditable
        suppressContentEditableWarning
        className={`
          w-full min-h-full h-fit
          bg-card/50 rounded-xl shadow-xl outline-none
          p-8 sm:p-12 lg:p-16 ring-2 ring-transparent
          focus:ring-accent transition-all duration-300
          relative group
          ${getWidthClass()}
        `}
      >
        <h1 className="text-4xl text-card-foreground font-extrabold mb-8 placeholder-text">
          Заголовок Документа
        </h1>

        <div className="text-xl leading-relaxed text-card-foreground min-h-[400px] placeholder-text">
          <p>
            Начните писать здесь. Используйте Enter для нового абзаца.
            Рабочая область автоматически подстроится по высоте.
          </p>
        </div>
      </div>
    </div>
  );
};
