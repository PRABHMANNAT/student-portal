import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import { Bookmark, Download, Eye, EyeOff, Loader2, Maximize2, MessageSquarePlus } from 'lucide-react';
import DownloadDropdown from './DownloadDropdown';
import './FlowCanvas.css';

// ── Dagre layout ─────────────────────────────────────────────────────────────

function applyDagreLayout(nodes, edges) {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: 'LR', ranksep: 90, nodesep: 50, marginx: 40, marginy: 40 });
  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((node) => {
    g.setNode(node.id, { width: node._w || 200, height: node._h || 48 });
  });

  edges.forEach((edge) => {
    if (edge._skipDagre) return;
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  return nodes.map((node) => {
    const pos = g.node(node.id);
    if (!pos) return node;
    return {
      ...node,
      position: {
        x: pos.x - (node._w || 200) / 2,
        y: pos.y - (node._h || 48) / 2,
      },
    };
  });
}

// ── Node type resolver ────────────────────────────────────────────────────────

function resolveNodeType(node) {
  if (node.type === 'label' || node.type === 'section_header') return 'labelNode';
  if (node.type === 'checkpoint') return 'darkNode';
  if (node.style === 'alternative' || node.style === 'optional' || node.type === 'subtopic') return 'whiteNode';
  return 'yellowNode';
}

// ── Convert roadmap data ──────────────────────────────────────────────────────

function toFlowElements(roadmapData) {
  if (!roadmapData?.nodes?.length) return { nodes: [], edges: [] };

  const rawNodes = roadmapData.nodes.map((node) => ({
    id: node.id,
    type: resolveNodeType(node),
    position: { x: node.x ?? 0, y: node.y ?? 0 },
    data: {
      label: node.title,
      note: node.personalizedNote,
      originalType: node.type,
      originalStyle: node.style,
    },
    style: { width: node.width || 200 },
    _w: node.width || 200,
    _h: node.height || 48,
    draggable: false,
  }));

  const nodeIds = new Set(rawNodes.map((n) => n.id));

  const edges = (roadmapData.edges || [])
    .filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target))
    .map((edge) => {
      const isDashed = edge.type === 'dashed';
      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle || null,
        targetHandle: edge.targetHandle || null,
        animated: true,
        type: 'smoothstep',
        style: {
          stroke: '#3B82F6',
          strokeWidth: 2.5,
          ...(isDashed ? { strokeDasharray: '5,5' } : {}),
        },
      };
    });

  const hasPositions = rawNodes.some((n) => n.position.x !== 0 || n.position.y !== 0);
  const nodes = hasPositions ? rawNodes : applyDagreLayout(rawNodes, edges);

  return { nodes, edges };
}

// ── Typewriter hook ───────────────────────────────────────────────────────────

const GENERATING_PHRASES = [
  'Analyzing your background…',
  'Structuring learning path…',
  'Adding resources…',
  'Finalizing roadmap…',
];

function useTypewriter(isActive) {
  const [display, setDisplay] = useState('');
  const phraseRef = useRef(0);
  const charRef = useRef(0);

  useEffect(() => {
    if (!isActive) {
      setDisplay('');
      phraseRef.current = 0;
      charRef.current = 0;
      return;
    }

    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const phrase = GENERATING_PHRASES[phraseRef.current % GENERATING_PHRASES.length];
      if (charRef.current <= phrase.length) {
        setDisplay(phrase.slice(0, charRef.current));
        charRef.current += 1;
        window.setTimeout(tick, 28);
      } else {
        // Pause at end of phrase then move to next
        window.setTimeout(() => {
          if (cancelled) return;
          phraseRef.current += 1;
          charRef.current = 0;
          tick();
        }, 1500);
      }
    };

    tick();
    return () => { cancelled = true; };
  }, [isActive]);

  return display;
}

// ── Custom node components (Framer Motion for entrance animation) ─────────────

const NODE_SPRING = { type: 'spring', stiffness: 300, damping: 22 };

function YellowNode({ data }) {
  return (
    <motion.div
      className="fc-node fc-node--yellow"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={NODE_SPRING}
    >
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="target" position={Position.Right} id="right" />
      <span>{data.label}</span>
      {data.note && <span className="fc-node__note" title={data.note}>★</span>}
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
    </motion.div>
  );
}

function DarkNode({ data }) {
  return (
    <motion.div
      className="fc-node fc-node--dark"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={NODE_SPRING}
    >
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="target" position={Position.Right} id="right" />
      <span>{data.label}</span>
      <Handle type="source" position={Position.Bottom} id="bottom" />
    </motion.div>
  );
}

