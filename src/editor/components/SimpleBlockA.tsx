"use client";

import React from "react";
import InternalSortable from "@/editor/dnd/InternalSortable";

export const SimpleBlockA: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-xl font-semibold tracking-tight">
            Simple Block A
          </h3>
          <span className="text-sm text-muted-foreground">Demo template</span>
        </div>

        <div className="border border-border bg-card p-6 shadow-sm transition hover:shadow-md">
          <InternalSortable />
        </div>
      </div>
    </div>
  );
};

export default SimpleBlockA;
