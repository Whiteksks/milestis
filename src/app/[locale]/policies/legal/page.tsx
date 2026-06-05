'use client'

import { ShieldCheck, Scale, FileText, ArrowRight, Lock, Mail } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'

const POLICIES = [
  {
    id: "terms",
    icon: <Scale className="w-5 h-5" />,
    link: "/policies/terms" // Сюда поставишь ссылку на условия от Iubenda
  },
  {
    id: "privacy",
    icon: <ShieldCheck className="w-5 h-5" />,
    link: "/policies/privacy-policy" // Сюда ссылку на приватность от Iubenda
  },
  {
    id: "cookies",
    icon: <FileText className="w-5 h-5" />,
    link: "/policies/cookie-policy" // Сюда ссылку на куки от Iubenda
  }
]

const LegalPage = () => {
  const t = useTranslations('Legal')

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/10">
      <main className="max-w-3xl mx-auto px-6 py-24">
        
        {/* Header Section */}
        <header className="mb-16 space-y-4">
          <div className="flex items-center gap-2 text-primary font-medium">
            <Lock className="w-4 h-4" />
            <span className="text-xs uppercase tracking-widest">
              {t('badge')}
            </span>
          </div>
          
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl text-balance">
            {t('title')}
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {t('description')}
          </p>
        </header>

        {/* Policies List */}
        <section className="grid gap-4">
          {POLICIES.map((policy) => (
            <Link
              key={policy.id}
              href={policy.link}
              className="group flex items-center justify-between p-6 rounded-lg border border-border bg-card hover:bg-accent hover:border-accent-foreground/20 transition-all duration-150"
            >
              <div className="flex items-start gap-5">
                <div className="mt-1 flex items-center justify-center size-10 rounded-md text-secondary-foreground">
                  {policy.icon}
                </div>
                
                <div className="space-y-1">
                  <h2 className="font-medium text-lg leading-tight">
                    {t(`policies.${policy.id}.title`)}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-snug">
                    {t(`policies.${policy.id}.description`)}
                  </p>
                </div>
              </div>

              <div className="hidden sm:block text-muted-foreground/50 group-hover:text-primary transition-colors">
                <ArrowRight className="w-5 h-5" />
              </div>
            </Link>
          ))}
        </section>

        {/* Support Section */}
        <footer className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-8 rounded-xl border border-border bg-muted/20">
            <div className="space-y-1">
              <h3 className="font-medium">
                {t('support.title')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('support.description')}
              </p>
            </div>
            
            <a 
              href="mailto:support@milestis.com" 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Mail className="w-4 h-4" />
              {t('support.cta')}
            </a>
          </div>
          
          <p className="mt-10 text-center text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em]">
            {t('effectiveDate')}
          </p>
        </footer>
      </main>
    </div>
  )
}

export default LegalPage