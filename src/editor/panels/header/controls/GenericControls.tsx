'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Move,
  Maximize2,
  Palette,
} from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const GenericControls = () => {
  return (
    <div className="flex items-center gap-2">
      {/* Position */}
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Position">
        <Move className="size-4" />
      </Button>

      {/* Spacing */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5" title="Spacing">
            <Maximize2 className="size-3.5" />
            <span>Spacing</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="padding">Padding</Label>
              <div className="grid grid-cols-4 gap-2">
                <Input
                  type="number"
                  placeholder="Top"
                  className="h-8 text-xs"
                  defaultValue="0"
                />
                <Input
                  type="number"
                  placeholder="Right"
                  className="h-8 text-xs"
                  defaultValue="0"
                />
                <Input
                  type="number"
                  placeholder="Bottom"
                  className="h-8 text-xs"
                  defaultValue="0"
                />
                <Input
                  type="number"
                  placeholder="Left"
                  className="h-8 text-xs"
                  defaultValue="0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="margin">Margin</Label>
              <div className="grid grid-cols-4 gap-2">
                <Input
                  type="number"
                  placeholder="Top"
                  className="h-8 text-xs"
                  defaultValue="0"
                />
                <Input
                  type="number"
                  placeholder="Right"
                  className="h-8 text-xs"
                  defaultValue="0"
                />
                <Input
                  type="number"
                  placeholder="Bottom"
                  className="h-8 text-xs"
                  defaultValue="0"
                />
                <Input
                  type="number"
                  placeholder="Left"
                  className="h-8 text-xs"
                  defaultValue="0"
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Separator orientation="vertical" className="h-5" />

      {/* Background Color */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Background">
            <Palette className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-2">
            <Label htmlFor="bg-color">Background Color</Label>
            <Input
              id="bg-color"
              type="color"
              defaultValue="#ffffff"
              className="h-10 w-full"
            />
          </div>
        </PopoverContent>
      </Popover>

      {/* Display Mode */}
      <Select defaultValue="block">
        <SelectTrigger className="h-8 w-24 text-xs">
          <SelectValue placeholder="Display" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="block">Block</SelectItem>
          <SelectItem value="flex">Flex</SelectItem>
          <SelectItem value="grid">Grid</SelectItem>
          <SelectItem value="inline">Inline</SelectItem>
          <SelectItem value="none">None</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
