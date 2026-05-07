import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import HalftoneBg from './HalftoneBg';
import SherlockMockup from './SherlockMockup';
import MagneticButton from './MagneticButton';

const up = (i=0) => ({ initial:{opacity:0,y:24}, animate:{opacity:1,y:0}, transition:{delay:0.1+i*0.08,duration:0.7,ease:[0.22,1,0.36,1]} });

export default function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-300, 300], [6, -6]), { stiffness: 150, damping: 20 });
  const ry = useSpring(useTransform(mx, [-300, 300], [-6, 6]), { stiffness: 150, damping: 20 });

  return (
    <section className="relative overflow-hidden grain">
      <HalftoneBg />
      <div className="absolute inset-y-0 left-4 w-px edge-dotted opacity-70 hidden md:block"/>
      <div className="absolute inset-y-0 right-4 w-px edge-dotted opacity-70 hidden md:block"/>
      <div className="relative max-w-[1400px] mx-auto px-5 md:px-8 pt-20 pb-28 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <h1 className="font-display font-black text-white tracking-tightest leading-[0.92]" style={{fontSize:'clamp(48px, 7vw, 112px)'}}>
            {['You don’t need', 'more applicants.', 'You need Sherlock.'].map((line, i) => (
              <motion.span
                key={line}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={`block ${i === 2 ? 'text-ingen-ink' : ''}`}>
                {line}
              </motion.span>
            ))}
          </h1>
          <motion.p {...up(4)} className="mt-8 max-w-xl text-lg text-white/90 leading-relaxed">
            Drop a candidate&apos;s LinkedIn or GitHub. Sherlock scans the web, verifies their work, and scores their fit against your role - before you waste a single call.
          </motion.p>
          <motion.div {...up(5)} className="mt-10 flex flex-wrap gap-3">
            <MagneticButton href="/sherlock" className="px-6 py-3.5 bg-ingen-ink text-white font-medium rounded-md hover:bg-white hover:text-ingen-ink transition-colors">Run Sherlock free →</MagneticButton>
            <MagneticButton href="/demo" className="px-6 py-3.5 bg-transparent text-white border border-white/60 font-medium rounded-md hover:bg-white hover:text-ingen-ink transition-colors">Book a demo</MagneticButton>
          </motion.div>
        </div>
        <motion.div
          {...up(6)}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            mx.set(e.clientX - r.left - r.width/2);
            my.set(e.clientY - r.top - r.height/2);
          }}
          onMouseLeave={() => { mx.set(0); my.set(0); }}
          style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d', perspective: 1000 }}
          className="lg:col-span-5 lg:pt-12">
          <SherlockMockup />
        </motion.div>
      </div>
    </section>
  );
}
