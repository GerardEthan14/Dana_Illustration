import Image from 'next/image';
import Link from 'next/link';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

type HeroProps = {
  dict: Dictionary['home']['hero'];
  lang: Locale;
};

export function Hero({ dict, lang }: HeroProps) {
  return (
    <section className="hero">
      <div className="hero-text">
        <p className="eyebrow">{dict.eyebrow}</p>
        <h1>
          {dict.title}
          <br />
          <em>{dict.titleAccent}</em>.
        </h1>
        <p className="hero-subtitle">{dict.subtitle}</p>
        <div className="hero-ctas">
          <Link className="btn btn-primary" href={`/${lang}/commissions`}>
            {dict.ctaPrimary}
          </Link>
          <Link className="btn btn-ghost" href={`/${lang}/portfolio`}>
            {dict.ctaSecondary} →
          </Link>
        </div>
      </div>
      <div className="hero-image">
        <div className="hero-image-frame">
          <Image
            src="/images/covers/cover-1.png"
            alt="Mira à l'aventure"
            width={600}
            height={800}
            priority
            sizes="(max-width: 960px) 80vw, 40vw"
          />
        </div>
        <div className="hero-tag">
          {dict.tag} · <em>{dict.tagWork}</em>
        </div>
      </div>
    </section>
  );
}
