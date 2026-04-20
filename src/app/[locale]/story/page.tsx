import React from 'react';
import { CTAButton } from '@/components/shared/cta-button';
import { Heart, Sparkles, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from '@/components/layout/footer';
import Header from '@/components/layout/header';

const MissionPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      <Header />
      
      {/* Hero Section */}
      <header className="relative pt-32 pb-20 px-6 border-b border-border/40">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Heart className="w-4 h-4 fill-current" />
            <span>Every milestone deserves to be remembered</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-foreground leading-[1.1]">
            Your life has milestones. <br /> 
            <span className="text-muted-foreground italic font-serif">They deserve more than a folder.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Milestis turns your most meaningful moments into living digital experiences — beautiful, permanent, and ready to share in minutes.
          </p>
        </div>
      </header>

      {/* The Soul of the Project */}
      <article className="py-24 px-6 bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-semibold mb-6 tracking-tight text-foreground">Why we built Milestis</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                The people we love grow up, move away, get married. Life moves fast — and the moments that define us keep slipping into unorganized photo libraries, never to be properly honored.
              </p>
              
              <div className="space-y-6">

                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-background rounded-lg border border-border shadow-sm text-primary">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Always looks stunning</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      You pick the photos. We handle the rest. Layouts, typography, light — everything is crafted so the result is always beautiful, whoever made it.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-background rounded-lg border border-border shadow-sm text-primary">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">A gift worth sending</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Share a link — and they open an interactive photobook with depth effects, animations and your personal story. On any phone, instantly.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative aspect-square rounded-3xl overflow-hidden border border-border bg-card shadow-lg flex items-center justify-center p-12">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/10 opacity-50" />
              <div className="relative text-center">
                <Sparkles className="w-16 h-16 text-primary/30 mx-auto mb-4" />
                <p className="text-lg font-serif italic text-muted-foreground leading-relaxed px-4">
                  &quot;Some moments are too good to live only in your camera roll.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Speed & Simplicity */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Made for real life</h2>
            <p className="text-muted-foreground italic text-lg font-serif">You shouldn&apos;t need a designer to honor a memory.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center group">
              <div className="mb-6 w-14 h-14 flex items-center justify-center rounded-2xl bg-primary/5 text-primary border border-primary/10">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">5 minutes, start to finish</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Upload your photos, pick a palette, hit publish. That&apos;s it. No tutorials, no learning curve — just your milestone, ready to share.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center group">
              <div className="mb-6 w-14 h-14 flex items-center justify-center rounded-2xl bg-primary/5 text-primary border border-primary/10">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Design you can&apos;t break</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Rigid layouts, curated palettes, professional depth effects. You customize the content — the quality is already guaranteed.
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="mb-6 w-14 h-14 flex items-center justify-center rounded-2xl bg-primary/5 text-primary border border-primary/10">
                <ArrowRight className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">From your phone</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Build and publish entirely from your smartphone. At the venue, on the way home, wherever the moment finds you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <footer className="pb-32 px-6">
        <Card className="max-w-4xl mx-auto bg-primary text-primary-foreground overflow-hidden border-none relative shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <CardContent className="p-12 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 italic font-serif leading-tight">
              Some moments only happen once.
            </h2>
            <p className="text-primary-foreground/90 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
              Make them permanent. Make them beautiful. Start your first milestone today.
            </p>
            <CTAButton className="bg-background text-foreground px-12 py-4 rounded-full font-bold hover:bg-secondary transition-colors shadow-lg active:scale-95">
              Begin Your Story
            </CTAButton>
          </CardContent>
        </Card>
      </footer>
      <Footer />
    </div>
  );
};

export default MissionPage;