function WhiteNode({ data }) {
  return (
    <motion.div
      className="fc-node fc-node--white"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={NODE_SPRING}
    >
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="target" position={Position.Right} id="right" />
      <span>{data.label}</span>
      {data.note && <span className="fc-node__note" title={data.note}>★</span>}
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
    </motion.div>
  );
}

function LabelNode({ data }) {
  return (
    <motion.div
      className="fc-node fc-node--label"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <span>{data.label}</span>
    </motion.div>
  );
}

function CommentNode({ id, data }) {
  const { setNodes } = useReactFlow();
  const [editing, setEditing] = useState(data.initialEditing || false);
  const [text, setText] = useState(data.text || '');

  const commit = useCallback(() => {
    setEditing(false);
    setNodes((ns) =>
      ns.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, text, initialEditing: false } } : n
      )
    );
  }, [id, setNodes, text]);

  const handleKeyDown = useCallback(
    (e) => { if (e.key === 'Escape') commit(); },
    [commit]
  );

  return (
    <div
      className="fc-comment"
      onDoubleClick={(e) => {
        e.stopPropagation();
        setEditing(true);
      }}
    >
      <Handle type="target" position={Position.Left} />
      <Handle type="target" position={Position.Top} />
      {editing ? (
        <>
          <textarea
            autoFocus
            className="fc-comment__textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={commit}
            onKeyDown={handleKeyDown}
            placeholder="Type your comment…"
          />
          <p className="fc-comment__hint">Esc or click outside to save</p>
        </>
      ) : text ? (
        <p className="fc-comment__text">{text}</p>
      ) : (
        <p className="fc-comment__placeholder">Double-click to add a comment…</p>
      )}
    </div>
  );
}

const NODE_TYPES = {
  yellowNode: YellowNode,
  darkNode: DarkNode,
  whiteNode: WhiteNode,
  labelNode: LabelNode,
  commentNode: CommentNode,
};

// ── Context menu ──────────────────────────────────────────────────────────────

function ContextMenu({ x, y, nodeId, onAddComment, onClose }) {
  return (
    <div
      className="fc-context-menu"
      style={{ top: y, left: x }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="fc-context-menu__item"
        onClick={() => { onAddComment(nodeId); onClose(); }}
      >
        <MessageSquarePlus size={14} />
        Add Comment
      </button>
    </div>
  );
}

// ── Toast notification ─────────────────────────────────────────────────────────

function ToastNotification({ message, onDismiss }) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, 2200);
    return () => window.clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      className="fc-toast"
      initial={{ opacity: 0, y: 20, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 340, damping: 24 }}
    >
      {message}
    </motion.div>
  );
}

// ── Color Legend ───────────────────────────────────────────────────────────────

