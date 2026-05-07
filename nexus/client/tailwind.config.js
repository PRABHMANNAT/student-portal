/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ingen: {
          bg:'#FBF1E8', bgAlt:'#F5E6D8', orange:'#FF6B35', orangeDk:'#E55525',
          coral:'#FF8C61', ink:'#0E0E0E', graphite:'#1A1A1A', mute:'#6B6760',
          line:'#E8D9C9', lineDk:'#2A2A2A', success:'#16A34A', warn:'#EAB308', danger:'#DC2626',
        },
      },
      fontFamily: {
        display: ['Geist', 'system-ui', 'sans-serif'],
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest:'-0.05em',
        tighter:'-0.04em',
      },
      borderRadius: {
        editorial: '6px',
      },
      transitionTimingFunction: {
        expensive: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        marquee: { '0%':{transform:'translateX(0)'}, '100%':{transform:'translateX(-50%)'} },
        drift: { '0%,100%':{transform:'translate(0,0)'}, '50%':{transform:'translate(-12px,8px)'} },
      },
      animation: {
        marquee:'marquee 40s linear infinite',
        drift:'drift 30s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
