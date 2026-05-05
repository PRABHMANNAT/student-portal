import { motion, AnimatePresence } from 'framer-motion';

export default function GenerationOverlay({ isGenerating, currentStep, steps }) {
  return (
    <AnimatePresence>
      {isGenerating && (
        <motion.div
          className="pe-generation-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="pe-generation-content">
            <div className="pe-generation-spinner">
              <div className="pe-generation-ring" />
            </div>

            <div className="pe-generation-badge">
              <span className="pe-generation-dot" />
              Aristotle is editing…
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={currentStep}
                className="pe-generation-step"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {steps[currentStep]?.label || 'Processing…'}
              </motion.p>
            </AnimatePresence>

            <div className="pe-generation-progress">
              {steps.map((step, i) => (
                <span
                  key={i}
                  className={`pe-generation-progress-dot ${i <= currentStep ? 'is-active' : ''} ${i === currentStep ? 'is-current' : ''}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
