"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  BookOpen,
  Share2,
  Coins,
  Clock,
  MessageCircle,
  ChevronRight,
  Sparkles,
  FileText,
  Compass,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const quickHelpCards = [
  {
    id: "what-is-milestis",
    href: "/help/articles/what-is-milestis",
    title: "What is Milestis",
    description: "Understand the product, the project types, and why Milestis works differently from traditional editors.",
    icon: Compass,
    color: "bg-sky-100 text-sky-600",
  },
  {
    id: "first-photobook",
    href: "/help/articles/getting-started",
    title: "Create and edit your first project",
    description: "Learn how to start a project, shape the content, refine the design, and preview the result.",
    icon: BookOpen,
    color: "bg-rose-100 text-rose-600",
  },
  {
    id: "publish",
    href: "/help/articles/publish-share",
    title: "Publish and share your project",
    description: "Understand publishing, private and public links, credits, and how to share the final result.",
    icon: Share2,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    id: "credits",
    href: "/help/articles/how-credits-work",
    title: "How credits work",
    description: "See how publish cost is calculated, where your balance appears, and what happens when credits run low.",
    icon: Coins,
    color: "bg-amber-100 text-amber-600",
  },
]

const guides = [
  {
    id: "what-is-milestis",
    href: "/help/articles/what-is-milestis",
    title: "What is Milestis",
    description: "A clear introduction to the product, who it is for, and how the Milestis workflow works.",
    readTime: "4 min read",
    category: "Basics",
  },
  {
    id: "getting-started",
    href: "/help/articles/getting-started",
    title: "Create and edit your first project",
    description: "A practical guide to starting a project, building it inside the editor, and refining the final look.",
    readTime: "5 min read",
    category: "Basics",
  },
  {
    id: "sharing-options",
    href: "/help/articles/publish-share",
    title: "Publish and share your project",
    description: "Learn how publishing works for Memory Books and Portfolio Sites, and how to share them the right way.",
    readTime: "4 min read",
    category: "Sharing",
  },
  {
    id: "how-credits-work",
    href: "/help/articles/how-credits-work",
    title: "How credits work",
    description: "A practical guide to publish cost, balance categories, and how credits support your workflow.",
    readTime: "4 min read",
    category: "Billing",
  },
  {
    id: "account-security",
    href: "/help/articles/account-security",
    title: "Account and security",
    description: "Understand sign-in methods, linked access, and the difference between private account identity and public profile.",
    readTime: "4 min read",
    category: "Account",
  },
  {
    id: "archive-republish",
    href: "/help/articles/archive-republish",
    title: "Archive, deletion, and republishing",
    description: "Learn what happens after publish and how to manage archived, offline, and permanently deleted projects.",
    readTime: "4 min read",
    category: "Projects",
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
