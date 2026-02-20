import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface SettingsCardProps extends React.ComponentProps<typeof Card> {
  children: React.ReactNode
}

export function SettingsCard({ className, children, ...props }: SettingsCardProps) {
  return (
    <Card 
      className={cn("rounded-2xl border-border/40 bg-card/80 backdrop-blur-sm", className)} 
      {...props}
    >
      {children}
    </Card>
  )
}
