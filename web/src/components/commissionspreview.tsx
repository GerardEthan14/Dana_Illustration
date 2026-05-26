import Image from 'next/image';
import Link from 'next/link';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

type CommissionsPreviewProps = {
  dict: Dictionary['home']['commissions'];
  lang: Locale;
};

export function CommissionsPreview({ dict, lang }: CommissionsPreviewProps) {
  const items = [
    {
      key: 'animal' as const,
      image: '/images/animals/animal-2.png',
      featured: false,
    },
    {
      key: 'cover' as const,
      image: '/images/covers/cover-1.png',
      featured: true,
    },
    {
      key: 'custom' as const,
      image: '/images/portfolio/portfolio-1.png',
      featured: false,
    },
  ];

  return (
    <section className="commissions-preview" id="commissions">
      <div className="section-head">
        <p className="eyebrow">{dict.eyebrow}</p>
        <h2>
          {dict.titlePart1} <em>{dict.titleAccent}</em>
        </h2>
        <p className="section-sub">{dict.subtitle}</p>
      </div>

      <div className="commission-cards">
        {items.map((item) => {
          const data = dict.items[item.key];
          return (
            <article
              key={item.key}
              className={`commission-card${item.featured ? ' featured' : ''}`}
            >
              <div className="commission-image">
                <Image
                  src={item.image}
                  alt={data.title}
                  width={600}
                  height={450}
                  sizes="(max-width: 960px) 90vw, 33vw"
                />
              </div>
              <div className="commission-body">
                {item.featured && (
                  <span className="badge">{dict.featured}</span>
                )}
                <h3>{data.title}</h3>
                <p className="price">
                  {dict.fromPrice} {data.price}
                </p>
                <p>{data.description}</p>
                <Link className="link-arrow" href={`/${lang}/commissions`}>
                  {dict.learnMore} →
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="section-cta">
        <Link className="btn btn-primary" href={`/${lang}/commissions`}>
          {dict.requestQuote}
        </Link>
      </div>
    </section>
  );
}
