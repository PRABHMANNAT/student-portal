import RoadmapRenderer from './RoadmapRenderer';
import frontendEngineerRoadmap from '../../data/roadmaps/frontend-engineer.json';
import { layoutRoadmap } from '../../lib/layoutRoadmap.js';
import { useMemo } from 'react';

const SPINE_X = 620;
const LEFT_X = 250;
const RIGHT_X = 1020;
const SPINE_WIDTH = 240;
const BRANCH_WIDTH = 200;
const NODE_HEIGHT = 49;

function slug(value = 'node') {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'node';
}

function stableId(seed, index) {
  let hash = index + 17;
  for (const char of seed) {
    hash = (hash * 33 + char.charCodeAt(0)) % 1679616;
  }
  return `${slug(seed)}-${hash.toString(36).padStart(4, '0')}`;
}

function normalizeResource(resource, fallbackType = 'article') {
  return {
    type: resource?.type || fallbackType,
    title: resource?.title || resource?.label || 'Learning resource',
    url: resource?.url || '#',
    source: resource?.source || resource?.channel || resource?.domain || 'Resource',
    discount: resource?.discount || null
  };
}

function contentForNode(node) {
  const resources = node.resources || {};
  const docs = node.docs || [];
  const videos = node.youtube || [];

  return {
    description: node.description || `${node.title} is part of this personalized roadmap.`,
    freeResources: [
      ...(resources.free || []).map((item) => normalizeResource(item)),
      ...docs.map((item) => normalizeResource(item)),
      ...videos.map((item) => normalizeResource(item, 'video'))
    ].slice(0, 4),
    premiumResources: (resources.premium || []).map((item) => normalizeResource(item, 'course')).slice(0, 2),
    aiTutor: (resources.aiTutor || []).map((item) => normalizeResource(item)).slice(0, 2)
  };
}

function schemaFromPhases(roadmap) {
  const nodes = [];
  const edges = [];
  const content = {};
  let y = 100;
  let edgeIndex = 1;
  let previousSpineId = null;

  (roadmap.phases || []).forEach((phase, phaseIndex) => {
    const labelId = stableId(`${phase.label || phase.name || `phase-${phaseIndex}`} label`, phaseIndex);
    nodes.push({
      id: labelId,
      type: 'label',
      title: phase.label || phase.name || `Phase ${phaseIndex + 1}`,
      x: SPINE_X - 60,
      y,
      width: 360,
      height: 38,
      style: 'label',
      personalizedNote: null
    });
    y += 72;

    (phase.nodes || []).forEach((sourceNode, nodeIndex) => {
      const id = stableId(sourceNode.id || sourceNode.title || sourceNode.label, phaseIndex * 100 + nodeIndex);
      const title = sourceNode.title || sourceNode.label || `Topic ${nodeIndex + 1}`;
      const style = sourceNode.type === 'optional'
        ? 'optional'
        : sourceNode.type === 'checkpoint'
          ? 'checkpoint'
          : 'primary';

      nodes.push({
        id,
        type: style === 'checkpoint' ? 'checkpoint' : 'topic',
        title,
        x: style === 'checkpoint' ? SPINE_X - 50 : SPINE_X,
        y,
        width: style === 'checkpoint' ? 340 : SPINE_WIDTH,
        height: style === 'checkpoint' ? 54 : NODE_HEIGHT,
        style,
        personalizedNote: sourceNode.personalizedNote || null
      });
      content[id] = contentForNode({ ...sourceNode, title });

      if (previousSpineId) {
        edges.push({
          id: `e${edgeIndex++}`,
          source: previousSpineId,
          target: id,
          type: 'solid',
          sourceHandle: 'bottom',
          targetHandle: 'top'
        });
      }
      previousSpineId = id;

      const branches = [
        ...(sourceNode.projects || []).map((project) => project.title),
        ...(sourceNode.docs || []).map((doc) => doc.title),
        ...(sourceNode.youtube || []).map((video) => video.title)
      ].filter(Boolean).slice(0, 3);
      const branchSide = (phaseIndex + nodeIndex) % 2 === 0 ? 'right' : 'left';
      const branchX = branchSide === 'right' ? RIGHT_X : LEFT_X;

      branches.forEach((branchTitle, branchIndex) => {
        const branchId = stableId(`${id}-${branchTitle}`, branchIndex);
        nodes.push({
          id: branchId,
          type: 'subtopic',
          title: branchTitle,
          x: branchX,
          y: y + (branchIndex - 1) * 52,
          width: BRANCH_WIDTH,
          height: 38,
          style: 'alternative',
          personalizedNote: null
        });
        content[branchId] = contentForNode({ title: branchTitle, description: `Use ${branchTitle} to reinforce ${title}.` });
        edges.push({
          id: `e${edgeIndex++}`,
          source: id,
          target: branchId,
          type: 'dashed',
          sourceHandle: branchSide === 'right' ? 'right' : 'left',
          targetHandle: branchSide === 'right' ? 'left' : 'right'
        });
      });

      y += Math.max(124, branches.length * 42 + 44);
    });

    y += 48;
  });

  return {
    id: slug(roadmap.title || roadmap.career || 'personalized-roadmap'),
    title: roadmap.title || roadmap.career || 'Personalized Roadmap',
    subtitle: roadmap.subtitle || roadmap.description || 'Step by step guide for this career path',
      totalNodes: nodes.filter((node) => node.type !== 'label').length,
    duration: roadmap.duration || 'Self paced',
    totalHours: roadmap.totalHours || nodes.length * 6,
    nodes,
    edges,
    content
  };
}

