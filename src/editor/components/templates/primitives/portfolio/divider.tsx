import { cn } from '@/lib/utils'

export function EditorialDivider({ className }: { className?: string }) {
  return (
    <div className={cn('w-full h-px bg-current opacity-10', className)} />
  )
}
