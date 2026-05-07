import { motion } from 'framer-motion';
import { Link2, Github, Linkedin, FileCheck, ShieldCheck } from 'lucide-react';

const chip = (delay) => ({ initial:{opacity:0,scale:0.9,y:6}, whileInView:{opacity:1,scale:1,y:0}, viewport:{once:true}, transition:{delay,duration:0.4,ease:[0.22,1,0.36,1]} });

export default function SherlockMockup() {
  return (
    <div className="relative">
      <div className="bg-ingen-ink rounded-xl shadow-[0_30px_60px_-15px_rgba(255,107,53,0.4)] overflow-hidden border border-ingen-lineDk">
        <div className="flex items-center gap-2 px-4 py-3 bg-ingen-graphite border-b border-ingen-lineDk">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56]"/>
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]"/>
          <span className="w-3 h-3 rounded-full bg-[#27c93f]"/>
          <span className="ml-4 font-mono text-xs text-white/60">sherlock.ingen.ai</span>
        </div>
        <div className="p-6 bg-ingen-graphite text-white space-y-5">
          <div className="flex items-center gap-3 bg-black/30 border border-white/10 rounded-lg px-4 py-3">
            <Link2 size={16} className="text-ingen-orange"/>
            <span className="font-mono text-sm text-white/80 truncate">linkedin.com/in/alex-chen</span>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-mono text-xs uppercase tracking-wider text-white/60">Scanning profile...</span>
              <span className="font-mono text-xs text-ingen-orange">100%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div initial={{width:0}} whileInView={{width:'100%'}} viewport={{once:true}} transition={{duration:1.4,ease:[0.22,1,0.36,1]}} className="h-full bg-gradient-to-r from-ingen-orange to-ingen-coral"/>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[{icon:Github,label:'GitHub'},{icon:Linkedin,label:'LinkedIn'},{icon:FileCheck,label:'Projects'},{icon:ShieldCheck,label:'Claims'}].map((c,i)=>(
              <motion.div key={c.label} {...chip(0.4+i*0.08)} className="flex items-center gap-1.5 px-3 py-1.5 bg-ingen-success/15 border border-ingen-success/40 rounded-md">
                <span className="text-ingen-success text-xs">✓</span>
                <c.icon size={12} className="text-white/70"/>
                <span className="font-mono text-[11px] text-white/90">{c.label}</span>
              </motion.div>
            ))}
          </div>
          <motion.div {...chip(0.9)} className="flex items-center gap-4 pt-4 border-t border-white/10">
            <div className="relative w-16 h-16 shrink-0">
              <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,.1)" strokeWidth="4" fill="none"/>
                <motion.circle cx="32" cy="32" r="28" stroke="#16A34A" strokeWidth="4" fill="none" strokeLinecap="round"
                  initial={{strokeDasharray:'0 176'}} whileInView={{strokeDasharray:'160 176'}} viewport={{once:true}} transition={{duration:1.2,delay:0.4}}/>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-display font-black text-xl">91</span>
            </div>
            <div>
              <p className="font-display font-black">Sarah Kim</p>
              <p className="text-xs font-mono text-ingen-success uppercase tracking-wider">✓ Hire-ready match</p>
            </div>
          </motion.div>
        </div>
      </div>
      <motion.div {...chip(1.2)} className="absolute -top-3 -right-3 bg-white border border-ingen-line rounded-md px-3 py-2 shadow-lg">
        <p className="font-mono text-[10px] uppercase tracking-wider text-ingen-mute">Verdict in</p>
        <p className="font-display font-black text-sm text-ingen-ink">4.2 sec</p>
      </motion.div>
      <motion.div {...chip(1.4)} className="absolute -bottom-4 -left-4 bg-ingen-ink text-white rounded-md px-3 py-2 shadow-lg">
        <p className="font-mono text-[10px] uppercase tracking-wider text-white/60">Cross-checked</p>
        <p className="font-display font-black text-sm">17 sources</p>
      </motion.div>
    </div>
  );
}
