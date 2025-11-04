'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Type,
} from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const TextControls = () => {
  return (
    <div className="flex items-center gap-2">
      {/* Font Size */}
      <Select defaultValue="16">
        <SelectTrigger className="h-8 w-20 text-xs">
          <SelectValue placeholder="Size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="12">12px</SelectItem>
          <SelectItem value="14">14px</SelectItem>
          <SelectItem value="16">16px</SelectItem>
          <SelectItem value="18">18px</SelectItem>
          <SelectItem value="20">20px</SelectItem>
          <SelectItem value="24">24px</SelectItem>
          <SelectItem value="32">32px</SelectItem>
          <SelectItem value="48">48px</SelectItem>
        </SelectContent>
      </Select>

      {/* Font Weight */}
      <Select defaultValue="400">
        <SelectTrigger className="h-8 w-24 text-xs">
          <SelectValue placeholder="Weight" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="300">Light</SelectItem>
          <SelectItem value="400">Regular</SelectItem>
          <SelectItem value="500">Medium</SelectItem>
          <SelectItem value="600">Semibold</SelectItem>
          <SelectItem value="700">Bold</SelectItem>
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="h-5" />

      {/* Text Style Buttons */}
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Bold">
        <Bold className="size-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Italic">
        <Italic className="size-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Underline">
        <Underline className="size-4" />
      </Button>

      <Separator orientation="vertical" className="h-5" />

      {/* Alignment */}
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Align Left">
        <AlignLeft className="size-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Align Center">
        <AlignCenter className="size-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Align Right">
        <AlignRight className="size-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Justify">
        <AlignJustify className="size-4" />
      </Button>

      <Separator orientation="vertical" className="h-5" />

      {/* Color Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Text Color">
            <Type className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-2">
            <Label htmlFor="text-color">Text Color</Label>
            <Input
              id="text-color"
              type="color"
              defaultValue="#000000"
              className="h-10 w-full"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
