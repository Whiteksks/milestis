import React from 'react';
import { Check, Zap, Star, ShieldCheck, Info } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Header from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      <Header />
      {/* Header */}
      <header className="pt-32 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Simple, <span className="text-muted-foreground italic font-serif">honest</span> pricing.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Choose the plan that fits your creative pace. No hidden fees, 
            just more room for your memories.
          </p>
        </div>
      </header>

      {/* Pricing Cards */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Free Tier */}
          <PricingCard 
            title="Explorer"
            price="0"
            description="Perfect for trying out the editor and creating your first draft."
            features={[
              "1 Active Project",
              "5 Welcome Credits",
              "Standard Templates",
              "Mobile-First Editor",
              "Public Link Sharing"
            ]}
            buttonText="Get Started"
            variant="outline"
          />

          {/* Recommended Tier (Creator) */}
          <PricingCard 
            title="Creator"
            price="19"
            description="Our most popular plan for active storytellers and artists."
            features={[
              "Unlimited Projects",
              "50 Monthly Credits",
              "Premium Templates",
              "Advanced Visual Effects",
              "Custom Domains (Portfolio)",
              "Priority Support"
            ]}
            buttonText="Start Free Trial"
            variant="default"
            isPopular={true}
          />

          {/* Pro Tier */}
          <PricingCard 
            title="Archive"
            price="49"
            description="For professionals and studios managing large-scale digital legacies."
            features={[
              "Everything in Creator",
              "150 Monthly Credits",
              "White-label Branding",
              "Early Access to New Features",
              "Dedicated Storage",
              "Team Collaboration"
            ]}
            buttonText="Go Pro"
            variant="outline"
          />
        </div>
      </section>

      {/* Credit System Explanation */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto bg-muted/30 rounded-[2.5rem] p-10 border border-border/50">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Info className="w-5 h-5" />
                <span>How Credits Work</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">1 Credit = 1 Memory</h2>
              <p className="text-muted-foreground leading-relaxed">
                We don't believe in rigid templates. With our credit system, you only pay for the content you add. Use credits for high-resolution photos in your photobooks or special elements in your portfolio.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <Card className="bg-background p-4 text-center border-border">
                <span className="block text-2xl font-bold">1</span>
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Photo</span>
              </Card>
              <Card className="bg-background p-4 text-center border-border">
                <span className="block text-2xl font-bold">1</span>
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Credit</span>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Footer */}
      <footer className="py-20 px-6 text-center border-t border-border/40">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
          <div className="flex gap-8 text-muted-foreground/60 grayscale">
            <ShieldCheck className="w-8 h-8" />
            <Zap className="w-8 h-8" />
            <Star className="w-8 h-8" />
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            Secure payments handled by Paddle. Cancel or change your plan at any time.
          </p>
        </div>
      </footer>
      <Footer />
    </div>
  );
};

const PricingCard = ({ title, price, description, features, buttonText, variant, isPopular = false }: any) => (
  <Card className={`relative flex flex-col h-full bg-card border-border transition-all duration-300 hover:shadow-xl ${isPopular ? 'ring-2 ring-primary scale-105 z-10' : ''}`}>
    {isPopular && (
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
        Most Popular
      </div>
    )}
    <CardHeader className="p-8">
      <CardTitle className="text-xl font-bold mb-2">{title}</CardTitle>
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-4xl font-bold">${price}</span>
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
      <button className={`w-full py-3 rounded-full font-bold transition-all active:scale-95 ${
        variant === 'default' 
          ? 'bg-primary text-primary-foreground hover:opacity-90' 
          : 'bg-background border border-border hover:bg-muted text-foreground'
      }`}>
        {buttonText}
      </button>
    </CardFooter>
  </Card>
);

export default PricingPage;