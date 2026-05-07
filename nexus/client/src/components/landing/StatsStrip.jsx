import { useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

function CountUp({ to, suffix = '', duration = 1.6 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, v => Math.floor(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsub = rounded.on('change', v => setDisplay(v));
    return () => unsub();
  }, [rounded]);

  useEffect(() => {
    if (inView) {
      const c = animate(mv, to, { duration, ease: [0.22, 1, 0.36, 1] });
      return () => c.stop();
    }
    return undefined;
  }, [inView, to, duration, mv]);

  return <span ref={ref}>{display}{suffix}</span>;
}

export default function StatsStrip() {
  return (
    <section className="border-y border-ingen-line bg-ingen-bg dot-grid">
      <div className="max-w-[1400px] mx-auto px-8 py-24 grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ingen-line">
        <div className="py-10 md:py-0 md:px-10">
          <p className="font-display font-black text-7xl md:text-8xl tracking-tighter leading-none">
            <CountUp to={4} /> <span className="text-ingen-mute font-light">min</span>
          </p>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-ingen-mute">Average time to shortlist</p>
        </div>
        <div className="py-10 md:py-0 md:px-10">
          <p className="font-display font-black text-7xl md:text-8xl tracking-tighter leading-none">
            <CountUp to={94} suffix="%" />
          </p>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-ingen-mute">Match accuracy rate</p>
        </div>
        <div className="py-10 md:py-0 md:px-10">
          <p className="font-display font-black text-7xl md:text-8xl tracking-tighter leading-none text-ingen-orange">0</p>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-ingen-mute">Cold calls wasted on unfit candidates</p>
        </div>
      </div>
    </section>
  );
}
