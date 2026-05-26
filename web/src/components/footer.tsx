import Link from 'next/link';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

type FooterProps = {
  dict: Dictionary;
  lang: Locale;
};

export function Footer({ dict, lang }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-cols">
        <div className="footer-brand">
          <h4>
            Dana <em>Illustration</em>
          </h4>
          <p>{dict.footer.tagline}</p>
        </div>

        <div>
          <h5>{dict.footer.siteMap}</h5>
          <ul>
            <li>
              <Link href={`/${lang}/portfolio`}>{dict.nav.portfolio}</Link>
            </li>
            <li>
              <Link href={`/${lang}/shop`}>{dict.nav.shop}</Link>
            </li>
            <li>
              <Link href={`/${lang}/commissions`}>{dict.nav.commissions}</Link>
            </li>
            <li>
              <Link href={`/${lang}/about`}>{dict.nav.about}</Link>
            </li>
            <li>
              <Link href={`/${lang}/contact`}>{dict.nav.contact}</Link>
            </li>
          </ul>
        </div>

        <div>
          <h5>{dict.footer.follow}</h5>
          <ul>
            <li>
              <a
                href="https://instagram.com/dana_illustration"
                target="_blank"
                rel="noopener noreferrer"
              >
                {dict.footer.instagram}
              </a>
            </li>
            <li>
              <Link href={`/${lang}/contact`}>{dict.footer.email}</Link>
            </li>
          </ul>
        </div>

        <div>
          <h5>{dict.footer.legal}</h5>
          <ul>
            <li>
              <Link href={`/${lang}/legal/mentions`}>{dict.footer.mentions}</Link>
            </li>
            <li>
              <Link href={`/${lang}/legal/terms`}>{dict.footer.terms}</Link>
            </li>
            <li>
              <Link href={`/${lang}/legal/privacy`}>{dict.footer.privacy}</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {year} Dana Illustration · {dict.footer.copyright}</p>
        <p>v0.1</p>
      </div>
    </footer>
  );
}
