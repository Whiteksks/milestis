'use client';

import { useIubenda } from './useIubenda';

// 1. Условия использования
export function IubendaTerms() {
  useIubenda();
  return (
    <a 
      href="https://www.iubenda.com/terms-and-conditions/66643854" 
      className="iubenda-nostyle iubenda-noiframe iubenda-embed iub-body-embed" 
      title="Terms and Conditions"
    >
      Terms and Conditions
    </a>
  );
}

// 2. Куки
export function IubendaCookie() {
  useIubenda();
  return (
    <a 
      href="https://www.iubenda.com/privacy-policy/66643854/cookie-policy" 
      className="iubenda-nostyle iubenda-noiframe iubenda-embed iub-body-embed" 
      title="Cookie Policy"
    >
      Cookie Policy
    </a>
  );
}

// 3. Политика конфиденциальности
export function IubendaPrivacy() {
  useIubenda();
  return (
    <a 
      href="https://www.iubenda.com/privacy-policy/66643854" 
      className="iubenda-nostyle iubenda-noiframe iubenda-embed iub-body-embed" 
      title="Privacy Policy"
    >
      Privacy Policy
    </a>
  );
}