import * as Dialog from '@radix-ui/react-dialog';
import { ArrowUpRight, CalendarDays, Check, CheckCircle2, Circle, CircleDot, Clock, Maximize2, Minimize2, Target, X, Send, Bot, Sparkles } from 'lucide-react';
/* Note: Check is used in RoadmapContextPanel rationale list */
import ReactMarkdown from 'react-markdown';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FlowCanvas from './FlowCanvas';
import SourcesPanel from './SourcesPanel';

const STATES = ['pending', 'in_progress', 'completed', 'skipped'];
const MARKDOWN_FILES = import.meta.glob('../../data/roadmaps/*/content/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
});


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

// ── Projects Tab (Mock Content) ──────────────────────────────────────────────

function ProjectsTab() {
  const [tasks, setTasks] = useState([
    { id: 1, label: 'Set up project scaffolding & routing', done: false },
    { id: 2, label: 'Build transaction input form with validation', done: false },
    { id: 3, label: 'Create dashboard with charts (Chart.js / Recharts)', done: false },
    { id: 4, label: 'Add category filtering & monthly breakdown', done: false },
  ]);

  const toggle = (id) => setTasks((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t));

  return (
    <div className="roadmap-tab-content" draggable={false}>
      <div className="roadmap-project-card" draggable={false}>
        <div className="roadmap-project-header">
          <div>
            <span className="roadmap-project-badge is-intermediate">Intermediate</span>
            <span className="roadmap-project-time">~12 hours</span>
          </div>
        </div>
        <h3 className="roadmap-project-title">Build a Personal Finance Tracker</h3>
        <p className="roadmap-project-desc">
          Create a full-stack personal finance tracker with expense categorisation,
          budget goals, interactive charts, and monthly reporting. Uses React, Node.js,
          and a database of your choice.
        </p>
        <div className="roadmap-project-milestones">
          <h4>Milestones</h4>
          {tasks.map((task) => (
            <label key={task.id} className="roadmap-project-task">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggle(task.id)}
              />
              <span className={task.done ? 'is-done' : ''}>{task.label}</span>
            </label>
          ))}
        </div>
        <button type="button" className="roadmap-project-view-btn">
          View Project <ArrowUpRight size={15} />
        </button>
      </div>
    </div>
  );
}

// ── AI Tutor Tab (Mock Content) ──────────────────────────────────────────────

