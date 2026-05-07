import { motion } from 'framer-motion';

const LOGOS = ['LinkedIn','GitHub','Greenhouse','Lever','Ashby','Workday','Outlook','Gmail','Slack','Notion','Chrome','Zapier'];

export default function IntegrationsGrid() {
  const cells = Array.from({ length: 24 }, (_, i) => i);
  const HEADLINE_START = 8;
  const headlineCells = [HEADLINE_START, HEADLINE_START+1, HEADLINE_START+6, HEADLINE_START+7];
  const logoCells = cells.filter(i => !headlineCells.includes(i));
  const logoMap = {};
  logoCells.slice(0, 12).forEach((idx, i) => { logoMap[idx] = LOGOS[i]; });

  return (
    <section className="relative bg-ingen-bg">
      <div className="max-w-[1400px] mx-auto px-8 py-32">
        <div className="flex items-center gap-3 mb-14">
          <span className="font-mono text-xs tracking-[0.18em] uppercase text-ingen-mute">[03] Integrations</span>
          <span className="h-px flex-1 bg-ingen-line"/>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-0 border-t border-l border-ingen-line">
          {cells.map(i => {
            if (i === HEADLINE_START) return (
              <motion.div key={i}
                initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}
                className="col-span-2 row-span-2 border-r border-b border-ingen-line p-8 md:p-10 flex flex-col justify-center bg-ingen-bgAlt aspect-square">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ingen-mute mb-3">[ ATS · CRM · Email ]</p>
                <h3 className="font-display font-black text-3xl md:text-5xl tracking-tighter leading-[0.95]">Plugs into your stack.</h3>
              </motion.div>
            );
            if (headlineCells.includes(i)) return null;
            const logo = logoMap[i];
            return (
              <motion.div key={i}
                initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}
                transition={{delay: (i % 6) * 0.05 + Math.floor(i / 6) * 0.04}}
                className={`border-r border-b border-ingen-line aspect-square flex items-center justify-center group cursor-pointer transition-colors ${logo ? 'bg-white hover:bg-ingen-orange/5' : 'diamond-grid'}`}>
                {logo && <span className="font-display font-black text-base text-ingen-ink/70 group-hover:text-ingen-orange transition-colors">{logo}</span>}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
