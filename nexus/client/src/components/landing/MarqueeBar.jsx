const ITEMS = ['✦ Research-grade intelligence','Built with researchers at the University of Sydney','✦ 4 min average shortlist','94% match accuracy','✦ Verified, not vibed'];

export default function MarqueeBar() {
  return (
    <div className="bg-ingen-ink text-ingen-bg overflow-hidden border-b border-ingen-lineDk">
      <div className="h-0.5 bg-ingen-orange"/>
      <div className="flex animate-marquee whitespace-nowrap py-2 font-mono text-[11px] tracking-[0.15em] uppercase hover:[animation-play-state:paused]">
        {[...ITEMS,...ITEMS,...ITEMS,...ITEMS].map((it,i)=>(<span key={i} className="px-8 shrink-0">{it}</span>))}
      </div>
    </div>
  );
}
