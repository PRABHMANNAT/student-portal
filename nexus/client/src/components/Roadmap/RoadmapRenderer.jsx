import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { ArrowUpRight, Bookmark, CalendarDays, Check, CheckCircle2, Circle, CircleDot, Clock, Target, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useEffect, useMemo, useRef, useState } from 'react';

const STATES = ['pending', 'in_progress', 'completed', 'skipped'];
const ROADMAP_CANVAS_WIDTH = 1480;
const MARKDOWN_FILES = import.meta.glob('../../data/roadmaps/*/content/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
});

const styleClass = {
  primary: 'is-primary',
  alternative: 'is-alternative',
  optional: 'is-optional',
  checkpoint: 'is-checkpoint',
  recommended: 'is-recommended',
  label: 'is-label',
  header: 'is-label'
};

function progressKey(roadmapId) {
  return `roadmap_progress_${roadmapId || 'default'}`;
}

function readProgress(roadmapId) {
  try {
    return JSON.parse(window.localStorage.getItem(progressKey(roadmapId)) || '{}');
  } catch {
    return {};
  }
}

function writeProgress(roadmapId, progress) {
  window.localStorage.setItem(progressKey(roadmapId), JSON.stringify(progress));
}

function cycleProgressValue(value = 'pending') {
  const index = STATES.indexOf(value);
  return STATES[(Math.max(index, 0) + 1) % STATES.length];
}

function getHandlePoint(node, handle = 'bottom') {
  const cx = node.x + node.width / 2;
  const cy = node.y + node.height / 2;

  switch (handle) {
    case 'top':
      return { x: cx, y: node.y };
    case 'bottom':
      return { x: cx, y: node.y + node.height };
    case 'left':
      return { x: node.x, y: cy };
    case 'right':
      return { x: node.x + node.width, y: cy };
    default:
      return { x: cx, y: cy };
  }
}

export function generateElbowPath(source, target, sourceHandle = 'bottom', targetHandle = 'top') {
  const sp = getHandlePoint(source, sourceHandle);
  const tp = getHandlePoint(target, targetHandle);

  if (sourceHandle === 'bottom' && targetHandle === 'top') {
    return `M ${sp.x},${sp.y} L ${tp.x},${tp.y}`;
  }

  if (sourceHandle === 'right' && targetHandle === 'left') {
    if (Math.abs(sp.y - tp.y) < 3) {
      return `M ${sp.x},${sp.y} L ${tp.x},${tp.y}`;
    }

    const exitX = sp.x + 30;
    return `M ${sp.x},${sp.y} L ${exitX},${sp.y} L ${exitX},${tp.y} L ${tp.x},${tp.y}`;
  }

  if (sourceHandle === 'left' && targetHandle === 'right') {
    if (Math.abs(sp.y - tp.y) < 3) {
      return `M ${sp.x},${sp.y} L ${tp.x},${tp.y}`;
    }

    const exitX = sp.x - 30;
    return `M ${sp.x},${sp.y} L ${exitX},${sp.y} L ${exitX},${tp.y} L ${tp.x},${tp.y}`;
  }

  return `M ${sp.x},${sp.y} L ${tp.x},${tp.y}`;
}

function nodeSlug(nodeId = '') {
  return nodeId.replace(/-[a-z0-9]{4,}$/i, '');
}

function getMarkdownForNode(roadmapId, node) {
  const slug = nodeSlug(node.id);
  const directSuffix = `/data/roadmaps/${roadmapId}/content/${node.id}.md`;
  const slugSuffix = `/data/roadmaps/${roadmapId}/content/${slug}.md`;
  const direct = Object.entries(MARKDOWN_FILES).find(([path]) => path.endsWith(directSuffix));
  const bySlug = Object.entries(MARKDOWN_FILES).find(([path]) => path.endsWith(slugSuffix));
  return bySlug?.[1] || direct?.[1] || '';
}

