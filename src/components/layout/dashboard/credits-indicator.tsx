"use client"

import { Coins, Sparkles, Calendar } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CreditsIndicatorProps {
  used: number
  total: number
  resetDate: string
}

export function CreditsIndicator({ used, total, resetDate }: CreditsIndicatorProps) {
  const remaining = total - used
  const percentage = (remaining / total) * 100

  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 rounded-full border border-border/60 bg-card/80 px-4 py-2 shadow-sm transition-all duration-200 hover:bg-accent/50 hover:shadow-md hover:scale-[1.02]">
                <div className="flex items-center gap-2">
                  <Coins className="size-4 text-primary/70" />
                  <span className="hidden md:flex text-sm font-medium text-foreground">
                    {remaining} / {total}
                  </span>
                </div>
                <Progress value={percentage} className="hidden md:flex h-1.5 w-16" />
              </button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="hidden md:flex max-w-55 rounded-xl">
            Credits are used to create and publish photo books. They reset monthly.
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end" className="w-64 rounded-2xl shadow-lg shadow-foreground/5">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            Monthly Credits
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="space-y-3 p-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Monthly limit</span>
                <span className="font-medium">{total} credits</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Used</span>
                <span className="font-medium">{used} credits</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-medium text-primary">{remaining} credits</span>
              </div>
            </div>
            <Progress value={percentage} className="h-2" />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="size-3" />
              <span>Resets on {resetDate}</span>
            </div>
            <Button className="mt-2 w-full gap-2 rounded-full" size="sm">
              <Sparkles className="size-4" />
              Upgrade plan
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  )
}
