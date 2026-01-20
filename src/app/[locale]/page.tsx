import {HeroSection} from "@/components/layout/landing/components/hero-section";

const navigationData = [
  {
    title: 'Home',
    href: '/dashboard'
  },
  {
    title: 'Products',
    href: '/design/id/edit'
  },
  {
    title: 'About Us',
    href: '/about'
  },
  {
    title: 'Contacts',
    href: '/contacts'
  }
]
import { EmotionalContextSection } from "@/components/layout/landing/components/emotional-context-section";
import { FinalCTA } from "@/components/layout/landing/components/final-cta";
import { Footer } from "@/components/layout/landing/components/footer";
import { HowItWorksSection } from "@/components/layout/landing/components/how-it-works-section";
import { PreviewSection } from "@/components/layout/landing/components/preview-section";
import { PricingTeaser } from "@/components/layout/landing/components/pricing-teaser";
import { UseCasesSection } from "@/components/layout/landing/components/use-cases-section";
import {FeaturesSection} from "@/components/layout/landing/components/features-section";
import Header from "@/components/layout/Headers/header";

export default function Home() {

  return (
    <div className="relative">
      <Header navigationData={navigationData} />
      <HeroSection />
      <EmotionalContextSection />
      <HowItWorksSection />
      <FeaturesSection />
      <UseCasesSection />
      <PreviewSection />
      <PricingTeaser />
      <FinalCTA />
      <Footer />
    </div>
  );
}
