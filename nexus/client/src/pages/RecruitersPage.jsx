import MarqueeBar from '@/components/landing/MarqueeBar';
import Nav from '@/components/landing/Nav';
import Hero from '@/components/landing/Hero';
import AgentTabs from '@/components/landing/AgentTabs';
import DeploySection from '@/components/landing/DeploySection';
import StatsStrip from '@/components/landing/StatsStrip';
import IntegrationsGrid from '@/components/landing/IntegrationsGrid';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';

export default function RecruitersPage() {
  return (
    <main className="min-h-screen bg-ingen-bg text-ingen-ink font-sans overflow-x-hidden">
      <MarqueeBar /><Nav /><Hero />
      <section className="border-y border-ingen-line bg-ingen-bg">
        <div className="max-w-[1400px] mx-auto px-8 py-10 flex flex-wrap items-center justify-between gap-6">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-ingen-mute">Built with researchers at the University of Sydney</p>
          <div className="flex items-center gap-8 font-mono text-xs uppercase tracking-[0.15em] text-ingen-ink/60">
            <span>✦ Verified, not vibed</span>
            <span>✦ Research-grade</span>
            <span>✦ Live in 2026</span>
          </div>
        </div>
      </section>
      <AgentTabs />
      <DeploySection /><StatsStrip /><IntegrationsGrid /><FinalCTA /><Footer />
    </main>
  );
}
