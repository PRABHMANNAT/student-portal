import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SherlockMockup from './SherlockMockup';
import AristotleMockup from './AristotleMockup';
import ColumbusMockup from './ColumbusMockup';
import MagneticButton from './MagneticButton';
import Reveal from './Reveal';

const TABS = [
  { id:'sherlock', label:'Sherlock', sub:'Verification', bg:'bg-ingen-orange', tint:'text-ingen-ink',
    headline:'One URL. Every signal. Verified.', body:'Drop a LinkedIn or GitHub. Sherlock cross-references claims against 17+ public sources, scores fit against your role, and flags inconsistencies before you open a calendar.', cta:'Run Sherlock', mockup:SherlockMockup },
  { id:'aristotle', label:'Aristotle', sub:'Shortlist', bg:'bg-ingen-ink', tint:'text-white',
    headline:'Let Aristotle handle the shortlist.', body:'Post your role. Aristotle surfaces pre-verified students matched to your exact requirements. Learns your hiring bar from every thumbs up. No noise.', cta:'Build my shortlist', mockup:AristotleMockup },
  { id:'columbus', label:'Columbus', sub:'Discovery', bg:'bg-[#0F4C5C]', tint:'text-white',
    headline:'Discover talent you didn’t know existed.', body:'Columbus searches across 30+ data sources, surfacing candidates outside your network. Auto-runs personalized outreach with reply tracking.', cta:'Try Columbus', mockup:ColumbusMockup },
];

export default function AgentTabs() {
  const [active, setActive] = useState('sherlock');
  const tab = TABS.find(t=>t.id===active);
  const Mock = tab.mockup;
  return (
    <section className="relative border-t border-b border-ingen-line">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 pt-20 pb-8">
        <Reveal className="flex items-center gap-3 mb-4">
          <span className="font-mono text-xs tracking-[0.18em] uppercase text-ingen-mute">[01] Features</span>
          <span className="h-px flex-1 bg-ingen-line"/>
        </Reveal>
        <Reveal delay={0.15}>
          <h2 className="font-display font-black text-6xl md:text-8xl tracking-tighter leading-[0.95] max-w-4xl">How it works: Humans <span className="text-ingen-orange">+</span> Agents.</h2>
        </Reveal>
      </div>

      <div className="border-t border-ingen-line overflow-x-auto">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 flex gap-1 min-w-max md:min-w-0 snap-x">
          {TABS.map(t => (
            <button key={t.id} onClick={()=>setActive(t.id)} className="relative snap-start px-6 py-5 font-mono text-xs uppercase tracking-[0.15em] text-ingen-mute hover:text-ingen-ink transition-colors">
              <span className={active===t.id?'text-ingen-ink':''}>◇ {t.label} <span className="opacity-50">/ {t.sub}</span></span>
              {active===t.id && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-ingen-orange"/>}
            </button>
          ))}
        </div>
      </div>

      <div className={`relative ${tab.bg} transition-colors duration-500`}>
        <div className="absolute inset-0 diamond-grid-dark pointer-events-none"/>
        <div className="relative max-w-[1400px] mx-auto px-5 md:px-8 py-32 grid lg:grid-cols-2 gap-16 items-center min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div key={active+'-mock'} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:20}} transition={{duration:0.4}}>
              <Mock />
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div key={active+'-text'} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} transition={{duration:0.4}} className={tab.tint}>
              <span className="inline-block px-3 py-1 mb-6 bg-white/15 border border-white/30 rounded font-mono text-[11px] uppercase tracking-[0.15em]">{tab.sub}</span>
              <h3 className="font-display font-black text-4xl md:text-6xl tracking-tighter leading-[0.95] mb-6">{tab.headline}</h3>
              <p className="text-lg opacity-90 max-w-md mb-8">{tab.body}</p>
              <div className="flex flex-wrap gap-3">
                <MagneticButton href="#" className="px-6 py-3 bg-white text-ingen-ink font-medium rounded-md hover:bg-ingen-bg transition-colors">{tab.cta} →</MagneticButton>
                <MagneticButton href="#" className="px-6 py-3 border border-current font-medium rounded-md opacity-80 hover:opacity-100 transition-opacity">Book demo</MagneticButton>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
