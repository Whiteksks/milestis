import type { Metadata } from 'next'
import { HeroSection } from "@/components/layout/landing/hero-section";
import { EmotionalContextSection } from "@/components/layout/landing/emotional-context-section";
import { FinalCTA } from "@/components/layout/landing/final-cta";
import { Footer } from "@/components/layout/footer";
import { HowItWorksSection } from "@/components/layout/landing/how-it-works-section";
import { PreviewSection } from "@/components/layout/landing/preview-section";
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
    en: 'Create beautiful interactive photo books and share your story with the world.',
    ru: 'Создавайте красивые интерактивные фотокниги и делитесь своей историей.',
    kz: 'Әдемі интерактивті фотокітаптар жасаңыз және тарихыңызбен бөлісіңіз.',
  }

  return {
    title: titles[locale] ?? titles.en,
    description: descriptions[locale] ?? descriptions.en,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'ru': '/ru',
      },
    },
  }
}

export default function Home() {
  return (
    <div className="relative">
      <Header />
      <HeroSection />
      <EmotionalContextSection />
      <HowItWorksSection />
      <FeaturesSection />
      <UseCasesSection />
      <PreviewSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}
