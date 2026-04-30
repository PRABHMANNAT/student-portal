import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import CommentsPanel from '../components/Notes/CommentsPanel';
import NotesPanel from '../components/Notes/NotesPanel';
import AppShell from '../components/Shell/AppShell';
import { notesApi } from '../api';
import notesDemo from '../demo/notes.json';
import { useApp } from '../context/AppContext';
import { useChat } from '../hooks/useChat';

function toDisplayTitle(query) {
  return query
    .replace(/\b(notes on|summarize|explain)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase()) || 'Athena Notes';
}

function buildDraftComment({ highlightedText = '', position = 0, author, username }) {
  return {
    id: `comment-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    author,
    username,
    highlightedText,
    commentText: '',
    position,
    timestamp: new Date().toISOString(),
    color: '#fef9c3',
    source: `Source: personal highlight - ${new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })}`
  };
}

export default function NotesPage() {
  const location = useLocation();
  const { session, refreshCollections } = useApp();
  const { messages, pushMessage, resetMessages } = useChat('notes');
  const [noteId, setNoteId] = useState(null);
  const [title, setTitle] = useState(notesDemo.note.title);
  const [content, setContent] = useState(notesDemo.note.content);
  const [comments, setComments] = useState(notesDemo.comments);
  const [meta, setMeta] = useState(notesDemo.meta);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState(notesDemo.comments[0]?.id || null);
  const [draftText, setDraftText] = useState('');
  const [scrollMetrics, setScrollMetrics] = useState({
    scrollTop: 0,
    contentHeight: 1400
  });
  const titleRef = useRef(notesDemo.note.title);
  const fullContentRef = useRef(notesDemo.note.content);
  const queueRef = useRef([]);
  const pumpingRef = useRef(false);
  const streamDoneRef = useRef(false);
  const streamMetaRef = useRef(notesDemo.meta);
  const completionPostedRef = useRef(false);

  useEffect(() => {
    const savedNote = location.state?.savedNote;

    if (!savedNote?.title) {
      return;
    }

    updateTitle(savedNote.title);
    setContent(savedNote.content || '');
    setComments(savedNote.comments || []);
    setMeta({
      mode: 'collection',
      provider: 'collections',
      agent: 'Athena'
    });
    setLoading(false);
    setSaving(false);
    setActiveCommentId(savedNote.comments?.[0]?.id || null);
    pushMessage({
      role: 'assistant',
      text: `${savedNote.title} was loaded from Collections.`
    });
  }, [location.state, pushMessage]);

  const finalizeStream = useCallback(() => {
    if (pumpingRef.current || queueRef.current.length || !streamDoneRef.current) {
      return;
    }

    setLoading(false);
    setMeta(streamMetaRef.current);

    if (!completionPostedRef.current) {
      completionPostedRef.current = true;
      pushMessage({
        role: 'assistant',
        text: `${titleRef.current} is rendered in the notes workspace. You can highlight any passage and comment on it from the sidebar.`
      });
    }
  }, [pushMessage]);

  const pumpQueue = useCallback(() => {
    if (pumpingRef.current) {
      return;
    }

    pumpingRef.current = true;

    const tick = () => {
      if (!queueRef.current.length) {
        pumpingRef.current = false;
        finalizeStream();
        return;
      }

      const nextToken = queueRef.current.shift();
      setContent((current) => current + nextToken);
      window.setTimeout(tick, 18);
    };

    tick();
  }, [finalizeStream]);

  const updateTitle = (nextTitle) => {
    titleRef.current = nextTitle;
    setTitle(nextTitle);
  };

  const handleSubmit = async (input) => {
    pushMessage({ role: 'user', text: input });

    completionPostedRef.current = false;
    streamDoneRef.current = false;
    queueRef.current = [];
    pumpingRef.current = false;
    fullContentRef.current = '';

    updateTitle(toDisplayTitle(input));
    setContent('');
    setComments([]);
    setActiveCommentId(null);
    setDraftText('');
    setLoading(true);
    setMeta({ mode: 'live', provider: 'pending', agent: 'Athena' });

    await notesApi.generateStream(
      {
        query: input,
        userId: session.user.id || 'guest'
      },
      {
        onChunk: (text) => {
          fullContentRef.current += text;
          queueRef.current.push(...(text.match(/\S+\s*/g) || [text]));
          pumpQueue();
        },
        onDone: (result) => {
          streamMetaRef.current = {
            ...(result.meta || {}),
            agent: 'Athena'
          };
          streamDoneRef.current = true;
          finalizeStream();
        },
        onError: () => {
          streamMetaRef.current = {
            mode: 'demo',
            provider: 'client-fallback',
            agent: 'Athena'
          };
        }
      }
    );
  };

  const handleSave = async () => {
    setSaving(true);
    const response = await notesApi.save({
      title: titleRef.current,
      content,
      comments,
      userId: session.user.id || 'guest'
    });

    setSaving(false);
    setNoteId(response.id);
    await refreshCollections();
    pushMessage({
      role: 'assistant',
      text: `${titleRef.current} was saved. The draft is now available in Collections.`
    });
  };

  const handleExport = () => {
    const blob = new Blob([`# ${titleRef.current}\n\n${content}`], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${titleRef.current.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'athena-notes'}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateComment = ({ highlightedText, position }) => {
    const draftComment = buildDraftComment({
      highlightedText,
      position,
      author: session.user.name || 'Demo Student',
      username: session.user.name || 'demo-student'
    });

    setComments((current) => [...current, draftComment]);
    setActiveCommentId(draftComment.id);
    setDraftText('');
  };

  const handleSubmitComment = async () => {
    if (!draftText.trim()) {
      return;
    }

    const fallbackPosition = scrollMetrics.scrollTop + 48;
    const activeComment = comments.find((item) => item.id === activeCommentId);

    if (!activeComment) {
      const standalone = {
        ...buildDraftComment({
          position: fallbackPosition,
          author: session.user.name || 'Demo Student',
          username: session.user.name || 'demo-student'
        }),
        commentText: draftText.trim()
      };

      setComments((current) => [...current, standalone]);
      setActiveCommentId(standalone.id);
      setDraftText('');
      return;
    }

    const nextText = draftText.trim();
    setComments((current) =>
      current.map((item) =>
        item.id === activeComment.id
          ? {
              ...item,
              commentText: nextText
            }
          : item
      )
    );

    setDraftText('');

    if (noteId) {
      await notesApi.comment({
        noteId,
        highlightedText: activeComment.highlightedText,
        commentText: nextText,
        position: activeComment.position,
        userId: session.user.id || 'guest'
      });
    }
  };

  const handlePositionsChange = useCallback((positions) => {
    setComments((current) => {
      let changed = false;
      const next = current.map((comment) => {
        const update = positions.find((item) => item.id === comment.id);
        if (!update || Math.abs((comment.position || 0) - update.position) < 1) {
          return comment;
        }
        changed = true;
        return {
          ...comment,
          position: update.position
        };
      });
      return changed ? next : current;
    });
  }, []);

  const handleReset = () => {
    queueRef.current = [];
    pumpingRef.current = false;
    streamDoneRef.current = false;
    streamMetaRef.current = notesDemo.meta;
    completionPostedRef.current = false;
    fullContentRef.current = notesDemo.note.content;
    resetMessages();
    setNoteId(null);
    updateTitle(notesDemo.note.title);
    setContent(notesDemo.note.content);
    setComments(notesDemo.comments);
    setMeta(notesDemo.meta);
    setLoading(false);
    setSaving(false);
    setActiveCommentId(notesDemo.comments[0]?.id || null);
    setDraftText('');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <AppShell
        chat={{
          title: 'Athena',
          description: 'Ask Athena to generate notes.',
          messages,
          suggestions: [
            'Notes on React hooks',
            'Summarize machine learning basics',
            'Explain system design concepts'
          ],
          onSubmit: handleSubmit,
          loading,
          meta,
          accentColor: '#8b7fd4',
          statusColor: 'var(--teal)',
          secondaryAction: {
            label: 'Reset chat',
            onClick: handleReset
          },
          footer: <p>Highlights and comments stay linked inside the notes workspace.</p>
        }}
        artifact={{
          fullBleed: true,
          hideHeader: true,
          empty: false,
          motionKey: `${title}-${meta?.provider || 'notes'}-${comments.length}`
        }}
        artifactSidebar={
          <CommentsPanel
            comments={comments}
            activeCommentId={activeCommentId}
            onSelectComment={setActiveCommentId}
            draftText={draftText}
            onDraftChange={setDraftText}
            onSubmitDraft={handleSubmitComment}
            currentUser={session.user}
            scrollTop={scrollMetrics.scrollTop}
            contentHeight={scrollMetrics.contentHeight}
          />
        }
      >
        <div className="notes-workspace">
          <NotesPanel
            title={title}
            content={content}
            comments={comments}
            isStreaming={loading}
            onTitleChange={updateTitle}
            onExport={handleExport}
            onSave={handleSave}
            saveDisabled={saving || loading}
            onRequestComment={handleCreateComment}
            onCommentPositionsChange={handlePositionsChange}
            onScrollMetrics={setScrollMetrics}
          />
        </div>
      </AppShell>
    </motion.div>
  );
}
