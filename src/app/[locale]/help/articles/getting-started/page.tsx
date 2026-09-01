import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { ArticleLayout } from "@/components/layout/kb/article-layout"
import { Lightbulb } from "lucide-react"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/seo/metadata"
import { JsonLd } from "@/components/shared/json-ld"
import { helpArticleBreadcrumbJsonLd, howToJsonLd } from "@/lib/seo/json-ld"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "help_create_edit.metadata" })
  return buildPageMetadata({
    locale,
    path: "/help/articles/getting-started",
    title: t("title"),
    description: t("description"),
  })
}

export default async function GettingStartedPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "help_create_edit" })

  // Конфигурация для Rich Text: маппинг тегов из JSON на React-компоненты
  const richTextComponents = {
    strong_tag: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
    link_dashboard: (chunks: React.ReactNode) => <Link href="/">{chunks}</Link>,
    link_publish: (chunks: React.ReactNode) => (
      <Link href="/help/articles/publish-share">{chunks}</Link>
    ),
  }

  const toc = [
    { id: "start-from-dashboard", label: t("toc.start-from-dashboard") },
    { id: "choose-format", label: t("toc.choose-format") },
    { id: "edit-content", label: t("toc.edit-content") },
    { id: "refine-design", label: t("toc.refine-design") },
    { id: "save-preview", label: t("toc.save-preview") },
    { id: "before-publishing", label: t("toc.before-publishing") },
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
    { title: t("related.publish_share"), href: "/help/articles/publish-share" },
  ]

  return (
    <>
      <JsonLd
        data={[
          helpArticleBreadcrumbJsonLd(locale, meta.title, "/help/articles/getting-started"),
          howToJsonLd({
            locale,
            path: "/help/articles/getting-started",
            name: meta.title,
            description: meta.description,
            steps: toc.map((item) => ({ name: item.label, anchor: item.id })),
          }),
        ]}
      />
      <ArticleLayout meta={meta} toc={toc} related={related}>
      {/* Start from the dashboard */}
      <h2 id="start-from-dashboard">{t("toc.start-from-dashboard")}</h2>
      <p>{t.rich("content.dashboard_p1", richTextComponents)}</p>
      <p>{t.rich("content.dashboard_p2", richTextComponents)}</p>

      {/* Choose a format */}
      <h2 id="choose-format">{t("toc.choose-format")}</h2>
      <p>{t("content.format_intro")}</p>
      <ul>
        <li>{t.rich("content.format_memory", richTextComponents)}</li>
        <li>{t.rich("content.format_portfolio", richTextComponents)}</li>
      </ul>
      <p>{t("content.format_outro")}</p>

      {/* Edit your content */}
      <h2 id="edit-content">{t("toc.edit-content")}</h2>
      <p>{t("content.edit_intro")}</p>
      <ul>
        <li>{t("content.edit_li1")}</li>
        <li>{t("content.edit_li2")}</li>
        <li>{t("content.edit_li3")}</li>
      </ul>
      <p>{t("content.edit_outro")}</p>

      <div className="kb-callout">
        <Lightbulb className="kb-callout-icon text-amber-500" />
        <span>{t("content.callout_lightbulb")}</span>
      </div>

      {/* Refine the design */}
      <h2 id="refine-design">{t("toc.refine-design")}</h2>
      <p>{t("content.design_p1")}</p>
      <p>{t("content.design_p2")}</p>
      <ul>
        <li>{t.rich("content.design_li1", richTextComponents)}</li>
        <li>{t.rich("content.design_li2", richTextComponents)}</li>
        <li>{t.rich("content.design_li3", richTextComponents)}</li>
      </ul>

      {/* Save and preview */}
      <h2 id="save-preview">{t("toc.save-preview")}</h2>
      <p>{t("content.save_p1")}</p>
      <p>{t.rich("content.save_p2", richTextComponents)}</p>

      {/* Before publishing */}
      <h2 id="before-publishing">{t("toc.before-publishing")}</h2>
      <p>{t("content.before_intro")}</p>
      <ul>
        <li>{t("content.before_li1")}</li>
        <li>{t("content.before_li2")}</li>
        <li>{t("content.before_li3")}</li>
        <li>{t("content.before_li4")}</li>
      </ul>
      <p>{t.rich("content.before_outro", richTextComponents)}</p>
    </ArticleLayout>
    </>
  )
}