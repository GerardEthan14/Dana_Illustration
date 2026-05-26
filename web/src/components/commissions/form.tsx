'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { Dictionary } from '@/i18n/dictionaries';

type FormProps = {
  dict: Dictionary['commissionsPage']['form'];
};

const MAX_FILES = 5;
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export function CommissionsForm({ dict }: FormProps) {
  const [type, setType] = useState<string>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<FormStatus>('idle');

  const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files ?? []);
    const valid = incoming.filter((f) => f.size <= MAX_SIZE_BYTES);
    setFiles((prev) => [...prev, ...valid].slice(0, MAX_FILES));
    e.target.value = ''; // allow re-selecting the same file
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    // Placeholder: log to console for now.
    // TODO: connect to an email service (Resend / Brevo / Mailjet).
    const payload = {
      type,
      name,
      email,
      description,
      budget,
      deadline,
      files: files.map((f) => ({ name: f.name, size: f.size })),
      consent,
    };
    console.log('Commission request', payload);

    // Fake latency for UX
    await new Promise((r) => setTimeout(r, 800));
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <section className="form-section" id="form">
        <div className="form-success">
          <h2>{dict.successTitle}</h2>
          <p>{dict.successMessage}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="form-section" id="form">
      <div className="section-head">
        <p className="eyebrow">{dict.eyebrow}</p>
        <h2>{dict.title}</h2>
        <p className="section-sub">{dict.subtitle}</p>
      </div>

      <form className="commission-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label className="form-field full">
            <span className="form-label">{dict.type}</span>
            <select
              required
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">—</option>
              <option value="animal">{dict.typeOptions.animal}</option>
              <option value="cover">{dict.typeOptions.cover}</option>
              <option value="custom">{dict.typeOptions.custom}</option>
              <option value="other">{dict.typeOptions.other}</option>
            </select>
          </label>
        </div>

        <div className="form-row">
          <label className="form-field">
            <span className="form-label">{dict.name}</span>
            <input
              type="text"
              required
              placeholder={dict.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="form-field">
            <span className="form-label">{dict.email}</span>
            <input
              type="email"
              required
              placeholder={dict.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>

        <div className="form-row">
          <label className="form-field full">
            <span className="form-label">{dict.description}</span>
            <textarea
              required
              rows={5}
              placeholder={dict.descriptionPlaceholder}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </div>

        <div className="form-row">
          <label className="form-field">
            <span className="form-label">{dict.budget}</span>
            <input
              type="text"
              placeholder={dict.budgetPlaceholder}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </label>
          <label className="form-field">
            <span className="form-label">{dict.deadline}</span>
            <input
              type="text"
              placeholder={dict.deadlinePlaceholder}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </label>
        </div>

        <div className="form-row">
          <div className="form-field full">
            <span className="form-label">{dict.references}</span>
            <p className="form-hint">{dict.referencesHint}</p>

            {files.length > 0 && (
              <ul className="file-list">
                {files.map((file, i) => (
                  <li key={i}>
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      aria-label="Remove"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {files.length < MAX_FILES && (
              <label className="file-upload">
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  multiple
                  onChange={handleFiles}
                />
                <span>+ {dict.referencesAdd}</span>
              </label>
            )}
          </div>
        </div>

        <div className="form-row">
          <label className="form-field full form-consent">
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <span>{dict.consent}</span>
          </label>
        </div>

        <div className="form-row form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? dict.submitting : dict.submit}
          </button>
        </div>

        {status === 'error' && (
          <p className="form-error">{dict.errorMessage}</p>
        )}
      </form>
    </section>
  );
}
