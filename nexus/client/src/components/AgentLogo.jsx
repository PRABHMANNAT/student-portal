const AGENT_THEMES = {
  aristotle: {
    dotColor: '#00C9A7',
    dotColorAlt: '#00A896',
    eyeColor: '#003D36',
    bgColor: 'rgba(0,201,167,0.08)',
    glowColor: 'rgba(0,201,167,0.35)'
  },
  athena: {
    dotColor: '#8B5CF6',
    dotColorAlt: '#6D28D9',
    eyeColor: '#2D1B69',
    bgColor: 'rgba(139,92,246,0.08)',
    glowColor: 'rgba(139,92,246,0.35)'
  },
  columbus: {
    dotColor: '#FF6B35',
    dotColorAlt: '#E85D04',
    eyeColor: '#4A1A00',
    bgColor: 'rgba(255,107,53,0.08)',
    glowColor: 'rgba(255,107,53,0.35)'
  }
};

export default function AgentLogo({ agent = 'aristotle', size = 80, status, className = '' }) {
  const theme = AGENT_THEMES[agent] || AGENT_THEMES.aristotle;
  const dots = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * 2 * Math.PI;
    const radius = size * 0.36;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const dotSize = size * 0.085;
    const color = i % 2 === 0 ? theme.dotColor : theme.dotColorAlt;

    return { x, y, dotSize, color };
  });
  const eyeWidth = size * 0.1;
  const eyeHeight = size * 0.14;

  return (
    <div
      className={`agent-wrapper ${className}`.trim()}
      style={{
        '--agent-size': `${size}px`,
        '--glow': theme.glowColor,
        '--agent-bg': theme.bgColor,
        width: `${size}px`,
        height: `${size}px`
      }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes agentSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.08); }
        }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0px 0px var(--glow); }
          50% { box-shadow: 0 0 18px 6px var(--glow); }
        }

        @keyframes statusRipple {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        .agent-wrapper {
          position: relative;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: var(--agent-bg);
          animation: pulseGlow 3s ease-in-out infinite;
          flex: 0 0 auto;
        }

        .agent-ring {
          position: absolute;
          inset: 0;
          animation: agentSpin 12s linear infinite;
        }

        .agent-dot {
          position: absolute;
          border-radius: 35%;
        }

        .agent-face {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .agent-eye {
          display: block;
          border-radius: 40%;
          transform-origin: center;
          animation: blink 4s ease-in-out infinite;
        }

        .agent-status {
          position: absolute;
          right: 4%;
          bottom: 4%;
          z-index: 10;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22C55E;
          border: 1px solid rgba(255, 255, 255, 0.9);
        }

        .agent-status::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: #22C55E;
          animation: statusRipple 1.5s ease-out infinite;
          z-index: -1;
        }
      `}</style>

      <div className="agent-ring">
        {dots.map((dot, index) => (
          <div
            key={index}
            className="agent-dot"
            style={{
              width: dot.dotSize,
              height: dot.dotSize,
              backgroundColor: dot.color,
              left: `calc(50% + ${dot.x}px - ${dot.dotSize / 2}px)`,
              top: `calc(50% + ${dot.y}px - ${dot.dotSize / 2}px)`
            }}
          />
        ))}

      </div>

      <div className="agent-face" style={{ gap: `${size * 0.12}px` }}>
        <span
          className="agent-eye"
          style={{
            width: `${eyeWidth}px`,
            height: `${eyeHeight}px`,
            backgroundColor: theme.eyeColor
          }}
        />
        <span
          className="agent-eye"
          style={{
            width: `${eyeWidth}px`,
            height: `${eyeHeight}px`,
            backgroundColor: theme.eyeColor
          }}
        />
      </div>

      {status === 'online' ? <span className="agent-status" /> : null}
    </div>
  );
}
