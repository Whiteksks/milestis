'use client'

import { useState } from 'react'
import { CoinsIcon, CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface PopoverCreditsProps {
  permanentCredits: number
  subscriptionCredits?: number
  subscriptionTotal?: number // например, 100
  nextRenewal?: string // формат: "12 ноября 2025"
}

const PopoverCredits = ({
  permanentCredits,
  subscriptionCredits,
  subscriptionTotal,
  nextRenewal,
}: PopoverCreditsProps) => {
  const hasSubscription = subscriptionTotal && subscriptionTotal > 0
  const totalCredits = permanentCredits + (subscriptionCredits || 0)
  const progress = hasSubscription
    ? Math.min(((subscriptionCredits || 0) / subscriptionTotal!) * 100, 100)
    : 0

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='items-center gap-2 px-3 py-1.5 rounded-xl border bg-muted/50 hover:bg-muted cursor-pointer transition min-w-20'
        >
          <CoinsIcon className='size-4 text-yellow-500' />
          <span className='text-sm font-medium'>{totalCredits}</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-72 space-y-3'>
        <div className='flex items-center justify-between text-sm font-semibold'>
          <span>Всего кредитов</span>
          <span>{totalCredits}</span>
        </div>

        <div className='text-sm'>
          💎 <span className='font-medium'>{permanentCredits}</span> перманентных
        </div>

        {hasSubscription ? (
          <>
            <div className='text-sm'>
              ⭐ <span className='font-medium'>{subscriptionCredits}</span> из{' '}
              {subscriptionTotal} по подписке
            </div>
            <Progress value={progress} />
            <div className='text-muted-foreground flex items-center gap-2 text-xs mt-1'>
              <CalendarIcon className='size-4' />
              <span>Следующее обновление: {nextRenewal}</span>
            </div>
          </>
        ) : (
          <p className='text-xs text-muted-foreground italic'>
            У вас нет активной подписки
          </p>
        )}
      </PopoverContent>
    </Popover>
  )
}

export default PopoverCredits
