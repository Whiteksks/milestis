"use client"

import { BarChart3, Eye, MousePointer, Clock, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Track views and engagement across your projects</p>
      </div>

      {/* Coming Soon Card */}
      <Card className="rounded-3xl border-muted-foreground/10 bg-card/80 backdrop-blur-sm">
        <CardContent className="py-16 text-center">
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5">
            <BarChart3 className="size-10 text-primary" />
          </div>
          <Badge className="mb-4 rounded-full bg-primary/10 text-primary hover:bg-primary/10">Coming Soon</Badge>
          <h2 className="mb-2 text-xl font-semibold text-foreground">Analytics is on the way</h2>
          <p className="mx-auto max-w-md text-muted-foreground">
            Soon you&apos;ll be able to see how your photobooks and portfolio sites are performing with detailed
            insights and engagement metrics.
          </p>

          {/* Preview Stats */}
          <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Eye, label: "Total Views", value: "—" },
              { icon: MousePointer, label: "Clicks", value: "—" },
              { icon: Clock, label: "Avg. Time", value: "—" },
              { icon: TrendingUp, label: "Growth", value: "—" },
            ].map((stat) => (
              <Card key={stat.label} className="rounded-2xl border-dashed border-muted-foreground/20 bg-muted/30">
                <CardHeader className="pb-2">
                  <stat.icon className="size-5 text-muted-foreground/50" />
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-2xl font-bold text-muted-foreground/30">{stat.value}</p>
                  <p className="text-xs text-muted-foreground/50">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* What to Expect */}
      <Card className="rounded-3xl border-muted-foreground/10 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">What to expect</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "View Tracking",
                description: "See how many people visit your published projects",
              },
              {
                title: "Engagement Metrics",
                description: "Understand how visitors interact with your content",
              },
              {
                title: "Time Insights",
                description: "Learn when your audience is most active",
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-muted-foreground/10 bg-muted/30 p-4">
                <h3 className="mb-1 font-medium text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
