"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  BookOpen,
  Coins,
  Share2,
  Palette,
  Clock,
  MessageCircle,
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
    href: "/help/articles/getting-started",
    title: "Create your first photobook",
    description: "Learn how to upload photos, arrange layouts, and create a beautiful photobook in minutes.",
    icon: BookOpen,
    color: "bg-rose-100 text-rose-600",
  },
  {
    id: "credits",
    href: "/help/articles/how-credits-work",
    title: "How credits work",
    description: "Understand your monthly credits, what they cover, and how to get more when you need them.",
    icon: Coins,
    color: "bg-amber-100 text-amber-600",
  },
  {
    id: "publish",
    href: "/help/articles/publish-share",
    title: "Publish & share projects",
    description: "Share your photobooks and portfolios with custom links, or download them for printing.",
    icon: Share2,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    id: "portfolio",
    href: "/help/articles/customize-portfolio",
    title: "Customize your portfolio",
    description: "Build a stunning portfolio site with your own style, colors, and layout preferences.",
    icon: Palette,
    color: "bg-violet-100 text-violet-600",
  },
]

const guides = [
  {
    id: "getting-started",
    href: "/help/articles/getting-started",
    title: "Getting started with Milestis",
    description: "Everything you need to know to create your first project.",
    readTime: "5 min read",
    category: "Basics",
  },
  {
    id: "customize-portfolio",
    href: "/help/articles/customize-portfolio",
    title: "Customize your portfolio",
    description: "Build a stunning portfolio with your own style, colors, and layout preferences.",
    readTime: "5 min read",
    category: "Design",
  },
  {
    id: "sharing-options",
    href: "/help/articles/publish-share",
    title: "All the ways to share your work",
    description: "From private links to custom domains — find the right option for you.",
    readTime: "4 min read",
    category: "Sharing",
  },
  {
    id: "account-billing",
    href: "/help/articles/account-billing",
    title: "Managing your account & billing",
    description: "How to update your plan, payment methods, and account settings.",
    readTime: "3 min read",
    category: "Account",
  },
  {
    id: "change-email",
    href: "/help/articles/change-email",
    title: "How to change your email address",
    description: "Step-by-step guide to updating your login email, with troubleshooting tips.",
    readTime: "3 min read",
    category: "Account",
  },
  {
    id: "how-credits-work",
    href: "/help/articles/how-credits-work",
    title: "How credits work",
    description: "Everything about credits — what they cover, when they refresh, and how to get more.",
    readTime: "4 min read",
    category: "Billing",
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
              <Link key={card.id} href={card.href}>
                <Card className="group cursor-pointer rounded-2xl border-border/50 bg-background/80 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md">
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${card.color}`}>
                      <Icon className="size-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{card.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{card.description}</p>
                      <Button variant="link" className="mt-2 h-auto p-0 text-sm text-primary" asChild>
                        <span>
                          Learn more
                          <ChevronRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
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
              <Link
                key={guide.id}
                href={guide.href}
                className={`group flex flex-col sm:flex-row cursor-pointer items-start sm:items-center justify-between p-5 transition-colors hover:bg-muted/30 ${
                  index === 0 ? "rounded-t-2xl" : ""
                } ${index === guides.length - 1 ? "rounded-b-2xl" : ""}`}
              >
                <div className="flex-1 w-full">
                  <div className="flex items-start justify-between gap-3 sm:justify-start">
                    {/* Название */}
                    <h3 className="font-medium text-foreground">{guide.title}</h3>
                    
                    {/* Badge: справа на мобилках, рядом с текстом на ПК */}
                    <Badge variant="secondary" className="rounded-full text-xs font-normal shrink-0">
                      {guide.category}
                    </Badge>
                  </div>
                  
                  {/* Описание */}
                  <p className="mt-1 text-sm text-muted-foreground pr-6 sm:pr-0">
                    {guide.description}
                  </p>

                  {/* Reading time: снизу на мобилках, скрыто для десктопа в этом блоке */}
                  <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground sm:hidden">
                    <Clock className="size-3" />
                    <span>{guide.readTime}</span>
                    <ChevronRight className="size-5 text-muted-foreground sm:hidden" />
                  </div>
                </div>

                {/* Правая часть: только для десктопа */}
                <div className="hidden sm:flex items-center gap-3 ml-4">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    <span>{guide.readTime}</span>
                  </div>
                  <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
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
    </div>
  )
}
