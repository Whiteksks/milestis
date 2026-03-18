"use client"

import { BarChart3, Eye, MousePointer, Clock, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"

export function AnalyticsPage() {
  const t = useTranslations()
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">{t('analytics.title')}</h1>
        <p className="text-muted-foreground">{t('analytics.description')}</p>
      </div>

      {/* Coming Soon Card */}
      <Card className="rounded-3xl border-muted-foreground/10 bg-card/80 backdrop-blur-sm">
        <CardContent className="py-16 text-center">
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-linear-to-br from-primary/20 to-primary/5">
            <BarChart3 className="size-10 text-primary" />
          </div>
          <Badge className="mb-4 rounded-full bg-primary/10 text-primary hover:bg-primary/10">{t('analytics.comingSoon')}</Badge>
          <h2 className="mb-2 text-xl font-semibold text-foreground">{t('analytics.comingTitle')}</h2>
          <p className="mx-auto max-w-md text-muted-foreground">{t('analytics.comingDescription')}</p>

          {/* Preview Stats */}
          <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Eye, labelKey: 'analytics.stats.totalViews', value: "—" },
              { icon: MousePointer, labelKey: 'analytics.stats.clicks', value: "—" },
              { icon: Clock, labelKey: 'analytics.stats.avgTime', value: "—" },
              { icon: TrendingUp, labelKey: 'analytics.stats.growth', value: "—" },
            ].map((stat) => (
              <Card key={stat.labelKey} className="rounded-2xl border-dashed border-muted-foreground/20 bg-muted/30">
                <CardHeader className="pb-2">
                  <stat.icon className="size-5 text-muted-foreground/50" />
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-2xl font-bold text-muted-foreground/30">{stat.value}</p>
                  <p className="text-xs text-muted-foreground/50">{t(stat.labelKey)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* What to Expect */}
      <Card className="rounded-3xl border-muted-foreground/10 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">{t('analytics.whatToExpectTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                titleKey: 'analytics.features.viewTracking.title',
                descriptionKey: 'analytics.features.viewTracking.description',
              },
              {
                titleKey: 'analytics.features.engagement.title',
                descriptionKey: 'analytics.features.engagement.description',
              },
              {
                titleKey: 'analytics.features.time.title',
                descriptionKey: 'analytics.features.time.description',
              },
            ].map((feature) => (
              <div key={(feature as any).titleKey} className="rounded-2xl border border-muted-foreground/10 bg-muted/30 p-4">
                <h3 className="mb-1 font-medium text-foreground">{t((feature as any).titleKey)}</h3>
                <p className="text-sm text-muted-foreground">{t((feature as any).descriptionKey)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
