import { useState } from 'react';

import { useProfile } from '../../context/ProfileContext';
import { PROFILE_SCHEMA_FIELDS } from '../../lib/profileSchema';

const STEPS = [
  ['Identity', 'identity'],
  ['Education', 'education'],
  ['Geography', 'geography'],
  ['Experience', 'experience'],
  ['Skills', 'skills'],
  ['Goals', 'goals']
];

function formatValue(value) {
  if (Array.isArray(value)) return value.join(', ') || 'None';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (value === null || value === undefined || value === '') return 'Not set';
  if (typeof value === 'object') return `${value.length || 0} items`;
  return String(value);
}

export default function ProfileEditModal() {
  const { profile, profileModalOpen, setProfileModalOpen } = useProfile();
  const [stepIndex, setStepIndex] = useState(0);

  if (!profileModalOpen) {
    return null;
  }

  const [label, key] = STEPS[stepIndex];
  const fields = PROFILE_SCHEMA_FIELDS[key] || [];

  return (
    <div className="profile-modal-backdrop" role="presentation" onClick={() => setProfileModalOpen(false)}>
      <section className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-modal-title" onClick={(event) => event.stopPropagation()}>
        <header className="profile-modal-header">
          <div>
            <span>Student Profile</span>
            <h2 id="profile-modal-title">{label}</h2>
          </div>
          <button type="button" onClick={() => setProfileModalOpen(false)}>
            Close
          </button>
        </header>

        <nav className="profile-modal-steps" aria-label="Profile sections">
          {STEPS.map(([stepLabel], index) => (
            <button
              key={stepLabel}
              type="button"
              className={stepIndex === index ? 'is-active' : ''}
              onClick={() => setStepIndex(index)}
            >
              {stepLabel}
            </button>
          ))}
        </nav>

        <div className="profile-modal-fields">
          {fields.map((field) => (
            <label key={field}>
              <span>{field.replace(/([A-Z])/g, ' $1')}</span>
              <input value={formatValue(profile[field])} readOnly />
            </label>
          ))}
        </div>

        <footer className="profile-modal-footer">
          <button type="button" disabled={stepIndex === 0} onClick={() => setStepIndex((current) => Math.max(0, current - 1))}>
            Previous
          </button>
          <button type="button" disabled={stepIndex === STEPS.length - 1} onClick={() => setStepIndex((current) => Math.min(STEPS.length - 1, current + 1))}>
            Next
          </button>
        </footer>
      </section>
    </div>
  );
}
