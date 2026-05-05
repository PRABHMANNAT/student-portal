import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, FileType, Image, Download, ChevronDown, Check, Loader2 } from 'lucide-react';

const DOWNLOAD_OPTIONS = [
  { id: 'pdf', label: 'Download as PDF', ext: '.pdf', icon: FileText },
  { id: 'docx', label: 'Download as DOCX', ext: '.docx', icon: FileType },
  { id: 'png', label: 'Download as Image', ext: '.png', icon: Image },
];

export default function DownloadDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [downloading, setDownloading] = useState(null); // null | { id, phase }
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const handleSelect = useCallback((option) => {
    setIsOpen(false);
    setDownloading({ id: option.id, phase: 'preparing' });

    setTimeout(() => {
      setDownloading({ id: option.id, phase: 'done' });
    }, 1600);

    setTimeout(() => {
      setDownloading(null);
    }, 3400);
  }, []);

  return (
    <div className="dl-dropdown-wrapper" ref={dropdownRef}>
      <button
        type="button"
        className="fc-toolbar__btn fc-toolbar__btn--icon-only"
        title="Download"
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Download options"
      >
        <Download size={13} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="dl-dropdown"
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.14 }}
          >
            {DOWNLOAD_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  type="button"
                  className="dl-dropdown-item"
                  onClick={() => handleSelect(opt)}
                >
                  <Icon size={14} />
                  <span>{opt.label}</span>
                  <small>{opt.ext}</small>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fake download toast */}
      <AnimatePresence>
        {downloading && (
          <motion.div
            className="dl-toast"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          >
            {downloading.phase === 'preparing' ? (
              <>
                <Loader2 size={14} className="dl-toast-spinner" />
                <span>Preparing your {downloading.id.toUpperCase()}…</span>
              </>
            ) : (
              <>
                <Check size={14} />
                <span>Download started!</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
