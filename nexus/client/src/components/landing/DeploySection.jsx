import { motion } from 'framer-motion';
import { Search, GraduationCap, Send } from 'lucide-react';
import Reveal from './Reveal';

const FEATURES = [
  { tag:'AI VERIFICATION', title:'Search on autopilot.', body:'Sherlock validates every claim against public sources. No more resume fiction.', icon:Search },
  { tag:'AGENTIC LEARNING', title:'Sharper with every hire.', body:'Aristotle learns your hiring bar from feedback. Refines matches with greater precision.', icon:GraduationCap },
  { tag:'AUTOMATED OUTREACH', title:'Outreach that doesn’t feel automated.', body:'Columbus runs personalized multi-step sequences with full reply tracking.', icon:Send },
];

export default function DeploySection() {
  return (
    <section className="relative bg-ingen-graphite text-white overflow-hidden">
      <div className="absolute inset-0 diamond-grid-dark pointer-events-none"/>
      <div className="relative max-w-[1400px] mx-auto px-5 md:px-8 py-28">
        <Reveal className="flex items-center gap-3 mb-4">
          <span className="font-mono text-xs tracking-[0.18em] uppercase text-white/40">[02] Agents</span>
          <span className="h-px flex-1 bg-white/10"/>
        </Reveal>
        <Reveal delay={0.15}>
          <h2 className="font-display font-black text-6xl md:text-8xl tracking-tighter leading-[0.95] max-w-5xl mb-20">Deploy AI agents for every desk.</h2>
        </Reveal>

        <div className="relative max-w-3xl mx-auto h-[420px] mb-24">
          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 bg-white text-ingen-ink rounded-xl border border-ingen-line p-4 w-64 shadow-xl">
            <p className="font-mono text-[10px] uppercase tracking-wider text-ingen-mute mb-1">Candidate profile</p>
            <p className="font-display font-black">Tonya Rempel</p>
            <p className="text-xs text-ingen-mute mb-3">Senior Data Analyst · Garner</p>
            <div className="flex gap-1">
              <span className="px-1.5 py-0.5 bg-ingen-success/15 text-ingen-success rounded text-[10px] font-mono">✓ Verified</span>
              <span className="px-1.5 py-0.5 bg-ingen-orange/15 text-ingen-orange rounded text-[10px] font-mono">91% fit</span>
            </div>
          </div>
          {[
            { label:'Sherlock', sub:'Verifying claims', pos:'top-0 left-0', color:'bg-ingen-orange' },
            { label:'Aristotle', sub:'Scoring against role', pos:'top-0 right-0', color:'bg-ingen-success' },
            { label:'Columbus', sub:'Sourcing similar', pos:'bottom-0 left-1/2 -translate-x-1/2', color:'bg-[#0F4C5C]' },
          ].map((a,i)=>(
            <motion.div key={a.label} initial={{opacity:0,scale:0.8}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:0.3+i*0.15}}
              className={`absolute z-20 ${a.pos} ${a.color} rounded-md px-3 py-2 shadow-lg`}>
              <p className="font-display font-black text-sm">{a.label}</p>
              <p className="font-mono text-[10px] uppercase tracking-wider opacity-80">{a.sub}</p>
            </motion.div>
          ))}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
            <line x1="15%" y1="15%" x2="50%" y2="50%" stroke="rgba(255,255,255,.2)" strokeDasharray="4 4"/>
            <line x1="85%" y1="15%" x2="50%" y2="50%" stroke="rgba(255,255,255,.2)" strokeDasharray="4 4"/>
            <line x1="50%" y1="85%" x2="50%" y2="50%" stroke="rgba(255,255,255,.2)" strokeDasharray="4 4"/>
          </svg>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-lg overflow-hidden">
          {FEATURES.map((f)=>(
            <div key={f.tag} className="bg-ingen-graphite p-8">
              <span className="inline-block mb-6 font-mono text-[11px] tracking-[0.15em] uppercase text-ingen-orange">{f.tag}</span>
              <f.icon size={20} className="text-white/40 mb-4"/>
              <h3 className="font-display font-black text-2xl tracking-tighter mb-3">{f.title}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
