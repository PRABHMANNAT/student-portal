import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, FolderOpen } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

/* ─── helpers ──────────────────────────────────────────────────── */

function getDomain(url) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return 'resource';
  }
}

/* ─── layout engine ────────────────────────────────────────────── */

const NODE_W = 150;
const NODE_H = 40;
const ROW_GAP = 90;
const COL_GAP = 24;
const PHASE_GAP = 48;
const CANVAS_PAD_X = 60;
const CANVAS_PAD_TOP = 80;

/**
 * Build a flat 2D layout from phases data.
 * Returns { phaseBlocks[], connections[], totalWidth, totalHeight }
 */
function buildFlatLayout(roadmap) {
  const nodePositions = {};
  const phaseBlocks = [];
  let cursorY = CANVAS_PAD_TOP;

  roadmap.phases.forEach((phase, phaseIndex) => {
    const phaseStartY = cursorY;

    // Split nodes into rows of max 3
    const rows = [];
    for (let i = 0; i < phase.nodes.length; i += 3) {
      rows.push(phase.nodes.slice(i, i + 3));
    }

    const nodeLayouts = [];

    rows.forEach((row, rowIndex) => {
      const rowWidth = row.length * NODE_W + (row.length - 1) * COL_GAP;
      const startX = CANVAS_PAD_X + (700 - rowWidth) / 2;

      row.forEach((node, colIndex) => {
        const x = startX + colIndex * (NODE_W + COL_GAP);
        const y = cursorY;

        const layout = {
          ...node,
          x,
          y,
          phaseIndex,
          phaseLabel: phase.label,
          phaseId: phase.id,
          cx: x + NODE_W / 2,
          cy: y + NODE_H / 2,
        };

        nodePositions[node.id] = layout;
        nodeLayouts.push(layout);
      });

      cursorY += ROW_GAP;
    });

    // Add checkpoint node for the phase
    const checkpointY = cursorY - ROW_GAP / 2 + 8;
    const checkpointLabel = `Checkpoint — ${phase.label}`;
    const checkpointId = `checkpoint-${phase.id}`;
    const checkpointX = CANVAS_PAD_X + (700 - 200) / 2;

    phaseBlocks.push({
      ...phase,
      index: phaseIndex,
      startY: phaseStartY,
      endY: cursorY,
      nodes: nodeLayouts,
      checkpoint: {
        id: checkpointId,
        label: checkpointLabel,
        x: checkpointX,
        y: checkpointY,
        w: 200,
      },
    });

    cursorY += PHASE_GAP;
  });

  // Build connections from the connections data
  const connections = roadmap.connections
    .map((conn) => {
      const from = nodePositions[conn.from];
      const to = nodePositions[conn.to];
      if (!from || !to) return null;
      return {
        ...conn,
        x1: from.cx,
        y1: from.y + NODE_H,
        x2: to.cx,
        y2: to.y,
      };
    })
    .filter(Boolean);

  return {
    phaseBlocks,
    connections,
    totalWidth: 700 + CANVAS_PAD_X * 2,
    totalHeight: cursorY + 40,
  };
}

/* ─── SVG connector paths ──────────────────────────────────────── */

