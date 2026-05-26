import type { Dictionary } from '@/i18n/dictionaries';

type ProcessProps = {
  dict: Dictionary['commissionsPage']['process'];
};

export function Process({ dict }: ProcessProps) {
  return (
    <section className="process">
      <div className="section-head">
        <p className="eyebrow">{dict.eyebrow}</p>
        <h2>{dict.title}</h2>
        <p className="section-sub">{dict.subtitle}</p>
      </div>

      <ol className="process-steps">
        {dict.steps.map((step, i) => (
          <li key={i} className="process-step">
            <div className="step-number">{String(i + 1).padStart(2, '0')}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
