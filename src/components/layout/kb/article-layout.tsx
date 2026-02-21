import Link from "next/link"
import { ChevronRight, Clock, BookOpen } from "lucide-react"
import Header from "@/components/layout/header"
import { TableOfContents, TocItem } from "./toc"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export interface ArticleMeta {
  title: string
  description: string
  category: string
  readTime: string
  updatedAt?: string
}

interface ArticleLayoutProps {
  meta: ArticleMeta
  toc: TocItem[]
  children: React.ReactNode
  /** Optional related articles list */
  related?: { title: string; href: string }[]
}

export function ArticleLayout({ meta, toc, children, related }: ArticleLayoutProps) {
  return (
    <div className="min-h-screen">
      <Header />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
        {/* Breadcrumb */}
        <nav className="mb-8 mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/help" className="hover:text-foreground transition-colors">
            Help
          </Link>
          <ChevronRight className="size-4 shrink-0" />
          <span className="text-foreground font-medium">{meta.category}</span>
        </nav>

        <div className="flex gap-10 xl:gap-16">
          {/* Main article */}
          <article className="min-w-0 flex-1">
            {/* Article Header */}
            <div className="mb-8">
              <Badge variant="secondary" className="mb-3 rounded-full text-xs font-normal">
                {meta.category}
              </Badge>
              <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                {meta.title}
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">{meta.description}</p>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4" />
                  {meta.readTime}
                </span>
                {meta.updatedAt && (
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="size-4" />
                    Updated {meta.updatedAt}
                  </span>
                )}
              </div>
            </div>

            <Separator className="mb-8" />

            {/* Article body */}
            <div className="kb-article">{children}</div>

            {/* Related articles */}
            {related && related.length > 0 && (
              <div className="mt-12 rounded-2xl border border-border/50 bg-muted/30 p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Related articles
                </h3>
                <ul className="space-y-2">
                  {related.map((r) => (
                    <li key={r.href}>
                      <Link
                        href={r.href}
                        className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                      >
                        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                        {r.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>

          {/* TOC Sidebar — hidden on small screens */}
          {toc.length > 0 && (
            <aside className="hidden xl:block w-60 shrink-0">
              <div className="sticky top-24">
                <TableOfContents items={toc} />
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
