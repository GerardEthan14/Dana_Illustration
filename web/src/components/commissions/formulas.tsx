import Image from 'next/image';
import type { Dictionary } from '@/i18n/dictionaries';

type FormulasProps = {
  dict: Dictionary['commissionsPage']['formulas'];
};

const FORMULA_KEYS = ['animal', 'cover', 'custom'] as const;

const IMAGE_BY_KEY: Record<(typeof FORMULA_KEYS)[number], string> = {
  animal: '/images/animals/animal-3.png',
  cover: '/images/covers/cover-2.png',
  custom: '/images/portfolio/portfolio-2.png',
};

export function Formulas({ dict }: FormulasProps) {
  return (
    <section className="formulas">
      <div className="section-head">
        <p className="eyebrow">{dict.eyebrow}</p>
        <h2>{dict.title}</h2>
        <p className="section-sub">{dict.subtitle}</p>
      </div>

      <div className="formulas-grid">
        {FORMULA_KEYS.map((key) => {
          const item = dict.items[key];
          return (
            <article key={key} className="formula-card">
              <div className="formula-image">
                <Image
                  src={IMAGE_BY_KEY[key]}
                  alt={item.title}
                  width={600}
                  height={450}
                  sizes="(max-width: 960px) 90vw, 33vw"
                />
              </div>
              <div className="formula-body">
                <p className="formula-subtitle">{item.subtitle}</p>
                <h3>{item.title}</h3>
                <p className="formula-price">
                  {dict.fromPrice} <strong>{item.price}</strong>
                </p>
                <p className="formula-description">{item.description}</p>

                <dl className="formula-meta">
                  <div>
                    <dt>{dict.delay}</dt>
                    <dd>{item.delay}</dd>
                  </div>
                  <div>
                    <dt>{dict.format}</dt>
                    <dd>{item.format}</dd>
                  </div>
                </dl>

                <p className="formula-includes-label">{dict.includes}</p>
                <ul className="formula-includes">
                  {item.includes.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>

                <a className="btn btn-primary formula-cta" href="#form">
                  {dict.cta}
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
