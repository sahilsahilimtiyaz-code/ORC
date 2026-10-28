import PageHead from "@/components/PageHead";
import { ArrowLeft, Scale, Shield, ShieldCheck, Timer, Users } from "lucide-react";
import Link from "next/link";
import { FAQ } from "@/lib/mockData";
import { Reveal } from "@/components/ui";

const PILLARS = [
  {
    icon: Scale,
    title: "Official Source Of Record",
    body: "Ranks, influence scores and movement data are imported verbatim from the officialchadrankings.com leaderboard (its public PublicFigure dataset), with the import date stamped on every leaderboard surface. Nothing is ranked by guesswork here.",
  },
  {
    icon: Users,
    title: "Community Layer",
    body: "Votes and battle picks on this site are clearly-labelled sample interactions. They live in memory, reset on reload, and never alter an official rank — popularity and rank are kept as separate concepts.",
  },
  {
    icon: Timer,
    title: "Cycle Cadence",
    body: "The board updates whenever the official source publishes a new cycle. Movement columns (risers, droppers, stability) are derived from the board's own published previous-rank fields for each import.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity & Verification",
    body: "Every record carries a verification status — verified (identity corroborated against independent public sources) or pending review. Role records and mystery slots are never rendered as creators, and photos stream from recorded origins with explicit placeholders on failure.",
  },
];

export default function MethodologyPage() {
  return (
    <div>
      <PageHead
        eyebrow="THE STANDARD"
        title="How Chad Rankings Work"
        lead="Our methodology is designed to be fair, transparent, and reflective of real-world chad energy and momentum."
        right={
          <Link href="/" className="btn btn-ghost !text-[12.5px]">
            <ArrowLeft size={13} /> Back to Home
          </Link>
        }
      />
      {/* centered seal */}
      <div className="mt-10 text-center">
        <span className="glow-ring relative mx-auto grid h-24 w-24 place-items-center rounded-3xl bg-gold/10 text-gold shadow-glow">
          <Shield size={38} strokeWidth={1.5} />
        </span>
        <div className="mt-5 text-[10.5px] font-black tracking-[0.34em] text-neutral-500">
          RATIFIED BY THE INTERNATIONAL CHAD RANKING ASSOCIATION
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {PILLARS.map((s, i) => (
          <Reveal key={s.title} delay={i * 70}>
            <section className="panel panel-hover h-full p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold/10 text-gold ring-1 ring-gold/25">
                <s.icon size={19} />
              </span>
              <h3 className="mt-4 font-display text-[17px] font-bold tracking-[0.04em] text-gold-bright">{s.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-neutral-400">{s.body}</p>
            </section>
          </Reveal>
        ))}
      </div>

      {/* FAQ */}
      <Reveal className="mt-8">
        <div className="panel divide-y divide-white/5 p-2">
          {FAQ.map((f) => (
            <details key={f.q} className="group px-4 py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14.5px] font-semibold text-white transition-colors hover:text-gold-bright">
                {f.q}
                <span className="text-gold transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 pb-1 text-[13.5px] leading-relaxed text-neutral-400">{f.a}</p>
            </details>
          ))}
        </div>
      </Reveal>
      <p className="mt-4 text-[11.5px] text-neutral-600">
        All methodology copy is placeholder sample — replace with your association's real rules.
      </p>
    </div>
  );
}