function contentToMarkdown(node, content) {
  if (!content) return '';
  const lines = [`# ${node.title}`, '', content.description || `${node.title} is part of this roadmap.`];

  [
    ['Free Resources', content.freeResources || content.free || []],
    ['AI Tutor (Personalized)', content.aiTutor || []],
    ['Premium Resources', content.premiumResources || content.premium || []]
  ].forEach(([heading, items]) => {
    if (!items.length) return;
    lines.push('', `## ${heading}`, '');
    items.forEach((item) => {
      lines.push(`- [@${item.type || 'article'}@${item.title}](${item.url || '#'})`);
    });
  });

  return lines.join('\n');
}

function useRoadmapProgress(roadmapId) {
  const [progress, setProgress] = useState(() => readProgress(roadmapId));

  useEffect(() => {
    const onProgressUpdate = () => setProgress(readProgress(roadmapId));
    window.addEventListener('progress-updated', onProgressUpdate);
    setProgress(readProgress(roadmapId));
    return () => window.removeEventListener('progress-updated', onProgressUpdate);
  }, [roadmapId]);

  const cycle = (nodeId) => {
    const next = {
      ...readProgress(roadmapId),
      [nodeId]: cycleProgressValue(readProgress(roadmapId)[nodeId])
    };
    writeProgress(roadmapId, next);
    setProgress(next);
    window.dispatchEvent(new Event('progress-updated'));
  };

  return [progress, cycle];
}

function StatusDot({ progress = 'pending', onClick }) {
  return (
    <span
      role="button"
      tabIndex={0}
      className={`roadmap-svg-status-dot is-${progress}`}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick(event);
        }
      }}
    >
      {progress === 'completed' ? <Check size={10} strokeWidth={4} /> : null}
      {progress === 'in_progress' ? <i /> : null}
    </span>
  );
}

function RoadmapNode({ node, progress, onClick, onCycleProgress }) {
  if (node.type === 'label' || node.type === 'section_header') {
    return <div className="roadmap-svg-label">{node.title}</div>;
  }

  return (
    <div className="roadmap-svg-node-wrapper">
      <button
        type="button"
        className={`roadmap-svg-node ${styleClass[node.style] || 'is-primary'}`}
        onClick={onClick}
      >
        {node.type === 'topic' || node.type === 'subtopic' || node.type === 'checkpoint' ? (
          <StatusDot
            progress={progress}
            onClick={(event) => {
              event.stopPropagation();
              onCycleProgress(node.id);
            }}
          />
        ) : null}
        <span>{node.title}</span>
      </button>
    </div>
  );
}

function RoadmapNote({ node }) {
  return (
    <div className="roadmap-svg-note">
      {node.personalizedNote}
    </div>
  );
}

function ResourceBadge({ type = 'article' }) {
  return <span className={`roadmap-svg-resource-badge is-${type}`}>{type}</span>;
}

function MarkdownLink({ href, children }) {
  const label = String(children?.[0] || '');
  const match = label.match(/^@([^@]+)@(.+)$/);
  const type = match?.[1] || 'article';
  const title = match?.[2] || label;

  return (
    <a href={href} target={href === 'generated' || href === '#' ? undefined : '_blank'} rel="noreferrer">
      <ResourceBadge type={type} />
      <span>{title}</span>
    </a>
  );
}

