import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Toaster } from '@/components/ui/sonner';
import { Providers } from '@/components/providers';
import { FirebaseInitializer } from '@/lib/firebase';
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
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      <FirebaseInitializer />
      <Providers>
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </Providers>
    </NextIntlClientProvider>
  );
}