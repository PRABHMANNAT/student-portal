export default function HalftoneBg({ from='#FF6B35', to='#FF8C61', dotColor='#FBF1E8', className='' }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute inset-0" style={{background:`radial-gradient(ellipse at 50% 30%, ${from} 0%, ${to} 70%, ${to} 100%)`}}/>
      <svg className="absolute inset-0 w-full h-full animate-drift" aria-hidden="true">
        <defs>
          <pattern id="ht" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" fill={dotColor}/>
          </pattern>
          <radialGradient id="fade" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="black" stopOpacity="0"/>
            <stop offset="60%" stopColor="black" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="black" stopOpacity="1"/>
          </radialGradient>
          <mask id="hm"><rect width="100%" height="100%" fill="url(#fade)"/></mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#ht)" mask="url(#hm)" opacity="0.55"/>
      </svg>
    </div>
  );
}
