import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import Script from 'next/script';
import { Toaster } from '@/components/ui/sonner';
import { Providers } from '@/components/providers';
import { FirebaseInitializer } from '@/lib/firebase';
import { ReferralConversionToast } from '@/lib/referral';
import { MetaPixelScript } from '@/lib/analytics';
import { JsonLd } from '@/components/shared/json-ld';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo/json-ld';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <Script
        id="iubenda-cookie-solution"
        strategy="afterInteractive"
        src="https://embeds.iubenda.com/widgets/f6bff847-fa8b-4753-8ce9-3dc2137f21d0.js"
      />
      <MetaPixelScript />
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      <FirebaseInitializer />
      <ReferralConversionToast />
      <Providers>
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </Providers>
    </NextIntlClientProvider>
  );
}