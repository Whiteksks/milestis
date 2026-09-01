import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { ArticleLayout } from "@/components/layout/kb/article-layout"
import { Info, Sparkles } from "lucide-react"
import { buildPageMetadata } from "@/lib/seo/metadata"
import { JsonLd } from "@/components/shared/json-ld"
import { helpArticleBreadcrumbJsonLd } from "@/lib/seo/json-ld"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "help_what_is_milestis.metadata" })
  return buildPageMetadata({
    locale,
    path: "/help/articles/what-is-milestis",
    title: t("title"),
    description: t("description"),
  })
}

export default async function WhatIsMilestisPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "help_what_is_milestis" })

  const richTextOption = {
    strong_tag: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
  }

  const toc = [
    { id: "what-is-milestis", label: t("toc.what-is-milestis") },
    { id: "who-it-is-for", label: t("toc.who-it-is-for") },
    { id: "how-it-works", label: t("toc.how-it-works") },
    { id: "project-types", label: t("toc.project-types") },
    { id: "why-it-feels-different", label: t("toc.why-it-feels-different") },
  ]

  const meta = {
    title: t("meta.title"),
    description: t("meta.description"),
    category: t("meta.category"),
    readTime: t("meta.readTime"),
    updatedAt: t("meta.updatedAt"),
  }

  const related = [
    { title: t("related.getting_started"), href: "/help/articles/getting-started" },
    { title: t("related.publish_share"), href: "/help/articles/publish-share" },
  ]

  return (
    <>
      <JsonLd data={helpArticleBreadcrumbJsonLd(locale, meta.title, "/help/articles/what-is-milestis")} />
      <ArticleLayout meta={meta} toc={toc} related={related}>
      {/* What is Milestis? */}
      <h2 id="what-is-milestis">{t("toc.what-is-milestis")}</h2>
      <p>{t.rich("content.what_is_p1", richTextOption)}</p>
      <p>{t("content.what_is_p2")}</p>

      <div className="kb-callout">
        <Info className="kb-callout-icon text-primary" />
        <span>{t.rich("content.callout_result", richTextOption)}</span>
      </div>

      {/* Who it is for */}
      <h2 id="who-it-is-for">{t("toc.who-it-is-for")}</h2>
      <p>{t("content.who_p1")}</p>
      <ul>
        <li>{t.rich("content.who_li1", richTextOption)}</li>
        <li>{t.rich("content.who_li2", richTextOption)}</li>
      </ul>
      <p>{t("content.who_p2")}</p>

      {/* How it works */}
      <h2 id="how-it-works">{t("toc.how-it-works")}</h2>
      <p>{t.rich("content.how_p1", richTextOption)}</p>
      <p>{t("content.how_p2")}</p>
      <ol>
        <li>{t("content.how_li1")}</li>
        <li>{t("content.how_li2")}</li>
        <li>{t("content.how_li3")}</li>
        <li>{t("content.how_li4")}</li>
        <li>{t("content.how_li5")}</li>
      </ol>
      <p>{t("content.how_p3")}</p>

      {/* Project types */}
      <h2 id="project-types">{t("toc.project-types")}</h2>
      <p>{t("content.types_p1")}</p>
      <ul>
        <li>{t.rich("content.types_li1", richTextOption)}</li>
        <li>{t.rich("content.types_li2", richTextOption)}</li>
      </ul>
      <p>{t("content.types_p2")}</p>

      {/* Why it feels different */}
      <h2 id="why-it-feels-different">{t("toc.why-it-feels-different")}</h2>
      <p>{t("content.different_p1")}</p>
      <ul>
        <li>{t.rich("content.different_li1", richTextOption)}</li>
        <li>{t.rich("content.different_li2", richTextOption)}</li>
        <li>{t.rich("content.different_li3", richTextOption)}</li>
        <li>{t.rich("content.different_li4", richTextOption)}</li>
      </ul>

      <div className="kb-callout">
        <Sparkles className="kb-callout-icon text-amber-500" />
        <span>{t("content.callout_sparkles")}</span>
      </div>
    </ArticleLayout>
    </>
  )
}