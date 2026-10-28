import { TrendingUp, TrendingDown } from "lucide-react";
import PageHead from "@/components/PageHead";
import { RankRowView } from "@/components/rankings";
import { FeaturedMovement } from "@/components/panels";
import { RANK_TABLE } from "@/lib/mockData";
import { Reveal, SectionHead } from "@/components/ui";

export default function MovementsPage() {
  const nullsLast = (v: number | null) => (v == null ? -Infinity : v);
  const nullsSinkDesc = (v: number | null) => (v == null ? Infinity : v);
  const rising = [...RANK_TABLE].sort((a, b) => nullsLast(b.delta) - nullsLast(a.delta)).slice(0, 10);
  const falling = [...RANK_TABLE].sort((a, b) => nullsSinkDesc(a.delta) - nullsSinkDesc(b.delta)).slice(0, 10);

  return (
    <div>
      <PageHead
        eyebrow="OFFICIAL BOARD MOVEMENT · THIS CYCLE"
        title="Movements"
        lead="Every rise and fall across the roster, derived from the official board's own published previous ranks — who is charging up the board and who is slipping into the static."
      />

      <Reveal className="mt-6">
        <div className="max-w-md">
          <FeaturedMovement />
        </div>
      </Reveal>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Reveal>
          <section className="panel p-5">
            <SectionHead
              icon={<TrendingUp size={15} className="text-rise" />}
              title="ALL RISING"
              sub="Largest upward moves this week"
            />
            <div className="mt-4 space-y-2">
              {rising.map((r, i) => (
                <RankRowView key={`up-${r.rank}`} row={r} index={i} />
              ))}
            </div>
          </section>
        </Reveal>
        <Reveal delay={80}>
          <section className="panel p-5">
            <SectionHead
              icon={<TrendingDown size={15} className="text-fall" />}
              title="ALL FALLING"
              sub="Largest downward moves this week"
            />
            <div className="mt-4 space-y-2">
              {falling.map((r, i) => (
                <RankRowView key={`dn-${r.rank}-${r.name}`} row={r} index={i} />
              ))}
            </div>
          </section>
        </Reveal>
      </div>
      <p className="mt-4 text-[11.5px] text-neutral-600">
        Movement figures come from the official board&apos;s published previous ranks (imported snapshot). The source
        publishes no day-by-day history, so no trend lines are drawn here — movement is shown per cycle only.
      </p>
    </div>
  );
}
