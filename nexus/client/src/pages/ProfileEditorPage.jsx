import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Bookmark,
  Briefcase,
  FileText,
  Map,
} from 'lucide-react';

import ingenLogo from '../assets/ingen-logo.png';
import { useApp } from '../context/AppContext';
import UserAvatar from '../components/UserAvatar';
import ProfileAssistantPanel from '../components/ProfileEditor/ProfileAssistantPanel';
import ProfileCanvas from '../components/ProfileEditor/ProfileCanvas';
import Toast from '../components/ProfileEditor/Toast';
import mockData from '../data/profileEditorMockData.json';

const NAV_ITEMS = [
  { to: '/roadmap', icon: Map, label: 'Roadmap', accent: '#FF6B35' },
  { to: '/jobs', icon: Briefcase, label: 'Jobs', accent: '#3B82F6' },
  { to: '/notes', icon: FileText, label: 'Edit Profile', accent: '#8B5CF6' },
  { to: '/collections', icon: Bookmark, label: 'Collections', accent: '#F59E0B' },
];

function detectTransformation(input) {
  const lower = input.toLowerCase();
  if (lower.includes('ibm') || lower.includes('sde 1') || lower.includes('sde1')) {
    return 'ibm-sde1';
  }
  if (lower.includes('frontend') || lower.includes('react')) {
    return 'frontend-only';
  }
  if (lower.includes('backend') || lower.includes('api') || lower.includes('python') || lower.includes('sql')) {
    return 'backend-only';
  }
  return 'graduate-shortlist';
}

export default function ProfileEditorPage() {
  const { session, setAuthOpen } = useApp();
  const [profile, setProfile] = useState(mockData.defaultProfile);
  const [avatarUrl, setAvatarUrl] = useState('/veer-profile.png');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedSkills, setHighlightedSkills] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const generatingRef = useRef(false);

  const runGeneration = useCallback(async (input) => {
    if (generatingRef.current) return;
    generatingRef.current = true;

    const transformKey = detectTransformation(input);
    const transformation = mockData.mockTransformations[transformKey];
    if (!transformation) {
      generatingRef.current = false;
      return;
    }

    setIsGenerating(true);
    setCurrentStep(0);

    // Cycle through animation steps
    for (let i = 0; i < mockData.animationStates.length; i++) {
      setCurrentStep(i);
      await new Promise((resolve) =>
        setTimeout(resolve, mockData.animationStates[i].durationMs)
      );
    }

    // Apply transformation
    setProfile((prev) => {
      const next = { ...prev };
      if (transformation.headline) next.headline = transformation.headline;
      if (transformation.targetCompany) next.targetCompany = transformation.targetCompany;
      if (transformation.targetRole) next.targetRole = transformation.targetRole;
      if (transformation.skillTags) next.skillTags = transformation.skillTags;
      if (transformation.roleFitSummary) next.roleFitSummary = transformation.roleFitSummary;
      if (transformation.interviewTalkingPoints) next.interviewTalkingPoints = transformation.interviewTalkingPoints;
      return next;
    });

    // Highlight new skills briefly
    if (transformation.skillTags) {
      setHighlightedSkills(transformation.skillTags.map((s) => s.label));
      setTimeout(() => setHighlightedSkills([]), 2000);
    }

    setIsGenerating(false);
    generatingRef.current = false;
  }, []);

  const handleReset = useCallback(() => {
    setProfile(mockData.defaultProfile);
    setAvatarUrl('');
    setHighlightedSkills([]);
    setToastMessage('');
  }, []);

  const handleExport = useCallback(() => {
    setToastMessage('Mock export ready — profile data copied.');
  }, []);

  const handleSave = useCallback(() => {
    setToastMessage('Saved locally for demo.');
  }, []);

  const currentStepLabel = isGenerating
    ? mockData.animationStates[currentStep]?.label
    : '';

  return (
    <motion.div
      className="pe-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Left vertical nav — mirrors the AppShell nav exactly */}
      <nav className="pe-nav">
        <div className="pe-nav-top">
          <NavLink to="/roadmap" className="shell-logo" aria-label="Go to roadmap">
            <img src={ingenLogo} alt="Ingen" className="shell-logo-image" />
          </NavLink>

          <span className="shell-nav-divider" aria-hidden="true" />

          <div className="shell-nav-stack">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `shell-nav-item ${isActive ? 'is-active' : ''}`
                  }
                  style={{ '--shell-agent-accent': item.accent }}
                  aria-label={item.label}
                >
                  <span className="shell-nav-icon-box">
                    <Icon size={20} strokeWidth={1.9} />
                  </span>
                  <span className="shell-nav-tooltip">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Middle-left assistant panel */}
      <ProfileAssistantPanel
        suggestions={mockData.promptSuggestions}
        onSubmit={runGeneration}
        isGenerating={isGenerating}
        currentStepLabel={currentStepLabel}
      />

      {/* Main canvas — stretches to right edge */}
      <main className="pe-main">
        <ProfileCanvas
          profile={profile}
          avatarUrl={avatarUrl}
          onAvatarChange={setAvatarUrl}
          isGenerating={isGenerating}
          currentStep={currentStep}
          animationSteps={mockData.animationStates}
          highlightedSkills={highlightedSkills}
          onExport={handleExport}
          onSave={handleSave}
          onReset={handleReset}
        />
      </main>

      <Toast
        message={toastMessage}
        onClose={() => setToastMessage('')}
      />
    </motion.div>
  );
}
