'use client';

import { useLocale } from 'next-intl';
import { useIubenda } from './useIubenda';

interface IubendaConfig {
  privacy: string;
  cookie: string;
  terms: string;
}

const IUBENDA_CONFIGS: Record<string, IubendaConfig> = {
  en: {
    privacy: 'https://www.iubenda.com/privacy-policy/66643854',
    cookie:  'https://www.iubenda.com/privacy-policy/66643854/cookie-policy',
    terms:   'https://www.iubenda.com/terms-and-conditions/66643854',
  },
  ru: {
    privacy: 'https://www.iubenda.com/privacy-policy/99637352',
    cookie:  'https://www.iubenda.com/privacy-policy/99637352/cookie-policy',
    terms:   'https://www.iubenda.com/polozhyeniya-i-usloviya/99637352',
  },
};

function useIubendaConfig(): IubendaConfig {
  const locale = useLocale();
  return IUBENDA_CONFIGS[locale] ?? IUBENDA_CONFIGS.en;
}

// 1. Условия использования
export function IubendaTerms() {
  const { terms } = useIubendaConfig();
  void terms;
  useIubenda();
  // Iubenda temporarily disabled
  return null;
  /*
  return (
    <div className="w-full overflow-x-hidden">
      <a
        href={terms}
        className="iubenda-nostyle iubenda-noiframe iubenda-embed iub-body-embed"
        title="Terms and Conditions"
      >
        Terms and Conditions
      </a>
    </div>
  );
  */
}

// 2. Куки
export function IubendaCookie() {
  const { cookie } = useIubendaConfig();
  void cookie;
  useIubenda();
  // Iubenda temporarily disabled
  return null;
  /*
  return (
    <div className="w-full overflow-x-hidden">
      <a
        href={cookie}
        className="iubenda-nostyle iubenda-noiframe iubenda-embed iub-body-embed"
        title="Cookie Policy"
      >
        Cookie Policy
      </a>
    </div>
  );
  */
}

// 3. Политика конфиденциальности
export function IubendaPrivacy() {
  const { privacy } = useIubendaConfig();
  void privacy;
  useIubenda();
  // Iubenda temporarily disabled
  return null;
  /*
  return (
    <div className="w-full overflow-x-hidden">
      <a
        href={privacy}
        className="iubenda-nostyle iubenda-noiframe iubenda-embed iub-body-embed"
        title="Privacy Policy"
      >
        Privacy Policy
      </a>
    </div>
  );
  */
}