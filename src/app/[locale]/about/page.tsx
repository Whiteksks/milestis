// /about always shows the landing page — visible to everyone including logged-in users.
import type { Metadata } from 'next'
import { HeroSection } from "@/components/layout/landing/hero-section";
import { EmotionalContextSection } from "@/components/layout/landing/emotional-context-section";
import { FinalCTA } from "@/components/layout/landing/final-cta";
import { Footer } from "@/components/layout/footer";
import { HowItWorksSection } from "@/components/layout/landing/how-it-works-section";
import { UseCasesSection } from "@/components/layout/landing/use-cases-section";
import { FeaturesSection } from "@/components/layout/landing/features-section";
import Header from "@/components/layout/header";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const titles: Record<string, string> = {
    en: 'Milestis — Create Your Interactive Photo Book',
    ru: 'Milestis — Создайте интерактивную фотокнигу',
    kz: 'Milestis — Интерактивті фотокітапты жасаңыз',
  }
  const descriptions: Record<string, string> = {
    en: 'Create beautiful interactive photo books and share your story with the world. Start for free — no design skills needed.',
    ru: 'Создавайте красивые интерактивные фотокниги и делитесь своей историей. Начните бесплатно.',
    kz: 'Әдемі интерактивті фотокітаптар жасаңыз және тарихыңызбен бөлісіңіз. Тегін бастаңыз.',
  }

  const title = titles[locale] ?? titles.en
  const description = descriptions[locale] ?? descriptions.en

  return {
    title,
    description,
    // Canonical points to the root landing — /about is a mirror
    alternates: {
      canonical: `https://milestis.com/${locale}`,
    },
    openGraph: {
      type: 'website',
      url: `https://milestis.com/${locale}`,
      title,
      description,
      siteName: 'Milestis',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default function AboutPage() {
  return (
    <div className="relative">
      <Header />
      <HeroSection />
      <EmotionalContextSection />
      <HowItWorksSection />
      <FeaturesSection />
      <UseCasesSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}
