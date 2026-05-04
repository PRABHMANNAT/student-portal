export default function GhostMascot() {
  return (
    <div
      className="ghost-logo"
      aria-hidden="true"
      style={{
        width: 40,
        height: 46,
        margin: '12px auto 8px auto',
        position: 'relative',
        flexShrink: 0,
        animation: 'ghostFloat 2.5s ease-in-out infinite',
        overflow: 'visible'
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #FF3CAC, #784BA0)',
          borderRadius: '20px 20px 0 0',
          filter: 'drop-shadow(0 0 8px rgba(255,60,172,0.5))'
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: -1,
          left: 0,
          right: 0,
          height: 12,
          display: 'flex'
        }}
      >
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #FF3CAC, #784BA0)',
              borderRadius: '0 0 50% 50%'
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          top: 13,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 8
        }}
      >
        {[0, 1].map((item) => (
          <div
            key={item}
            style={{
              width: 9,
              height: 11,
              backgroundColor: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'blink 3.5s ease-in-out infinite'
            }}
          >
            <div
              style={{
                width: 4,
                height: 4,
                backgroundColor: '#1a0030',
                borderRadius: '50%',
                animation: 'eyeLook 5s ease-in-out infinite'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
