import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function ProfileSettingsSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Profile Card Skeleton */}
      <Card className="rounded-3xl border-border/30 overflow-hidden">
        <CardContent className="p-0">
          {/* Decorative band */}
          <Skeleton className="h-20 w-full rounded-none opacity-50" />

          <div className="px-8 pb-8 -mt-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
              {/* Avatar Skeleton */}
              <Skeleton className="size-28 rounded-3xl border-4 border-background shadow-xl" />

              {/* Name and Email Skeleton */}
              <div className="flex-1 space-y-2 pb-2">
                <Skeleton className="h-8 w-48" /> {/* Name */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-32" /> {/* Email */}
                  <Skeleton className="h-5 w-20 rounded-full" /> {/* Badge */}
                </div>
              </div>

              {/* Button Skeleton */}
              <Skeleton className="h-10 w-28 rounded-xl" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Public Profile Form Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-7 w-32 ml-1" /> {/* Section Title */}
        <Card className="rounded-2xl">
          <CardContent className="p-6 space-y-6">
            <Skeleton className="h-16 w-full rounded-xl" /> {/* Info Note */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}