import type { Metadata } from "next"
import { useTranslations } from "next-intl"
import { getTranslations } from "next-intl/server"
import { ArticleLayout } from "@/components/layout/kb/article-layout"
import { Info, ShieldCheck } from "lucide-react"

// Генерируем динамические метаданные через next-intl
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("help_account_security.metadata")
  return {
    title: t("title"),
    description: t("description"),
  }
}

export default function AccountSecurityPage() {
  const t = useTranslations("help_account_security")

  // Отрендерим стронг-теги одной функцией, чтобы не дублировать код
  const richTextOption = {
    strong_tag: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
  }

  const toc = [
    { id: "your-account", label: t("toc.your-account") },
    { id: "sign-in-methods", label: t("toc.sign-in-methods") },
    { id: "email-access", label: t("toc.email-access") },
    { id: "google-access", label: t("toc.google-access") },
    { id: "public-profile", label: t("toc.public-profile") },
    { id: "security-tips", label: t("toc.security-tips") },
  ]

  const meta = {
    title: t("meta.title"),
    description: t("meta.description"),
    category: t("meta.category"),
    readTime: t("meta.readTime"),
    updatedAt: t("meta.updatedAt"),
  }

  const related = [
    { title: t("related.credits"), href: "/help/articles/how-credits-work" },
    { title: t("related.archive"), href: "/help/articles/archive-republish" },
  ]

  return (
    <ArticleLayout meta={meta} toc={toc} related={related}>
      {/* Your account */}
      <h2 id="your-account">{t("toc.your-account")}</h2>
      <p>{t("content.p1")}</p>
      <p>{t("content.p2")}</p>

      {/* Sign-in methods */}
      <h2 id="sign-in-methods">{t("toc.sign-in-methods")}</h2>
      <p>{t("content.methods_intro")}</p>
      <ul>
        <li>{t.rich("content.method_email", richTextOption)}</li>
        <li>{t.rich("content.method_google", richTextOption)}</li>
      </ul>
      <p>{t("content.methods_outro")}</p>

      <div className="kb-callout">
        <Info className="kb-callout-icon text-primary" />
        <span>{t.rich("content.callout_safe", richTextOption)}</span>
      </div>

      {/* Email access */}
      <h2 id="email-access">{t("toc.email-access")}</h2>
      <p>{t.rich("content.email_p1", richTextOption)}</p>
      <p>{t("content.email_p2")}</p>

      {/* Google access */}
      <h2 id="google-access">{t("toc.google-access")}</h2>
      <p>{t.rich("content.google_p1", richTextOption)}</p>
      <p>{t("content.google_p2")}</p>

      {/* Public profile */}
      <h2 id="public-profile">{t("toc.public-profile")}</h2>
      <p>{t.rich("content.profile_p1", richTextOption)}</p>
      <p>{t("content.profile_p2")}</p>

      {/* Security tips */}
      <h2 id="security-tips">{t("toc.security-tips")}</h2>
      <ul>
        <li>{t("content.tip1")}</li>
        <li>{t("content.tip2")}</li>
        <li>{t("content.tip3")}</li>
        <li>{t("content.tip4")}</li>
      </ul>

      <div className="kb-callout">
        <ShieldCheck className="kb-callout-icon text-amber-500" />
        <span>{t.rich("content.callout_security", richTextOption)}</span>
      </div>
    </ArticleLayout>
  )
}