function ConnectorPath({ conn }) {
  const isDashed = conn.type === 'recommended';
  const { x1, y1, x2, y2 } = conn;

  // L-shaped right-angle path
  const midY = y1 + (y2 - y1) / 2;
  const d =
    Math.abs(x1 - x2) < 2
      ? `M ${x1} ${y1} L ${x2} ${y2}`
      : `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;

  return (
    <path
      d={d}
      fill="none"
      stroke="#2563EB"
      strokeWidth="2"
      strokeDasharray={isDashed ? '6 4' : 'none'}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flat-connector"
    />
  );
}

/* ─── node components ──────────────────────────────────────────── */

function FlatNode({ node, isActive, onSelect }) {
  const cls =
    node.type === 'advanced'
      ? 'flat-node flat-node-dark'
      : node.type === 'optional'
        ? 'flat-node flat-node-muted'
        : 'flat-node flat-node-yellow';

  return (
    <g
      className={`${cls}${isActive ? ' is-active-phase' : ''}`}
      onClick={() => onSelect(node)}
      style={{ cursor: 'pointer' }}
    >
      <rect
        x={node.x}
        y={node.y}
        width={NODE_W}
        height={NODE_H}
        rx={6}
        className="flat-node-rect"
      />
      <text
        x={node.x + NODE_W / 2}
        y={node.y + NODE_H / 2}
        dominantBaseline="central"
        textAnchor="middle"
        className="flat-node-text"
      >
        {node.label}
      </text>
      {/* Estimated hours badge */}
      {node.estimatedHours ? (
        <text
          x={node.x + NODE_W - 6}
          y={node.y + NODE_H + 14}
          textAnchor="end"
          className="flat-node-hours"
        >
          {node.estimatedHours}h
        </text>
      ) : null}
    </g>
  );
}

function CheckpointNode({ checkpoint }) {
  return (
    <g>
      <rect
        x={checkpoint.x}
        y={checkpoint.y}
        width={checkpoint.w}
        height={NODE_H}
        rx={6}
        className="flat-checkpoint-rect"
      />
      <text
        x={checkpoint.x + checkpoint.w / 2}
        y={checkpoint.y + NODE_H / 2}
        dominantBaseline="central"
        textAnchor="middle"
        className="flat-checkpoint-text"
      >
        {checkpoint.label}
      </text>
    </g>
  );
}

/* ─── flat roadmap component ───────────────────────────────────── */

function FlatRoadmap({ roadmap, activePhaseIndex, onSelectNode }) {
  const scrollRef = useRef(null);
  const phaseRefs = useRef({});
  const layout = useMemo(() => buildFlatLayout(roadmap), [roadmap]);

  // Scroll active phase into view
  useEffect(() => {
    const block = layout.phaseBlocks[activePhaseIndex];
    if (!block || !scrollRef.current) return;

    scrollRef.current.scrollTo({
      top: Math.max(0, block.startY - 100),
      behavior: 'smooth',
    });
  }, [activePhaseIndex, layout.phaseBlocks]);

  return (
    <div className="flat-roadmap-scroll" ref={scrollRef}>
      {/* Legend */}
      <div className="flat-legend">
        <div className="flat-legend-item">
          <span className="flat-legend-swatch flat-legend-yellow" />
          Key topics to learn
        </div>
        <div className="flat-legend-item">
          <span className="flat-legend-swatch flat-legend-dark" />
          Checkpoints &amp; milestones
        </div>
        <div className="flat-legend-item">
          <span className="flat-legend-swatch flat-legend-muted" />
          Optional topics
        </div>
      </div>

      <svg
        className="flat-roadmap-svg"
        viewBox={`0 0 ${layout.totalWidth} ${layout.totalHeight}`}
        width={layout.totalWidth}
        height={layout.totalHeight}
      >
        {/* Connector lines (behind nodes) */}
        <g className="flat-connectors-layer">
          {layout.connections.map((conn, i) => (
            <ConnectorPath key={`${conn.from}-${conn.to}-${i}`} conn={conn} />
          ))}
        </g>

        {/* Phase blocks */}
        {layout.phaseBlocks.map((block) => {
          const isActive = block.index === activePhaseIndex;
          return (
            <g key={block.id} ref={(el) => { phaseRefs.current[block.index] = el; }}>
              {/* Phase background highlight */}
              <rect
                x={CANVAS_PAD_X - 20}
                y={block.startY - 24}
                width={layout.totalWidth - CANVAS_PAD_X * 2 + 40}
                height={block.endY - block.startY + 16}
                rx={16}
                className={`flat-phase-bg${isActive ? ' is-active' : ''}`}
              />

              {/* Phase label on left */}
              <text
                x={16}
                y={block.startY - 6}
                className="flat-phase-label"
              >
                {block.label}
              </text>

              {/* Duration label */}
              <text
                x={layout.totalWidth - 16}
                y={block.startY - 6}
                textAnchor="end"
                className="flat-phase-duration"
              >
                {block.duration}
              </text>

              {/* Vertical spine line through center */}
              <line
                x1={layout.totalWidth / 2}
                y1={block.startY}
                x2={layout.totalWidth / 2}
                y2={block.endY - ROW_GAP + NODE_H + 10}
                className="flat-spine"
              />

              {/* Nodes */}
              {block.nodes.map((node) => (
                <FlatNode
                  key={node.id}
                  node={node}
                  isActive={isActive}
                  onSelect={onSelectNode}
                />
              ))}

              {/* Checkpoint */}
              <CheckpointNode checkpoint={block.checkpoint} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ─── resource drawer (untouched) ──────────────────────────────── */

function ResourceDrawer({ node, onClose }) {
  return (
    <AnimatePresence>
      {node ? (
        <motion.aside
          className="roadmap-resource-drawer"
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="roadmap-resource-top">
            <div>
              <p className="roadmap-resource-eyebrow">{node.phaseLabel}</p>
              <h3>{node.label}</h3>
              <p>{node.description}</p>
            </div>
            <button type="button" className="roadmap-resource-close" onClick={onClose}>
              Close
            </button>
          </div>

          <div className="roadmap-resource-list">
            {node.resources.map((resource) => (
              <a
                key={resource.url}
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="roadmap-resource-card"
              >
                <div className="roadmap-resource-card-icon">
                  <FolderOpen size={16} strokeWidth={2} />
                </div>
                <div className="roadmap-resource-card-copy">
                  <strong>{resource.title}</strong>
                  <div className="roadmap-resource-card-meta">
                    <span className="roadmap-domain-pill">{getDomain(resource.url)}</span>
                    <span className="roadmap-open-link">
                      Open <ExternalLink size={12} strokeWidth={2} />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}

/* ─── minimap (updated for 2D) ─────────────────────────────────── */

function MiniMap({ roadmap, activePhaseIndex }) {
  const width = 100;
  const height = 60;
  const spacing = width / (roadmap.phases.length + 1);

  return (
    <div className="roadmap-minimap">
      <svg viewBox={`0 0 ${width} ${height}`}>
        {roadmap.phases.map((phase, index) => {
          const x = spacing * (index + 1);
          const y = 16 + index * 7;
          const isActive = index === activePhaseIndex;

          return (
            <g key={phase.id}>
              {index < roadmap.phases.length - 1 ? (
                <line
                  x1={x}
                  y1={y + 4}
                  x2={spacing * (index + 2)}
                  y2={16 + (index + 1) * 7}
                  stroke={isActive ? '#2563EB' : 'rgba(0,0,0,0.15)'}
                  strokeWidth="1.5"
                />
              ) : null}
              <circle
                cx={x}
                cy={y}
                r={isActive ? 4.5 : 3}
                fill={isActive ? '#2563EB' : '#ccc'}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ─── skeleton loader ──────────────────────────────────────────── */

export function RoadmapVisualizationSkeleton() {
  return (
    <div className="roadmap-visualization roadmap-visualization-loading flat-roadmap-light">
      <div className="roadmap-skeleton-center">
        <div className="roadmap-skeleton-dots">
          <span />
          <span />
          <span />
        </div>
        <p>Aristotle is mapping the pathway.</p>
      </div>
    </div>
  );
}

/* ─── main component ───────────────────────────────────────────── */

export default function RoadmapVisualization({
  roadmap,
  onSave,
  saving = false,
  saved = false,
}) {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    setActivePhaseIndex(0);
    setSelectedNode(null);
  }, [roadmap.title]);

  const activePhase = roadmap.phases[activePhaseIndex] || roadmap.phases[0];
  const progress = roadmap.phases.length
    ? ((activePhaseIndex + 1) / roadmap.phases.length) * 100
    : 0;

  return (
    <div className="roadmap-visualization flat-roadmap-light">
      <FlatRoadmap
        roadmap={roadmap}
        activePhaseIndex={activePhaseIndex}
        onSelectNode={(node) => {
          setSelectedNode(node);
          setActivePhaseIndex(node.phaseIndex);
        }}
      />

      <div className="roadmap-overlay roadmap-overlay-top">
        <div className="roadmap-overlay-block">
          <h2 className="roadmap-title">{roadmap.title}</h2>
          <div className="roadmap-phase-tabs">
            {roadmap.phases.map((phase, index) => (
              <button
                key={phase.id}
                type="button"
                className={`roadmap-phase-tab ${
                  activePhaseIndex === index ? 'is-active' : ''
                }`}
                onClick={() => setActivePhaseIndex(index)}
              >
                {phase.label}
              </button>
            ))}
          </div>
        </div>

        <div className="roadmap-progress-panel">
          <span>{`PHASE ${activePhaseIndex + 1} of ${roadmap.phases.length}`}</span>
          <div className="roadmap-progress-track">
            <div
              className="roadmap-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <small>{activePhase?.duration}</small>
        </div>
      </div>

      <div className="roadmap-overlay roadmap-overlay-bottom">
        <button
          type="button"
          className="roadmap-save-button"
          onClick={onSave}
          disabled={saving || saved}
        >
          {saved ? 'SAVED TO COLLECTIONS' : saving ? 'SAVING...' : 'SAVE TO COLLECTIONS'}
        </button>
      </div>

      <MiniMap roadmap={roadmap} activePhaseIndex={activePhaseIndex} />

      <ResourceDrawer node={selectedNode} onClose={() => setSelectedNode(null)} />
    </div>
  );
}
