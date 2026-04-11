import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

const LOCALES = ['en', 'ru', 'kz'];
const SESSION_COOKIE = 'milestis_session';

/** Routes under construction — always 404 */
const BLOCKED_PAGES = [
  'dashboard/analytics',
  'dashboard/templates',
  'admin/settings',
  'api/internal'
];

/** Strip leading locale segment, e.g. /en/dashboard → /dashboard */
function stripLocale(pathname: string): string {
  for (const locale of LOCALES) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1) || '/';
    }
  }
  return pathname;
}

/** Routes that require authentication */
const AUTH_REQUIRED = ['/dashboard', '/account', '/design'];

/** Routes that should redirect authenticated users away (auth pages) */
const AUTH_PAGES = ['/auth'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') ?? '';

  // ── Subdomain rewrite: {slug}.milestis.site → /sites/{slug} ──────────────
  const subdomainMatch = host.match(/^([a-z0-9-]+)\.milestis\.site(?::\d+)?$/);
  if (subdomainMatch) {
    const slug = subdomainMatch[1];
    const url = request.nextUrl.clone();
    url.pathname = `/sites/${slug}`;
    return NextResponse.rewrite(url);
  }

  // ── milestis.site/{slug} → /sites/{slug} ──────────────────────────────────
  const isMilestisSite = host === 'milestis.site' || /^milestis\.site:\d+$/.test(host);
  if (isMilestisSite) {
    if (pathname !== '/' && pathname.startsWith('/')) {
      const url = request.nextUrl.clone();
      url.pathname = `/sites${pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // ── Blocked pages (under construction) ─────────────────────────────────────
  const bare0 = stripLocale(pathname);
  const isBlocked = BLOCKED_PAGES.some(
    (p) => bare0 === p || bare0.startsWith(`${p}/`)
  );
  if (isBlocked) {
    return new NextResponse(null, { status: 404 });
  }

  // ── Auth-based redirects (main domain only) ───────────────────────────────
  const isAuthenticated = request.cookies.get(SESSION_COOKIE)?.value === '1';
  const bare = stripLocale(pathname); // path without locale prefix

  // Detect locale for redirect targets
  const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : 'en';

  // 1. Protected pages → redirect unauthenticated to login
  const needsAuth = AUTH_REQUIRED.some(
    (p) => bare === p || bare.startsWith(`${p}/`)
  );
  if (needsAuth && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/auth/login`;
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // 2. Landing / → redirect authenticated users to dashboard
  if (bare === '/' && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/dashboard`;
    return NextResponse.redirect(url);
  }

  // 3. Auth pages (login) → redirect authenticated users to dashboard
  const isAuthPage = AUTH_PAGES.some(
    (p) => bare === p || bare.startsWith(`${p}/`)
  );
  if (isAuthPage && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/dashboard`;
    return NextResponse.redirect(url);
  }

  // ── i18n middleware for everything else ───────────────────────────────────
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
