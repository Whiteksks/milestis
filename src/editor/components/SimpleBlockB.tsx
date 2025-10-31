"use client";

import React from "react";
import InternalSortable from "@/editor/dnd/InternalSortable";

export const SimpleBlockB: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-white/80">
      <div className="max-w-4xl mx-auto p-8">
        <h3 className="text-lg font-medium mb-2">Simple Block B</h3>
        <InternalSortable />
      </div>
    </div>
  );
};

export default SimpleBlockB;
