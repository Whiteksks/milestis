// /about always shows the landing page — visible to everyone including logged-in users.
import { HeroSection } from "@/components/layout/landing/hero-section";
import { EmotionalContextSection } from "@/components/layout/landing/emotional-context-section";
import { FinalCTA } from "@/components/layout/landing/final-cta";
import { Footer } from "@/components/layout/footer";
import { HowItWorksSection } from "@/components/layout/landing/how-it-works-section";
import { UseCasesSection } from "@/components/layout/landing/use-cases-section";
import { FeaturesSection } from "@/components/layout/landing/features-section";
import Header from "@/components/layout/header";

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
