import { motion } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function VideoPitchCard({ videoPitch, isGenerating }) {
  const [showOverlay, setShowOverlay] = useState(false);

  if (!videoPitch?.enabled) return null;

  return (
    <motion.div
      className={`pe-video-card ${isGenerating ? 'is-pulsing' : ''}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pe-video-inner" onClick={() => setShowOverlay(!showOverlay)}>
        {showOverlay ? (
          <motion.div
            className="pe-video-overlay-mock"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="pe-video-overlay-text">Mock video pitch preview</span>
            <button
              type="button"
              className="pe-video-close-btn"
              onClick={(e) => { e.stopPropagation(); setShowOverlay(false); }}
            >
              Close
            </button>
          </motion.div>
        ) : (
          <>
            <div className="pe-video-play-area">
              {videoPitch.videoUrl ? (
                <video src={videoPitch.videoUrl} autoPlay muted loop playsInline style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', borderRadius: '12px'}} />
              ) : (
                <div className="pe-video-play-btn">
                  <Play size={28} fill="#fff" />
                </div>
              )}
            </div>

            <div className="pe-video-info">
              <h4 className="pe-video-label">{videoPitch.thumbnailLabel}</h4>
              <p className="pe-video-quote">"{videoPitch.quote}"</p>
              <span className="pe-video-duration">{videoPitch.duration}</span>
            </div>
          </>
        )}
      </div>

      <div className="pe-video-nav">
        <button type="button" className="pe-video-nav-btn" aria-label="Previous">
          <ChevronLeft size={16} />
        </button>
        <button type="button" className="pe-video-nav-btn" aria-label="Next">
          <ChevronRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}
