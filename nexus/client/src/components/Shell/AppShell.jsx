import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUp,
  Bookmark,
  Briefcase,
  FileText,
  Map
} from 'lucide-react';
import { Children, useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import ingenLogo from '../../assets/ingen-logo.png';
import { useApp } from '../../context/AppContext';
import AgentLogo from '../AgentLogo';
import UserAvatar from '../UserAvatar';
import AuthDialog from './AuthDialog';
import SideNav from './SideNav';

const NAV_ITEMS = [
  {
    to: '/roadmap',
    variant: 'aristotle',
    icon: Map,
    label: 'Roadmap',
    accent: '#FF6B35',
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
    variant: 'columbus',
    icon: Briefcase,
    label: 'Jobs',
    accent: '#3B82F6',
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
    variant: 'athena',
    icon: FileText,
    label: 'Notes',
    accent: '#A855F7',
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
    variant: 'collection',
    icon: Bookmark,
    label: 'Collections',
    accent: '#F59E0B',
    agentName: 'Collection',
    askLine: 'Ask Collection to filter saved roadmaps, jobs, or notes.',
    suggestions: ['analytics', 'internship', 'systems'],
    emptyText: 'Your Collection output appears here'
  }
];

const ROUTE_NAV_ITEMS = NAV_ITEMS.filter((item) => item.to);
const ITEM_BY_ROUTE = Object.fromEntries(ROUTE_NAV_ITEMS.map((item) => [item.to, item]));

const artifactTransition = {
  duration: 0.34,
  ease: [0.22, 1, 0.36, 1]
};

function getAgentLogoId(variant) {
  return ['aristotle', 'athena', 'columbus'].includes(variant) ? variant : 'aristotle';
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
  const activeItem = ITEM_BY_ROUTE[pathname] || ROUTE_NAV_ITEMS[0];
  const [draft, setDraft] = useState('');
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const hideChat = Boolean(chat.hidden);

  const messages = chat.messages || [];
  const agentName = chat.title || activeItem.agentName;
  const placeholder = chat.placeholder || 'Ex: Senior Rust Engineer with...';
  const activeAgentLogo = getAgentLogoId(activeItem.variant);
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
    setMobileChatOpen(false);
  }, [pathname]);

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
      <SideNav />

      <nav className="shell-mobile-tabs" aria-label="Primary mobile navigation">
        {ROUTE_NAV_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `shell-mobile-tab ${isActive ? 'is-active' : ''}`}
              aria-label={item.label}
            >
              <Icon size={20} strokeWidth={1.9} />
            </NavLink>
          );
        })}
      </nav>

      {hideChat ? null : (
        <aside
          className={`shell-chat ${mobileChatOpen ? 'is-mobile-open' : ''}`}
          style={{
            '--shell-agent-accent': accentColor,
            '--shell-status-color': statusColor
          }}
        >
          <div className="shell-chat-top">
            <AgentLogo agent={activeAgentLogo} size={80} status="online" />
            <span className="shell-terminal-rule" aria-hidden="true" />
            <p className="shell-terminal-question">Who's the one you're searching for?</p>
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
                  {message.role === 'assistant' ? (
                    <AgentLogo agent={activeAgentLogo} size={28} className="shell-bubble-avatar" />
                  ) : null}
                  <div className={`shell-message-bubble ${message.role === 'user' ? 'is-user' : 'is-agent'}`}>
                    <p>{message.text}</p>
                  </div>
                  {message.role === 'user' ? (
                    <UserAvatar seed={session.user?.name === 'Demo Student' ? 'DemoStudent' : session.user?.name} name={session.user?.name} size={32} className="shell-bubble-avatar" />
                  ) : null}
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
                  <AgentLogo agent={activeAgentLogo} size={28} className="shell-bubble-avatar" />
                  <div className="shell-message-bubble is-agent is-loading">
                    <span className="shell-loading-word" aria-label={`${agentName} is working`}>
                      {Array.from(agentName).map((char, index) => (
                        <span
                          key={`${agentName}-${char}-${index}`}
                          style={{ '--loading-letter-delay': `${index * 0.06}s` }}
                          aria-hidden="true"
                        >
                          {char}
                        </span>
                      ))}
                    </span>
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

      {!hideChat ? (
        <button
          type="button"
          className="shell-mobile-chat-button"
          onClick={() => setMobileChatOpen((current) => !current)}
          aria-label="Toggle Aristotle chat"
        >
          💬
        </button>
      ) : null}

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
