"use client";

import { SidebarDropdown } from "../layout/sidebarDropdown";
import { SidebarIsland } from "../layout/sidebarIsland";
import { SidebarSettings } from "../layout/sidebarSettings";

export function SidebarEditorComponents() {
  return (
    // Родительский контейнер для плавающего меню
    <div className="fixed h-full p-4 z-50">
    
      <div className="absolute top-28"> 
          <SidebarDropdown />
      </div>

    
      <div className="absolute top-1/2 transform -translate-y-1/2">
          <SidebarIsland title="Блоки">
            <div>Lorem ipsum dolor sit amet.</div>
          </SidebarIsland>
      </div>

      <div className="absolute bottom-4">
        <SidebarSettings />
      </div>
    </div>
  );
}