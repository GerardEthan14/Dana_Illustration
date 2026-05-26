import type { Dictionary } from '@/i18n/dictionaries';

type CommissionsHeroProps = {
  dict: Dictionary['commissionsPage']['hero'];
};

export function CommissionsHero({ dict }: CommissionsHeroProps) {
  return (
    <section className="commissions-hero">
      <div className="commissions-hero-inner">
        <p className="eyebrow">{dict.eyebrow}</p>
        <h1>
          {dict.title}
          <br />
          <em>{dict.titleAccent}</em>.
        </h1>
        <p className="commissions-hero-subtitle">{dict.subtitle}</p>
        <a className="btn btn-primary" href="#form">
          {dict.ctaScroll}
        </a>

        <div className="stats-row">
          {dict.stats.map((stat, i) => (
            <div key={i} className="stat">
              <p className="stat-number">{stat.number}</p>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
