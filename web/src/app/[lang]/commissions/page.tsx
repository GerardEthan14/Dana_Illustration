import { notFound } from 'next/navigation';
import { getDictionary, hasLocale } from '@/i18n/dictionaries';
import { CommissionsHero } from '@/components/commissions/Hero';
import { Process } from '@/components/commissions/Process';
import { Formulas } from '@/components/commissions/Formulas';
import { FAQ } from '@/components/commissions/FAQ';
import { CommissionsForm } from '@/components/commissions/Form';

export default async function CommissionsPage({
  params,
}: PageProps<'/[lang]/commissions'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const page = dict.commissionsPage;

  return (
    <>
      <CommissionsHero dict={page.hero} />
      <Process dict={page.process} />
      <Formulas dict={page.formulas} />
      <FAQ dict={page.faq} />
      <CommissionsForm dict={page.form} />
    </>
  );
}