function AITutorTab() {
  const chips = ['Explain this concept', 'Give me a quiz', 'Show me an example', 'Summarize key points'];

  return (
    <div className="roadmap-tab-content" draggable={false}>
      <div className="roadmap-tutor-card" draggable={false}>
        <div className="roadmap-tutor-header">
          <div className="roadmap-tutor-avatar">
            <Bot size={22} />
          </div>
          <div>
            <h3>AI Tutor</h3>
            <span className="roadmap-tutor-status">Online · Ready to help</span>
          </div>
        </div>

        <div className="roadmap-tutor-chat">
          <div className="roadmap-tutor-bubble is-ai">
            <Sparkles size={14} className="roadmap-tutor-sparkle" />
            <p>Hi! I'm your AI tutor. Ask me anything about this roadmap topic — I can explain concepts, generate quizzes, or walk you through examples.</p>
          </div>
        </div>

        <div className="roadmap-tutor-chips">
          {chips.map((chip) => (
            <button key={chip} type="button" className="roadmap-tutor-chip">
              {chip}
            </button>
          ))}
        </div>

        <div className="roadmap-tutor-input">
          <input type="text" placeholder="Ask me anything…" disabled />
          <button type="button" className="roadmap-tutor-send" disabled aria-label="Send message">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Info Cards (moved below the roadmap) ─────────────────────────────────────

function InfoCardsRow({
  roadmap,
  profile,
  totalTopics,
  firstUncompletedNode,
  checkpointProgress,
  rationale,
  onOpenNode,
  onScrollToNode
}) {
  const milestoneHours = firstUncompletedNode?.estimatedHours || firstUncompletedNode?.hours;

  return (
    <div className="roadmap-info-cards-row" draggable={false}>
      {/* Your Path */}
      <section className="roadmap-context-card is-summary" draggable={false}>
        <p className="roadmap-context-eyebrow">Your Path</p>
        <h2>{roadmap.title}</h2>
        <div className="roadmap-context-stats">
          <span><Clock size={14} /> {roadmap.totalHours || 0} hours</span>
          <span><CalendarDays size={14} /> {roadmap.duration || 'Self paced'}</span>
          <span><Target size={14} /> {totalTopics} topics</span>
        </div>
        <p className="roadmap-context-summary">{formatProfileSummary(profile, roadmap)}</p>
      </section>

      {/* Why This Works */}
      <section className="roadmap-context-card" draggable={false}>
        <p className="roadmap-context-eyebrow">Why This Works For You</p>
        <ul className="roadmap-context-rationale">
          {(rationale.length ? rationale : ['Personalized from your profile, target role, timeline, and saved skill history.']).map((item) => (
            <li key={item}><Check size={14} /> <span>{item}</span></li>
          ))}
        </ul>
      </section>

      {/* Start Here */}
      <section className="roadmap-context-card" draggable={false}>
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
    </div>
  );
}


export default function RoadmapRenderer({
  roadmapData,
  profile = null,
  generatedAt = null,
  animationKey = 0,
  onBuildStatus,
  onSave,
  onQuickStart,
  saving = false,
  saved = false,
  isGenerating = false
}) {
  const roadmap = roadmapData;
  const scrollRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [justSaved, setJustSaved] = useState(false);
  const [progress, cycleProgress] = useRoadmapProgress(roadmap.id);
  const onBuildStatusRef = useRef(onBuildStatus);
  const [activeTab, setActiveTab] = useState('roadmap');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [sourcesTopic, setSourcesTopic] = useState('');

  useEffect(() => {
    onBuildStatusRef.current = onBuildStatus;
  }, [onBuildStatus]);

  useEffect(() => {
    if (!saved) return undefined;
    setJustSaved(true);
    const timeout = window.setTimeout(() => setJustSaved(false), 1600);
    return () => window.clearTimeout(timeout);
  }, [saved]);

  // Signal the chat panel when roadmap data is ready
  useEffect(() => {
    if (!animationKey) return undefined;
    onBuildStatusRef.current?.({ message: `Rendering ${roadmap.title} roadmap…` });
    const timer = window.setTimeout(() => {
      onBuildStatusRef.current?.({
        message: `Done. ${roadmap.totalHours || 0} hours of focused work to ${roadmap.title}. Click any topic to dive in.`,
        done: true,
      });
    }, 600);
    return () => window.clearTimeout(timer);
  }, [animationKey, roadmap.title, roadmap.totalHours]);

  // Wire quick-start events from the empty canvas state
  useEffect(() => {
    if (!onQuickStart) return;
    const handler = (e) => onQuickStart(e.detail?.prompt);
    window.addEventListener('nexus:quick-start', handler);
    return () => window.removeEventListener('nexus:quick-start', handler);
  }, [onQuickStart]);

  // Escape exits fullscreen
  useEffect(() => {
    if (!isFullscreen) return;
    const handler = (e) => { if (e.key === 'Escape') setIsFullscreen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isFullscreen]);

  // Map a ReactFlow node click back to the full roadmap node — open sources panel
  const handleFlowNodeClick = useCallback((flowNode) => {
    const roadmapNode = roadmap.nodes.find((n) => n.id === flowNode.id);
    if (roadmapNode) {
      setSourcesTopic(roadmapNode.title || flowNode.data?.label || flowNode.id);
      setSourcesOpen(true);
    }
  }, [roadmap.nodes]);

  const trackableNodes = roadmap.nodes.filter((node) => node.type === 'topic' || node.type === 'subtopic');
  const completedCount = trackableNodes.filter((node) => progress[node.id] === 'completed').length;
  const progressPercent = trackableNodes.length ? Math.round((completedCount / trackableNodes.length) * 100) : 0;
  const selectedProgress = selectedNode ? progress[selectedNode.id] || 'pending' : 'pending';
  const firstUncompletedNode = trackableNodes.find((node) => !['completed', 'skipped'].includes(progress[node.id])) || null;
  const updatedLabel = formatUpdated(generatedAt || roadmap.updatedAt || roadmap.generatedAt);

  // With React Flow the canvas handles its own viewport; this is a no-op kept for context panel wiring
  const scrollToNode = useCallback((_nodeId) => {}, []);

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

  const rationale = (roadmap.personalizationRationale || []).slice(0, 4);

  const progressBreakdown = checkpointProgress
    .map((item) => `${item.title}: ${item.completedCount}/${item.totalTopics}`)
    .join('\n');

  const TABS = [
    { id: 'roadmap', label: 'Roadmap' },
    { id: 'projects', label: 'Projects' },
    { id: 'ai-tutor', label: 'AI Tutor' },
  ];

  // ── Fullscreen canvas ──────────────────────────────────────────────────────

  const canvasContent = (
    <section className={`roadmap-svg-canvas-panel is-flow-mode ${isFullscreen ? 'is-fullscreen' : ''}`}>
      <button
        type="button"
        className="roadmap-fullscreen-toggle"
        onClick={() => setIsFullscreen((v) => !v)}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </button>
      <FlowCanvas
        roadmapData={roadmap}
        animationKey={animationKey}
        isGenerating={isGenerating}
        onSave={onSave}
        onNodeClick={handleFlowNodeClick}
        saving={saving}
        saved={justSaved}
      />
    </section>
  );

  return (
    <div className="roadmap-svg-shell">
      <header className="roadmap-svg-header">
        <div>
          <h1>{roadmap.title}</h1>
          <p>{roadmap.subtitle}</p>
          <nav>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={activeTab === tab.id ? 'is-active' : ''}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <aside className="roadmap-svg-progress" title={progressBreakdown || undefined}>
          <p><strong>{progressPercent}% complete</strong> · {completedCount} of {trackableNodes.length} topics</p>
          <div><span style={{ width: `${progressPercent}%` }} /></div>
          <small>{roadmap.totalHours || 0} hours · {roadmap.duration || 'Self paced'}</small>
          <small>{updatedLabel}</small>
        </aside>
      </header>

      {/* ── Tab content ─────────────────────────────────────────────────────── */}
      {activeTab === 'roadmap' && (
        <main className="roadmap-svg-scroll is-flow-mode" ref={scrollRef}>
          {/* Fullscreen overlay */}
          <AnimatePresence>
            {isFullscreen && (
              <motion.div
                className="roadmap-fullscreen-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {canvasContent}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="roadmap-svg-body is-flow-mode is-restructured">
            {/* Canvas takes full width */}
            {!isFullscreen && canvasContent}

            {/* Info cards row below the roadmap */}
            <InfoCardsRow
              roadmap={roadmap}
              profile={profile}
              totalTopics={trackableNodes.length}
              firstUncompletedNode={firstUncompletedNode}
              checkpointProgress={checkpointProgress}
              rationale={rationale}
              onOpenNode={setSelectedNode}
              onScrollToNode={scrollToNode}
            />

            {/* Checkpoints */}
            <section className="roadmap-context-card roadmap-checkpoints-card" draggable={false}>
              <p className="roadmap-context-eyebrow">Checkpoints</p>
              <div className="roadmap-context-checkpoints">
                {checkpointProgress.map((checkpoint) => (
                  <button
                    key={checkpoint.id}
                    type="button"
                    className={`roadmap-context-checkpoint is-${checkpoint.state}`}
                    onClick={() => scrollToNode(checkpoint.id)}
                  >
                    <CheckpointIcon state={checkpoint.state} />
                    <span>{checkpoint.title}</span>
                    <small>{checkpoint.completedCount}/{checkpoint.totalTopics} complete</small>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </main>
      )}

      {activeTab === 'projects' && <ProjectsTab />}
      {activeTab === 'ai-tutor' && <AITutorTab />}

      <NodeDrawer
        roadmap={roadmap}
        node={selectedNode}
        open={Boolean(selectedNode)}
        onOpenChange={(open) => !open && setSelectedNode(null)}
        progress={selectedProgress}
        onCycleProgress={cycleProgress}
      />

      {/* Sources side panel */}
      <SourcesPanel
        topicName={sourcesTopic}
        open={sourcesOpen}
        onClose={() => setSourcesOpen(false)}
      />
    </div>
  );
}
