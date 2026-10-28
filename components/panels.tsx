"use client";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart2,
  Crown,
  Eye,
  Globe,
  Smile,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CTA_RANK, FEATURED_MOVEMENT, HALL_OF_FAME, HOT_STATS, MOVERS_MIX, RANK_TABLE } from "@/lib/mockData";
import { IMPORT_META } from "@/lib/creators";
import { CountUp, PhotoAvatar, Reveal, StatueTile } from "@/components/ui";

/* ---------------- GLOBAL STATISTICS panel ----------------------------------- */
const STAT_ICONS = { users: Users, user: User, globe: Globe, trend: BarChart2 } as const;

type HotStat = (typeof HOT_STATS)[number];

export function StatsPanel() {
  const mix = [
    { label: "RISERS", value: MOVERS_MIX.risers, color: "#34d399" },
    { label: "DROPPERS", value: MOVERS_MIX.droppers, color: "#f87171" },
    { label: "STABLE", value: MOVERS_MIX.stable, color: "#6b7280" },
  ];
  const total = Math.max(1, MOVERS_MIX.risers + MOVERS_MIX.droppers + MOVERS_MIX.stable);
  return (
    <section className="panel relative overflow-hidden p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gold/12 text-gold"><Globe size={15} /></span>
          <h2 className="whitespace-nowrap font-display text-[14px] font-bold tracking-[0.14em] text-white">
            BOARD STATISTICS
          </h2>
        </div>
        <span className="whitespace-nowrap text-[10.5px] font-bold tracking-[0.12em] text-neutral-500">
          SOURCE · {IMPORT_META.source.toUpperCase()} · {IMPORT_META.importedAt.slice(0, 10)}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {HOT_STATS.map((s: HotStat, i: number) => {
          const Icon = STAT_ICONS[s.icon];
          return (
            <Reveal key={s.label} delay={i * 70}>
              <div className="rounded-xl border border-line bg-black/25 px-4 py-3.5 transition-colors hover:border-gold/30">
                <Icon size={15} className="text-gold" />
                <div className="mt-2">
                  <CountUp value={s.value} className="font-display text-[24px] font-bold text-white" />
                </div>
                <div className="text-[10.5px] font-semibold tracking-[0.08em] text-neutral-500">{s.label}</div>
              </div>
            </Reveal>
          );
        })}
      </div>
      <div className="mt-4 rounded-xl border border-line bg-black/25 p-4">
        <div className="flex items-center justify-between text-[11px] font-bold tracking-[0.1em]">
          <span className="text-neutral-400">MOVEMENT MIX · THIS CYCLE</span>
          <span className="text-neutral-500">{total} FIGURES</span>
        </div>
        {/* single stacked bar — honest distribution of the board's published movement */}
        <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-black/50">
          {mix.map((m) => (
            <span key={m.label} style={{ width: `${(m.value / total) * 100}%`, background: m.color }} className="h-full" />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap justify-between gap-2 text-[10px] font-black tracking-[0.16em]">
          {mix.map((m) => (
            <span key={m.label} className="inline-flex items-center gap-1.5 text-neutral-400">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.color }} />
              {m.label} <span className="text-neutral-200 stat-num">{m.value}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FEATURED MOVEMENT riser/dropper ----------------------------- */
export function FeaturedMovement() {
  const { rise, fall } = FEATURED_MOVEMENT;
  if (!rise || !fall) return null;
  return (
    <section className="panel overflow-hidden p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gold/12 text-gold"><BarChart2 size={15} /></span>
          <h2 className="whitespace-nowrap font-display text-[14px] font-bold tracking-[0.14em] text-white">
            FEATURED MOVEMENT
          </h2>
        </div>
        <Link href="/movements" className="text-[11.5px] font-bold text-neutral-500 transition-colors hover:text-gold-bright">
          VIEW ALL →
        </Link>
      </div>
      <div className="mt-4 space-y-3">
        <Reveal>
          <Link
            href="/movements"
            className="block rounded-xl border border-line bg-gradient-to-r from-cyan-500/10 via-panel2 to-transparent p-4 transition-all hover:border-cyan-500/40 hover:shadow-[0_0_28px_rgba(103,232,249,0.12)]"
          >
            <div className="flex items-center gap-3.5">
              <PhotoAvatar url={rise.photo} name={rise.name} seed={52} size={46} />
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-black tracking-[0.24em] text-neon">BIGGEST RISE</div>
                <div className="font-display text-[19px] font-bold tracking-[0.06em] text-white">{rise.name}</div>
                <div className="text-[11.5px] text-neutral-500">From #{rise.from} to #{rise.to} — published by the board</div>
              </div>
              {rise.reason ? <div className="hidden max-w-[150px] truncate text-[11px] italic text-neutral-600 sm:block">“{rise.reason}”</div> : null}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span
                className="font-display text-[30px] font-bold text-neon stat-num"
                style={{ textShadow: "0 0 18px rgba(103,232,249,0.4)" }}
              >
                +{rise.delta}
              </span>
              <ArrowUpRight size={18} className="text-neon" />
            </div>
          </Link>
        </Reveal>
        <Reveal delay={90}>
          <Link
            href="/movements"
            className="block rounded-xl border border-line bg-gradient-to-r from-red-500/10 via-panel2 to-transparent p-4 transition-all hover:border-red-400/40 hover:shadow-[0_0_28px_rgba(248,113,113,0.12)]"
          >
            <div className="flex items-center gap-3.5">
              <PhotoAvatar url={fall.photo} name={fall.name} seed={88} size={46} />
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-black tracking-[0.24em] text-fall">BIGGEST DROP</div>
                <div className="font-display text-[19px] font-bold tracking-[0.06em] text-white">{fall.name}</div>
                <div className="text-[11.5px] text-neutral-500">From #{fall.from} to #{fall.to} — published by the board</div>
              </div>
              {fall.reason ? <div className="hidden max-w-[150px] truncate text-[11px] italic text-neutral-600 sm:block">“{fall.reason}”</div> : null}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span
                className="font-display text-[30px] font-bold text-fall stat-num"
                style={{ textShadow: "0 0 18px rgba(248,113,113,0.4)" }}
              >
                -{Math.abs(fall.delta)}
              </span>
              <ArrowDownRight size={18} className="text-fall" />
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- HALL OF FAME strip ------------------------------------------ */
export function HallOfFameStrip() {
  return (
    <section className="panel relative overflow-hidden">
      <div className="flex flex-wrap items-center gap-5 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold/12 text-gold shadow-glow"><Crown size={20} /></span>
          <div>
            <h2 className="font-display text-[20px] font-bold tracking-[0.14em] text-white">HALL OF FAME</h2>
            <p className="text-[10.5px] font-black tracking-[0.3em] text-gold/80">LEGENDS NEVER FADE.</p>
          </div>
        </div>
        <div className="mx-2 hidden h-10 w-px bg-white/10 md:block" aria-hidden />
        <div className="flex flex-1 flex-wrap gap-3">
          {HALL_OF_FAME.map((h, i) => (
            <Reveal key={h.name} delay={i * 80}>
              <Link href="/hall-of-fame" className="block">
                <div className="group flex items-center gap-3 rounded-2xl border border-line bg-black/25 p-3 transition-all hover:border-gold/35 hover:bg-gold/5">
                  <StatueTile seed={(i + 3) * 13} gold size={52} />
                  <div>
                    <div className="whitespace-nowrap font-display text-[14px] font-bold tracking-[0.06em] text-white transition-colors group-hover:text-gold-bright">
                      {h.name}
                    </div>
                    <div className="whitespace-nowrap text-[11px] text-neutral-500">{h.note}</div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <Link href="/hall-of-fame" className="ml-auto flex items-center gap-2 text-[13px] font-bold text-gold-bright transition-colors hover:text-white">
          View Hall of Fame <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}

/* ---------------- "YOUR RANK MATTERS" CTA -------------------------------------- */
export function CtaRankMatters() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-b from-[#151006] to-[#08080b] p-6 text-left shadow-glow">
      <div aria-hidden className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/15 blur-3xl" />
      <div className="float-y mb-3 w-fit">
        <StatueTile seed={41} gold size={82} />
      </div>
      <h2 className="font-display text-[24px] font-bold leading-tight tracking-[0.1em] text-white">
        YOUR RANK
        <br /> MATTERS
      </h2>
      <p className="mt-3 whitespace-pre-line text-[13px] leading-relaxed text-neutral-400">{CTA_RANK.body}</p>
      <Link href="/membership" className="btn btn-gold mt-5 justify-between">
        {CTA_RANK.cta} <span aria-hidden>→</span>
      </Link>
    </section>
  );
}

/* ---------------- Hero -------------------------------------------------------- */
const HERO_CHIPS: Array<{ label: string; icon: LucideIcon }> = [
  { label: "Looks", icon: Sparkles },
  { label: "Physique", icon: BarChart2 },
  { label: "Personality", icon: Smile },
  { label: "Presence", icon: Eye },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-[#0a1020] via-[#080b14] to-[#05060a] p-7 sm:p-10">
      {/* atmospherics */}
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-royal/25 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-72 rounded-full bg-gold/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-35">
        <svg className="h-full w-full">
          <defs>
            <pattern id="hgrid" width="42" height="42" patternUnits="userSpaceOnUse">
              <path d="M42 0H0v42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hgrid)" />
        </svg>
      </div>
      <div aria-hidden className="pointer-events-none absolute right-0 top-0 hidden h-full w-[290px] lg:block">
        <div className="float-y absolute right-2 top-1/2 -translate-y-1/2">
          <PhotoAvatar url={RANK_TABLE[0]?.photo} name={RANK_TABLE[0]?.name} seed={44} gold size={230} eager />
        </div>
      </div>

      <div className="relative">
        <div className="eyebrow">OFFICIAL CHAD RANKINGS</div>
        <h1 className="mt-4 font-display font-black leading-[0.98] tracking-tight">
          <span className="block text-[clamp(2.5rem,5.6vw,4.3rem)] text-[#e8e4da]">THE REAL</span>
          <span className="gold-leaf block text-[clamp(3.4rem,8.4vw,6.4rem)]">CHADS</span>
        </h1>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-neutral-400">
          Not just looks. it&apos;s the full package. Scored on presence, physique,
          personality and precision — every cycle.
        </p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          {HERO_CHIPS.map(({ label, icon: Icon }) => (
            <span key={label} className="chip">
              <Icon size={13} className="text-gold" /> {label}
            </span>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/rankings" className="btn btn-gold">
            Explore Rankings <span aria-hidden>→</span>
          </Link>
          <Link href="/movements" className="btn btn-ghost">
            View Movements
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Ticker -------------------------------------------------------- */
export function TickerStrip() {
  const rise = FEATURED_MOVEMENT.rise;
  const fall = FEATURED_MOVEMENT.fall;
  const line = [
    `SYNCED FROM ${IMPORT_META.source.toUpperCase()}`,
    IMPORT_META.importedAt.slice(0, 10),
    RANK_TABLE[0] ? `${RANK_TABLE[0].name.toUpperCase()} HOLDS #1` : null,
    rise ? `${rise.name.toUpperCase()} SURGES +${rise.delta} → #${rise.to}` : null,
    fall ? `${fall.name.toUpperCase()} SLIDES ${fall.delta} → #${fall.to}` : null,
    `${RANK_TABLE.length} FIGURES ON BOARD`,
    "IDENTITY REVIEW IN PROGRESS",
  ]
    .filter(Boolean)
    .join(" · ")
    .toUpperCase();
  return (
    <div className="relative overflow-hidden rounded-full border border-gold/20 bg-black/40 py-2">
      <div className="ticker-track">
        {[0, 1].map((k) => (
          <span key={k} className="whitespace-nowrap px-4 text-[12px] font-bold tracking-[0.14em] text-gold-bright/90">
            {line} ·&nbsp;
          </span>
        ))}
      </div>
    </div>
  );
}