function schemaFromSpine(roadmap) {
  const nodes = [];
  const edges = [];
  const content = {};
  let y = 100;
  let edgeIndex = 1;
  let previousSpineId = null;

  (roadmap.spine || []).forEach((item, index) => {
    const id = item.id || stableId(item.title, index);
    const isLabel = item.type === 'section_header';
    const isCheckpoint = item.type === 'checkpoint';
    nodes.push({
      id,
      type: isLabel ? 'label' : isCheckpoint ? 'checkpoint' : 'topic',
      title: item.title || `Topic ${index + 1}`,
      x: isLabel ? SPINE_X - 60 : isCheckpoint ? SPINE_X - 50 : SPINE_X,
      y,
      width: isLabel ? 360 : isCheckpoint ? 340 : SPINE_WIDTH,
      height: isLabel ? 38 : isCheckpoint ? 54 : NODE_HEIGHT,
      style: isLabel ? 'label' : isCheckpoint ? 'checkpoint' : item.recommendation === 'optional' ? 'optional' : 'primary',
      personalizedNote: item.personalizedNote || null
    });
    content[id] = contentForNode(item);

    if (previousSpineId && !isLabel) {
      edges.push({
        id: `e${edgeIndex++}`,
        source: previousSpineId,
        target: id,
        type: 'solid',
        sourceHandle: 'bottom',
        targetHandle: 'top'
      });
    }

    if (!isLabel) {
      previousSpineId = id;
    }

    const branchGroup = roadmap.branches?.[id];
    const branchNodes = Array.isArray(branchGroup) ? branchGroup : branchGroup?.nodes || [];
    const side = branchGroup?.side || (index % 2 === 0 ? 'right' : 'left');
    const branchX = side === 'right' ? RIGHT_X : LEFT_X;

    branchNodes.slice(0, 5).forEach((branch, branchIndex) => {
      const branchId = branch.id || stableId(`${id}-${branch.title}`, branchIndex);
      nodes.push({
        id: branchId,
        type: 'subtopic',
        title: branch.title || `Branch ${branchIndex + 1}`,
        x: branchX,
        y: y + (branchIndex - Math.floor(branchNodes.length / 2)) * 52,
        width: BRANCH_WIDTH,
        height: 38,
        style: branch.recommendation === 'optional' ? 'optional' : 'alternative',
        personalizedNote: branch.personalizedNote || null
      });
      content[branchId] = contentForNode(branch);
      edges.push({
        id: `e${edgeIndex++}`,
        source: id,
        target: branchId,
        type: 'dashed',
        sourceHandle: side === 'right' ? 'right' : 'left',
        targetHandle: side === 'right' ? 'left' : 'right'
      });
    });

    y += Math.max(112, branchNodes.length * 42 + 44);
  });

  return {
    id: roadmap.id || slug(roadmap.title || roadmap.career || 'personalized-roadmap'),
    title: roadmap.title || roadmap.career || 'Personalized Roadmap',
    subtitle: roadmap.subtitle || roadmap.description || 'Step by step guide for this career path',
    totalNodes: nodes.filter((node) => node.type !== 'label').length,
    duration: roadmap.duration || 'Self paced',
    totalHours: roadmap.totalHours || nodes.length * 6,
    nodes,
    edges,
    content
  };
}

function toRoadmapSchema(roadmap) {
  if (!roadmap) return frontendEngineerRoadmap;
  if (Array.isArray(roadmap.sections)) {
    const layout = layoutRoadmap(roadmap);
    return {
      ...roadmap,
      ...layout,
      id: roadmap.id || slug(roadmap.title || roadmap.career || 'personalized-roadmap'),
      title: roadmap.title || roadmap.career || 'Personalized Roadmap',
      subtitle: roadmap.subtitle || roadmap.description || 'Step by step guide for this career path',
      totalNodes: layout.nodes.filter((node) => node.type !== 'section_header').length,
      duration: roadmap.duration || 'Self paced',
      totalHours: roadmap.totalHours || layout.nodes.length * 6,
      content: roadmap.content || {}
    };
  }
  if (Array.isArray(roadmap.nodes) && Array.isArray(roadmap.edges)) {
    return {
      ...roadmap,
      id: roadmap.id || slug(roadmap.title),
      content: roadmap.content || {},
      totalNodes: roadmap.totalNodes || roadmap.nodes.filter((node) => node.type !== 'label').length
    };
  }
  if (Array.isArray(roadmap.spine)) return schemaFromSpine(roadmap);
  if (Array.isArray(roadmap.phases)) return schemaFromPhases(roadmap);
  return frontendEngineerRoadmap;
}

function RoadmapEmptyState({ dissolving = false }) {
  return (
    <div className={`roadmap-empty-state is-terminal ${dissolving ? 'is-dissolving' : ''}`}>
      <div className="roadmap-terminal-content">
        <p className="roadmap-terminal-label">Loading</p>
        <div className="roadmap-terminal-word-wrap">
          <span className="roadmap-terminal-word">Aristotle</span>
          <span className="roadmap-terminal-underline" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

export default function RoadmapVisualization({
  roadmap,
  profile = null,
  generatedAt = null,
  generationKey = 0,
  onBuildStatus,
  onSave,
  onQuickStart,
  saving = false,
  saved = false,
  isGenerating = false
}) {
  const roadmapData = useMemo(() => toRoadmapSchema(roadmap), [roadmap]);

  if (!roadmap && isGenerating) {
    return <RoadmapEmptyState dissolving />;
  }

  return (
    <RoadmapRenderer
      roadmapData={roadmapData}
      profile={profile}
      generatedAt={generatedAt}
      animationKey={generationKey}
      onBuildStatus={onBuildStatus}
      onSave={onSave}
      onQuickStart={onQuickStart}
      saving={saving}
      saved={saved}
      isGenerating={isGenerating}
    />
  );
}
