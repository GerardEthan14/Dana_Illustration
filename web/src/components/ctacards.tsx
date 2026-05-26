import Link from 'next/link';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

type CTACardsProps = {
  dict: Dictionary['home']['ctaCards'];
  lang: Locale;
};

export function CTACards({ dict, lang }: CTACardsProps) {
  return (
    <section className="cta-blocks">
      <Link className="cta-card" href={`/${lang}/portfolio`}>
        <h3>{dict.portfolio.title}</h3>
        <p>{dict.portfolio.description}</p>
        <span className="cta-arrow">→</span>
      </Link>
      <Link className="cta-card" href={`/${lang}/commissions`}>
        <h3>{dict.commissions.title}</h3>
        <p>{dict.commissions.description}</p>
        <span className="cta-arrow">→</span>
      </Link>
      <Link className="cta-card" href={`/${lang}/shop`}>
        <h3>{dict.shop.title}</h3>
        <p>{dict.shop.description}</p>
        <span className="cta-arrow">→</span>
      </Link>
    </section>
  );
}
