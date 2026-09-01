import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import Header from "@/components/layout/header"
import { FaqHero } from "@/components/layout/supportPage/faq-hero"
import { FaqContent } from "@/components/layout/supportPage/faq-content"
import { FaqReassurance } from "@/components/layout/supportPage/faq-reassurance"
import { JsonLd } from "@/components/shared/json-ld"
import { faqPageJsonLd, type FaqItem } from "@/lib/seo/json-ld"
import { buildPageMetadata } from "@/lib/seo/metadata"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "FaqPage" })

  return buildPageMetadata({
    locale,
    path: "/help/faq",
    title: t("hero.title"),
    description: t("hero.description"),
  })
}

const SECTION_IDS = ["general", "privacySharing", "editingContent", "pricingAccess"]

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "FaqPage" })
  const items = SECTION_IDS.flatMap(
    (id) => t.raw(`sections.${id}.items`) as FaqItem[]
  )

  return (
    <main className="min-h-screen">
      <JsonLd data={faqPageJsonLd(items)} />
      <Header />
      <FaqHero />
      <FaqContent />
      <FaqReassurance />
    </main>
  )
}
