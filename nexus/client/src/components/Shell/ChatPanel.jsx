import { LoaderCircle, RefreshCw } from 'lucide-react';
import { useState } from 'react';

function formatMeta(meta) {
  if (!meta) {
    return 'Idle';
  }

  if (meta.mode === 'live') {
    return `Live via ${meta.provider}`;
  }

  return `Demo via ${meta.provider || 'fallback'}`;
}

export default function ChatPanel({
  title,
  subtitle,
  promptLabel,
  placeholder,
  messages,
  suggestions = [],
  onSubmit,
  loading,
  meta,
  primaryLabel = 'Run Agent',
  secondaryAction,
  footer
}) {
  const [value, setValue] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!value.trim() || loading) {
      return;
    }

    const nextValue = value.trim();
    setValue('');
    await onSubmit(nextValue);
  };

  return (
    <section className="chat-panel">
      <div className="chat-panel-header">
        <div>
          <p className="panel-eyebrow">{title}</p>
          <h2 className="panel-title">{subtitle}</h2>
        </div>
        <span className="status-chip">{formatMeta(meta)}</span>
      </div>

      <div className="suggestion-row">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            className="suggestion-chip"
            onClick={() => onSubmit(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>

      <div className="chat-log">
        {messages.map((message) => (
          <article
            key={message.id}
            className={`chat-bubble ${message.role === 'assistant' ? 'is-assistant' : 'is-user'}`}
          >
            <span className="bubble-role">{message.role === 'assistant' ? 'Agent' : 'You'}</span>
            <p>{message.text}</p>
          </article>
        ))}

        {loading ? (
          <div className="loading-inline">
            <LoaderCircle size={16} className="spin" />
            <span>Running agent pipeline</span>
          </div>
        ) : null}
      </div>

      <form className="composer" onSubmit={handleSubmit}>
        <label className="composer-label" htmlFor={`composer-${title}`}>
          {promptLabel}
        </label>
        <textarea
          id={`composer-${title}`}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          rows={5}
        />
        <div className="composer-actions">
          {secondaryAction ? (
            <button type="button" className="secondary-button" onClick={secondaryAction.onClick} disabled={secondaryAction.disabled}>
              <RefreshCw size={14} />
              <span>{secondaryAction.label}</span>
            </button>
          ) : <span className="composer-meta">{formatMeta(meta)}</span>}

          <button type="submit" className="primary-button" disabled={loading || !value.trim()}>
            {primaryLabel}
          </button>
        </div>
      </form>

      {footer ? <div className="chat-footer">{footer}</div> : null}
    </section>
  );
}

