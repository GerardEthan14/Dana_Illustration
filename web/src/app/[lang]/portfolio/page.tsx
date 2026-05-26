import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDictionary, hasLocale } from '@/i18n/dictionaries';
import { safeFetch } from '@/sanity/lib/fetch';
import { urlFor } from '@/sanity/lib/image';
import { portfolioQuery } from '@/sanity/lib/queries';
import {
  getLocalizedDescription,
  getLocalizedTitle,
  type Portfolio,
} from '@/sanity/lib/types';

function formatBytes(bytes?: number): string | null {
  if (!bytes) return null;
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} Mo`;
  const kb = bytes / 1024;
  return `${Math.round(kb)} Ko`;
}

function formatDate(iso?: string, lang: 'fr' | 'nl' | 'en' = 'fr'): string | null {
  if (!iso) return null;
  const localeMap = { fr: 'fr-FR', nl: 'nl-BE', en: 'en-US' } as const;
  return new Date(iso).toLocaleDateString(localeMap[lang], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function PortfolioPage({
  params,
}: PageProps<'/[lang]/portfolio'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const portfolio = await safeFetch<Portfolio | null>(portfolioQuery, {}, null);

  if (!portfolio?.pdfUrl) {
    return (
      <section className="portfolio-page">
        <div className="section-head">
          <p className="eyebrow">{dict.portfolioPage.eyebrow}</p>
          <h1>{dict.portfolioPage.title}</h1>
        </div>
        <div className="portfolio-empty">
          <h2>{dict.portfolioPage.emptyTitle}</h2>
          <p>{dict.portfolioPage.emptyDescription}</p>
          <Link className="btn btn-primary" href={`/${lang}`}>
            ← {dict.comingSoon.backHome}
          </Link>
        </div>
      </section>
    );
  }

  const title = getLocalizedTitle(portfolio, lang) || dict.portfolioPage.title;
  const description =
    getLocalizedDescription(portfolio, lang) || dict.portfolioPage.subtitle;
  const updatedAt = formatDate(
    portfolio.updatedAt || portfolio._updatedAt,
    lang,
  );
  const fileSize = formatBytes(portfolio.pdfSize);
  const filename =
    portfolio.pdfFilename || `dana-illustration-portfolio.pdf`;

  return (
    <section className="portfolio-page">
      <div className="section-head">
        <p className="eyebrow">{dict.portfolioPage.eyebrow}</p>
        <h1>{title}</h1>
        {description && <p className="section-sub">{description}</p>}
      </div>

      {portfolio.coverImage?.asset && (
        <div className="portfolio-cover">
          <Image
            src={urlFor(portfolio.coverImage).width(1400).quality(90).url()}
            alt={title}
            width={1400}
            height={900}
            sizes="(max-width: 960px) 100vw, 1280px"
            priority
          />
        </div>
      )}

      <div className="portfolio-actions">
        <a
          className="btn btn-primary"
          href={`${portfolio.pdfUrl}?dl=${encodeURIComponent(filename)}`}
          download={filename}
        >
          ↓ {dict.portfolioPage.downloadPdf}
          {fileSize && <span className="btn-subtle"> · {fileSize}</span>}
        </a>
        {updatedAt && (
          <p className="portfolio-updated">
            {dict.portfolioPage.lastUpdated} {updatedAt}
          </p>
        )}
      </div>

      <div className="portfolio-pdf-wrap">
        <object
          data={`${portfolio.pdfUrl}#toolbar=1&navpanes=0`}
          type="application/pdf"
          className="portfolio-pdf-frame"
          aria-label={title}
        >
          <p className="portfolio-pdf-fallback">
            {dict.portfolioPage.browserUnsupported}{' '}
            <a href={portfolio.pdfUrl} target="_blank" rel="noopener noreferrer">
              {dict.portfolioPage.downloadPdf}
            </a>
          </p>
        </object>
      </div>
    </section>
  );
}
