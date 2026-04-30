import { motion } from 'framer-motion';
import { Download, Save } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

function unwrapHighlights(container) {
  const highlights = container.querySelectorAll('mark.notes-highlight[data-comment-id]');

  highlights.forEach((highlight) => {
    const parent = highlight.parentNode;
    while (highlight.firstChild) {
      parent.insertBefore(highlight.firstChild, highlight);
    }
    parent.removeChild(highlight);
    parent.normalize();
  });
}

function markSelectionText(container, text, commentId) {
  const needle = String(text || '').trim().toLowerCase();
  if (!needle) {
    return null;
  }

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.parentElement) {
        return NodeFilter.FILTER_REJECT;
      }

      if (node.parentElement.closest('pre, code, mark[data-comment-id]')) {
        return NodeFilter.FILTER_REJECT;
      }

      return NodeFilter.FILTER_ACCEPT;
    }
  });

  let currentNode = walker.nextNode();

  while (currentNode) {
    const haystack = currentNode.textContent.toLowerCase();
    const index = haystack.indexOf(needle);

    if (index >= 0) {
      const range = document.createRange();
      range.setStart(currentNode, index);
      range.setEnd(currentNode, index + needle.length);

      const mark = document.createElement('mark');
      mark.className = 'notes-highlight';
      mark.dataset.commentId = commentId;
      range.surroundContents(mark);
      return mark;
    }

    currentNode = walker.nextNode();
  }

  return null;
}

export default function NotesPanel({
  title,
  content,
  comments,
  isStreaming,
  onTitleChange,
  onExport,
  onSave,
  saveDisabled,
  onRequestComment,
  onCommentPositionsChange,
  onScrollMetrics
}) {
  const scrollRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const [selectionTooltip, setSelectionTooltip] = useState(null);

  // Store callback props in refs to avoid re-triggering effects
  const onScrollMetricsRef = useRef(onScrollMetrics);
  onScrollMetricsRef.current = onScrollMetrics;
  const onCommentPositionsChangeRef = useRef(onCommentPositionsChange);
  onCommentPositionsChangeRef.current = onCommentPositionsChange;

  const markdownComponents = useMemo(
    () => ({
      code({ inline, children, ...props }) {
        if (inline) {
          return <code {...props}>{children}</code>;
        }

        return <code {...props}>{children}</code>;
      }
    }),
    []
  );

  useEffect(() => {
    const scrollNode = scrollRef.current;
    const contentNode = contentRef.current;

    if (!scrollNode || !contentNode) {
      return undefined;
    }

    const publishMetrics = () => {
      onScrollMetricsRef.current?.({
        scrollTop: scrollNode.scrollTop,
        contentHeight: contentNode.offsetHeight
      });
    };

    publishMetrics();
    scrollNode.addEventListener('scroll', publishMetrics);
    const observer = new ResizeObserver(publishMetrics);
    observer.observe(contentNode);

    return () => {
      scrollNode.removeEventListener('scroll', publishMetrics);
      observer.disconnect();
    };
  }, [content, comments]);

  useLayoutEffect(() => {
    const container = contentRef.current;
    const scrollNode = scrollRef.current;

    if (!container || !scrollNode) {
      return;
    }

    unwrapHighlights(container);

    const nextPositions = comments
      .map((comment) => {
        const mark = markSelectionText(container, comment.highlightedText, comment.id);

        if (!mark) {
          return null;
        }

        const rect = mark.getBoundingClientRect();
        const scrollRect = scrollNode.getBoundingClientRect();

        return {
          id: comment.id,
          position: rect.top - scrollRect.top + scrollNode.scrollTop
        };
      })
      .filter(Boolean);

    onCommentPositionsChangeRef.current?.(nextPositions);
  }, [comments, content]);

  const handleSelection = () => {
    const selection = window.getSelection();
    const scrollNode = scrollRef.current;
    const contentNode = contentRef.current;

    if (!selection || selection.rangeCount === 0 || !scrollNode || !contentNode) {
      setSelectionTooltip(null);
      return;
    }

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString().trim();

    if (
      !selectedText ||
      range.collapsed ||
      !contentNode.contains(range.commonAncestorContainer)
    ) {
      setSelectionTooltip(null);
      return;
    }

    const rect = range.getBoundingClientRect();
    const containerRect = contentNode.getBoundingClientRect();

    setSelectionTooltip({
      text: selectedText,
      top: rect.top - containerRect.top + scrollNode.scrollTop - 10,
      left: rect.left - containerRect.left + rect.width / 2,
      position: rect.top - scrollNode.getBoundingClientRect().top + scrollNode.scrollTop
    });
  };

  return (
    <section className="notes-panel">
      <div className="notes-panel-topbar">
        <p className="notes-breadcrumb">NOTES · V1.0 · DRAFT</p>

        <div className="notes-topbar-actions">
          <button type="button" className="notes-pill-button is-outline" onClick={onExport}>
            <Download size={14} strokeWidth={2} />
            EXPORT
          </button>
          <button type="button" className="notes-pill-button is-filled" onClick={onSave} disabled={saveDisabled}>
            <Save size={14} strokeWidth={2} />
            SAVE
          </button>
        </div>
      </div>

      <div className="notes-panel-scroll" ref={scrollRef} onMouseUp={handleSelection} onKeyUp={handleSelection}>
        <div className="notes-panel-content" ref={contentRef}>
          {selectionTooltip ? (
            <button
              type="button"
              className="notes-selection-tooltip"
              style={{ top: selectionTooltip.top, left: selectionTooltip.left }}
              onClick={() => {
                onRequestComment?.({
                  highlightedText: selectionTooltip.text,
                  position: selectionTooltip.position
                });
                window.getSelection()?.removeAllRanges();
                setSelectionTooltip(null);
              }}
            >
              <span>💬</span>
              <span>Add Comment</span>
            </button>
          ) : null}

          <h1
            ref={titleRef}
            className="notes-title"
            contentEditable
            suppressContentEditableWarning
            data-placeholder="Untitled note"
            onBlur={() => onTitleChange(titleRef.current?.textContent?.trim() || '')}
          >
            {title}
          </h1>

          <div className="notes-markdown">
            <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
            {isStreaming ? (
              <motion.span
                className="notes-stream-cursor"
                animate={{ opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 0.9, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
