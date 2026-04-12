import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

const LOCALES = ['en', 'ru', 'kz'];
const SESSION_COOKIE = 'milestis_session';

/**
 * Bot/scanner trap patterns — instant 404, no page rendering.
 * Covers WordPress scanners, PHP probes, secrets hunters, etc.
 */
const TRASH_PATTERNS = [
  /\.php($|\?)/i,
  /\.aspx($|\?)/i,
  /\.env($|\?)/i,
  /\.git(\/|$)/i,
  /\/wp-admin(\/|$)/i,
  /\/wp-content(\/|$)/i,
  /\/wp-includes(\/|$)/i,
  /\/cgi-bin(\/|$)/i,
  /\/\.well-known(\/|$)/i,
  /\/config\.json($|\?)/i,
  /\/xmlrpc\.php/i,
  /\/wp-login\.php/i,
];

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

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Bot / scanner trap — return bare 404 before any processing ───────────
  if (TRASH_PATTERNS.some((re) => re.test(pathname))) {
    return new NextResponse(null, { status: 404 });
  }

  // Firebase App Hosting may rewrite the Host header — check x-forwarded-host first
  const host =
    request.headers.get('x-forwarded-host') ??
    request.headers.get('host') ??
    ''

  // ── Subdomain rewrite: {slug}.milestis.site → /sites/{slug} ──────────────
  // Mode = portfolio (custom subdomain)
  const subdomainMatch = host.match(/^([a-z0-9-]+)\.milestis\.site(?::\d+)?$/);
  if (subdomainMatch) {
    const slug = subdomainMatch[1];
    const url = request.nextUrl.clone();
    url.pathname = `/sites/${slug}`;
    const reqHeaders = new Headers(request.headers);
    reqHeaders.set('x-milestis-mode', 'portfolio');
    return NextResponse.rewrite(url, { request: { headers: reqHeaders } });
  }

  // ── milestis.site → published projects only ───────────────────────────────
  // Mode = photobook (path-based slug)
  const isMilestisSite = host === 'milestis.site' || /^milestis\.site:\d+$/.test(host);
  if (isMilestisSite) {
    // Root with no slug → redirect to main site
    if (pathname === '/' || pathname === '') {
      return NextResponse.redirect('https://milestis.com');
    }
    // /my-slug (and anything deeper) → /sites/my-slug
    const url = request.nextUrl.clone();
    url.pathname = `/sites${pathname}`;
    const reqHeaders = new Headers(request.headers);
    reqHeaders.set('x-milestis-mode', 'photobook');
    return NextResponse.rewrite(url, { request: { headers: reqHeaders } });
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
  // Catch everything except Next.js internals and static assets.
  // The broader matcher lets us intercept bot probes with dotted extensions
  // (e.g. /wp-admin/setup.php) before Next.js attempts to render a page.
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
