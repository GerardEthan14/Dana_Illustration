import { notFound } from 'next/navigation';
import { getDictionary, hasLocale } from '@/i18n/dictionaries';
import { ComingSoon } from '@/components/ComingSoon';

export default async function ShopPage({ params }: PageProps<'/[lang]/shop'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return <ComingSoon dict={dict.comingSoon} lang={lang} pageTitle={dict.nav.shop} />;
}
