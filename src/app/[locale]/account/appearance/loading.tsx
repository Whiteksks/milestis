import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function AppearanceSettingsSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-border/40 bg-card/80">
        <CardHeader className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 pb-7">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" /> {/* Title */}
            <Skeleton className="h-4 w-48" /> {/* Description */}
          </div>
          <Skeleton className="h-10 w-40 rounded-md" /> {/* Select Trigger */}
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Mobile Preview Skeleton (Visible only on mobile) */}
          <div className="flex flex-col items-center gap-6 sm:hidden">
            <Skeleton className="aspect-video w-full rounded-2xl" />
            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="size-12 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Desktop Grid Skeleton (Hidden on mobile) */}
          <div className="hidden gap-4 sm:grid sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border-2 p-1 border-border/50">
                <Skeleton className="aspect-4/3 w-full rounded-xl" />
                <div className="flex items-center justify-between px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-4 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="h-px w-full bg-border/40" />

          {/* High Contrast Toggle Skeleton */}
          <div className="flex items-center justify-between rounded-xl bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-56" />
              </div>
            </div>
            <Skeleton className="h-6 w-11 rounded-full" /> {/* Switch */}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}