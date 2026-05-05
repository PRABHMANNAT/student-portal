import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Play, BookOpen, ExternalLink } from 'lucide-react';
import { getSourcesForTopic } from '../../data/mockSources';

function ShimmerBlock({ width = '100%', height = 16 }) {
  return (
    <div
      className="sources-shimmer"
      style={{ width, height, borderRadius: 8 }}
    />
  );
}

function ShimmerState() {
  return (
    <div className="sources-shimmer-list">
      <ShimmerBlock width="60%" height={14} />
      <ShimmerBlock height={72} />
      <ShimmerBlock height={72} />
      <ShimmerBlock width="40%" height={14} />
      <ShimmerBlock height={64} />
      <ShimmerBlock height={64} />
    </div>
  );
}

function SourceCard({ icon: Icon, iconColor, title, subtitle, snippet, url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="source-card"
      draggable={false}
    >
      <div className="source-card-icon" style={{ color: iconColor }}>
        <Icon size={18} />
      </div>
      <div className="source-card-body">
        <h4>{title}</h4>
        {subtitle && <span className="source-card-sub">{subtitle}</span>}
        {snippet && <p>{snippet}</p>}
        <span className="source-card-url">
          {url} <ExternalLink size={11} />
        </span>
      </div>
    </a>
  );
}

export default function SourcesPanel({ topicName, open, onClose }) {
  const [loading, setLoading] = useState(true);
  const [sources, setSources] = useState(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open || !topicName) return;
    setLoading(true);
    setSources(null);
    const timer = setTimeout(() => {
      setSources(getSourcesForTopic(topicName));
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [open, topicName]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="sources-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            ref={panelRef}
            className="sources-panel"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            draggable={false}
          >
            <header className="sources-panel-header">
              <h3>Learn More: {topicName}</h3>
              <button
                type="button"
                className="sources-panel-close"
                onClick={onClose}
                aria-label="Close sources panel"
              >
                <X size={18} />
              </button>
            </header>

            <div className="sources-panel-body">
              {loading ? (
                <ShimmerState />
              ) : sources ? (
                <>
                  {sources.articles?.length > 0 && (
                    <section className="sources-section">
                      <h5 className="sources-section-title">
                        <FileText size={14} /> Articles
                      </h5>
                      {sources.articles.map((a) => (
                        <SourceCard
                          key={a.url}
                          icon={FileText}
                          iconColor="#6366f1"
                          title={a.title}
                          subtitle={a.source}
                          snippet={a.snippet}
                          url={a.url}
                        />
                      ))}
                    </section>
                  )}
                  {sources.videos?.length > 0 && (
                    <section className="sources-section">
                      <h5 className="sources-section-title">
                        <Play size={14} /> Videos
                      </h5>
                      {sources.videos.map((v) => (
                        <SourceCard
                          key={v.url}
                          icon={Play}
                          iconColor="#ef4444"
                          title={v.title}
                          subtitle={`${v.channel} · ${v.duration}`}
                          url={v.url}
                        />
                      ))}
                    </section>
                  )}
                  {sources.docs?.length > 0 && (
                    <section className="sources-section">
                      <h5 className="sources-section-title">
                        <BookOpen size={14} /> Documentation
                      </h5>
                      {sources.docs.map((d) => (
                        <SourceCard
                          key={d.url}
                          icon={BookOpen}
                          iconColor="#22c55e"
                          title={d.title}
                          url={d.url}
                        />
                      ))}
                    </section>
                  )}
                </>
              ) : null}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
