import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { ArticleLayout } from "@/components/layout/kb/article-layout"
import { Info, AlertCircle } from "lucide-react"
import { buildPageMetadata } from "@/lib/seo/metadata"
import { JsonLd } from "@/components/shared/json-ld"
import { helpArticleBreadcrumbJsonLd } from "@/lib/seo/json-ld"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "help_publish_share.metadata" })
  return buildPageMetadata({
    locale,
    path: "/help/articles/publish-share",
    title: t("title"),
    description: t("description"),
  })
}

export default async function PublishSharePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "help_publish_share" })

  const richTextOption = {
    strong_tag: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
  }

  const toc = [
    { id: "what-publish-means", label: t("toc.what-publish-means") },
    { id: "memory-book-links", label: t("toc.memory-book-links") },
    { id: "portfolio-links", label: t("toc.portfolio-links") },
    { id: "publish-cost", label: t("toc.publish-cost") },
    { id: "unpublish-republish", label: t("toc.unpublish-republish") },
    { id: "sharing-best-practices", label: t("toc.sharing-best-practices") },
  ]

  const meta = {
    title: t("meta.title"),
    description: t("meta.description"),
    category: t("meta.category"),
    readTime: t("meta.readTime"),
    updatedAt: t("meta.updatedAt"),
  }

  const related = [
    { title: t("related.what_is_milestis"), href: "/help/articles/what-is-milestis" },
    { title: t("related.getting_started"), href: "/help/articles/getting-started" },
  ]

  return (
    <>
      <JsonLd data={helpArticleBreadcrumbJsonLd(locale, meta.title, "/help/articles/publish-share")} />
      <ArticleLayout meta={meta} toc={toc} related={related}>
      {/* What publishing means */}
      <h2 id="what-publish-means">{t("toc.what-publish-means")}</h2>
      <p>{t("content.publish_p1")}</p>
      <p>{t("content.publish_p2")}</p>

      <div className="kb-callout">
        <Info className="kb-callout-icon text-primary" />
        <span>{t("content.callout_control")}</span>
      </div>

      {/* Memory Book links */}
      <h2 id="memory-book-links">{t("toc.memory-book-links")}</h2>
      <p>{t.rich("content.memory_p1", richTextOption)}</p>
      <p>{t("content.memory_p2")}</p>

      {/* Portfolio links */}
      <h2 id="portfolio-links">{t("toc.portfolio-links")}</h2>
      <p>{t.rich("content.portfolio_p1", richTextOption)}</p>
      <p>{t("content.portfolio_p2")}</p>

      <div className="kb-callout">
        <AlertCircle className="kb-callout-icon text-amber-500" />
        <span>{t("content.callout_slug")}</span>
      </div>

      {/* Credits and publish cost */}
      <h2 id="publish-cost">{t("toc.publish-cost")}</h2>
      <p>{t("content.cost_intro")}</p>
      <ul>
        <li>{t.rich("content.cost_portfolio", richTextOption)}</li>
        <li>{t.rich("content.cost_memory", richTextOption)}</li>
      </ul>
      <p>{t("content.cost_outro")}</p>

      {/* Unpublish and republish */}
      <h2 id="unpublish-republish">{t("toc.unpublish-republish")}</h2>
      <p>{t.rich("content.unpublish_p1", richTextOption)}</p>
      <p>{t.rich("content.unpublish_p2", richTextOption)}</p>

      {/* Sharing best practices */}
      <h2 id="sharing-best-practices">{t("toc.sharing-best-practices")}</h2>
      <p>{t("content.sharing_intro")}</p>
      <ul>
        <li>{t("content.sharing_li1")}</li>
        <li>{t("content.sharing_li2")}</li>
        <li>{t("content.sharing_li3")}</li>
        <li>{t("content.sharing_li4")}</li>
      </ul>
      <p>{t("content.sharing_outro")}</p>
    </ArticleLayout>
    </>
  )
}