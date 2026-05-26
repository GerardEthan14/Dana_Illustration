'use client';

import { useState } from 'react';
import type { Dictionary } from '@/i18n/dictionaries';

type FAQProps = {
  dict: Dictionary['commissionsPage']['faq'];
};

export function FAQ({ dict }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="faq">
      <div className="section-head">
        <p className="eyebrow">{dict.eyebrow}</p>
        <h2>{dict.title}</h2>
      </div>

      <div className="faq-list">
        {dict.items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className={`faq-item${isOpen ? ' open' : ''}`}>
              <button
                type="button"
                className="faq-question"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                <span>{item.q}</span>
                <span className="faq-icon" aria-hidden>
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              <div className="faq-answer" hidden={!isOpen}>
                <p>{item.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
