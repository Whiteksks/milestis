import { cn } from '@/lib/utils'

export function EditorialLabel({
  children,
  className,
  themeFont,
}: {
  children: React.ReactNode
  className?: string
  themeFont?: string
}) {
  return (
    <div className={cn('flex items-center gap-6', className)}>
      <span className={cn('text-[10px] uppercase tracking-[0.2em] opacity-40 whitespace-nowrap', themeFont)}>
        {children}
      </span>
      <div className="flex-1 h-px bg-current opacity-10 min-w-[2rem]" />
    </div>
  )
}

export function EditorialTitle({
  children,
  className,
  themeFont,
}: {
  children: React.ReactNode
  className?: string
  themeFont?: string
}) {
  return (
    <h3
      className={cn(
        'text-2xl @md:text-3xl @lg:text-4xl font-bold uppercase leading-tight',
        themeFont,
        className
      )}
    >
      {children}
    </h3>
  )
}

export function EditorialParagraph({
  children,
  className,
  themeFont,
  themeLineHeight,
}: {
  children: React.ReactNode
  className?: string
  themeFont?: string
  themeLineHeight?: string
}) {
  return (
    <p
      className={cn(
        'text-sm @md:text-base opacity-70 font-light whitespace-pre-line leading-relaxed',
        themeLineHeight,
        themeFont,
        className
      )}
    >
      {children}
    </p>
  )
}
