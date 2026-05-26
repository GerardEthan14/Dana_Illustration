'use client';

import { useState } from 'react';
import type { Dictionary } from '@/i18n/dictionaries';

type NewsletterProps = {
  dict: Dictionary['home']['newsletter'];
};

export function Newsletter({ dict }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: branch to a real provider (Mailchimp, Brevo, Resend audience...)
    // For now, just mark as submitted
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="newsletter">
      <div className="newsletter-inner">
        <h2>{dict.title}</h2>
        <p>{dict.description}</p>
        {submitted ? (
          <p style={{ color: 'var(--orange)', fontWeight: 500 }}>
            ✓ {dict.title}
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder={dict.placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label={dict.placeholder}
            />
            <button type="submit">{dict.submit}</button>
          </form>
        )}
      </div>
    </section>
  );
}
