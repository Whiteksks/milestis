"use client";

import React from "react";
import InternalSortable from "@/editor/dnd/InternalSortable";

export const HeaderBlock: React.FC = () => {
  return (
    <div className="w-full min-h-screen p-6 text-2xl font-bold text-center bg-blue-100 rounded-none shadow">
      <div className="max-w-7xl mx-auto">Заголовок блока</div>
      <div className="max-w-7xl mx-auto mt-6">
        <InternalSortable />
      </div>
    </div>
  );
};
