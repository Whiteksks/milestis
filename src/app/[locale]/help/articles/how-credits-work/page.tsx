import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { ArticleLayout } from "@/components/layout/kb/article-layout"
import { Info, Lightbulb } from "lucide-react"
import { buildPageMetadata } from "@/lib/seo/metadata"
import { JsonLd } from "@/components/shared/json-ld"
import { helpArticleBreadcrumbJsonLd } from "@/lib/seo/json-ld"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "help_how_credits_work.metadata" })
  return buildPageMetadata({
    locale,
    path: "/help/articles/how-credits-work",
    title: t("title"),
    description: t("description"),
  })
}

export default async function HowCreditsWorkPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "help_how_credits_work" })

  const richTextOption = {
    strong_tag: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
  }

  const toc = [
    { id: "what-are-credits", label: t("toc.what-are-credits") },
    { id: "where-to-see-balance", label: t("toc.where-to-see-balance") },
    { id: "publish-cost", label: t("toc.publish-cost") },
    { id: "credit-types", label: t("toc.credit-types") },
    { id: "running-low", label: t("toc.running-low") },
    { id: "faq", label: t("toc.faq") },
  ]

  const meta = {
    title: t("meta.title"),
    description: t("meta.description"),
    category: t("meta.category"),
    readTime: t("meta.readTime"),
    updatedAt: t("meta.updatedAt"),
  }

  const related = [
    { title: t("related.account_security"), href: "/help/articles/account-security" },
    { title: t("related.publish_share"), href: "/help/articles/publish-share" },
  ]

  return (
    <>
      <JsonLd data={helpArticleBreadcrumbJsonLd(locale, meta.title, "/help/articles/how-credits-work")} />
      <ArticleLayout meta={meta} toc={toc} related={related}>
      {/* What are credits? */}
      <h2 id="what-are-credits">{t("toc.what-are-credits")}</h2>
      <p>{t("content.credits_p1")}</p>
      <p>{t("content.credits_p2")}</p>

      <div className="kb-callout">
        <Info className="kb-callout-icon text-primary" />
        <span>{t.rich("content.callout_balance", richTextOption)}</span>
      </div>

      {/* Where to see your balance */}
      <h2 id="where-to-see-balance">{t("toc.where-to-see-balance")}</h2>
      <p>{t.rich("content.balance_p1", richTextOption)}</p>
      <p>{t("content.balance_p2")}</p>

      {/* Publish cost */}
      <h2 id="publish-cost">{t("toc.publish-cost")}</h2>
      <p>{t("content.cost_intro")}</p>
      <ul>
        <li>{t.rich("content.cost_portfolio", richTextOption)}</li>
        <li>
          {t.rich("content.cost_memory", richTextOption)}
          <ul>
            <li>{t("content.cost_memory_tier1")}</li>
            <li>{t("content.cost_memory_tier2")}</li>
            <li>{t("content.cost_memory_tier3")}</li>
          </ul>
        </li>
      </ul>
      <p>{t("content.cost_outro")}</p>

      {/* Credit types */}
      <h2 id="credit-types">{t("toc.credit-types")}</h2>
      <p>{t("content.types_intro")}</p>
      <ul>
        <li>{t.rich("content.types_subscription", richTextOption)}</li>
        <li>{t.rich("content.types_bonus", richTextOption)}</li>
        <li>{t.rich("content.types_purchased", richTextOption)}</li>
      </ul>
      <p>{t("content.types_outro")}</p>

      <div className="kb-callout">
        <Lightbulb className="kb-callout-icon text-amber-500" />
        <span>{t.rich("content.callout_capacity", richTextOption)}</span>
      </div>

      {/* When credits run low */}
      <h2 id="running-low">{t("toc.running-low")}</h2>
      <p>{t("content.low_p1")}</p>
      <p>{t("content.low_p2")}</p>

      {/* Frequently asked questions */}
      <h2 id="faq">{t("toc.faq")}</h2>
      <h3>{t("content.faq_q1")}</h3>
      <p>{t("content.faq_a1")}</p>
      
      <h3>{t("content.faq_q2")}</h3>
      <p>{t("content.faq_a2")}</p>
      
      <h3>{t("content.faq_q3")}</h3>
      <p>{t("content.faq_a3")}</p>
    </ArticleLayout>
    </>
  )
}