function NodeDrawer({ roadmap, node, open, onOpenChange, progress, onCycleProgress }) {
  const markdown = useMemo(() => {
    if (!node) return '';
    return getMarkdownForNode(roadmap.id, node) || contentToMarkdown(node, roadmap.content?.[node.id]);
  }, [node, roadmap]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="roadmap-svg-dialog-overlay" />
        <Dialog.Content className="roadmap-svg-drawer">
          <header className="roadmap-svg-drawer-header">
            <div>
              <Dialog.Title>{node?.title || 'Roadmap topic'}</Dialog.Title>
              <p>{progress === 'completed' ? 'Completed' : progress === 'in_progress' ? 'In progress' : 'Not started'}</p>
            </div>
            <div className="roadmap-svg-drawer-actions">
              {node ? (
                <button type="button" onClick={() => onCycleProgress(node.id)}>
                  Cycle status
                </button>
              ) : null}
              <Dialog.Close aria-label="Close topic drawer">
                <X size={18} />
              </Dialog.Close>
            </div>
          </header>
          <div className="roadmap-svg-markdown">
            <ReactMarkdown components={{ a: MarkdownLink }}>{markdown || `# ${node?.title || 'Topic'}\n\nNo content added yet.`}</ReactMarkdown>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function pluralize(count, singular, plural = `${singular}s`) {
  return Number(count) === 1 ? singular : plural;
}

function formatProfileSummary(profile, roadmap) {
  if (!profile) return roadmap.description || roadmap.subtitle || 'Built from your generated roadmap and current progress.';

  const background = profile.major || profile.degree || 'academic';
  const university = profile.university ? ` at ${profile.university}` : '';
  const years = Number(profile.yearsOfExperience || 0);
  const experience = years
    ? `${years} ${pluralize(years, 'year')} of experience`
    : 'your current project experience';
  const companies = (profile.targetCompanies || []).slice(0, 3).join(', ');

  return `Built around your ${background} background${university}, ${experience}${companies ? `, and target companies: ${companies}` : ''}.`;
}

function formatUpdated(timestamp) {
  if (!timestamp) return 'Updated just now';

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return 'Updated just now';

  const elapsedMs = Date.now() - date.getTime();
  if (elapsedMs < 60_000) return 'Updated just now';

  const minutes = Math.floor(elapsedMs / 60_000);
  if (minutes < 60) return `Updated ${minutes} ${pluralize(minutes, 'minute')} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Updated ${hours} ${pluralize(hours, 'hour')} ago`;

  const days = Math.floor(hours / 24);
  return `Updated ${days} ${pluralize(days, 'day')} ago`;
}

function completionState(completedCount, totalTopics, isCurrent) {
  if (totalTopics > 0 && completedCount >= totalTopics) return 'done';
  if (completedCount > 0 || isCurrent) return 'current';
  return 'future';
}

function CheckpointIcon({ state }) {
  if (state === 'done') return <CheckCircle2 size={15} />;
  if (state === 'current') return <CircleDot size={15} />;
  return <Circle size={15} />;
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function buildRevealSequence(roadmap, nodeById, edgeByTarget) {
  if (!Array.isArray(roadmap.sections) || !roadmap.sections.length) {
    return [...roadmap.nodes]
      .sort((a, b) => a.y - b.y || a.x - b.x)
      .map((node) => ({ type: 'node', node, edges: edgeByTarget.get(node.id) || [] }));
  }

  const steps = [];

  roadmap.sections.forEach((section) => {
    const header = nodeById.get(`header-${section.id}`);
    if (header) {
      steps.push({
        type: 'section',
        section,
        node: header,
        message: `Mapping out ${section.title.toLowerCase()}...`
      });
    }

    (section.spine || []).forEach((spineNode) => {
      const node = nodeById.get(spineNode.id);
      if (node) {
        steps.push({
          type: 'spine',
          section,
          node,
          edges: edgeByTarget.get(node.id) || []
        });
      }
    });

    (section.spine || []).forEach((spineNode) => {
      const branches = (spineNode.branches || [])
        .map((branch) => nodeById.get(branch.id))
        .filter(Boolean);

      if (branches.length) {
        steps.push({
          type: 'branch-message',
          section,
          sourceTitle: spineNode.title,
          branchCount: branches.length,
          message: `Adding ${branches.length} sub-topics for ${spineNode.title}...`
        });
      }

      branches.forEach((node) => {
        steps.push({
          type: 'branch',
          section,
          node,
          edges: edgeByTarget.get(node.id) || []
        });
      });
    });

    if (section.checkpoint) {
      const checkpoint = nodeById.get(section.checkpoint.id);
      if (checkpoint) {
        steps.push({
          type: 'checkpoint',
          section,
          node: checkpoint,
          edges: edgeByTarget.get(checkpoint.id) || [],
          message: `${section.title} checkpoint locked in`
        });
      }
    }
  });

  const seenIds = new Set(steps.map((step) => step.node?.id).filter(Boolean));
  roadmap.nodes
    .filter((node) => !seenIds.has(node.id))
    .sort((a, b) => a.y - b.y || a.x - b.x)
    .forEach((node) => {
      steps.push({ type: 'node', node, edges: edgeByTarget.get(node.id) || [] });
    });

  return steps;
}

function RoadmapContextPanel({
  roadmap,
  profile,
  totalTopics,
  firstUncompletedNode,
  checkpointProgress,
  onOpenNode,
  onScrollToNode
}) {
  const rationale = (roadmap.personalizationRationale || []).slice(0, 4);
  const milestoneHours = firstUncompletedNode?.estimatedHours || firstUncompletedNode?.hours;

  return (
    <aside className="roadmap-context-panel">
      <section className="roadmap-context-card is-summary">
        <p className="roadmap-context-eyebrow">Your Path</p>
        <h2>{roadmap.title}</h2>
        <div className="roadmap-context-stats">
          <span><Clock size={14} /> {roadmap.totalHours || 0} hours</span>
          <span><CalendarDays size={14} /> {roadmap.duration || 'Self paced'}</span>
          <span><Target size={14} /> {totalTopics} topics</span>
        </div>
        <p className="roadmap-context-summary">{formatProfileSummary(profile, roadmap)}</p>
      </section>

      <section className="roadmap-context-card">
        <p className="roadmap-context-eyebrow">Why This Works For You</p>
        <ul className="roadmap-context-rationale">
          {(rationale.length ? rationale : ['Personalized from your profile, target role, timeline, and saved skill history.']).map((item) => (
            <li key={item}><Check size={14} /> <span>{item}</span></li>
          ))}
        </ul>
      </section>

      <section className="roadmap-context-card">
        <p className="roadmap-context-eyebrow">Start Here</p>
        <h3>{firstUncompletedNode?.title || 'Roadmap complete'}</h3>
        <div className="roadmap-context-meta">
          <span>{milestoneHours ? `${milestoneHours} hours` : 'Focus topic'}</span>
          <span>{firstUncompletedNode?.difficulty || 'Medium'}</span>
        </div>
        <button
          type="button"
          className="roadmap-context-open"
          onClick={() => firstUncompletedNode && onOpenNode(firstUncompletedNode)}
          disabled={!firstUncompletedNode}
        >
          Open <ArrowUpRight size={15} />
        </button>
      </section>

      <section className="roadmap-context-card">
        <p className="roadmap-context-eyebrow">Checkpoints</p>
        <div className="roadmap-context-checkpoints">
          {checkpointProgress.map((checkpoint) => (
            <button
              key={checkpoint.id}
              type="button"
              className={`roadmap-context-checkpoint is-${checkpoint.state}`}
              onClick={() => onScrollToNode(checkpoint.id)}
            >
              <CheckpointIcon state={checkpoint.state} />
              <span>{checkpoint.title}</span>
              <small>{checkpoint.completedCount}/{checkpoint.totalTopics} complete</small>
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}

export default function RoadmapRenderer({
  roadmapData,
  profile = null,
  generatedAt = null,
  animationKey = 0,
  onBuildStatus,
  onSave,
  saving = false,
  saved = false
}) {
  const roadmap = roadmapData;
  const scrollRef = useRef(null);
  const svgRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [justSaved, setJustSaved] = useState(false);
  const [progress, cycleProgress] = useRoadmapProgress(roadmap.id);
  const [animationDone, setAnimationDone] = useState(animationKey <= 0);
  const [showNotes, setShowNotes] = useState(animationKey <= 0);
  const [revealedNodeIds, setRevealedNodeIds] = useState(() => new Set(animationKey <= 0 ? roadmap.nodes.map((node) => node.id) : []));
  const [revealedEdgeIds, setRevealedEdgeIds] = useState(() => new Set(animationKey <= 0 ? roadmap.edges.map((edge) => edge.id) : []));
  const onBuildStatusRef = useRef(onBuildStatus);

  useEffect(() => {
    onBuildStatusRef.current = onBuildStatus;
  }, [onBuildStatus]);

  useEffect(() => {
    if (!saved) return undefined;
    setJustSaved(true);
    const timeout = window.setTimeout(() => setJustSaved(false), 1600);
    return () => window.clearTimeout(timeout);
  }, [saved]);

  const canvasHeight = useMemo(() => {
    if (!roadmap.nodes.length) return 800;
    const maxBottom = Math.max(...roadmap.nodes.map((node) => node.y + node.height + 60));
    return Math.max(maxBottom, 800);
  }, [roadmap.nodes]);

  const nodeById = useMemo(
    () => new Map(roadmap.nodes.map((node) => [node.id, node])),
    [roadmap.nodes]
  );
  const validEdges = useMemo(
    () =>
      roadmap.edges.filter((edge) => {
        const source = nodeById.get(edge.source);
        const target = nodeById.get(edge.target);

        if (!source || !target) {
          console.warn(`Skipping edge ${edge.id}: missing node`, edge);
          return false;
        }

        return true;
      }),
    [nodeById, roadmap.edges]
  );
  const trackableNodes = roadmap.nodes.filter((node) => node.type === 'topic' || node.type === 'subtopic');
  const completedCount = trackableNodes.filter((node) => progress[node.id] === 'completed').length;
  const progressPercent = trackableNodes.length ? Math.round((completedCount / trackableNodes.length) * 100) : 0;
  const selectedProgress = selectedNode ? progress[selectedNode.id] || 'pending' : 'pending';
  const firstUncompletedNode = trackableNodes.find((node) => !['completed', 'skipped'].includes(progress[node.id])) || null;
  const updatedLabel = formatUpdated(generatedAt || roadmap.updatedAt || roadmap.generatedAt);
  const scrollToNode = (nodeId) => {
    const node = nodeById.get(nodeId);
    if (!node || !scrollRef.current || !svgRef.current) return;

    const scale = svgRef.current.clientHeight / canvasHeight || 1;
    scrollRef.current.scrollTo({
      top: Math.max(0, node.y * scale - 72),
      behavior: 'smooth'
    });
  };
  const checkpointProgress = useMemo(() => {
    if (Array.isArray(roadmap.sections) && roadmap.sections.length) {
      const items = roadmap.sections.map((section) => {
        const topicIds = (section.spine || []).flatMap((node) => [
          node.id,
          ...(node.branches || []).map((branch) => branch.id)
        ]);
        const totalTopics = topicIds.length;
        const sectionCompletedCount = topicIds.filter((id) => progress[id] === 'completed').length;

        return {
          id: section.checkpoint?.id || `header-${section.id}`,
          title: section.title,
          totalTopics,
          completedCount: sectionCompletedCount
        };
      });
      const currentIndex = items.findIndex((item) => item.completedCount < item.totalTopics);

      return items.map((item, index) => ({
        ...item,
        state: completionState(item.completedCount, item.totalTopics, index === Math.max(currentIndex, 0))
      }));
    }

    const checkpointNodes = roadmap.nodes.filter((node) => node.type === 'checkpoint');
    return checkpointNodes.map((node, index) => ({
      id: node.id,
      title: node.title.replace(/^Checkpoint\s*[-—]\s*/i, ''),
      totalTopics: trackableNodes.length,
      completedCount,
      state: completionState(completedCount, trackableNodes.length, index === 0)
    }));
  }, [completedCount, progress, roadmap.nodes, roadmap.sections, trackableNodes.length]);
  const progressBreakdown = checkpointProgress
    .map((item) => `${item.title}: ${item.completedCount}/${item.totalTopics}`)
    .join('\n');
  const edgeByTarget = useMemo(() => {
    const map = new Map();
    validEdges.forEach((edge) => {
      map.set(edge.target, [...(map.get(edge.target) || []), edge]);
    });
    return map;
  }, [validEdges]);
  const revealAll = () => {
    setRevealedNodeIds(new Set(roadmap.nodes.map((node) => node.id)));
    setRevealedEdgeIds(new Set(validEdges.map((edge) => edge.id)));
    setShowNotes(true);
    setAnimationDone(true);
    onBuildStatusRef.current?.({
      message: `Done. ${roadmap.totalHours || 0} hours of focused work to ${roadmap.title}. Click any topic to dive in.`,
      done: true
    });
  };

  useEffect(() => {
    let cancelled = false;

    if (!animationKey) {
      revealAll();
      return () => {
        cancelled = true;
      };
    }

    setAnimationDone(false);
    setShowNotes(false);
    setRevealedNodeIds(new Set());
    setRevealedEdgeIds(new Set());
    onBuildStatusRef.current?.({ message: `Building your ${roadmap.title} path...` });

    const sequence = buildRevealSequence(roadmap, nodeById, edgeByTarget);
    const totalDelay = Math.min(65, Math.max(28, Math.floor(2500 / Math.max(sequence.length, 1))));

    const run = async () => {
      for (const step of sequence) {
        if (cancelled) return;

        if (step.message) {
          onBuildStatusRef.current?.({ message: step.message });
        }

        if (step.node) {
          setRevealedNodeIds((current) => new Set([...current, step.node.id]));
        }

        if (step.edges?.length) {
          await wait(Math.min(25, totalDelay));
          if (cancelled) return;
          setRevealedEdgeIds((current) => new Set([...current, ...step.edges.map((edge) => edge.id)]));
        }

        if (step.type === 'checkpoint') {
          await wait(100);
        } else if (step.type === 'branch-message') {
          await wait(20);
        } else {
          await wait(totalDelay);
        }
      }

      if (cancelled) return;
      onBuildStatusRef.current?.({ message: `Tailoring this for your ${profile?.major || profile?.degree || 'student'} background${profile?.university ? ` at ${profile.university}` : ''}...` });
      await wait(250);
      if (cancelled) return;
      setShowNotes(true);
      await wait(180);
      if (cancelled) return;
      setAnimationDone(true);
      onBuildStatusRef.current?.({
        message: `Done. ${roadmap.totalHours || 0} hours of focused work to ${roadmap.title}. Click any topic to dive in.`,
        done: true
      });
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [animationKey, edgeByTarget, nodeById, profile?.degree, profile?.major, profile?.university, roadmap, validEdges]);

  return (
    <div className="roadmap-svg-shell">
      <header className="roadmap-svg-header">
        <div>
          <h1>{roadmap.title}</h1>
          <p>{roadmap.subtitle}</p>
          <nav>
            <button type="button" className="is-active">Roadmap</button>
            <button type="button">Projects</button>
            <button type="button">AI Tutor</button>
          </nav>
        </div>
        <aside className="roadmap-svg-progress" title={progressBreakdown || undefined}>
          <p><strong>{progressPercent}% complete</strong> · {completedCount} of {trackableNodes.length} topics</p>
          <div><span style={{ width: `${progressPercent}%` }} /></div>
          <small>{roadmap.totalHours || 0} hours · {roadmap.duration || 'Self paced'}</small>
          <small>{updatedLabel}</small>
          {!animationDone ? (
            <button type="button" className="roadmap-skip-animation" onClick={revealAll}>
              Skip animation
            </button>
          ) : null}
        </aside>
      </header>

      <main className="roadmap-svg-scroll" ref={scrollRef}>
        <div className="roadmap-svg-body">
          <RoadmapContextPanel
            roadmap={roadmap}
            profile={profile}
            totalTopics={trackableNodes.length}
            firstUncompletedNode={firstUncompletedNode}
            checkpointProgress={checkpointProgress}
            onOpenNode={setSelectedNode}
            onScrollToNode={scrollToNode}
          />
          <section className="roadmap-svg-canvas-panel">
            <div className="roadmap-svg-canvas roadmap-canvas-container">
              <svg
                ref={svgRef}
                viewBox={`0 0 ${ROADMAP_CANVAS_WIDTH} ${canvasHeight}`}
                preserveAspectRatio="xMidYMin meet"
                width="100%"
                height="auto"
                style={{ display: 'block', maxWidth: '100%' }}
              >
                <g className="roadmap-svg-edges">
                  {validEdges.map((edge) => {
                    const source = nodeById.get(edge.source);
                    const target = nodeById.get(edge.target);
                    const isRevealed = animationDone || revealedEdgeIds.has(edge.id);
                    return (
                      <motion.path
                        key={edge.id}
                        d={generateElbowPath(source, target, edge.sourceHandle, edge.targetHandle)}
                        stroke={edge.type === 'dashed' ? '#3B82F6' : '#2563EB'}
                        strokeWidth="2.5"
                        strokeDasharray={edge.type === 'dashed' ? '6 4' : undefined}
                        fill="none"
                        initial={false}
                        animate={{
                          pathLength: isRevealed ? 1 : 0,
                          opacity: isRevealed ? 1 : 0
                        }}
                        transition={{ duration: edge.type === 'dashed' ? 0.28 : 0.4, ease: 'easeInOut' }}
                      />
                    );
                  })}
                </g>
                <g className="roadmap-svg-nodes">
                  {roadmap.nodes.map((node) => {
                    const isRevealed = animationDone || revealedNodeIds.has(node.id);
                    return (
                      <foreignObject
                        key={node.id}
                        x={node.x}
                        y={node.y}
                        width={node.width + 20}
                        height={node.height}
                      >
                        <motion.div
                          className="roadmap-svg-node-motion"
                          initial={false}
                          animate={{
                            opacity: isRevealed ? 1 : 0,
                            y: isRevealed ? 0 : -10,
                            scale: isRevealed ? 1 : 0.95
                          }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <RoadmapNode
                            node={node}
                            progress={progress[node.id] || 'pending'}
                            onClick={() => node.type !== 'label' && node.type !== 'section_header' && setSelectedNode(node)}
                            onCycleProgress={cycleProgress}
                          />
                        </motion.div>
                      </foreignObject>
                    );
                  })}
                </g>
                <g className="roadmap-svg-notes">
                  {roadmap.nodes.filter((node) => node.personalizedNote).map((node) => {
                    const isRevealed = (animationDone || showNotes) && (animationDone || revealedNodeIds.has(node.id));
                    return (
                      <foreignObject
                        key={`note-${node.id}`}
                        x={node.x}
                        y={node.y + node.height + 4}
                        width={node.width}
                        height={40}
                        style={{ overflow: 'visible', pointerEvents: 'none' }}
                      >
                        <motion.div
                          initial={false}
                          animate={{
                            opacity: isRevealed ? 1 : 0,
                            y: isRevealed ? 0 : -4
                          }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                        >
                          <RoadmapNote node={node} />
                        </motion.div>
                      </foreignObject>
                    );
                  })}
                </g>
              </svg>
            </div>
          </section>
        </div>
      </main>

      <button type="button" className="roadmap-svg-save" onClick={onSave} disabled={saving}>
        <Bookmark size={16} fill="currentColor" />
        {justSaved ? 'Saved' : saving ? 'Saving...' : 'Save'}
      </button>

      <NodeDrawer
        roadmap={roadmap}
        node={selectedNode}
        open={Boolean(selectedNode)}
        onOpenChange={(open) => !open && setSelectedNode(null)}
        progress={selectedProgress}
        onCycleProgress={cycleProgress}
      />
    </div>
  );
}
