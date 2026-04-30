import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, BookMarked, BriefcaseBusiness, FilePenLine, Route, UserRound } from 'lucide-react';
import { Children, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { useApp } from '../../context/AppContext';
import AuthDialog from './AuthDialog';

const NAV_ITEMS = [
  {
    to: '/roadmap',
    icon: Route,
    label: 'ARISTOTLE',
    agentName: 'Aristotle',
    askLine: 'Ask Aristotle to map a focused career roadmap.',
    suggestions: [
      'Create a 12-week roadmap for data science internships.',
      'Plan a backend engineering sprint for a third-year student.',
      'Map a product analytics path with two portfolio projects.'
    ],
    emptyText: 'Your Aristotle output appears here'
  },
  {
    to: '/jobs',
    icon: BriefcaseBusiness,
    label: 'COLUMBUS',
    agentName: 'Columbus',
    askLine: 'Ask Columbus to rank roles and surface strong fits.',
    suggestions: [
      'Find remote product analytics internships for summer.',
      'Search for backend intern roles using Node and SQL.',
      'Rank growth operations roles for a student with dashboard experience.'
    ],
    emptyText: 'Your Columbus output appears here'
  },
  {
    to: '/notes',
    icon: FilePenLine,
    label: 'ATHENA',
    agentName: 'Athena',
    askLine: 'Ask Athena to turn rough material into clean notes.',
    suggestions: [
      'Turn distributed systems consensus into exam notes.',
      'Generate a revision pack for binary search trees.',
      'Convert operating systems scheduling notes into flashcards.'
    ],
    emptyText: 'Your Athena output appears here'
  },
  {
    to: '/collections',
    icon: BookMarked,
    label: 'COLLECTION',
    agentName: 'Collection',
    askLine: 'Ask Collection to filter saved roadmaps, jobs, or notes.',
    suggestions: ['analytics', 'internship', 'systems'],
    emptyText: 'Your Collection output appears here'
  }
];

const ITEM_BY_ROUTE = Object.fromEntries(NAV_ITEMS.map((item) => [item.to, item]));

const artifactTransition = {
  duration: 0.34,
  ease: [0.22, 1, 0.36, 1]
};

function AgentOrbit({ accentColor }) {
  return (
    <div className="shell-agent-orbit" aria-hidden="true">
      <svg viewBox="0 0 80 80" className="shell-agent-orbit-svg">
        <circle
          cx="40"
          cy="40"
          r="28"
          fill="none"
          stroke={accentColor}
          strokeWidth="2"
          strokeDasharray="2 7"
          strokeLinecap="round"
          opacity="0.9"
        />
        <circle cx="40" cy="12" r="3.5" fill={accentColor} />
        <circle cx="64.2" cy="50.5" r="2.8" fill={accentColor} opacity="0.72" />
        <circle cx="17" cy="54.5" r="2.6" fill={accentColor} opacity="0.58" />
      </svg>
      <div className="shell-agent-core" />
    </div>
  );
}

function EmptyArtifact({ agentName }) {
  return (
    <div className="shell-empty-state">
      <motion.svg
        viewBox="0 0 220 180"
        className="shell-empty-illustration"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect x="28" y="28" width="164" height="124" rx="22" fill="rgba(255,255,255,0.74)" stroke="var(--border)" />
        <circle cx="72" cy="82" r="20" fill="rgba(0,180,160,0.12)" stroke="var(--teal)" strokeDasharray="3 7" />
        <circle cx="146" cy="70" r="12" fill="rgba(139,127,212,0.12)" stroke="var(--purple)" />
        <path d="M68 118h88" stroke="var(--border-input)" strokeWidth="8" strokeLinecap="round" />
        <path d="M68 136h58" stroke="var(--border-input)" strokeWidth="8" strokeLinecap="round" />
        <path d="M92 80l16 12 30-34" fill="none" stroke="var(--teal)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>

      <p className="shell-empty-copy">{`Your ${agentName} output appears here`}</p>
    </div>
  );
}

export default function AppShell({ chat = {}, artifact = {}, artifactSidebar = null, children }) {
  const { pathname } = useLocation();
  const { session, setAuthOpen } = useApp();
  const inputRef = useRef(null);
  const activeItem = ITEM_BY_ROUTE[pathname] || NAV_ITEMS[0];
  const [draft, setDraft] = useState('');
  const hideChat = Boolean(chat.hidden);

  const suggestions = useMemo(
    () => (chat.suggestions?.length ? chat.suggestions.slice(0, 3) : activeItem.suggestions),
    [activeItem.suggestions, chat.suggestions]
  );

  const messages = chat.messages || [];
  const agentName = chat.title || activeItem.agentName;
  const placeholder = `Ask ${agentName}...`;
  const accentColor = chat.accentColor || 'var(--teal)';
  const statusColor = chat.statusColor || accentColor;
  const artifactKey =
    artifact.motionKey ||
    artifact.meta?.timestamp ||
    artifact.title ||
    artifact.summary ||
    pathname;
  const hasArtifactContent = !artifact.empty && (Children.count(children) > 0 || Boolean(artifactSidebar));
  const showArtifactHeader =
    !artifact.hideHeader && (artifact.title || artifact.summary || artifact.action);

  useEffect(() => {
    setDraft('');
  }, [pathname]);

  const handleSuggestionClick = (suggestion) => {
    setDraft(suggestion);
    inputRef.current?.focus();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!chat.onSubmit || chat.loading || !draft.trim()) {
      return;
    }

    const nextPrompt = draft.trim();
    setDraft('');
    await chat.onSubmit(nextPrompt);
  };

  return (
    <div className={`app-shell ${hideChat ? 'is-no-chat' : ''}`}>
      <nav className="shell-nav">
        <div className="shell-nav-top">
          <NavLink to="/roadmap" className="shell-logo" aria-label="Go to roadmap">
            N
          </NavLink>

          <div className="shell-nav-stack">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `shell-nav-item ${isActive ? 'is-active' : ''}`}
                  aria-label={item.label}
                >
                  <Icon size={20} strokeWidth={1.95} />
                  <span className="shell-nav-tooltip">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          className="shell-avatar-button"
          onClick={() => setAuthOpen(true)}
          title={session.meta?.guest ? 'Open sign in' : session.user?.email}
        >
          {session.meta?.guest ? (
            <UserRound size={16} strokeWidth={2} />
          ) : (
            <span>{session.user?.name?.slice(0, 1)?.toUpperCase() || 'U'}</span>
          )}
        </button>
      </nav>

      {hideChat ? null : (
        <aside
          className="shell-chat"
          style={{
            '--shell-agent-accent': accentColor,
            '--shell-status-color': statusColor
          }}
        >
          <div className="shell-chat-top">
            <AgentOrbit accentColor={accentColor} />
            <p className="shell-agent-label">{agentName.toUpperCase()}</p>
            <div className="shell-agent-status">
              <span className="shell-agent-status-dot" />
              <span>ONLINE</span>
            </div>
            <h2 className="shell-ready-heading">READY.</h2>
            <p className="shell-agent-copy">{chat.description || activeItem.askLine}</p>

            {chat.secondaryAction ? (
              <button
                type="button"
                className="shell-secondary-chip"
                onClick={chat.secondaryAction.onClick}
                disabled={chat.secondaryAction.disabled}
              >
                {chat.secondaryAction.label}
              </button>
            ) : null}

            <div className="shell-suggestions">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="shell-suggestion-pill"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div className="shell-chat-history">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`shell-message-row ${message.role === 'user' ? 'is-user' : 'is-agent'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className={`shell-message-bubble ${message.role === 'user' ? 'is-user' : 'is-agent'}`}>
                    <p>{message.text}</p>
                  </div>
                </motion.div>
              ))}

              {chat.loading ? (
                <motion.div
                  key={`${pathname}-loading`}
                  className="shell-message-row is-agent"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="shell-message-bubble is-agent is-loading">
                    <span className="shell-loading-dot" />
                    <span className="shell-loading-dot" />
                    <span className="shell-loading-dot" />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <div className="shell-chat-bottom">
            {chat.footer ? <div className="shell-chat-footnote">{chat.footer}</div> : null}

            <form className="shell-composer" onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                type="text"
                className="shell-composer-input"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={placeholder}
                aria-label={placeholder}
              />
              <button
                type="submit"
                className="shell-send-button"
                disabled={chat.loading || !draft.trim()}
                aria-label={`Send message to ${agentName}`}
              >
                <ArrowUp size={16} strokeWidth={2.2} />
              </button>
            </form>
          </div>
        </aside>
      )}

      <section className="shell-artifact">
        <div className={`shell-artifact-scroll ${artifact.fullBleed ? 'is-full-bleed' : ''}`}>
          <AnimatePresence mode="wait" initial={false}>
            {hasArtifactContent ? (
              <motion.div
                key={artifactKey}
                className={`shell-artifact-stage ${artifact.fullBleed ? 'is-full-bleed' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={artifactTransition}
              >
                {showArtifactHeader ? (
                  <div className="shell-artifact-header">
                    <div className="shell-artifact-copy">
                      <p className="shell-artifact-eyebrow">{artifact.eyebrow || `NEXUS / ${agentName}`}</p>
                      {artifact.title ? <h1 className="shell-artifact-title">{artifact.title}</h1> : null}
                      {artifact.summary ? <p className="shell-artifact-summary">{artifact.summary}</p> : null}
                    </div>

                    {artifact.action ? (
                      <button
                        type="button"
                        className="shell-artifact-action"
                        onClick={artifact.action.onClick}
                        disabled={artifact.action.disabled}
                      >
                        {artifact.action.label}
                      </button>
                    ) : null}
                  </div>
                ) : null}

                {artifactSidebar ? (
                  <div className="shell-artifact-split">
                    <div className="shell-artifact-main">{children}</div>
                    <div className="shell-artifact-sidebar">{artifactSidebar}</div>
                  </div>
                ) : (
                  <div className="shell-artifact-content">{children}</div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key={`empty-${pathname}`}
                className="shell-artifact-stage is-empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={artifactTransition}
              >
                <EmptyArtifact agentName={agentName} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <AuthDialog />
    </div>
  );
}
