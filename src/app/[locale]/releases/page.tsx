import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Header from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

// Описываем интерфейс для текстовых данных из JSON
interface ChangelogTextEntry {
  date: string;
  title: string;
  description: string;
  longDescription: string;
  highlights: string[];
}

// Статичный путь к фотографии, который не зависит от языка
const CHANGELOG_IMAGE_SRC = "/images/changelog/v1.png"; // Укажи здесь реальный путь к файлу

const ChangelogPage = () => {
  const t = useTranslations('ChangelogPage');
  
  // Получаем массив текстовых переводов из JSON
  const stringEntries = t.raw('entries') as ChangelogTextEntry[];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      <Header />

      <main className="max-w-6xl mx-auto pt-32 pb-24 px-6">
        <header className="mb-24 relative">
          {/* Декоративное пятно на фоне */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-medium mb-6 animate-in fade-in slide-in-from-bottom-2">
            <Sparkles className="w-3 h-3" />
            <span>{t('meta.latestUpdate')}</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            {t('meta.title')}
          </h1>
          
          <p className="text-muted-foreground text-xl font-light max-w-2xl leading-relaxed">
            {t('meta.description')}
          </p>
        </header>

        <div className="space-y-32">
          {stringEntries.map((entry, index) => (
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

                {/* Image Container с единой статичной фотографией */}
                <div className="mb-8 rounded-2xl overflow-hidden border border-border/40 bg-muted/30 aspect-video flex items-center justify-center relative">
                  <Image 
                    src={CHANGELOG_IMAGE_SRC} 
                    alt={entry.title} 
                    fill
                    priority={index === 0} // Первая картинка загружается быстрее
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
                      {t('meta.helpCenterLink')}
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