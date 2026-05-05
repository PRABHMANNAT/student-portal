import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Sparkles } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import AgentLogo from '../AgentLogo';

export default function ProfileAssistantPanel({
  suggestions,
  onSubmit,
  isGenerating,
  currentStepLabel,
}) {
  const [draft, setDraft] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (draft.trim() && !isGenerating) {
        onSubmit(draft.trim());
        setDraft('');
        setShowSuggestions(false);
      }
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setDraft(suggestion.prompt);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <aside className="pe-assistant-panel" ref={panelRef}>
      <div className="pe-assistant-top">
        <AgentLogo agent="aristotle" size={72} status="online" />

        <span className="pe-assistant-rule" aria-hidden="true" />

        <h2 className="pe-assistant-question">
          Who's the role you're tailoring for?
        </h2>

        <div className="pe-assistant-instruction">
          <Sparkles size={14} className="pe-assistant-sparkle" />
          <p>
            Aristotle edits your candidate profile using mock recruiter signals.
            Ask for a role, company, or skill focus.
          </p>
        </div>
      </div>

      {isGenerating && currentStepLabel && (
        <motion.div
          className="pe-assistant-status"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="pe-assistant-status-dot" />
          <span>{currentStepLabel}</span>
        </motion.div>
      )}

      <div className="pe-assistant-bottom">
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              className="pe-suggestions-popup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  type="button"
                  className="pe-suggestion-chip"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <Sparkles size={12} />
                  {suggestion.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pe-composer">
          <input
            ref={inputRef}
            type="text"
            className="pe-composer-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder="Ex: Customize for IBM SDE 1"
            disabled={isGenerating}
          />
          <button
            type="button"
            className="pe-send-button"
            disabled={isGenerating || !draft.trim()}
            onClick={() => {
              if (draft.trim() && !isGenerating) {
                onSubmit(draft.trim());
                setDraft('');
                setShowSuggestions(false);
              }
            }}
          >
            <ArrowUp size={16} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </aside>
  );
}
