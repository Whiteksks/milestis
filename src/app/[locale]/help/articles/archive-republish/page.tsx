import type { Metadata } from "next"
import { useTranslations } from "next-intl"
import { getTranslations } from "next-intl/server"
import { ArticleLayout } from "@/components/layout/kb/article-layout"
import { AlertCircle, Info } from "lucide-react"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("help_archive_republish.metadata")
  return {
    title: t("title"),
    description: t("description"),
  }
}

export default function ArchiveRepublishPage() {
  const t = useTranslations("help_archive_republish")

  const richTextOption = {
    strong_tag: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
  }

  const toc = [
    { id: "what-is-archive", label: t("toc.what-is-archive") },
    { id: "after-publish", label: t("toc.after-publish") },
    { id: "unpublish", label: t("toc.unpublish") },
    { id: "republish", label: t("toc.republish") },
    { id: "delete-forever", label: t("toc.delete-forever") },
    { id: "best-practices", label: t("toc.best-practices") },
  ]

  const meta = {
    title: t("meta.title"),
    description: t("meta.description"),
    category: t("meta.category"),
    readTime: t("meta.readTime"),
    updatedAt: t("meta.updatedAt"),
  }

  const related = [
    { title: t("related.publish_share"), href: "/help/articles/publish-share" },
    { title: t("related.credits"), href: "/help/articles/how-credits-work" },
  ]

  return (
    <ArticleLayout meta={meta} toc={toc} related={related}>
      {/* What is the archive? */}
      <h2 id="what-is-archive">{t("toc.what-is-archive")}</h2>
      <p>{t("content.archive_p1")}</p>
      <p>{t("content.archive_p2")}</p>

      {/* What happens after publish */}
      <h2 id="after-publish">{t("toc.after-publish")}</h2>
      <p>{t("content.after_publish_p1")}</p>
      <p>{t.rich("content.after_publish_p2", richTextOption)}</p>

      <div className="kb-callout">
        <Info className="kb-callout-icon text-primary" />
        <span>{t("content.callout_archive")}</span>
      </div>

      {/* Unpublish a project */}
      <h2 id="unpublish">{t("toc.unpublish")}</h2>
      <p>{t("content.unpublish_p1")}</p>
      <p>{t("content.unpublish_p2")}</p>

      {/* Republish a project */}
      <h2 id="republish">{t("toc.republish")}</h2>
      <p>{t("content.republish_p1")}</p>
      <p>{t("content.republish_p2")}</p>

      {/* Delete permanently */}
      <h2 id="delete-forever">{t("toc.delete-forever")}</h2>
      <p>{t("content.delete_p1")}</p>
      <p>{t("content.delete_p2")}</p>
      <ul>
        <li>{t("content.delete_li1")}</li>
        <li>{t("content.delete_li2")}</li>
        <li>{t("content.delete_li3")}</li>
        <li>{t("content.delete_li4")}</li>
      </ul>

      <div className="kb-callout">
        <AlertCircle className="kb-callout-icon text-amber-500" />
        <span>{t("content.callout_delete")}</span>
      </div>

      {/* Best practices */}
      <h2 id="best-practices">{t("toc.best-practices")}</h2>
      <ul>
        <li>{t("content.tips_li1")}</li>
        <li>{t("content.tips_li2")}</li>
        <li>{t("content.tips_li3")}</li>
        <li>{t("content.tips_li4")}</li>
      </ul>
    </ArticleLayout>
  )
}