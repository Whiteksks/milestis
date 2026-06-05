import React from 'react';
import { useTranslations } from 'next-intl';
import { CTAButton } from '@/components/shared/cta-button';
import { Heart, Sparkles, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from '@/components/layout/footer';
import Header from '@/components/layout/header';

const MissionPage = () => {
  const t = useTranslations('MissionPage');

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      <Header />
      
      {/* Hero Section */}
      <header className="relative pt-32 pb-20 px-6 border-b border-border/40">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Heart className="w-4 h-4 fill-current" />
            <span>{t('hero.badge')}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-foreground leading-[1.1]">
            {t('hero.titleMain')} <br /> 
            <span className="text-muted-foreground italic font-serif">{t('hero.titleSub')}</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('hero.description')}
          </p>
        </div>
      </header>

      {/* The Soul of the Project */}
      <article className="py-24 px-6 bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-semibold mb-6 tracking-tight text-foreground">
                {t('soul.title')}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {t('soul.description')}
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-background rounded-lg border border-border shadow-sm text-primary">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{t('soul.features.stunning.title')}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t('soul.features.stunning.description')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-background rounded-lg border border-border shadow-sm text-primary">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{t('soul.features.gift.title')}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t('soul.features.gift.description')}
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
                  "{t('soul.quote')}"
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
            <h2 className="text-3xl font-bold mb-4 tracking-tight">{t('simplicity.title')}</h2>
            <p className="text-muted-foreground italic text-lg font-serif">{t('simplicity.subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center group">
              <div className="mb-6 w-14 h-14 flex items-center justify-center rounded-2xl bg-primary/5 text-primary border border-primary/10">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('simplicity.features.speed.title')}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t('simplicity.features.speed.description')}
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center group">
              <div className="mb-6 w-14 h-14 flex items-center justify-center rounded-2xl bg-primary/5 text-primary border border-primary/10">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('simplicity.features.unbreakable.title')}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t('simplicity.features.unbreakable.description')}
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="mb-6 w-14 h-14 flex items-center justify-center rounded-2xl bg-primary/5 text-primary border border-primary/10">
                <ArrowRight className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('simplicity.features.mobile.title')}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t('simplicity.features.mobile.description')}
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
              {t('cta.title')}
            </h2>
            <p className="text-primary-foreground/90 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
              {t('cta.description')}
            </p>
            <CTAButton className="bg-background text-foreground px-12 py-4 rounded-full font-bold hover:bg-secondary transition-colors shadow-lg active:scale-95">
              {t('cta.button')}
            </CTAButton>
          </CardContent>
        </Card>
      </footer>
      <Footer />
    </div>
  );
};

export default MissionPage;