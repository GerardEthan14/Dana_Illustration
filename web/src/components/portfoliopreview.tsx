import Image from 'next/image';
import Link from 'next/link';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

type PortfolioPreviewProps = {
  dict: Dictionary['home']['portfolio'];
  lang: Locale;
};

const PREVIEW_IMAGES = [
  { src: '/images/portfolio/portfolio-1.png', alt: 'Portfolio · personnages' },
  { src: '/images/animals/animal-1.png', alt: 'Portrait d’animaux' },
  { src: '/images/portfolio/portfolio-2.png', alt: 'Portfolio · personnages' },
  { src: '/images/covers/cover-2.png', alt: 'Couverture de livre' },
  { src: '/images/portfolio/portfolio-3.png', alt: 'Portfolio · personnages' },
  { src: '/images/animals/animal-4.png', alt: 'Portrait d’animaux' },
  { src: '/images/portfolio/portfolio-4.png', alt: 'Portfolio · personnages' },
  { src: '/images/covers/cover-3.png', alt: 'Couverture de livre' },
];

export function PortfolioPreview({ dict, lang }: PortfolioPreviewProps) {
  return (
    <section className="portfolio-preview" id="portfolio">
      <div className="section-head">
        <p className="eyebrow">{dict.eyebrow}</p>
        <h2>{dict.title}</h2>
      </div>
      <div className="portfolio-grid">
        {PREVIEW_IMAGES.map((image) => (
          <Link
            key={image.src}
            className="portfolio-item"
            href={`/${lang}/portfolio`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={500}
              height={500}
              sizes="(max-width: 960px) 50vw, 25vw"
            />
          </Link>
        ))}
      </div>
      <div className="section-cta">
        <Link className="link-arrow" href={`/${lang}/portfolio`}>
          {dict.viewAll} →
        </Link>
      </div>
    </section>
  );
}
