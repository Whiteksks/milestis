'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Image,
  Crop,
  Upload,
  Circle,
} from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export const ImageControls = () => {
  return (
    <div className="flex items-center gap-2">
      {/* Replace Image */}
      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5" title="Replace Image">
        <Upload className="size-3.5" />
        <span>Replace</span>
      </Button>

      <Separator orientation="vertical" className="h-5" />

      {/* Crop */}
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Crop">
        <Crop className="size-4" />
      </Button>

      {/* Border Radius */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Border Radius">
            <Circle className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-3">
            <Label htmlFor="border-radius">Border Radius</Label>
            <div className="flex items-center gap-3">
              <input
                id="border-radius"
                type="range"
                defaultValue="0"
                min="0"
                max="50"
                className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <Input
                type="number"
                defaultValue="0"
                className="h-8 w-16 text-xs"
                min="0"
                max="50"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Opacity */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Opacity">
            <Image className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-3">
            <Label htmlFor="opacity">Opacity</Label>
            <div className="flex items-center gap-3">
              <input
                id="opacity"
                type="range"
                defaultValue="100"
                min="0"
                max="100"
                className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <Input
                type="number"
                defaultValue="100"
                className="h-8 w-16 text-xs"
                min="0"
                max="100"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
