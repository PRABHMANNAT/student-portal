import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > lastY && y > 200);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 transition-colors duration-300 border-t-2 border-ingen-orange ${scrolled ? 'bg-ingen-bg/90 backdrop-blur-md border-b border-ingen-line' : 'bg-transparent'}`}>
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 h-20 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2" aria-label="iNGEN home">
          <span className="text-ingen-orange text-2xl leading-none">✷</span>
          <span className="font-display font-black text-xl tracking-tightest">iNGEN</span>
        </a>
        <div className="hidden md:flex items-center gap-1 bg-ingen-bgAlt rounded-full p-1 border border-ingen-line">
          <a href="/recruiters" className="px-5 py-2 rounded-full bg-ingen-orange text-white text-sm font-medium">For Recruiters</a>
          <a href="/students" className="px-5 py-2 rounded-full text-ingen-ink/70 text-sm font-medium hover:text-ingen-ink">For Students</a>
        </div>
        <div className="flex items-center gap-3">
          <a href="/login" className="hidden md:inline-block text-sm font-mono uppercase tracking-wider hover:text-ingen-orange">Sign In</a>
          <a href="/demo" className="hidden lg:inline-block text-sm font-mono uppercase tracking-wider hover:text-ingen-orange">Book a Demo</a>
          <a href="/signup" className="px-5 py-2.5 bg-ingen-ink text-white text-sm font-medium rounded-md hover:bg-ingen-orange transition-colors">Get Started →</a>
        </div>
      </div>
    </motion.header>
  );
}
