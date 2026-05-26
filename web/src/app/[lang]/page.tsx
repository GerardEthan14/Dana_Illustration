import { notFound } from 'next/navigation';
import { getDictionary, hasLocale } from '@/i18n/dictionaries';
import { Hero } from '@/components/Hero';
import { CTACards } from '@/components/CTACards';
import { PortfolioPreview } from '@/components/PortfolioPreview';
import { CommissionsPreview } from '@/components/CommissionsPreview';
import { Newsletter } from '@/components/Newsletter';

export default async function Home({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <>
      <Hero dict={dict.home.hero} lang={lang} />
      <CTACards dict={dict.home.ctaCards} lang={lang} />
      <PortfolioPreview dict={dict.home.portfolio} lang={lang} />
      <CommissionsPreview dict={dict.home.commissions} lang={lang} />
      <Newsletter dict={dict.home.newsletter} />
    </>
  );
}
