import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface SettingsListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  icon?: LucideIcon
  action?: React.ReactNode
  iconContainerClassName?: string
}

export function SettingsListItem({
  title,
  description,
  icon: Icon,
  action,
  className,
  iconContainerClassName,
  ...props
}: SettingsListItemProps) {
  return (
    <div 
      className={cn("flex items-center justify-between rounded-xl bg-muted/30 px-4 py-3", className)}
      {...props}
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={cn("flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-lg bg-background", iconContainerClassName)}>
            <Icon className="size-4 sm:size-5 text-muted-foreground" />
          </div>
        )}
        <div>
          <p className="font-medium text-sm">{title}</p>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
      
      {action && (
        <div className="shrink-0 ml-4">
          {action}
        </div>
      )}
    </div>
  )
}
