import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import RoadmapVisualization from '../components/Roadmap/RoadmapVisualization';
import AppShell from '../components/Shell/AppShell';
import { useApp } from '../context/AppContext';
import { useProfile } from '../context/ProfileContext';
import { useAgent } from '../hooks/useAgent';
import { useChat } from '../hooks/useChat';
import { roadmapApi } from '../api';
import { generateRoadmap, detectRoadmapFromPrompt } from '../lib/roadmapGenerator';

const PROMPT_HISTORY_KEY = 'nexus-roadmap-prompt-history';
const HISTORY_LIMIT = 5;

function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

const GENERATION_LIMIT = 20;
const GENERATION_COUNTER_KEY = 'nexus-roadmap-generation-count';

function readGenerationCount() {
  return Number(window.localStorage.getItem(GENERATION_COUNTER_KEY) || 0);
}

function readRemainingGenerations() {
  return Math.max(0, GENERATION_LIMIT - readGenerationCount());
}

function incrementGenerationCount() {
  const nextCount = Math.min(GENERATION_LIMIT, readGenerationCount() + 1);
  window.localStorage.setItem(GENERATION_COUNTER_KEY, String(nextCount));
  return Math.max(0, GENERATION_LIMIT - nextCount);
}

function inferTargetRole(input, profile) {
  const match = input.match(/(?:become|as|for|to be|targeting|switch to)\s+(?:a |an )?([^,.]+?)(?:\s+at|\s+in|\s+with|$)/i);
  return match?.[1]?.trim() || profile.targetRole || 'your target role';
}

