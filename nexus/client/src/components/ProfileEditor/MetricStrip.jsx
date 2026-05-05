import { motion } from 'framer-motion';

export default function MetricStrip({ metrics }) {
  const toneMap = {
    purple: { bg: '#F1E8FF', color: '#8B5CF6', border: '#E4D4FB' },
    mint: { bg: '#D5FAF1', color: '#16C7B7', border: '#BFF3EB' },
    orange: { bg: '#FFF0E0', color: '#F29E64', border: '#FFE0C4' },
    green: { bg: '#D4F8E8', color: '#2ECC71', border: '#B8F0D8' },
  };

  return (
    <div className="pe-metric-strip">
      {metrics.map((metric, index) => {
        const palette = toneMap[metric.tone] || toneMap.mint;

        return (
          <motion.div
            key={metric.label}
            className="pe-metric-pill"
            style={{
              '--metric-bg': palette.bg,
              '--metric-color': palette.color,
              '--metric-border': palette.border,
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="pe-metric-value">{metric.value}</span>
            <span className="pe-metric-label">{metric.label}</span>
          </motion.div>
        );
      })}
    </div>
  );
}
