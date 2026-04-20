import React from 'react';
import { CTAButton } from '@/components/shared/cta-button';
import { Check, Zap, Star, ShieldCheck, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Header from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      <Header />
      
      <header className="pt-32 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Simple, <span className="text-muted-foreground italic font-serif">honest</span> pricing.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Choose a plan that scales with your creative business. 
            From single memories to professional digital archives.
          </p>
        </div>
      </header>

      <section id="plans" className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Explorer Tier */}
          <PricingCard 
            title="Explorer"
            price="--" // Price logic to be added
            description="Essential tools for individuals and small personal projects."
            features={[
              "5 Active Projects",
              "1GB Cloud Storage",
              "Unlimited Archive Storage",
              "Standard Project Support",
              "Evergreen Web Updates",
              "One-time purchase available"
            ]}
            buttonText="Get Started"
            variant="outline"
          />

          {/* Creator Tier */}
          <PricingCard 
            title="Creator"
            price="--" // Price logic to be added
            description="Designed for professional photographers and visual storytellers."
            features={[
              "25 Active Projects",
              "10GB Cloud Storage",
              "Professional Workspace",
              "White-label Branding",
              "200 Monthly Credits",
              "Discounted Credit Top-ups",
              "Extended Infrastructure Support",
              "Evergreen Web Updates"
            ]}
            buttonText="Start Creator"
            variant="default"
            isPopular={true}
          />

          {/* Archive Tier */}
          <PricingCard 
            title="Archive"
            price="--" // Price logic to be added
            description="Maximum capacity for studios managing large-scale digital legacies."
            features={[
              "100 Active Projects",
              "50GB Cloud Storage",
              "Advanced Workspace",
              "Full White-label Suite",
              "750 Monthly Credits",
              "Lowest Credit Rates",
              "Priority Infrastructure Support",
              "Evergreen Web Updates"
            ]}
            buttonText="Go Pro"
            variant="outline"
          />
        </div>
      </section>

      {/* Evergreen & Support System */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto bg-muted/30 rounded-[2.5rem] p-10 border border-border/50">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <RefreshCw className="w-5 h-5" />
                <span>Evergreen Infrastructure</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Future-Proof Memories</h2>
              <p className="text-muted-foreground leading-relaxed">
                The web is constantly evolving, and so are we. Every project hosted on our platform receives automatic updates to match modern browser standards and performance optimizations. Your digital sites stay fast, secure, and accessible, no matter how much time has passed.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 w-full md:w-auto">
              <Card className="bg-background p-6 border-border flex flex-col items-center gap-2 min-w-[200px]">
                <ShieldCheck className="w-8 h-8 text-primary" />
                <span className="text-sm font-medium text-center uppercase tracking-tighter">Guaranteed Support</span>
                <span className="text-xs text-muted-foreground text-center italic">Maintenance & Compatibility</span>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-20 px-6 text-center border-t border-border/40">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
          <div className="flex gap-8 text-muted-foreground/60 grayscale">
            <ShieldCheck className="w-8 h-8" />
            <Zap className="w-8 h-8" />
            <Star className="w-8 h-8" />
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            Powered by a sustainable SaaS model. Secure hosting and long-term digital preservation.
          </p>
        </div>
      </footer>
      <Footer />
    </div>
  );
};

interface PricingCardProps {
  title: string
  price: string | number
  description: string
  features: string[]
  buttonText: string
  variant?: string
  isPopular?: boolean
}

const PricingCard = ({ title, price, description, features, buttonText, variant, isPopular = false }: PricingCardProps) => (
  <Card className={`relative flex flex-col h-full bg-card border-border transition-all duration-300 hover:shadow-xl ${isPopular ? 'ring-2 ring-primary scale-105 z-10' : ''}`}>
    {isPopular && (
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
        Professional Choice
      </div>
    )}
    <CardHeader className="p-8">
      <CardTitle className="text-xl font-bold mb-2">{title}</CardTitle>
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-4xl font-bold">
          {price === "--" ? "--" : `$${price}`}
        </span>
        <span className="text-muted-foreground text-sm">/month</span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </CardHeader>
    <CardContent className="p-8 pt-0 flex-grow">
      <ul className="space-y-4">
        {features.map((feature: string) => (
          <li key={feature} className="flex items-start gap-3 text-sm">
            <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span className="text-foreground/80">{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter className="p-8 pt-0">
      <CTAButton className={`w-full py-3 rounded-full font-bold transition-all active:scale-95 ${
        variant === 'default' 
          ? 'bg-primary text-primary-foreground hover:opacity-90' 
          : 'bg-background border border-border hover:bg-muted text-foreground'
      }`}>
        {buttonText}
      </CTAButton>
    </CardFooter>
  </Card>
);

export default PricingPage;