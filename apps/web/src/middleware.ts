import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { defaultLocale, type Locale, locales } from './i18n/config';

const LOCALE_COOKIE = 'NEXT_LOCALE';

function getPreferredLocale(request: NextRequest): Locale {
  // Check if locale cookie exists
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  // Parse Accept-Language header
  const acceptLanguage = request.headers.get('Accept-Language');
  if (acceptLanguage) {
    const preferredLanguages = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().substring(0, 2).toLowerCase());

    for (const lang of preferredLanguages) {
      if (locales.includes(lang as Locale)) {
        return lang as Locale;
      }
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Check if locale cookie exists
  const existingLocale = request.cookies.get(LOCALE_COOKIE)?.value;

  if (!existingLocale) {
    // Set initial locale cookie based on browser preference
    const preferredLocale = getPreferredLocale(request);
    response.cookies.set(LOCALE_COOKIE, preferredLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
