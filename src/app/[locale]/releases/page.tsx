import { siteConfig } from '@/config/site'
import type { Metadata } from 'next'
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Header from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';


interface ChangelogTextEntry {
  date: string;
  title: string;
  description: string;
  longDescription: string;
  highlights: string[];
}

// Статичный путь к фотографии, который не зависит от языка
import CHANGELOG_IMAGE_SRC from "@/components/assets/milestis-release.webp"; // Укажи здесь реальный путь к файлу
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const titles: Record<string, string> = {
    en: 'Milestis Releases',
    ru: 'Обновления Milestis',
    kz: 'Milestis жаңартулары',
  }
  const descriptions: Record<string, string> = {
    en: 'We\u2019re constantly refining the Milestis experience. Follow our progress as we craft the ultimate tool for your digital legacy.',
    ru: 'Мы постоянно улучшаем опыт использования Milestis. Следите за нашим прогрессом в создании идеального инструмента для цифрового наследия.',
    kz: 'Біз Milestis тәжірибесін үнемі жетілдіреміз. Сандық мұраға арналған ең үздік құралды жасау жолындағы дамуымызды бақылаңыз.',
  }

  const title = titles[locale] ?? titles.en
  const description = descriptions[locale] ?? descriptions.en
  const url = `${siteConfig.appUrl}/${locale}/releases`

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'en': `${siteConfig.appUrl}/en/releases`,
        'ru': `${siteConfig.appUrl}/ru/releases`,
        'kk': `${siteConfig.appUrl}/kz/releases`,
        'x-default': `${siteConfig.appUrl}/en/releases`,
      },
    },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: 'Milestis',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

const ChangelogPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>
}) => {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ChangelogPage' });
  
  // Получаем массив текстовых переводов из JSON
  const stringEntries = t.raw('entries') as ChangelogTextEntry[];

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/10">
      {/* Subtle paper grain — keeps flat surfaces from reading as vector fills */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <Header />

      <main className="max-w-6xl mx-auto pt-32 pb-24 px-6">
        <header className="mb-24">
          <div className="mb-5 flex items-center gap-4">
            <span className="inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
              <Sparkles className="w-3 h-3 text-primary" />
              {t('meta.latestUpdate')}
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <h1 className="font-serif text-5xl leading-tight tracking-tight text-balance mb-6 md:text-6xl">
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
                <time className="sticky top-32 block border-l-2 border-border/60 pl-4 font-mono text-xs uppercase tracking-widest text-muted-foreground/60">
                  {entry.date}
                </time>
              </aside>

              {/* Right: Content */}
              <div className="flex-1 max-w-3xl">
                <h2 className="font-serif text-3xl md:text-4xl mb-8 tracking-tight">
                  {entry.title}
                </h2>

                {/* Image Container с единой статичной фотографией */}
                <div className="mb-8 rounded-2xl overflow-hidden border border-border/40 bg-muted/30 aspect-[16/11] flex items-center justify-center relative shadow-sm">
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
                  <Button variant="link" className="p-0 h-auto text-primary gap-2 group" asChild>
                    <Link href="/help">
                      {t('meta.helpCenterLink')}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
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