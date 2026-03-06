"use client"

import { Check } from 'lucide-react'

import { Button } from '@/components/ui/button'

type Props = {
  selectedLabel: string | null
  isApplyDisabled: boolean
  onCancel: () => void
  onApply: () => void
}

export function DesignCatalogFooter({ selectedLabel, isApplyDisabled, onCancel, onApply }: Props) {
  return (
    <div className="w-full flex items-center justify-between">
      <div className="text-sm text-muted-foreground min-w-0">
        {selectedLabel ? (
          <span className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500 shrink-0" />
            <span className="truncate">
              <span className="font-medium text-foreground">{selectedLabel}</span> selected
            </span>
          </span>
        ) : (
          'Select an item to continue'
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button variant="ghost" onClick={onCancel} className="text-muted-foreground hover:text-foreground">
          Cancel
        </Button>
        <Button disabled={isApplyDisabled} onClick={onApply}>
          Apply
        </Button>
      </div>
    </div>
  )
}
