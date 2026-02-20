import { cn } from "@/lib/utils"
import { Info, LucideIcon } from "lucide-react"

interface InfoNoteProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  icon?: LucideIcon
  variant?: "muted" | "accent"
}

export function InfoNote({ 
  title, 
  children, 
  icon: Icon = Info, 
  variant = "muted",
  className,
  ...props 
}: InfoNoteProps) {
  const variants = {
    muted: "bg-muted/30 border-muted/90",
    accent: "bg-accent/30 border-accent/50"
  }

  return (
    <div 
      className={cn(
        "flex items-start gap-3 rounded-2xl border  p-4", 
        variants[variant],
        className
      )} 
      {...props}
    >
      <Icon className="size-5 text-primary mt-0.5 shrink-0" />
      <div className="space-y-1">
        {title && <p className="text-sm font-medium">{title}</p>}
        <div className="text-sm text-muted-foreground">
          {children}
        </div>
      </div>
    </div>
  )
}