function ColorLegend({ visible, onToggle }) {
  return (
    <div className="fc-legend-wrap">
      <button type="button" className="fc-legend-toggle" onClick={onToggle} title="Toggle legend">
        {visible ? <EyeOff size={12} /> : <Eye size={12} />}
      </button>
      <AnimatePresence>
        {visible && (
          <motion.div
            className="fc-legend"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
          >
            <div className="fc-legend__row"><span className="fc-legend__dot is-yellow" />Key topics</div>
            <div className="fc-legend__row"><span className="fc-legend__dot is-dark" />Milestones</div>
            <div className="fc-legend__row"><span className="fc-legend__dot is-white" />Sub-topics</div>
            <div className="fc-legend__row"><span className="fc-legend__dot is-green" />Completed</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Generating overlay ─────────────────────────────────────────────────────────

function GeneratingOverlay({ typewriterText }) {
  return (
    <motion.div
      className="fc-generating-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="fc-generating-inner">
        <Loader2 size={28} className="fc-generating-spinner" />
        <p className="fc-generating-text">
          {typewriterText || 'Generating your roadmap…'}
          <span className="fc-generating-cursor" aria-hidden="true" />
        </p>
      </div>
    </motion.div>
  );
}

// ── Empty canvas state ─────────────────────────────────────────────────────────

function EmptyCanvasState({ onQuickStart }) {
  const starters = [
    { emoji: '🤖', label: 'AI Engineer' },
    { emoji: '⚛️', label: 'Frontend Engineer' },
    { emoji: '🗄️', label: 'Full Stack Developer' },
  ];

  return (
    <div className="fc-empty-state">
      <svg viewBox="0 0 80 80" className="fc-empty-icon" aria-hidden="true">
        <circle cx="40" cy="40" r="36" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="2" />
        <path d="M28 40h24M40 28v24" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
        <circle cx="40" cy="40" r="5" fill="#14B8A6" />
      </svg>
      <h3 className="fc-empty-title">Generate Your Learning Roadmap</h3>
      <p className="fc-empty-subtitle">Type your target role in the input on the left to create a personalized, interactive roadmap.</p>
      <div className="fc-empty-starters">
        {starters.map(({ emoji, label }) => (
          <button
            key={label}
            type="button"
            className="fc-empty-starter-btn"
            onClick={() => onQuickStart(label)}
          >
            {emoji} {label} →
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Toolbar ───────────────────────────────────────────────────────────────────

function FlowToolbar({ title, isAnimating, typewriterText, onFitView, onExport, onSave, saving, saved }) {
  const displayTitle = isAnimating ? null : title;

  return (
    <div className="fc-toolbar">
      <div className="fc-toolbar__title-area">
        {isAnimating ? (
          <span className="fc-toolbar__typewriter">
            {typewriterText || 'Generating…'}
            <span className="fc-toolbar__cursor" aria-hidden="true" />
          </span>
        ) : (
          <span className="fc-toolbar__title" title={displayTitle}>
            {displayTitle}
          </span>
        )}
      </div>
      <div className="fc-toolbar__actions">
        <button
          type="button"
          className="fc-toolbar__btn fc-toolbar__btn--icon-only"
          title="Fit View"
          onClick={onFitView}
        >
          <Maximize2 size={13} />
        </button>
        <DownloadDropdown />
        <div className="fc-toolbar__sep" />
        <button
          type="button"
          className="fc-toolbar__btn fc-toolbar__btn--save"
          onClick={onSave}
          disabled={saving}
          title="Save roadmap"
        >
          <Bookmark size={13} fill="currentColor" />
          {saved ? 'Saved ✓' : saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
}

// ── Inner canvas ──────────────────────────────────────────────────────────────

function FlowCanvasInner({
  roadmapData,
  animationKey,
  isGenerating,
  onSave,
  onNodeClick,
  saving,
  saved,
}) {
  const { fitView } = useReactFlow();
  const wrapperRef = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [toast, setToast] = useState(null);
  const [legendVisible, setLegendVisible] = useState(true);
  const revealTimers = useRef([]);
  const revealKeyRef = useRef(0);
  const typewriterText = useTypewriter(isAnimating);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => fitView({ padding: 0.15, maxZoom: 1, duration: 200 }));
    ro.observe(el);
    return () => ro.disconnect();
  }, [fitView]);

  // Staggered node-by-node reveal
  useEffect(() => {
    if (!roadmapData) return;

    // Abort any in-progress reveal
    revealTimers.current.forEach(clearTimeout);
    revealTimers.current = [];
    const myKey = ++revealKeyRef.current;

    const { nodes: allNodes, edges: allEdges } = toFlowElements(roadmapData);
    if (!allNodes.length) return;

    // Clear canvas first
    setNodes([]);
    setEdges([]);
    setIsAnimating(true);

    const STAGGER_MS = 180;
    const EDGE_DELAY_MS = 200;

    allNodes.forEach((node, index) => {
      const t = window.setTimeout(() => {
        if (revealKeyRef.current !== myKey) return;
        setNodes((prev) => [...prev, node]);

        // Reveal connected edges shortly after node
        const et = window.setTimeout(() => {
          if (revealKeyRef.current !== myKey) return;
          setEdges((prev) => {
            const existingIds = new Set(prev.map((e) => e.id));
            const incoming = allEdges.filter(
              (e) => e.target === node.id && !existingIds.has(e.id)
            );
            return [...prev, ...incoming];
          });
        }, EDGE_DELAY_MS);
        revealTimers.current.push(et);

        // After last node
        if (index === allNodes.length - 1) {
          const dt = window.setTimeout(() => {
            if (revealKeyRef.current !== myKey) return;
            setIsAnimating(false);
            fitView({ padding: 0.15, maxZoom: 1.0, duration: 600 });
            setToast({ id: Date.now(), message: '✓ Roadmap ready' });
          }, 350);
          revealTimers.current.push(dt);
        }
      }, index * STAGGER_MS);

      revealTimers.current.push(t);
    });

    return () => {
      revealTimers.current.forEach(clearTimeout);
      revealTimers.current = [];
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationKey, roadmapData]);

  const handleNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    const bounds = wrapperRef.current?.getBoundingClientRect() ?? { left: 0, top: 0 };
    setContextMenu({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
      nodeId: node.id,
    });
  }, []);

  const handleNodeClick = useCallback(
    (_event, node) => {
      if (node.type === 'commentNode' || node.type === 'labelNode') return;
      onNodeClick?.(node);
    },
    [onNodeClick]
  );

  const closeContextMenu = useCallback(() => setContextMenu(null), []);

  const addComment = useCallback(
    (sourceNodeId) => {
      const source = nodes.find((n) => n.id === sourceNodeId);
      if (!source) return;

      const commentId = `comment-${Date.now()}`;
      const offsetX = (source._w || 200) + 60;

      setNodes((ns) => [
        ...ns,
        {
          id: commentId,
          type: 'commentNode',
          position: {
            x: (source.position?.x ?? 0) + offsetX,
            y: source.position?.y ?? 0,
          },
          data: { text: '', initialEditing: true },
          draggable: false,
        },
      ]);

      setEdges((es) => [
        ...es,
        {
          id: `ec-${commentId}`,
          source: sourceNodeId,
          target: commentId,
          _skipDagre: true,
          animated: false,
          style: { stroke: '#D97706', strokeWidth: 1.5, strokeDasharray: '4,4' },
          type: 'smoothstep',
        },
      ]);
    },
    [nodes, setNodes, setEdges]
  );

  const handleExport = useCallback(async () => {
    const el = wrapperRef.current;
    if (!el) return;
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(el, { cacheBust: true });
      const link = document.createElement('a');
      link.download = `${roadmapData?.title || 'roadmap'}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      const msg = document.createElement('div');
      Object.assign(msg.style, {
        position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
        background: '#1e293b', color: '#fff', padding: '10px 16px',
        borderRadius: '8px', fontSize: '13px',
      });
      msg.textContent = 'Run: npm install html-to-image  (in nexus/client)';
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), 4000);
    }
  }, [roadmapData]);

  const miniMapNodeColor = useCallback((node) => {
    if (node.type === 'yellowNode') return '#FBBF24';
    if (node.type === 'darkNode') return '#1a1a1a';
    if (node.type === 'commentNode') return '#FEF3C7';
    if (node.type === 'labelNode') return '#94a3b8';
    return '#e2e8f0';
  }, []);

  const isEmpty = !roadmapData && !isGenerating;

  return (
    <div className="fc-shell" ref={wrapperRef} onClick={closeContextMenu}>
      <FlowToolbar
        title={`${roadmapData?.title || 'Roadmap'} — Roadmap`}
        isAnimating={isAnimating}
        typewriterText={typewriterText}
        onFitView={() => fitView({ padding: 0.15, maxZoom: 1, duration: 600 })}
        onExport={handleExport}
        onSave={onSave}
        saving={saving}
        saved={saved}
      />

      <div className="fc-canvas">
        {isEmpty ? (
          <EmptyCanvasState onQuickStart={(label) => {
            // Bubble up a synthetic submit via a custom event
            window.dispatchEvent(new CustomEvent('nexus:quick-start', { detail: { prompt: label } }));
          }} />
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={NODE_TYPES}
            onNodeContextMenu={handleNodeContextMenu}
            onNodeClick={handleNodeClick}
            onPaneClick={closeContextMenu}
            fitView
            fitViewOptions={{ padding: 0.15, minZoom: 0.5, maxZoom: 1.0, duration: 0 }}
            minZoom={0.4}
            maxZoom={1.5}
            defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
            nodesDraggable={false}
            nodesConnectable={false}
            deleteKeyCode={null}
          >
            <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="#cbd5e1" />
            <Controls position="bottom-left" showInteractive={false} />
            <MiniMap
              position="bottom-right"
              nodeColor={miniMapNodeColor}
              maskColor="rgba(248,250,252,0.7)"
              pannable
              zoomable
            />
          </ReactFlow>
        )}

        {/* Generating overlay (over the canvas) */}
        <AnimatePresence>
          {isGenerating && !isAnimating && (
            <GeneratingOverlay typewriterText={typewriterText} />
          )}
        </AnimatePresence>

        {/* Node-reveal "drawing" overlay */}
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              className="fc-reveal-indicator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Loader2 size={14} className="fc-generating-spinner fc-generating-spinner--small" />
              <span>Building roadmap…</span>
            </motion.div>
          )}
        </AnimatePresence>

        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            nodeId={contextMenu.nodeId}
            onAddComment={addComment}
            onClose={closeContextMenu}
          />
        )}

        {/* Color legend (above zoom controls, bottom-left) */}
        <div className="fc-legend-container">
          <ColorLegend
            visible={legendVisible}
            onToggle={() => setLegendVisible((v) => !v)}
          />
        </div>

        {/* Toast */}
        <div className="fc-toast-container">
          <AnimatePresence>
            {toast && (
              <ToastNotification
                key={toast.id}
                message={toast.message}
                onDismiss={() => setToast(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ── Public export ─────────────────────────────────────────────────────────────

export default function FlowCanvas(props) {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
