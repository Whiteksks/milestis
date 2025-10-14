import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

// Ограничиваем matcher, чтобы не трогать /api, /_next и статику
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
