const COLS = [
  { title:'Product', links:['Sherlock','Aristotle','Columbus','Pricing','Chrome Extension'] },
  { title:'Resources', links:['Docs','Help Center','Research Papers','Changelog'] },
  { title:'Company', links:['About','Blog','Careers','Customers'] },
  { title:'Legal', links:['Privacy','Terms','Trust','Status'] },
];

export default function Footer() {
  return (
    <footer className="bg-ingen-bg border-t border-ingen-line">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 pt-20 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-20">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-ingen-orange text-2xl">✷</span>
              <span className="font-display font-black text-xl tracking-tightest">iNGEN</span>
            </div>
            <p className="text-sm text-ingen-mute">Research-grade AI hiring. Built at the University of Sydney.</p>
          </div>
          {COLS.map(c=>(
            <div key={c.title}>
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ingen-mute mb-4">{c.title}</p>
              <ul className="space-y-2">
                {c.links.map(l=><li key={l}><a href="#" className="text-sm hover:text-ingen-orange transition-colors">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-ingen-line pt-12 pb-4 overflow-hidden">
          <p className="font-display font-black tracking-tightest leading-none text-center select-none"
             style={{fontSize:'clamp(80px, 16vw, 240px)', color:'transparent', WebkitTextStroke:'1.5px #E8D9C9'}}>
            iNGEN
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-ingen-line gap-4">
          <p className="font-mono text-xs text-ingen-mute">© 2026 iNGEN · University of Sydney</p>
          <div className="flex gap-4 font-mono text-xs">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-ingen-success animate-pulse"/> All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
