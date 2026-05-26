import Link from 'next/link';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import { LanguageSwitcher } from './LanguageSwitcher';

type HeaderProps = {
  dict: Dictionary['nav'];
  lang: Locale;
};

export function Header({ dict, lang }: HeaderProps) {
  return (
    <header className="site-header">
      <nav className="nav">
        <Link className="logo" href={`/${lang}`}>
          Dana <em>Illustration</em>
        </Link>

        <ul className="nav-links">
          <li>
            <Link href={`/${lang}/portfolio`}>{dict.portfolio}</Link>
          </li>
          <li>
            <Link href={`/${lang}/shop`}>{dict.shop}</Link>
          </li>
          <li>
            <Link href={`/${lang}/commissions`}>{dict.commissions}</Link>
          </li>
          <li>
            <Link href={`/${lang}/about`}>{dict.about}</Link>
          </li>
          <li>
            <Link href={`/${lang}/contact`}>{dict.contact}</Link>
          </li>
        </ul>

        <div className="nav-actions">
          <LanguageSwitcher current={lang} />
          <button className="cart-btn" aria-label={dict.cart}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="cart-count">0</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
