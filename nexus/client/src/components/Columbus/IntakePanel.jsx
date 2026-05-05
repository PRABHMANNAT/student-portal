import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function IntakePanel({ orbState, messages, onSend, suggestions }) {
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className="jobs-intake-panel">
      <div className="jobs-intake-header">
        <span className="jobs-intake-eyebrow">ARISTOTLE</span>
        <h2 className="jobs-intake-title">Candidate Intake</h2>
      </div>

      <div className="jobs-intake-messages">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              className={`jobs-msg ${msg.role === 'status' ? 'is-status' : msg.role === 'user' ? 'is-user' : 'is-assistant'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {msg.role === 'status' ? (
                <div className="jobs-msg-bubble is-status">
                  <div className="jobs-dots-loading">
                    <span /><span /><span />
                  </div>
                  {msg.text}
                </div>
              ) : (
                <div className={`jobs-msg-bubble ${msg.role === 'user' ? 'is-user' : 'is-assistant'}`}>
                  {msg.text}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="jobs-intake-footer">
        {suggestions?.length > 0 && orbState === 'idle' && (
          <div className="jobs-intake-chips">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                className="jobs-intake-chip"
                onClick={() => onSend(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}
        
        <form onSubmit={handleSend} className="jobs-intake-composer">
          <input
            type="text"
            placeholder="Ex: Senior Rust Engineer"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={orbState !== 'idle' && orbState !== 'listening' && orbState !== 'complete'}
          />
          <button
            type="submit"
            className="jobs-intake-send"
            disabled={!input.trim() || (orbState !== 'idle' && orbState !== 'listening' && orbState !== 'complete')}
          >
            <ArrowUp size={18} strokeWidth={2.5} />
          </button>
        </form>
      </div>
    </div>
  );
}
