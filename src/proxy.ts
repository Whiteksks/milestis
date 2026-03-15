import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const host = request.headers.get('host') ?? ''

  // *.milestis.site (и localhost: abc123.milestis.site:3000)
  const siteMatch = host.match(/^([a-z0-9-]+)\.milestis\.site(?::\d+)?$/)

  if (siteMatch) {
    const projectId = siteMatch[1]
    const url = request.nextUrl.clone()
    url.pathname = `/sites/${projectId}`
    return NextResponse.rewrite(url)
  }

  // Обычный .com трафик — i18n как обычно
  return intlMiddleware(request)
}

// Ограничиваем matcher, чтобы не трогать /api, /_next и статику
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
