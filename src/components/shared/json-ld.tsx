import Script from 'next/script';

/** Renders one or more schema.org objects as a JSON-LD <script> tag. */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <Script
      id="schema-jsonld" // Next.js требует уникальный ID для инлайновых скриптов
      type="application/ld+json"
      strategy="afterInteractive" // Скрипт загрузится без ущерба для скорости сайта
    >
      {JSON.stringify(data)}
    </Script>
  );
}