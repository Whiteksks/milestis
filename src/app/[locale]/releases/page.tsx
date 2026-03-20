import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Header from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const ChangelogPage = () => {
  const entries = [
    {
      date: "March 12, 2026",
      title: "Goodbye Complex Editors. Hello, Milestis!",
      image: "/api/placeholder/800/450", // Замени на реальный путь к скриншоту
      description: "We are officially live. Milestis is here to prove that professional design doesn't have to be difficult. From now on, your focus stays on the story, while we handle the aesthetic.",
      longDescription: `
        Creating a digital legacy shouldn't feel like a chore. Our initial launch introduces a 
        universal editor with strict, high-performance templates for photobooks and portfolios. 
        Whether you're at an event or on the move, you can now build a complete project in under 
        5 minutes using just your smartphone. 
      `,
      highlights: [
        "Select a professional layout and see your project come to life instantly.",
        "Add atmospheric depth with light rays and textures using drag-and-drop.",
        "Your memories are preserved forever with a unique permanent link."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      <Header />

      <main className="max-w-6xl mx-auto pt-32 pb-24 px-6">
        <header className="mb-24 relative">
          {/* Декоративное пятно на фоне */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-medium mb-6 animate-in fade-in slide-in-from-bottom-2">
            <Sparkles className="w-3 h-3" />
            <span>Latest Update: March 2026</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Milestis Releases
          </h1>
          
          <p className="text-muted-foreground text-xl font-light max-w-2xl leading-relaxed">
            We’re constantly refining the Milestis experience. 
            Follow our progress as we craft the ultimate tool for your digital legacy.
          </p>
        </header>
        <div className="space-y-32">
          {entries.map((entry, index) => (
            <section key={index} className="flex flex-col md:flex-row gap-8 md:gap-16">
              
              {/* Left: Date */}
              <aside className="md:w-32 shrink-0">
                <time className="text-sm font-medium text-muted-foreground/60 sticky top-32">
                  {entry.date}
                </time>
              </aside>

              {/* Right: Content */}
              <div className="flex-1 max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight">
                  {entry.title}
                </h2>

                {/* Image Placeholder */}
                <div className="mb-8 rounded-2xl overflow-hidden border border-border/40 bg-muted/30 aspect-video flex items-center justify-center">
                  <img 
                    src={entry.image} 
                    alt={entry.title} 
                    className="w-full h-full object-cover opacity-90"
                  />
                </div>

                <div className="space-y-6 text-muted-foreground leading-relaxed font-light text-lg">
                  <p className="text-foreground font-medium">
                    {entry.description}
                  </p>
                  <p>
                    {entry.longDescription}
                  </p>
                  
                  <ul className="space-y-4 pt-4">
                    {entry.highlights.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <Sparkles className="w-4 h-4 mt-1 text-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-8">
                    <Button variant="link" className="p-0 h-auto text-primary gap-2 group">
                      Learn more in Help Center 
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>

            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ChangelogPage;