"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Sparkles,
  CreditCard,
  Calendar,
  BookOpen,
  Globe,
  Download,
  CheckCircle2,
  Clock,
  ChevronRight,
  Info,
} from "lucide-react"

export default function BillingSettings() {
  const creditsUsed = 7
  const creditsTotal = 10
  const creditsPercentage = (creditsUsed / creditsTotal) * 100

  const usageHistory = [
    { project: "Summer Memories 2024", credits: 2, date: "Dec 15, 2024" },
    { project: "Family Reunion Book", credits: 3, date: "Dec 8, 2024" },
    { project: "Travel Adventures", credits: 2, date: "Nov 28, 2024" },
  ]

  const billingHistory = [
    { date: "Dec 1, 2024", amount: "$0.00", status: "Free Plan" },
    { date: "Nov 1, 2024", amount: "$0.00", status: "Free Plan" },
    { date: "Oct 1, 2024", amount: "$0.00", status: "Free Plan" },
  ]

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card className="rounded-2xl border-border/40 bg-card/80 backdrop-blur-sm overflow-hidden">
        <div className="h-1.5 bg-linear-to-r from-primary/60 via-primary to-primary/60" />
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Current Plan</CardTitle>
              <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary border-0">
                Free
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">Free Plan</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Perfect for trying out Milestis. Create beautiful photo books and share your memories with friends and
                family.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Button className="rounded-full gap-2">
              <Sparkles className="h-4 w-4" />
              Upgrade Plan
            </Button>
            <Button variant="ghost" className="rounded-full text-muted-foreground">
              View all plans
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Credits - Primary Section */}
      <Card className="rounded-2xl border-border/40 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-lg">Monthly Credits</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Credits Balance Display */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-bold text-foreground">{creditsUsed}</span>
                <span className="text-xl text-muted-foreground">/ {creditsTotal}</span>
              </div>
              <p className="text-sm text-muted-foreground">credits used this month</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1.5">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Resets on Jan 1</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={creditsPercentage} className="h-3 rounded-full" />
            <p className="text-sm text-muted-foreground">{creditsTotal - creditsUsed} credits remaining</p>
          </div>

          {/* Explanation */}
          <div className="rounded-xl bg-muted/30 p-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Credits are used to create and publish photo books. They reset automatically every month.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Photobook creation: 2-3 credits</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Portfolio site: 1 credit</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credits Usage */}
      <Card className="rounded-2xl border-border/40 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-lg">Credits Usage</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {usageHistory.map((item, index) => (
              <div key={index} className="flex items-center justify-between rounded-xl bg-muted/30 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.project}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary border-0">
                  {item.credits} credits
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className="rounded-2xl border-border/40 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-lg">Payment Method</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-xl bg-muted/30 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-background border border-border/40">
                <span className="text-xs font-semibold text-muted-foreground">VISA</span>
              </div>
              <div>
                <p className="font-medium text-sm">Visa ending in 4242</p>
                <p className="text-xs text-muted-foreground">Expires 12/26</p>
              </div>
            </div>
            <Button variant="outline" className="rounded-full bg-transparent">
              Update
            </Button>
          </div>
          <div className="flex items-start gap-2 mt-4 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <p>Your payment information is securely stored and encrypted.</p>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="rounded-2xl border-border/40 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-lg">Billing History</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {billingHistory.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-xl px-4 py-3 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.amount}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="rounded-full border-0 bg-muted text-muted-foreground">
                    {item.status}
                  </Badge>
                  <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
