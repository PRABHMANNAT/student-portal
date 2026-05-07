import { motion } from 'framer-motion';
import { Search, MapPin, Filter } from 'lucide-react';

const CANDIDATES = [
  { name:'Sarah Kim', role:'Backend Engineer', loc:'Sydney', score:96, tag:'good' },
  { name:'Marcus Liu', role:'ML Engineer', loc:'Melbourne', score:92, tag:'good' },
  { name:'Priya Sharma', role:'Data Engineer', loc:'Sydney', score:88, tag:null },
  { name:'James O’Brien', role:'DevOps', loc:'Brisbane', score:74, tag:null },
  { name:'Anika Patel', role:'Frontend', loc:'Perth', score:62, tag:'bad' },
];

export default function ColumbusMockup() {
  return (
    <div className="relative">
      <div className="bg-white rounded-xl border border-ingen-line shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-ingen-line">
          <div className="flex items-center gap-2 mb-3">
            <Search size={14} className="text-ingen-mute"/>
            <span className="font-mono text-xs text-ingen-mute">Discovery query</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2 py-1 bg-ingen-orange/10 border border-ingen-orange/30 rounded text-xs text-ingen-orange font-medium">Software Engineer</span>
            <span className="px-2 py-1 bg-ingen-bgAlt border border-ingen-line rounded text-xs flex items-center gap-1"><MapPin size={10}/> Sydney</span>
            <span className="px-2 py-1 bg-ingen-bgAlt border border-ingen-line rounded text-xs flex items-center gap-1"><Filter size={10}/> +5 filters</span>
          </div>
        </div>
        <div className="px-5 py-3 border-b border-ingen-line flex justify-between items-center">
          <p className="font-display font-black text-sm">Autopilot Results <span className="text-ingen-mute">(428)</span></p>
          <span className="font-mono text-[10px] uppercase tracking-wider text-ingen-mute">30 sources</span>
        </div>
        <div className="divide-y divide-ingen-line">
          {CANDIDATES.map((c,i)=>(
            <motion.div key={c.name} initial={{opacity:0,x:-10}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:0.15+i*0.07}} className="flex items-center gap-3 px-5 py-3">
              <div className="w-8 h-8 rounded-full bg-ingen-bgAlt flex items-center justify-center font-mono text-[10px] font-semibold">{c.name.split(' ').map(s=>s[0]).join('')}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs text-ingen-mute">{c.role} · {c.loc}</p>
              </div>
              <span className="font-mono text-xs font-semibold">{c.score}%</span>
            </motion.div>
          ))}
        </div>
      </div>
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" aria-hidden="true">
        <path d="M 93% 42% C 104% 44%, 102% 45%, 97% 48%" stroke="rgba(255,255,255,.75)" strokeDasharray="4 4" fill="none"/>
        <path d="M 5% 86% C -8% 82%, -8% 78%, 2% 75%" stroke="rgba(255,255,255,.75)" strokeDasharray="4 4" fill="none"/>
      </svg>
      <motion.div initial={{opacity:0,scale:0.9}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:0.6}} className="absolute top-[40%] -right-6 bg-ingen-success/95 text-white rounded-md px-3 py-1.5 shadow-lg">
        <p className="font-mono text-[10px] uppercase tracking-wider">✓ Good match</p>
      </motion.div>
      <motion.div initial={{opacity:0,scale:0.9}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:0.9}} className="absolute bottom-4 -left-6 bg-ingen-danger/95 text-white rounded-md px-3 py-1.5 shadow-lg">
        <p className="font-mono text-[10px] uppercase tracking-wider">⊘ Not a match</p>
      </motion.div>
    </div>
  );
}
