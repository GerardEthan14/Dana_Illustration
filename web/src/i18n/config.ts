export const locales = ['fr', 'nl', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';

export const localeNames: Record<Locale, string> = {
  fr: 'FR',
  nl: 'NL',
  en: 'EN',
};
