import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Mail, Github } from 'lucide-react';

const ROWS = [
  { name:'Dean Wiegand', title:'Senior SWE', co:'Acme.xyz', match:100, init:'DW' },
  { name:'Krystal Han', title:'Software Engineer', co:'Stark', match:100, init:'KH' },
  { name:'Wade Walter', title:'SWE III', co:'Acme.xyz', match:90, init:'WW' },
  { name:'Jenna Alvarez', title:'Frontend Engineer', co:'Initech', match:85, init:'JA' },
  { name:'Ethan Chen', title:'Full Stack', co:'Virtucon', match:80, init:'EC', no:true },
];

export default function AristotleMockup() {
  return (
    <div className="relative">
      <div className="bg-white rounded-xl border border-ingen-line shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-ingen-line flex items-center justify-between">
          <p className="font-display font-black">Profiles Ready for Review <span className="text-ingen-mute">(35)</span></p>
          <span className="font-mono text-[10px] uppercase tracking-wider text-ingen-success">● Live</span>
        </div>
        <div className="divide-y divide-ingen-line">
          {ROWS.map((r,i)=>(
            <motion.div key={r.name} initial={{opacity:0,x:-10}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:0.1+i*0.07}} className="group flex items-center gap-3 px-5 py-3 hover:bg-ingen-bg/60 cursor-pointer relative">
              <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-ingen-orange opacity-0 group-hover:opacity-100"/>
              <div className="w-8 h-8 rounded-full bg-ingen-bgAlt flex items-center justify-center font-mono text-[10px] font-semibold text-ingen-ink">{r.init}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{r.name}</p>
                <p className="text-xs text-ingen-mute truncate">{r.title} · {r.co}</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-ingen-mute">
                <Mail size={12}/><Github size={12}/>
              </div>
              <span className={`font-mono text-xs font-semibold ${r.match===100?'text-ingen-success':r.match>=85?'text-ingen-ink':'text-ingen-mute'}`}>{r.match}%</span>
              <div className="hidden sm:flex items-center gap-1">
                <ThumbsUp size={14} className="text-ingen-mute hover:text-ingen-success"/>
                {r.no ? <span className="text-ingen-danger text-sm">⊘</span> : <ThumbsDown size={14} className="text-ingen-mute hover:text-ingen-danger"/>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <motion.div initial={{opacity:0,scale:0.9}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:0.6}} className="absolute -top-4 -right-2 bg-ingen-success/95 text-white rounded-md px-3 py-2 shadow-lg">
        <p className="font-mono text-[10px] uppercase tracking-wider opacity-80">Software engineer agent</p>
        <p className="font-display font-black text-sm">35 ready for review</p>
      </motion.div>
      <motion.div initial={{opacity:0,scale:0.9}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:0.9}} className="absolute -bottom-5 -left-4 bg-white border border-ingen-line rounded-md px-3 py-2 shadow-lg">
        <p className="font-mono text-[10px] uppercase tracking-wider text-ingen-mute">Learning curve</p>
        <p className="font-display font-black text-sm text-ingen-ink">+12% accuracy this week</p>
      </motion.div>
    </div>
  );
}
