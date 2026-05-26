import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale, type Locale } from '@/i18n/config';

function getLocale(request: NextRequest): Locale {
  const acceptLanguage = request.headers.get('accept-language') ?? '';
  for (const lang of acceptLanguage.split(',')) {
    const code = lang.trim().split(';')[0].split('-')[0].toLowerCase();
    if ((locales as readonly string[]).includes(code)) {
      return code as Locale;
    }
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Forward pathname so the root layout can determine current locale
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  // Studio lives outside [lang] — let it through unchanged
  if (pathname.startsWith('/studio')) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Skip Next.js internals, static assets, API routes
  matcher: ['/((?!_next|api|favicon.ico|images|.*\\..*).*)'],
};
