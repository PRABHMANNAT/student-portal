import { motion } from 'framer-motion';
import { Download, Save, RotateCcw } from 'lucide-react';

import CandidateHeroCard from './CandidateHeroCard';
import VideoPitchCard from './VideoPitchCard';
import MetricStrip from './MetricStrip';
import ProofCard from './ProofCard';
import EndorsementCard from './EndorsementCard';
import RecruiterInsightsCard from './RecruiterInsightsCard';
import GenerationOverlay from './GenerationOverlay';

export default function ProfileCanvas({
  profile,
  avatarUrl,
  onAvatarChange,
  isGenerating,
  currentStep,
  animationSteps,
  highlightedSkills,
  onExport,
  onSave,
  onReset,
}) {
  return (
    <div className="pe-canvas-wrapper">
      <div className="pe-canvas-header">
        <div className="pe-canvas-header-left">
          <span className="pe-canvas-eyebrow">PROFILE · V1.0 · MOCK</span>
          <span className="pe-canvas-label">Recruiter-ready profile</span>
        </div>
        <div className="pe-canvas-header-actions">
          <button type="button" className="pe-header-btn" onClick={onExport}>
            <Download size={14} />
            <span>EXPORT</span>
          </button>
          <button type="button" className="pe-header-btn" onClick={onSave}>
            <Save size={14} />
            <span>SAVE</span>
          </button>
          <button type="button" className="pe-header-btn pe-header-btn-reset" onClick={onReset}>
            <RotateCcw size={14} />
            <span>RESET</span>
          </button>
        </div>
      </div>

      <div className="pe-canvas-scroll">
        <div className="pe-canvas-content">
          <GenerationOverlay
            isGenerating={isGenerating}
            currentStep={currentStep}
            steps={animationSteps}
          />

          <CandidateHeroCard
            profile={profile}
            avatarUrl={avatarUrl}
            onAvatarChange={onAvatarChange}
            isGenerating={isGenerating}
            highlightedSkills={highlightedSkills}
          />

          <VideoPitchCard
            videoPitch={profile.videoPitch}
            isGenerating={isGenerating}
          />

          <MetricStrip metrics={profile.metrics} />

          <div className="pe-canvas-body">
            <div className="pe-canvas-main">
              <section className="pe-section">
                <h3 className="pe-section-heading">Verified proof</h3>
                <div className="pe-proof-grid">
                  {profile.proofCards.map((card, i) => (
                    <ProofCard key={card.title} card={card} index={i} isGenerating={isGenerating} />
                  ))}
                </div>
              </section>

              <section className="pe-section">
                <h3 className="pe-section-heading">Endorsements</h3>
                <div className="pe-endorsement-grid">
                  {profile.endorsements.map((endorsement, i) => (
                    <EndorsementCard key={endorsement.name} endorsement={endorsement} index={i} />
                  ))}
                </div>
              </section>
            </div>

            <div className="pe-canvas-side">
              <RecruiterInsightsCard
                insights={profile.insights}
                checklist={profile.recruiterChecklist}
                roleFitSummary={profile.roleFitSummary}
                interviewTalkingPoints={profile.interviewTalkingPoints}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
