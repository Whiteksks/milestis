import React from 'react';
import { 
  Smartphone, 
  Palette, 
  Layers, 
  Zap, 
  MousePointer2, 
  CloudLightning, 
  Maximize, 
  Infinity,
  Focus
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import Header from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      <Header />
      {/* Header Section */}
      <header className="pt-32 pb-16 px-6 text-center border-b border-border/40">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Powerful tools, <br />
            <span className="text-muted-foreground italic font-serif">effortless results.</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            We’ve engineered every detail so you can focus on your story. 
            Professional performance meets intuitive design.
          </p>
        </div>
      </header>

      {/* Feature Grid 1: The Editor */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center mb-24">
            <div className="flex-1 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Smartphone className="w-6 h-6" />
              </div>
              <h2 className="text-3xl">Mobile-First Creation</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our editor is built for the modern world. Lightweight and high-performing, it allows you to build complete photobooks or professional portfolios directly from your smartphone without any lag.
              </p>
              <ul className="space-y-3">
                {['Zero-latency interface', 'Optimized for touch', 'Instant auto-save'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 w-full aspect-video bg-muted/30 rounded-3xl border border-border flex items-center justify-center relative overflow-hidden shadow-inner">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
               <MousePointer2 className="w-12 h-12 text-muted-foreground/20" />
            </div>
          </div>

          {/* Feature Grid 2: Aesthetics */}
          <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
            <div className="flex-1 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Palette className="w-6 h-6" />
              </div>
              <h2 className="text-3xl">Curated Visual Depth</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Move beyond flat designs. Add atmosphere with light rays, professional textures, and cinematic transitions powered by Framer Motion—all pre-configured to look stunning.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <Card className="bg-card border-border/60">
                  <CardContent className="p-4 text-sm font-medium">
                    <Layers className="w-4 h-4 mb-2 text-primary" />
                    Depth Textures
                  </CardContent>
                </Card>
                <Card className="bg-card border-border/60">
                  <CardContent className="p-4 text-sm font-medium">
                    <CloudLightning className="w-4 h-4 mb-2 text-primary" />
                    Light Rays
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="flex-1 w-full aspect-video bg-muted/30 rounded-3xl border border-border flex items-center justify-center relative overflow-hidden shadow-inner">
               <div className="absolute inset-0 bg-gradient-to-tl from-primary/10 to-transparent opacity-50" />
               <Focus className="w-12 h-12 text-muted-foreground/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid: Technical Excellence */}
      <section className="py-24 px-6 bg-muted/20 border-y border-border/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Under the Hood</h2>
            <p className="text-muted-foreground max-w-xl mx-auto italic font-serif">
              We use industry-leading technologies to ensure your project is fast, accessible, and future-proof.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-background border-border shadow-sm">
              <CardContent className="p-8">
                <Zap className="w-6 h-6 text-primary mb-4" />
                <h4 className="font-bold mb-2">Tailwind CSS</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Utility-first styling ensures minimal bundle size and lightning-fast load times for your visitors.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-border shadow-sm">
              <CardContent className="p-8">
                <Maximize className="w-6 h-6 text-primary mb-4" />
                <h4 className="font-bold mb-2">Responsive Logic</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your designs automatically adapt to any screen size—from ultrawide monitors to the smallest smartphones.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-border shadow-sm">
              <CardContent className="p-8">
                <Infinity className="w-6 h-6 text-primary mb-4" />
                <h4 className="font-bold mb-2">Edge Hosting</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Global CDN distribution means your portfolio or photobook loads instantly, no matter where your audience is.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Credit System Feature */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto border border-primary/20 rounded-[2.5rem] p-12 text-center bg-gradient-to-b from-primary/[0.02] to-transparent">
          <h2 className="text-3xl font-bold mb-6 italic font-serif">Flexible Credit Ecosystem</h2>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            Forget complex pricing tiers. One subscription gives you 50 monthly credits. 
            Spend them however you like: <strong>1 credit = 1 high-resolution photo.</strong> 
            Build your photobook at your own pace and budget.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
             <div className="px-6 py-3 bg-background border border-border rounded-full text-sm font-semibold">
               Portfolio Site: 10 Credits
             </div>
             <div className="px-6 py-3 bg-background border border-border rounded-full text-sm font-semibold">
               Standard Photobook: 20 Credits
             </div>
             <div className="px-6 py-3 bg-background border border-border rounded-full text-sm font-semibold text-primary">
               Unlimited Updates Included
             </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <footer className="py-24 px-6 text-center">
        <h2 className="text-2xl font-bold mb-8">Ready to experience the future of design?</h2>
        <button className="bg-foreground text-background px-10 py-4 rounded-full font-bold hover:opacity-90 transition-all active:scale-95 shadow-xl">
          Get Started for Free
        </button>
      </footer>
      <Footer />
    </div>
  );
};

export default FeaturesPage;