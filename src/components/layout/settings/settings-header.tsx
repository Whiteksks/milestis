import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface SettingsHeaderProps extends React.ComponentProps<typeof CardHeader> {
  title: string
  description?: string
  icon?: LucideIcon
  iconClassName?: string
}

export function SettingsHeader({ 
  title, 
  description, 
  icon: Icon, 
  iconClassName,
  className,
  ...props 
}: SettingsHeaderProps) {
  return (
    <CardHeader className={cn("pb-3", className)} {...props}>
      <div className="flex items-center gap-2">
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Icon className={cn("h-4 w-4 text-primary", iconClassName)} />
          </div>
        )}
        <CardTitle className="text-lg">{title}</CardTitle>
      </div>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
  )
}
