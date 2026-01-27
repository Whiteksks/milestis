import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function SecuritySettingsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <Card className="rounded-2xl border-border/40 bg-card/80">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="size-5 rounded-md" /> {/* Icon Shield */}
            <Skeleton className="h-6 w-40" /> {/* Title */}
          </div>
          <Skeleton className="h-4 w-64 mt-2" /> {/* Description */}
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-2xl border-2 p-5 border-border/50">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <Skeleton className="size-12 rounded-xl shrink-0" /> {/* Method Icon */}
                    <div className="space-y-2 w-full">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-32" /> {/* Method Name */}
                      </div>
                      <Skeleton className="h-4 w-3/4" /> {/* Method Description */}
                      <Skeleton className="h-4 w-1/2" /> {/* User Email placeholder */}
                    </div>
                  </div>
                  <Skeleton className="h-10 w-32 rounded-full shrink-0" /> {/* Button */}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bottom Info Note Skeleton */}
      <div className="flex items-start gap-3 rounded-2xl border border-border/40 bg-muted/30 p-4">
        <Skeleton className="size-8 rounded-full shrink-0" />
        <div className="space-y-2 w-full">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      </div>
    </div>
  )
}