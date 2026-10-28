import { Crown } from "lucide-react";
import PageHead from "@/components/PageHead";
import { HALL_OF_FAME } from "@/lib/mockData";
import { Reveal, StatueTile } from "@/components/ui";

export default function HallOfFamePage() {
  return (
    <div>
      <PageHead
        eyebrow="IN PERPETUUM"
        title="Hall of Fame"
        lead="The names that defined eras of the verse — retired from the active board, never from memory."
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {HALL_OF_FAME.map((h, i) => (
          <Reveal key={h.name} delay={i * 70}>
            <article
              className="panel panel-hover relative overflow-hidden p-6 text-center"
              style={{ borderColor: "rgba(212,175,55,0.25)" }}
            >
              <div aria-hidden className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-gold/12 blur-3xl" />
              <div className="float-y mx-auto w-fit">
                <StatueTile seed={(i + 2) * 17} gold size={96} />
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 text-gold">
                <Crown size={14} />
                <span className="eyebrow">LEGEND {String(i + 1).padStart(2, "0")}</span>
              </div>
              <h2 className="gold-leaf mt-2 font-display text-[26px] font-bold tracking-[0.08em]">{h.name}</h2>
              <p className="mt-2 text-[13px] text-neutral-500">{h.note}</p>
              <div className="mx-auto mt-4 h-px w-20 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
              <p className="mt-3 font-display text-[12px] font-bold tracking-[0.28em] text-neutral-500">
                ENGRAVED · CYCLE 42
              </p>
            </article>
          </Reveal>
        ))}
      </div>
      <p className="mt-4 text-[11.5px] text-neutral-600">
        Placeholder legends for the sample rebuild — replace with your inductees.
      </p>
    </div>
  );
}
