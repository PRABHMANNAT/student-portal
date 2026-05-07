import HalftoneBg from './HalftoneBg';
import MagneticButton from './MagneticButton';

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden">
      <HalftoneBg from="#0E0E0E" to="#1A1A1A" dotColor="#FF6B35"/>
      <div className="relative max-w-[1400px] mx-auto px-5 md:px-8 py-32 text-center">
        <span className="inline-block mb-8 font-mono text-xs tracking-[0.18em] uppercase text-ingen-orange">[ Ready when you are ]</span>
        <h2 className="font-display font-black text-white tracking-tightest leading-[0.92]" style={{fontSize:'clamp(48px, 8vw, 128px)'}}>
          The future of hiring<br/>starts with <span className="text-ingen-orange">iNGEN</span>.
        </h2>
        <p className="mt-8 max-w-xl mx-auto text-white/80 text-lg">Three agents. Verified candidates. Zero wasted calls.</p>
        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          <MagneticButton href="/signup" className="px-8 py-4 bg-ingen-orange text-white font-medium rounded-md hover:bg-white hover:text-ingen-ink transition-colors">Get Started Free →</MagneticButton>
          <MagneticButton href="/demo" className="px-8 py-4 border border-white/40 text-white font-medium rounded-md hover:bg-white hover:text-ingen-ink transition-colors">Book a demo</MagneticButton>
        </div>
      </div>
    </section>
  );
}
