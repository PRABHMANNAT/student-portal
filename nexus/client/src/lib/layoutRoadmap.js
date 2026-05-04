const SPINE_X = 740;
const SPINE_NODE_WIDTH = 240;
const BRANCH_NODE_WIDTH = 200;
const NODE_HEIGHT = 49;
const SPINE_GAP_Y = 200;
const BRANCH_GAP_Y = 56;
const BRANCH_OFFSET_X = 140;
const SECTION_HEADER_PADDING_TOP = 80;
const SECTION_HEADER_PADDING_BOTTOM = 50;
const CHECKPOINT_GAP = 60;

export function layoutRoadmap(roadmap) {
  const nodes = [];
  const edges = [];
  let currentY = 80;
  let prevSpineNodeId = null;

  for (const section of roadmap.sections || []) {
    currentY += SECTION_HEADER_PADDING_TOP;

    nodes.push({
      id: `header-${section.id}`,
      type: 'section_header',
      title: section.title,
      x: SPINE_X - 150,
      y: currentY,
      width: 300,
      height: 30,
      style: 'header'
    });
    currentY += 30 + SECTION_HEADER_PADDING_BOTTOM;

    for (const spineNode of section.spine || []) {
      const spineY = currentY;

      nodes.push({
        id: spineNode.id,
        type: 'topic',
        title: spineNode.title,
        x: SPINE_X - SPINE_NODE_WIDTH / 2,
        y: spineY,
        width: SPINE_NODE_WIDTH,
        height: NODE_HEIGHT,
        style: spineNode.style || 'primary',
        estimatedHours: spineNode.estimatedHours || spineNode.hours || null,
        difficulty: spineNode.difficulty || null,
        personalizedNote: spineNode.personalizedNote || null
      });

      if (prevSpineNodeId) {
        edges.push({
          id: `edge-${prevSpineNodeId}-${spineNode.id}`,
          source: prevSpineNodeId,
          target: spineNode.id,
          type: 'solid',
          sourceHandle: 'bottom',
          targetHandle: 'top'
        });
      }

      const leftBranches = (spineNode.branches || []).filter((branch) => branch.side === 'left');
      const rightBranches = (spineNode.branches || []).filter((branch) => branch.side === 'right');

      rightBranches.forEach((branch, index) => {
        const stackOffset = -((rightBranches.length - 1) * BRANCH_GAP_Y) / 2;
        const branchY = spineY + stackOffset + index * BRANCH_GAP_Y;
        nodes.push({
          id: branch.id,
          type: 'subtopic',
          title: branch.title,
          x: SPINE_X + SPINE_NODE_WIDTH / 2 + BRANCH_OFFSET_X,
          y: branchY,
          width: BRANCH_NODE_WIDTH,
          height: NODE_HEIGHT,
          style: branch.style || 'alternative',
          estimatedHours: branch.estimatedHours || branch.hours || null,
          difficulty: branch.difficulty || null,
          personalizedNote: branch.personalizedNote || null
        });

        edges.push({
          id: `edge-${spineNode.id}-${branch.id}`,
          source: spineNode.id,
          target: branch.id,
          type: 'dashed',
          sourceHandle: 'right',
          targetHandle: 'left'
        });
      });

      leftBranches.forEach((branch, index) => {
        const stackOffset = -((leftBranches.length - 1) * BRANCH_GAP_Y) / 2;
        const branchY = spineY + stackOffset + index * BRANCH_GAP_Y;
        nodes.push({
          id: branch.id,
          type: 'subtopic',
          title: branch.title,
          x: SPINE_X - SPINE_NODE_WIDTH / 2 - BRANCH_OFFSET_X - BRANCH_NODE_WIDTH,
          y: branchY,
          width: BRANCH_NODE_WIDTH,
          height: NODE_HEIGHT,
          style: branch.style || 'alternative',
          estimatedHours: branch.estimatedHours || branch.hours || null,
          difficulty: branch.difficulty || null,
          personalizedNote: branch.personalizedNote || null
        });

        edges.push({
          id: `edge-${spineNode.id}-${branch.id}`,
          source: spineNode.id,
          target: branch.id,
          type: 'dashed',
          sourceHandle: 'left',
          targetHandle: 'right'
        });
      });

      const maxBranches = Math.max(leftBranches.length, rightBranches.length, 1);
      const branchStackHeight = (maxBranches - 1) * BRANCH_GAP_Y + NODE_HEIGHT;
      currentY = spineY + Math.max(branchStackHeight, NODE_HEIGHT) + SPINE_GAP_Y;

      prevSpineNodeId = spineNode.id;
    }

    if (section.checkpoint) {
      nodes.push({
        id: section.checkpoint.id,
        type: 'checkpoint',
        title: section.checkpoint.title,
        x: SPINE_X - 180,
        y: currentY,
        width: 360,
        height: NODE_HEIGHT,
        style: 'checkpoint'
      });

      if (prevSpineNodeId) {
        edges.push({
          id: `edge-${prevSpineNodeId}-${section.checkpoint.id}`,
          source: prevSpineNodeId,
          target: section.checkpoint.id,
          type: 'solid',
          sourceHandle: 'bottom',
          targetHandle: 'top'
        });
      }

      prevSpineNodeId = section.checkpoint.id;
      currentY += CHECKPOINT_GAP + NODE_HEIGHT;
    }
  }

  const canvasHeight = currentY + 100;

  return { nodes, edges, canvasHeight, canvasWidth: 1480 };
}
