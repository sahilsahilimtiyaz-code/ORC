import PageHead from "@/components/PageHead";
import { CrownMark, Reveal, StatueTile } from "@/components/ui";

const SECTIONS = [
  {
    head: "Our Mission",
    body: "The International Chad Ranking Association is the official body behind the weekly standings — a community-run editorial voice tracking the rise and fall of influential looks. This paragraph is placeholder sample copy.",
  },
  {
    head: "The Standards",
    body: "Objective scoring, public sentiment and cycle momentum are weighted to produce a single classified list. This paragraph is placeholder sample copy.",
  },
  {
    head: "The Cycle",
    body: "Each publication window the association reviews votes, records and disputes before locking the board. This paragraph is placeholder sample copy.",
  },
  {
    head: "Governance",
    body: "A small council moderates the community, oversees appeals and publishes corrections. This paragraph is placeholder sample copy.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <PageHead
        eyebrow="WITNESSED SINCE CYCLE 0"
        title="About Us"
        lead="The International Chad Ranking Association"
      />
      <Reveal className="mt-8">
        <div className="panel glow-ring relative overflow-hidden p-8 text-center">
          <div aria-hidden className="float-y mx-auto w-fit"><StatueTile seed={21} gold size={120} /></div>
          <div className="mt-4 flex items-center justify-center gap-2 text-gold">
            <CrownMark size={16} />
            <span className="eyebrow">OFFICIAL CHAD RANKINGS</span>
          </div>
          <p className="mx-auto mt-3 max-w-xl text-[13.5px] leading-relaxed text-neutral-400">
            Real men. Real standards. The association keeps the definitive record of the verse.
          </p>
        </div>
      </Reveal>
      <div className="mt-2 divide-y divide-white/6">
        {SECTIONS.map((s, i) => (
          <Reveal key={s.head} delay={i * 50}>
            <section className="grid gap-3 py-8 md:grid-cols-[260px_1fr] md:gap-10">
              <h2 className="font-display text-[24px] font-bold tracking-[0.04em] text-white">{s.head}</h2>
              <p className="text-[15px] leading-relaxed text-neutral-400">{s.body}</p>
            </section>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
