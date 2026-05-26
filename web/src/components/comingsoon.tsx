import Link from 'next/link';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

type ComingSoonProps = {
  dict: Dictionary['comingSoon'];
  lang: Locale;
  pageTitle: string;
};

export function ComingSoon({ dict, lang, pageTitle }: ComingSoonProps) {
  return (
    <section className="coming-soon">
      <p className="eyebrow">{pageTitle}</p>
      <h1>{dict.title}</h1>
      <p>{dict.description}</p>
      <Link className="btn btn-primary" href={`/${lang}`}>
        ← {dict.backHome}
      </Link>
    </section>
  );
}
