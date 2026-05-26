import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export type Portfolio = {
  _id: string;
  pdfUrl: string;
  pdfSize: number;
  pdfFilename: string;
  coverImage?: SanityImageSource & { asset?: { _ref: string } };
  titleFr?: string;
  titleNl?: string;
  titleEn?: string;
  descriptionFr?: string;
  descriptionNl?: string;
  descriptionEn?: string;
  updatedAt?: string;
  _updatedAt: string;
};

type LangKey = 'fr' | 'nl' | 'en';

function pick(
  portfolio: Portfolio,
  prefix: 'title' | 'description',
  lang: LangKey,
): string | undefined {
  const cap = (lang.charAt(0).toUpperCase() + lang.slice(1)) as 'Fr' | 'Nl' | 'En';
  const key = `${prefix}${cap}` as keyof Portfolio;
  return (portfolio[key] as string | undefined) || (portfolio[`${prefix}Fr` as keyof Portfolio] as string | undefined);
}

export function getLocalizedTitle(portfolio: Portfolio, lang: LangKey): string {
  return pick(portfolio, 'title', lang) ?? 'Portfolio';
}

export function getLocalizedDescription(
  portfolio: Portfolio,
  lang: LangKey,
): string | undefined {
  return pick(portfolio, 'description', lang);
}
