import { motion, AnimatePresence } from 'framer-motion';
import { Camera, BadgeCheck, MapPin, GraduationCap, Briefcase, Star } from 'lucide-react';
import { useRef } from 'react';
import SkillChip from './SkillChip';

export default function CandidateHeroCard({ profile, avatarUrl, onAvatarChange, isGenerating, highlightedSkills }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onAvatarChange(url);
    }
  };

  return (
    <motion.section
      className={`pe-hero-card ${isGenerating ? 'is-pulsing' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pe-hero-top">
        <div className="pe-avatar-wrapper" onClick={() => fileInputRef.current?.click()}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={profile.name} className="pe-avatar-image" />
          ) : (
            <div className="pe-avatar-placeholder">
              <Camera size={24} />
              <span>Upload photo</span>
            </div>
          )}
          <div className="pe-avatar-overlay">
            <Camera size={16} />
            <span style={{ fontSize: '11px' }}>Upload photo</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>

        <div className="pe-hero-identity">
          <h2 className="pe-hero-name">{profile.name}</h2>

          <div className="pe-hero-meta">
            <span className="pe-hero-meta-item">
              <GraduationCap size={14} />
              {profile.education.degree} · {profile.education.institution}
            </span>
            <span className="pe-hero-meta-item">
              <MapPin size={14} />
              {profile.education.location}
            </span>
            <span className="pe-hero-meta-item">
              <Briefcase size={14} />
              Graduating {profile.education.graduation}
            </span>
          </div>

          <div className="pe-hero-verified">
            <BadgeCheck size={15} className="pe-verified-icon" />
            <span>Verified by <strong>{profile.verifiedBy}</strong></span>
          </div>

          {(profile.targetRole || profile.targetCompany) && (
            <motion.div
              className="pe-target-pill"
              layout
              key={`${profile.targetRole}-${profile.targetCompany}`}
            >
              <Star size={13} />
              <span>{profile.targetRole}{profile.targetCompany ? ` · ${profile.targetCompany}` : ''}</span>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={profile.headline}
          className="pe-hero-headline"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.32 }}
        >
          "{profile.headline}"
        </motion.p>
      </AnimatePresence>

      <div className="pe-hero-verification-line">
        <span>{profile.verificationLine}</span>
      </div>

      <div className="pe-skill-chips-section">
        <p className="pe-section-label">Top skills verified by Aristotle</p>
        <div className="pe-skill-chips">
          <AnimatePresence mode="popLayout">
            {profile.skillTags.map((skill) => (
              <SkillChip
                key={skill.label}
                label={skill.label}
                type={skill.type}
                confidence={skill.confidence}
                isHighlighted={highlightedSkills?.includes(skill.label)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}
