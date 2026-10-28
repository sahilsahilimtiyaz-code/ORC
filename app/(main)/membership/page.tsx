"use client";
import { useState } from "react";
import { Check, Crown, Sparkles, Star, Trophy } from "lucide-react";
import PageHead from "@/components/PageHead";
import { PRICING } from "@/lib/mockData";
import { Reveal } from "@/components/ui";

const ICONS = { trophy: Trophy, star: Star, crown: Crown } as const;

export default function MembershipPage() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div>
      <PageHead
        eyebrow="MEMBERSHIP · THE INNER CIRCLE"
        title="Become a Member"
        lead="Join the International Chad Ranking Association community — early cycles, weighted votes, and the rewards exchange."
      />
      <div className="mt-8 grid gap-5 md:grid-cols-3 md:items-stretch">
        {PRICING.map((p, i) => {
          const Icon = ICONS[p.icon];
          const popular = p.popular;
          return (
            <Reveal key={p.tier} delay={i * 80}>
              <div
                className={`glow-ring relative flex h-full flex-col rounded-3xl border p-6 ${
                  popular
                    ? "border-gold/50 bg-gradient-to-b from-[#191304] to-[#09090c] shadow-glow-lg"
                    : "border-line bg-panel"
                }`}
              >
                {popular && (
                  <span className="absolute -top-3.5 left-6 rounded-full bg-gradient-to-r from-gold-bright to-gold px-3.5 py-1.5 text-[10px] font-black tracking-[0.24em] text-black shadow-glow">
                    MOST POPULAR
                  </span>
                )}
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${popular ? "bg-gold/15 text-gold-bright" : "bg-gold/10 text-gold"}`}>
                  <Icon size={20} />
                </span>
                <div className="mt-4 font-display text-[17px] font-bold tracking-[0.06em] text-white">{p.tier}</div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="font-display text-[42px] font-bold leading-none text-white stat-num">{p.price}</span>
                  <span className="text-[13px] text-neutral-500">{p.period}</span>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-neutral-400">{p.blurb}</p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2.5 text-[13px] text-neutral-300">
                      <Check size={14} className="mt-0.5 shrink-0 text-gold" /> {perk}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => setOpen(p.tier)}
                  className={`btn mt-6 w-full ${popular ? "btn-gold" : "btn-ghost"}`}
                >
                  Enroll {p.tier}
                </button>
              </div>
            </Reveal>
          );
        })}
      </div>
      <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-line bg-black/25 px-5 py-4">
        <Sparkles size={14} className="mt-0.5 shrink-0 text-gold" />
        <p className="text-[12px] leading-relaxed text-neutral-500">
          Sample rebuild — no payment backend. {open ? `“${open}” enrollment is disabled in this demo; wire your provider in components to go live.` : "Pick a tier to see the demo notice."}
        </p>
      </div>
    </div>
  );
}
