'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';
import { locales, localeNames, type Locale } from '@/i18n/config';

type LanguageSwitcherProps = {
  current: Locale;
};

export function LanguageSwitcher({ current }: LanguageSwitcherProps) {
  const pathname = usePathname();
  // Strip current locale from pathname to keep the user on the same page
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/';

  return (
    <div className="lang-switcher">
      {locales.map((locale, i) => (
        <Fragment key={locale}>
          {i > 0 && <span aria-hidden>·</span>}
          <Link
            href={`/${locale}${pathWithoutLocale}`}
            className={current === locale ? 'lang-active' : ''}
            aria-label={`Switch to ${localeNames[locale]}`}
          >
            {localeNames[locale]}
          </Link>
        </Fragment>
      ))}
    </div>
  );
}
