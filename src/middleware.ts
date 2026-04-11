import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

const BLOCKED_PAGES = [
  'dashboard/analytics',
  'dashboard/templates',
  'admin/settings',
  'api/internal'
];


export function proxy(request: NextRequest) {
  const host = request.headers.get('host') ?? ''

  // {slug}.milestis.site -> portfolio subdomain -> rewrite to /sites/{slug}
  const subdomainMatch = host.match(/^([a-z0-9-]+)\.milestis\.site(?::\d+)?$/)
  if (subdomainMatch) {
    const slug = subdomainMatch[1]
    const url = request.nextUrl.clone()
    url.pathname = `/sites/${slug}`
    return NextResponse.rewrite(url)
  }

  // milestis.site/{slug}?token=xxx -> photobook path -> rewrite to /sites/{slug}
  const isMilestisSite = host === 'milestis.site' || /^milestis\.site:\d+$/.test(host)
  if (isMilestisSite) {
    const pathname = request.nextUrl.pathname
    if (pathname !== '/' && pathname.startsWith('/')) {
      const url = request.nextUrl.clone()
      url.pathname = `/sites${pathname}`
      return NextResponse.rewrite(url)
    }
  }

  // Block access to /dashboard/analytics and /dashboard/templates for subdomains and main domain
  const pathname = request.nextUrl.pathname;
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}\//, '/');
  const isBlocked = BLOCKED_PAGES.some(path => 
    pathWithoutLocale === `/${path}` || pathWithoutLocale.startsWith(`/${path}/`)
  );
  if (isBlocked) {
    return new NextResponse(null, { status: 404 });
  }

  // Regular milestis.com traffic - i18n as usual
  return intlMiddleware(request)
}

// Restrict matcher to avoid touching /api, /_next and static files
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
