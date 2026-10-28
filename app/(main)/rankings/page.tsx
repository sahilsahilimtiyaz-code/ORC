import { Trophy } from "lucide-react";
import PageHead from "@/components/PageHead";
import { RankingsPanel } from "@/components/rankings";
import { Reveal } from "@/components/ui";

export default function RankingsPage() {
  return (
    <div>
      <PageHead
        eyebrow="GLOBAL LEADERBOARD · 100 RANKED"
        title="Global Rankings"
        lead="The authoritative list, re-scored every cycle. Filter by decade of dominance, trend the movers, and view the full roster."
        right={
          <div className="chip">
            <Trophy size={13} className="text-gold" /> Source · officialchadrankings.com
          </div>
        }
      />
      <Reveal className="mt-6">
        <RankingsPanel rows={100} />
      </Reveal>
      <p className="mt-4 text-[11.5px] text-neutral-600">
        Verbatim mirror of the live officialchadrankings.com leaderboard (imported snapshot) —
        every figure carries its verification chip and recorded photo provenance.
      </p>
    </div>
  );
}
