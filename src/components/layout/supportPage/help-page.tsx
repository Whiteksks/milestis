"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import {
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
import { Badge } from "@/components/ui/badge"

const quickHelpCards = [
  {
    id: "what-is-milestis",
    href: "/help/articles/what-is-milestis",
    icon: Compass,
    color: "bg-sky-100 text-sky-600",
  },
  {
    id: "first-photobook",
    href: "/help/articles/getting-started",
    icon: BookOpen,
    color: "bg-rose-100 text-rose-600",
  },
  {
    id: "publish",
    href: "/help/articles/publish-share",
    icon: Share2,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    id: "credits",
    href: "/help/articles/how-credits-work",
    icon: Coins,
    color: "bg-amber-100 text-amber-600",
  },
]

const guides = [
  {
    id: "what-is-milestis",
    href: "/help/articles/what-is-milestis",
    readTimeCount: 4,
    category: "Basics",
  },
  {
    id: "getting-started",
    href: "/help/articles/getting-started",
    readTimeCount: 5,
    category: "Basics",
  },
  {
    id: "sharing-options",
    href: "/help/articles/publish-share",
    readTimeCount: 4,
    category: "Sharing",
  },
  {
    id: "how-credits-work",
    href: "/help/articles/how-credits-work",
    readTimeCount: 4,
    category: "Billing",
  },
  {
    id: "account-security",
    href: "/help/articles/account-security",
    readTimeCount: 4,
    category: "Account",
  },
  {
    id: "archive-republish",
    href: "/help/articles/archive-republish",
    readTimeCount: 4,
    category: "Projects",
  },
]

export function HelpPage() {
  const t = useTranslations("HelpPage")

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">{t("header.title")}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {t("header.description")}
        </p>
      </div>

      {/* Quick Help Section */}
      <section>
        <div className="mb-5 flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">{t("quickHelp.title")}</h2>
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
                      <h3 className="font-semibold text-foreground">
                        {t(`quickHelp.cards.${card.id}.title`)}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t(`quickHelp.cards.${card.id}.description`)}
                      </p>
                      <Button variant="link" className="mt-2 h-auto p-0 text-sm text-primary" asChild>
                        <span>
                          {t("quickHelp.learnMore")}
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
          <h2 className="text-xl font-semibold text-foreground">{t("guides.title")}</h2>
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
                    <h3 className="font-medium text-foreground">
                      {t(`guides.items.${guide.id}.title`)}
                    </h3>
                    
                    {/* Badge */}
                    <Badge variant="secondary" className="rounded-full text-xs font-normal shrink-0">
                      {t(`guides.categories.${guide.category}`)}
                    </Badge>
                  </div>
                  
                  {/* Описание */}
                  <p className="mt-1 text-sm text-muted-foreground pr-6 sm:pr-0">
                    {t(`guides.items.${guide.id}.description`)}
                  </p>

                  {/* Reading time: mobile */}
                  <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground sm:hidden">
                    <Clock className="size-3" />
                    <span>{t("guides.readTime", { count: guide.readTimeCount })}</span>
                    <ChevronRight className="size-5 text-muted-foreground sm:hidden" />
                  </div>
                </div>

                {/* Правая часть: desktop */}
                <div className="hidden sm:flex items-center gap-3 ml-4">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    <span>{t("guides.readTime", { count: guide.readTimeCount })}</span>
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
              <h3 className="text-xl font-semibold text-foreground">{t("contact.title")}</h3>
              <p className="mt-1 text-muted-foreground">
                {t("contact.description")}
              </p>
            </div>
            <Button className="mt-4 rounded-full px-6 sm:ml-6 sm:mt-0" asChild>
              <Link href="mailto:support@milestis.com">
                {t("contact.button")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}