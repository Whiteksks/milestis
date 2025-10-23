"use client";

import { HeaderApp } from "@/editor/ui/header";
import { HeaderTools } from "@/editor/ui/headerEditorFields";
import { SidebarEditorComponents } from "@/editor/ui/sidebarEditorComponents";
import { Workspace } from "@/editor/ui/workspace";

export default function Page() {
  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      <div className="flex flex-col flex-shrink-0">
        <HeaderApp />
        <HeaderTools />
      </div>

      {/* Основная область */}
      <div className="flex flex-1 relative overflow-hidden">
        <SidebarEditorComponents />
        <Workspace />
      </div>
    </div>
  );
}