function readPromptHistory() {
  try {
    return JSON.parse(window.localStorage.getItem(PROMPT_HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

function savePromptHistory(prompt, current) {
  const deduped = [prompt, ...current.filter((p) => p !== prompt)].slice(0, HISTORY_LIMIT);
  window.localStorage.setItem(PROMPT_HISTORY_KEY, JSON.stringify(deduped));
  return deduped;
}

function PromptHistoryChips({ history, onSelect, onRemove }) {
  if (!history.length) return null;

  return (
    <div className="prompt-history">
      <p className="prompt-history__label">Recent</p>
      <div className="prompt-history__chips">
        {history.map((prompt) => (
          <div key={prompt} className="prompt-history__chip">
            <button
              type="button"
              className="prompt-history__chip-text"
              onClick={() => onSelect(prompt)}
            >
              {prompt.length > 32 ? `${prompt.slice(0, 32)}…` : prompt}
            </button>
            <button
              type="button"
              className="prompt-history__chip-remove"
              onClick={() => onRemove(prompt)}
              aria-label={`Remove "${prompt}" from history`}
            >
              <X size={10} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  const { refreshCollections, session } = useApp();
  const { profile } = useProfile();
  const { artifact, meta, hydrate } = useAgent('roadmap');
  const { messages, pushMessage, updateMessage, resetMessages } = useChat('roadmap');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generationKey, setGenerationKey] = useState(0);
  const [buildMessageId, setBuildMessageId] = useState(null);
  const [promptHistory, setPromptHistory] = useState(readPromptHistory);
  const shellRef = useRef(null);

  useEffect(() => {
    window.localStorage.setItem(GENERATION_COUNTER_KEY, '0');
  }, []);

  const runPrompt = useCallback(async (input) => {
    if (readRemainingGenerations() <= 0) {
      pushMessage({
        role: 'assistant',
        text: 'Session generation limit reached. Refresh the page to reset the 20-generation demo cap.'
      });
      return;
    }

    // Store in history
    setPromptHistory((current) => savePromptHistory(input, current));
    pushMessage({ role: 'user', text: input });
    setGenerating(true);
    let progressMessageId = null;

    try {
      // Check for pre-built roadmap match first
      const prebuilt = detectRoadmapFromPrompt(input);

      if (prebuilt) {
        progressMessageId = pushMessage({
          role: 'assistant',
          text: `Loading ${prebuilt.title} roadmap…`
        });
        await delay(300);
        updateMessage(progressMessageId, { text: `Building your ${prebuilt.title} learning path…` });

        // Small delay so user sees the message before animation starts
        await delay(400);

        hydrate(prebuilt, {
          mode: 'template',
          provider: 'aristotle-template-library',
          timestamp: new Date().toISOString()
        });

        incrementGenerationCount();
        setSaved(false);
        setGenerationKey((k) => k + 1);
        setBuildMessageId(progressMessageId);
        return;
      }

      // AI generation path
      await delay(200);

      progressMessageId = pushMessage({
        role: 'assistant',
        text: `Reading your profile from ${profile.university}…`
      });

      await delay(250);
      updateMessage(progressMessageId, {
        text: `Factoring in your ${profile.yearsOfExperience} year experience and target companies…`
      });

      await delay(250);
      updateMessage(progressMessageId, {
        text: `Pulling resources for ${inferTargetRole(input, profile)}…`
      });

      await delay(300);
      updateMessage(progressMessageId, {
        text: 'Generating your personalized roadmap…'
      });

      const result = await generateRoadmap(input, profile, ({ message }) => {
        if (message && progressMessageId) {
          updateMessage(progressMessageId, { text: message });
        }
      });

      const nextRoadmap = result.roadmap;
      incrementGenerationCount();

      const liveFailed = result.source !== 'llm';
      const buildMessage = liveFailed
        ? 'Live AI was unavailable, so I used the template library. Building the roadmap canvas now…'
        : `Building your ${nextRoadmap.title || inferTargetRole(input, profile)} path…`;

      updateMessage(progressMessageId, { text: buildMessage });
      setBuildMessageId(progressMessageId);

      await delay(250);
      hydrate(nextRoadmap, {
        mode: 'personalized',
        provider: result.source === 'llm' ? 'openai-gpt-4o-mini' : 'aristotle-template-fallback',
        timestamp: new Date().toISOString()
      });

      setSaved(false);
      setGenerationKey((current) => current + 1);
    } catch (error) {
      const errorText = 'I hit a snag. Try rephrasing your goal — be specific about role and timeline.';
      if (progressMessageId) {
        updateMessage(progressMessageId, { text: errorText });
      } else {
        pushMessage({ role: 'assistant', text: errorText });
      }
      setGenerating(false);
      setBuildMessageId(null);
    }
  }, [profile, pushMessage, updateMessage, hydrate]);

  const handleSubmit = useCallback((input) => runPrompt(input), [runPrompt]);

  const handleBuildStatus = useCallback((status) => {
    if (status?.message && buildMessageId) {
      updateMessage(buildMessageId, { text: status.message });
    }

    if (status?.done) {
      setGenerating(false);
      setBuildMessageId(null);
    }
  }, [buildMessageId, updateMessage]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await roadmapApi.save({
        roadmap: artifact,
        userId: session.user.id || 'guest'
      });
      await refreshCollections();
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveHistory = useCallback((prompt) => {
    setPromptHistory((current) => {
      const next = current.filter((p) => p !== prompt);
      window.localStorage.setItem(PROMPT_HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const promptHistoryFooter = (
    <PromptHistoryChips
      history={promptHistory}
      onSelect={handleSubmit}
      onRemove={handleRemoveHistory}
    />
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <AppShell
        chat={{
          title: 'Aristotle',
          description: 'Ask Aristotle to map your career path.',
          messages,
          suggestions: [
            '🤖 AI Engineer roadmap',
            '⚛️ Frontend Engineer path',
            '🗄️ Full Stack Developer',
          ],
          onSubmit: handleSubmit,
          loading: generating,
          meta,
          footer: promptHistoryFooter,
          secondaryAction: {
            label: 'Reset chat',
            onClick: () => {
              resetMessages();
              setBuildMessageId(null);
              setGenerating(false);
              hydrate(null, {
                mode: 'empty',
                provider: 'aristotle-generator',
                timestamp: new Date().toISOString()
              });
              setSaved(false);
              setGenerationKey((current) => current + 1);
            }
          }
        }}
        artifact={{
          meta,
          fullBleed: true,
          hideHeader: true,
          motionKey: `${artifact?.title || 'empty-roadmap'}-${meta?.timestamp || 'demo'}`
        }}
      >
        <RoadmapVisualization
          roadmap={artifact}
          profile={profile}
          generatedAt={meta?.timestamp}
          generationKey={generationKey}
          onBuildStatus={handleBuildStatus}
          onSave={handleSave}
          onQuickStart={handleSubmit}
          saving={saving}
          saved={saved}
          isGenerating={generating}
        />
      </AppShell>
    </motion.div>
  );
}
