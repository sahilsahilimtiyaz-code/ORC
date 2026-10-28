"use client";
import { useState } from "react";
import { Check, Scale, ThumbsUp, Timer } from "lucide-react";
import PageHead from "@/components/PageHead";
import { useCountdown } from "@/components/Countdown";
import { placeholderName } from "@/lib/mockData";
import { PhotoAvatar, Reveal } from "@/components/ui";

const CATS = ["Most Influential", "Best Physique", "Rising Star", "Style Icon", "Mog of the Year", "Community Choice"].map(
  (name, i) => ({
    id: i,
    name,
    options: [placeholderName((i * 5 + 3) % 64), placeholderName((i * 7 + 11) % 64)],
  }),
);

export default function VotePage() {
  const cd = useCountdown(48);
  const [votes, setVotes] = useState<Record<number, string>>({});
  const cast = Object.keys(votes).length;

  return (
    <div>
      <PageHead
        eyebrow="COMMUNITY VOICE · EVERY 48H"
        title="Community Vote"
        lead="One vote per category, every 48 hours. Votes are weighed into the next publication cycle."
        right={
          <div className="flex max-w-xs gap-3 border-l-[3px] border-gold pl-4 text-[13px] leading-relaxed text-neutral-400">
            <Scale size={16} className="mt-0.5 shrink-0 text-gold" />
            Considered by the International Chad Ranking Association.
          </div>
        }
      />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-black/30 px-5 py-4">
        <span className="flex items-center gap-2.5 text-[14px] text-neutral-300">
          <Timer size={16} className="text-gold" /> Voting cycle resets in:
        </span>
        <span className="flex items-center gap-3">
          <span className="chip"><ThumbsUp size={11} className="text-gold" /> {cast}/6 cast</span>
          <span className="font-display text-[19px] font-bold text-gold-bright stat-num">{cd}</span>
        </span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {CATS.map((c, ci) => {
          const chosen = votes[c.id];
          return (
            <Reveal key={c.id} delay={ci * 60}>
              <div className="panel h-full p-5">
                <div className="flex items-center justify-between">
                  <span className="font-display text-[15px] font-bold tracking-[0.08em] text-gold-bright">{c.name}</span>
                  {chosen !== undefined ? <Check size={15} className="text-rise" /> : null}
                </div>
                <div className="mt-4 space-y-2.5">
                  {c.options.map((opt, oi) => {
                    const voted = chosen === opt;
                    const dimmed = chosen !== undefined && !voted;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => chosen === undefined && setVotes((v) => ({ ...v, [c.id]: opt }))}
                        className={`w-full rounded-xl border px-4 py-3 text-left transition-all duration-300 ${
                          voted
                            ? "border-gold/50 bg-gold/10"
                            : dimmed
                              ? "border-line bg-black/20 opacity-35"
                              : "border-line bg-black/30 hover:border-gold/40 hover:bg-white/4"
                        }`}
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span className="flex min-w-0 items-center gap-2.5">
                            <PhotoAvatar name={opt} seed={ci * 7 + oi} size={30} />
                            <span className="truncate text-[14.5px] font-bold text-white">{opt}</span>
                          </span>
                          <span className={`text-[10.5px] font-black tracking-[0.18em] ${voted ? "text-gold" : "text-neutral-500"}`}>
                            {voted ? "VOTED ✓" : "VOTE"}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
      <p className="mt-4 text-[11.5px] text-neutral-600">
        Sample votes live in memory only and reset on reload — no backend in the rebuild. No live tally is
        published here; official ranks always come from the board, never from this poll.
      </p>
    </div>
  );
}
