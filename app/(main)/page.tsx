import {
  CtaRankMatters,
  FeaturedMovement,
  HallOfFameStrip,
  Hero,
  StatsPanel,
  TickerStrip,
} from "@/components/panels";
import { PodiumStack, RankingsPanel } from "@/components/rankings";
import { Reveal } from "@/components/ui";

export default function HomePage() {
  return (
    <div className="space-y-5">
      <TickerStrip />

      {/* comp layout: hero + rail; rankings + rail remainders; hall strip full width */}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* LEFT */}
        <div className="min-w-0 space-y-5">
          <Hero />
          <Reveal>
            <RankingsPanel rows={10} />
          </Reveal>
        </div>

        {/* RIGHT rail */}
        <aside className="min-w-0 space-y-5">
          <PodiumStack />
          <StatsPanel />
          <FeaturedMovement />
          <CtaRankMatters />
        </aside>
      </div>

      <Reveal>
        <HallOfFameStrip />
      </Reveal>
    </div>
  );
}
