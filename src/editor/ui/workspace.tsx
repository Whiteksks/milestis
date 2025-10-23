"use client";

import React from "react";

export const Workspace: React.FC = () => {
  return (
    // Внешний контейнер: занимает оставшееся место, центрирует контент и управляет прокруткой
    <div className="flex-1 flex justify-center p-6 sm:p-10 lg:p-16 overflow-y-auto bg-gray-50">
      {/* Рабочий холст: 
        max-w-4xl (или 5xl) - для лучшей читаемости, так как очень широкие строки тяжело читать. 
        min-h-full - гарантирует, что он занимает всю вертикаль, даже если контента мало.
      */}
      <div
        contentEditable
        suppressContentEditableWarning
        // 'group' для стилизации вложенных элементов и placeholder
        className="
          w-full
          max-w-7xl
          bg-white 
          rounded-xl 
          shadow-xl 
          outline-none 
          p-8 sm:p-12 lg:p-16
          text-gray-900 
          ring-2 ring-transparent
          focus:ring-blue-500/50 
          transition-all 
          duration-300
          relative
          group
        "
      >
        <h1 className="text-4xl font-extrabold mb-8 placeholder-text">
          Заголовок Документа
        </h1>

        <div className="text-xl leading-relaxed text-gray-700 min-h-[400px] placeholder-text">
          <p>
            Начните писать здесь. Используйте Enter для нового абзаца. 
            Рабочая область автоматически подстроится по высоте.
          </p>
        </div>

      </div>
    </div>
  );
};