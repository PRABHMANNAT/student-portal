import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useState } from 'react';
import ColumbusOrb from './ColumbusOrb';

export default function ColumbusSidebar({ orbState, messages, onSend, suggestions }) {
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  return (
    <aside className="columbus-rail">
      <div className="rail-top">
        <ColumbusOrb state={orbState} />
        <h2 className="columbus-heading">Who's the one you're searching for?</h2>
        <p className="columbus-helper-text">
          Columbus searches mock job signals and stages recruiter-ready results.
        </p>
      </div>

      <div className="conversation-thread">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            className={`columbus-msg ${msg.role === 'status' ? 'columbus-msg-status' : `columbus-msg-${msg.role}`}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {msg.role === 'status' ? (
              <div className="message-bubble">
                <div className="columbus-dots-loading">
                  <span />
                  <span />
                  <span />
                </div>
                {msg.text}
              </div>
            ) : (
              <div className="message-bubble">{msg.text}</div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="composer-zone">
        {suggestions?.length > 0 && orbState === 'idle' && (
          <div className="columbus-suggestions">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                className="columbus-suggestion-chip"
                onClick={() => onSend(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <form onSubmit={handleSend} className="composer">
          <input
            className="columbus-input"
            type="text"
            placeholder="Ex: Senior Rust Engineer"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={orbState !== 'idle' && orbState !== 'listening' && orbState !== 'complete'}
          />
          <button
            type="submit"
            className="send-button"
            disabled={!input.trim() || (orbState !== 'idle' && orbState !== 'listening' && orbState !== 'complete')}
          >
            <ArrowUp size={18} strokeWidth={2.5} />
          </button>
        </form>
      </div>
    </aside>
  );
}
