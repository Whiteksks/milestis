"use client"

import { MenuIcon, SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Logo from "@/editorPage/components/ui/logo"
import { NAVBAR_PRESETS } from "@/editorPage/lib/presets/navbarPresets"
import type { CanvasBlock } from "@/editorPage/lib/block-types"

interface NavbarCenteredProps {
  block: CanvasBlock
  isSelected?: boolean
  onSelect?: () => void
}

export function NavbarCentered({ block, isSelected, onSelect }: NavbarCenteredProps) {
  const preset = NAVBAR_PRESETS.centered

  const navItems = block.settings?.navItems || [
    { title: "Home", href: "#" },
    { title: "Products", href: "#" },
    { title: "About Us", href: "#" },
    { title: "Contacts", href: "#" },
  ]

  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer transition-all ${isSelected ? "ring-2 ring-primary ring-offset-2" : ""}`}
    >
      <header className="bg-background sticky top-0 z-50 border-b border-border">
        <div className={preset.container}>
          <div className={preset.navWrapper}>
            <a href="#" className={preset.navLink}>
              {navItems[0]?.title || "Home"}
            </a>
            <a href="#" className={preset.navLink}>
              {navItems[1]?.title || "Products"}
            </a>
            <Logo className="text-foreground gap-3" />
            <a href="#" className={preset.navLink}>
              {navItems[2]?.title || "About Us"}
            </a>
            <a href="#" className={preset.navLink}>
              {navItems[3]?.title || "Contacts"}
            </a>
          </div>

          <div className={preset.actions}>
            <Button variant="ghost" size="icon">
              <SearchIcon />
              <span className="sr-only">Search</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger className="md:hidden" asChild>
                <Button variant="outline" size="icon">
                  <MenuIcon />
                  <span className="sr-only">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuGroup>
                  {navItems.map((item: any, index: number) => (
                    <DropdownMenuItem key={index}>
                      <a href={item.href}>{item.title}</a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </div>
  )
}
