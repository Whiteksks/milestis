"use client"

import { useState } from "react"
import {
  Search,
  BookOpen,
  Coins,
  Share2,
  Palette,
  Clock,
  MessageCircle,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  FileText,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const quickHelpCards = [
  {
    id: "first-photobook",
    title: "Create your first photobook",
    description: "Learn how to upload photos, arrange layouts, and create a beautiful photobook in minutes.",
    icon: BookOpen,
    color: "bg-rose-100 text-rose-600",
  },
  {
    id: "credits",
    title: "How credits work",
    description: "Understand your monthly credits, what they cover, and how to get more when you need them.",
    icon: Coins,
    color: "bg-amber-100 text-amber-600",
  },
  {
    id: "publish",
    title: "Publish & share projects",
    description: "Share your photobooks and portfolios with custom links, or download them for printing.",
    icon: Share2,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    id: "portfolio",
    title: "Customize your portfolio",
    description: "Build a stunning portfolio site with your own style, colors, and layout preferences.",
    icon: Palette,
    color: "bg-violet-100 text-violet-600",
  },
]

const guides = [
  {
    id: "getting-started",
    title: "Getting started with Milestis",
    description: "Everything you need to know to create your first project.",
    readTime: "5 min read",
    category: "Basics",
  },
  {
    id: "photo-tips",
    title: "Tips for better photo layouts",
    description: "Simple tricks to make your photobooks look professional.",
    readTime: "3 min read",
    category: "Design",
  },
  {
    id: "sharing-options",
    title: "All the ways to share your work",
    description: "From private links to public portfolios - find the right option for you.",
    readTime: "4 min read",
    category: "Sharing",
  },
  {
    id: "account-billing",
    title: "Managing your account & billing",
    description: "How to update your plan, payment methods, and account settings.",
    readTime: "3 min read",
    category: "Account",
  },
]

export function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">Help & Support</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Find answers, learn how to use Milestis, or contact support
        </p>

        {/* Search Input */}
        <div className="mx-auto mt-6 max-w-md">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="What do you need help with?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 rounded-full border-border/60 bg-background/80 pl-12 pr-4 text-base shadow-sm backdrop-blur-sm transition-shadow focus:shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Quick Help Section */}
      <section>
        <div className="mb-5 flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Quick help</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {quickHelpCards.map((card) => {
            const Icon = card.icon
            return (
              <Card
                key={card.id}
                className="group cursor-pointer rounded-2xl border-border/50 bg-background/80 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
              >
                <CardContent className="flex items-start gap-4 p-5">
                  <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${card.color}`}>
                    <Icon className="size-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{card.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{card.description}</p>
                    <Button variant="link" className="mt-2 h-auto p-0 text-sm text-primary">
                      Learn more
                      <ChevronRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Guides & Tutorials */}
      <section>
        <div className="mb-5 flex items-center gap-2">
          <FileText className="size-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Guides & Tutorials</h2>
        </div>
        <Card className="rounded-2xl border-border/50 bg-background/80 shadow-sm backdrop-blur-sm">
          <CardContent className="divide-y divide-border/50 p-0">
            {guides.map((guide, index) => (
              <div
                key={guide.id}
                className={`group flex cursor-pointer items-center justify-between p-5 transition-colors hover:bg-muted/30 ${
                  index === 0 ? "rounded-t-2xl" : ""
                } ${index === guides.length - 1 ? "rounded-b-2xl" : ""}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-foreground">{guide.title}</h3>
                    <Badge variant="secondary" className="rounded-full text-xs font-normal">
                      {guide.category}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{guide.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    <span>{guide.readTime}</span>
                  </div>
                  <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Contact Support */}
      <section>
        <Card className="rounded-2xl border-border/50 bg-linear-to-br from-primary/5 to-rose-50/50 shadow-sm">
          <CardContent className="flex flex-col items-center p-8 text-center sm:flex-row sm:text-left">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
              <MessageCircle className="size-8 text-primary" />
            </div>
            <div className="mt-4 flex-1 sm:ml-6 sm:mt-0">
              <h3 className="text-xl font-semibold text-foreground">Need more help?</h3>
              <p className="mt-1 text-muted-foreground">
                Our support team is here for you. We usually respond within 24 hours.
              </p>
            </div>
            <Button className="mt-4 rounded-full px-6 sm:ml-6 sm:mt-0">Contact support</Button>
          </CardContent>
        </Card>
      </section>

      {/* System Status */}
      <section>
        <Card className="rounded-2xl border-border/50 bg-background/60 shadow-sm backdrop-blur-sm">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="size-4 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-foreground">All systems operational</span>
            </div>
            <Button variant="ghost" size="sm" className="rounded-full text-xs text-muted-foreground">
              View status page
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
