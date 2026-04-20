import React from 'react';
import { CTAButton } from '@/components/shared/cta-button';
import {
  Palette,
  Layers,
  Zap,
  CloudLightning,
  Maximize,
  Infinity,
  ShieldCheck,
  Briefcase,
  GripHorizontal,
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import Header from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      <Header />

      {/* Hero */}
      <header className="pt-32 pb-16 px-6 text-center border-b border-border/40">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            No design skills. <br />
            <span className="text-muted-foreground italic font-serif">No compromise.</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Milestis gives you rigid, unbreakable layouts so every project
            you build looks premium — regardless of your experience.
          </p>
        </div>
      </header>

      {/* Section 1: Design System */}
      <section className="py-24 px-6 bg-muted/20 border-y border-border/40">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-16 text-center">01 — Design System</p>

          {/* Rigid Design */}
          <div className="flex flex-col md:flex-row gap-12 items-center mb-24">
            <div className="flex-1 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-3xl">Rigid Design — Quality by Default</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every template in Milestis is a carefully engineered preset — structure, proportions, and visual hierarchy are already worked out by design. You choose from a curated collection and combine with color palettes. The result is always professional, whoever assembled it.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="rounded-2xl border border-border bg-card p-4 text-sm">
                  <p className="font-semibold mb-1">What we handle</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">Structure, proportions, typography, spacing — fully engineered presets.</p>
                </div>
                <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm">
                  <p className="font-semibold mb-1 text-primary">What you control</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">Content, palette, atmosphere, decorations — your creative freedom.</p>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full aspect-video bg-muted/30 rounded-3xl border border-border flex items-center justify-center relative overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              <ShieldCheck className="w-12 h-12 text-muted-foreground/20" />
            </div>
          </div>

          {/* Visual Depth + Decorations — ОБНОВЛЕННЫЙ БЛОК */}
          <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
            <div className="flex-1 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Palette className="w-6 h-6" />
              </div>
              <h2 className="text-3xl">Atmosphere & Personal Touch</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Add depth to any project with textures, light effects, and decorative elements. Layer cinematic overlays, place ornaments across the page, combine everything with a curated color palette — and the project becomes unmistakably yours.
              </p>
              
              {/* Компактные Badge вместо карточек */}
              <div className="flex flex-wrap gap-2 pt-4">
                {[
                  { icon: Layers, label: "Depth Textures" },
                  { icon: CloudLightning, label: "Light Rays" },
                  { icon: GripHorizontal, label: "Decorations" },
                  { icon: Palette, label: "Color Palettes" },
                ].map((item) => (
                  <div 
                    key={item.label} 
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 text-sm font-medium hover:border-primary/30 transition-colors"
                  >
                    <item.icon className="w-4 h-4 text-primary" />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full aspect-video bg-muted/30 rounded-3xl border border-border flex items-center justify-center relative overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-tl from-primary/10 to-transparent opacity-50" />
              <Layers className="w-12 h-12 text-muted-foreground/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Platform */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4 text-center">02 — Platform</p>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Infrastructure That Lasts</h2>
            <p className="text-muted-foreground max-w-xl mx-auto italic font-serif">
              Every project hosted on Milestis is a live web product — not a static file.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-background border-border shadow-sm">
              <CardContent className="p-8">
                <Zap className="w-6 h-6 text-primary mb-4" />
                <h4 className="font-bold mb-2">Opens in an Instant</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Anyone you share the link with gets an instant-loading experience — no app, no download, no friction.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-border shadow-sm">
              <CardContent className="p-8">
                <Maximize className="w-6 h-6 text-primary mb-4" />
                <h4 className="font-bold mb-2">Responsive on Every Screen</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Whether opened on a phone, tablet, or large display — every project adapts and always looks its best.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-border shadow-sm">
              <CardContent className="p-8">
                <Infinity className="w-6 h-6 text-primary mb-4" />
                <h4 className="font-bold mb-2">Always Up to Date</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We maintain every hosted project automatically. Fast, secure, and accessible — years from now.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 3: For Professionals */}
      <section className="py-24 px-6 bg-muted/20 border-y border-border/40">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-16 text-center">03 — For Professionals</p>

          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Briefcase className="w-6 h-6" />
              </div>
              <h2 className="text-3xl">A Tool for Photographers & Creators</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Stop delivering a folder of files. With Milestis, you hand over a finished, branded digital product. A powerful upsell that increases your average order value — and makes clients remember you.
              </p>
              <ul className="space-y-3">
                {[
                  'White-label branding on Creator plan',
                  'Wholesale credits at 80% off retail',
                  'Professional workspace for 25+ active projects',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 w-full aspect-video bg-muted/30 rounded-3xl border border-border flex items-center justify-center relative overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              <Briefcase className="w-12 h-12 text-muted-foreground/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <footer className="py-24 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to build your first project?</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Start for free. No design skills required. Quality guaranteed.
        </p>
        <CTAButton className="bg-foreground text-background px-10 py-4 rounded-full font-bold hover:opacity-90 transition-all active:scale-95 shadow-xl">
          Get Started for Free
        </CTAButton>
      </footer>
      <Footer />
    </div>
  );
};