import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';
import { useEffect } from 'react';

export default function Toast({ message, onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className="pe-toast"
          initial={{ opacity: 0, y: 40, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 40, x: '-50%' }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <CheckCircle size={16} className="pe-toast-icon" />
          <span className="pe-toast-text">{message}</span>
          <button type="button" className="pe-toast-close" onClick={onClose}>
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
