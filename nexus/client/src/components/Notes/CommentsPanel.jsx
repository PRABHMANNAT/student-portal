import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';

function formatTimestamp(value) {
  const date = new Date(value);
  return date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function avatarUrl(username) {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username || 'user')}`;
}

export default function CommentsPanel({
  comments,
  activeCommentId,
  onSelectComment,
  draftText,
  onDraftChange,
  onSubmitDraft,
  currentUser,
  scrollTop,
  contentHeight
}) {
  const cardRefs = useRef(new Map());
  const [stackedTops, setStackedTops] = useState({});

  const sortedComments = useMemo(
    () => [...comments].sort((left, right) => (left.position || 0) - (right.position || 0)),
    [comments]
  );

  useLayoutEffect(() => {
    const nextTops = {};
    let lastBottom = 0;

    for (const comment of sortedComments) {
      const node = cardRefs.current.get(comment.id);
      const height = node?.offsetHeight || 128;
      const desiredTop = comment.position || 0;
      const top = Math.max(desiredTop, lastBottom ? lastBottom + 8 : desiredTop);
      nextTops[comment.id] = top;
      lastBottom = top + height;
    }

    setStackedTops((current) => {
      const changed =
        Object.keys(nextTops).length !== Object.keys(current).length ||
        Object.entries(nextTops).some(([id, value]) => current[id] !== value);

      return changed ? nextTops : current;
    });
  }, [sortedComments]);

  const canvasHeight = Math.max(
    contentHeight || 0,
    ...sortedComments.map((comment) => (stackedTops[comment.id] || comment.position || 0) + 180),
    640
  );

  return (
    <aside className="notes-comments-panel">
      <div className="notes-comments-header">COMMENTS</div>

      <div className="notes-comments-viewport">
        <div className="notes-comments-canvas" style={{ height: canvasHeight }}>
          <div className="notes-comments-layer" style={{ transform: `translateY(${-scrollTop}px)` }}>
            <AnimatePresence initial={false}>
              {sortedComments.map((comment) => (
                <motion.button
                  key={comment.id}
                  type="button"
                  ref={(node) => {
                    if (node) {
                      cardRefs.current.set(comment.id, node);
                    } else {
                      cardRefs.current.delete(comment.id);
                    }
                  }}
                  className={`notes-comment-card ${activeCommentId === comment.id ? 'is-active' : ''}`}
                  style={{ top: stackedTops[comment.id] || comment.position || 0 }}
                  onClick={() => onSelectComment(comment.id)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="notes-comment-top">
                    <img
                      src={avatarUrl(comment.username || comment.author)}
                      alt={comment.author}
                      className="notes-comment-avatar"
                    />
                    <div>
                      <div className="notes-comment-heading">
                        <strong>{comment.author}</strong>
                        <span>{formatTimestamp(comment.timestamp)}</span>
                      </div>

                      {comment.highlightedText ? (
                        <div className="notes-comment-quote">"{comment.highlightedText}"</div>
                      ) : null}

                      <p className={`notes-comment-text ${comment.commentText ? '' : 'notes-comment-draft'}`}>
                        {comment.commentText || 'Draft comment. Use the input below to finish it.'}
                      </p>

                      {comment.source ? <p className="notes-comment-source">{comment.source}</p> : null}
                    </div>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <form
        className="notes-comments-inputbar"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmitDraft();
        }}
      >
        <img
          src={avatarUrl(currentUser?.name || 'student')}
          alt={currentUser?.name || 'Current user'}
          className="notes-comment-avatar"
        />
        <div className="notes-comment-inputwrap">
          <input
            type="text"
            className="notes-comment-input"
            value={draftText}
            onChange={(event) => onDraftChange(event.target.value)}
            placeholder="Add a comment..."
          />
          <button type="submit" className="notes-comment-send" aria-label="Submit comment">
            <ArrowUp size={14} strokeWidth={2.2} />
          </button>
        </div>
      </form>
    </aside>
  );
}
