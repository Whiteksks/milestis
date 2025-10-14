import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  // поддерживаемые локали
  locales: ['en', 'ru', 'kz'],
  defaultLocale: 'en'
});
