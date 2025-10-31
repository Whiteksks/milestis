"use client";

import React from "react";
import InternalSortable from "@/editor/dnd/InternalSortable";

export const TestComponentB: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={"w-full min-h-screen flex items-center justify-center bg-green-500 text-white " + (className ?? "") }>
      <div className="max-w-4xl w-full p-8">
        <h2 className="text-3xl font-semibold mb-4">Test Component B</h2>
        <div className="bg-white/90 p-4 rounded shadow">
          <InternalSortable />
        </div>
      </div>
    </div>
  );
};

export default TestComponentB;
