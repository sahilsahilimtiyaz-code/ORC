"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Crown, Search } from "lucide-react";
import { RANK_TABLE, rowsForTab, type RankRow, type TrendTab } from "@/lib/mockData";
import { IMPORT_META } from "@/lib/creators";
import { DeltaChip, Meter, PhotoAvatar, Reveal, VerificationChip } from "@/components/ui";

const TREND_COLOR = (d: number | null) =>
  d == null
    ? "#6b7280"
    : Math.abs(d) >= 6
      ? "#67e8f9"
      : d > 0
        ? "#60a5fa"
        : d < 0
          ? "#a78bfa"
          : "#6b7280";

const FALL_COLOR = (d: number | null) => (d != null && d < 0 ? "#f87171" : TREND_COLOR(d));

/* ---------------- Podium stack (comp: #1 card + two mini cards) ------------- */
export function PodiumStack() {
  const [one, two, three] = RANK_TABLE;
  return (
    <section aria-label="The podium" className="space-y-4">
      {/* #1 — the throne */}
      <div className="glow-ring relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-b from-[#191304] via-[#0d0c07] to-[#070709] p-6 text-center shadow-glow-lg">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-gold/20 blur-2xl"
        />
        <div className="float-y relative mx-auto -mt-14 mb-1 w-fit" aria-hidden>
          <Crown size={30} className="text-gold-bright" style={{ filter: "drop-shadow(0 0 10px rgba(240,215,140,0.8))" }} />
        </div>
        <div className="relative mx-auto w-fit">
          <PhotoAvatar url={one.photo} name={one.name} seed={11} gold size={128} eager />
          <span
            aria-hidden
            className="absolute inset-x-2 -bottom-1 text-center font-display text-[56px] font-bold leading-none text-white/10"
          >
            01
          </span>
        </div>
        <div className="relative mt-4">
          <div className="eyebrow">TRUE ADAM</div>
          <h3 className="gold-leaf mt-2 font-display text-[38px] font-bold tracking-[0.08em]">{one.name}</h3>
          <p className="mt-1 text-[13px] text-neutral-400">{one.archetype}</p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <VerificationChip status={one.verification} />
            {one.realName ? <span className="text-[11px] text-neutral-500">· {one.realName}</span> : null}
          </div>
          <div className="mt-4 flex items-center justify-center gap-4">
            <span className="font-display text-[44px] font-bold leading-none text-gold-bright stat-num" style={{ textShadow: "0 0 22px rgba(240,215,140,0.4)" }}>
              {one.score != null ? one.score.toFixed(1) : "—"}
            </span>
            <DeltaChip value={one.delta} big />
          </div>
          {one.bio ? <p className="mt-3 text-[12.5px] text-neutral-500">“{one.bio}”</p> : null}
        </div>
      </div>

      {/* #2 / #3 minis */}
      {[two, three].map((r, i) => (
        <Reveal key={r.rank} delay={i * 90}>
          <div className="panel panel-hover flex items-center gap-4 p-4">
            <PhotoAvatar url={r.photo} name={r.name} seed={r.rank * 7} gold={r.rank === 2} size={56} eager={i === 0} />
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-black tracking-[0.24em] text-neutral-500">
                {r.rank === 2 ? "TOP 2" : "TOP 3"}
              </div>
              <div className="truncate font-display text-[17px] font-bold tracking-[0.06em] text-white">{r.name}</div>
              <div className="mt-1.5 flex items-center gap-2.5">
                <span className="font-display text-[18px] font-bold text-neutral-200 stat-num">
                  {r.score != null ? r.score.toFixed(1) : "—"}
                </span>
                <DeltaChip value={r.delta} />
                <VerificationChip status={r.verification} compact />
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </section>
  );
}

/* ---------------- One ranking row -------------------------------------------- */
/**
 * Photo-fetched name card — the same behavior class as the original site:
 * each figure's portrait streams in next to their standing. DOM cost kept low
 * (no per-row IntersectionObserver Reveal; CSS content-visibility handles it).
 */
export function RankRowView({ row, index = 0 }: { row: RankRow; index?: number }) {
  const first = row.rank === 1;
  const second = row.rank === 2;
  const third = row.rank === 3;
  const ring = first
    ? "border-gold/45 bg-gradient-to-r from-gold/12 via-gold/4 to-transparent"
    : second
      ? "border-silver/20 bg-gradient-to-r from-white/6 to-transparent"
      : third
        ? "border-bronze/25 bg-gradient-to-r from-bronze/8 to-transparent"
        : "border-line bg-transparent";
  return (
    <a
      href="/rankings"
      className={`cv-auto group relative flex items-center gap-3 rounded-2xl border px-3 py-3 transition-colors duration-300 hover:border-gold/35 hover:bg-white/[0.045] sm:gap-4 sm:px-4 ${ring}`}
    >
      <span
        aria-hidden
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-gold opacity-0 transition-opacity group-hover:opacity-100"
      />
      <span
        className={`grid h-9 w-11 shrink-0 place-items-center rounded-xl font-display text-[15px] font-bold ${
          first ? "bg-gold/20 text-gold-bright" : "bg-white/5 text-neutral-300"
        }`}
      >
        {String(row.rank).padStart(2, "0")}
      </span>
      <PhotoAvatar url={row.photo} name={row.name} seed={row.rank * 5} gold={first} size={38} eager={index < 4} />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate text-[14.5px] font-bold text-white">{row.name}</span>
          {first ? <Crown size={13} className="shrink-0 text-gold-bright" /> : null}
        </span>
        <span className="mt-0.5 flex items-center gap-1.5">
          <span className="truncate text-[12px] text-neutral-500">{row.archetype}</span>
          <VerificationChip status={row.verification} compact />
        </span>
      </span>
      <span className="hidden w-24 shrink-0 md:block">
        {row.score != null ? (
          <>
            <span className="block font-display text-[16px] font-bold text-neutral-100 stat-num">{row.score.toFixed(1)}</span>
            <span className="mt-1 block">
              <Meter value={row.score} color={first ? "#d4af37" : TREND_COLOR(row.delta)} />
            </span>
          </>
        ) : (
          <span className="font-display text-[16px] font-bold text-neutral-600">—</span>
        )}
      </span>
      <span className="hidden w-[86px] shrink-0 justify-end sm:flex">
        <DeltaChip value={row.delta} />
      </span>
      <span className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[12px] text-neutral-300 transition-colors group-hover:border-gold/40 group-hover:text-gold-bright sm:ml-0">
        View <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
      </span>
    </a>
  );
}

/* ---------------- Tabbed global rankings panel -------------------------------- */
/**
 * Windowed rendering: only ~24 rows mount at a time. A "Show more" control
 * reveals more, so the 100-row leaderboard never chokes the main thread on a
 * phone (100 full rows would cost ~700 DOM nodes at once).
 */
const PAGE = 24;

export function RankingsPanel({ rows = 10 }: { rows?: number }) {
  const [tab, setTab] = useState<TrendTab>("This Week");
  const [q, setQ] = useState("");
  const [shown, setShown] = useState(Math.min(rows, PAGE));

  const view = useMemo(() => {
    let list = rowsForTab(tab, RANK_TABLE);
    const s = q.trim().toLowerCase();
    if (s)
      list = list.filter((r) =>
        (r.name + " " + r.archetype + " " + (r.realName ?? "") + " " + r.tags.join(" ")).toLowerCase().includes(s),
      );
    return list.slice(0, rows);
  }, [tab, q, rows]);

  // reset paging when the filter or tab changes
  useEffect(() => {
    setShown(Math.min(rows, PAGE));
  }, [tab, q, rows]);

  const visible = view.slice(0, shown);
  const revealMore = () => setShown((n) => Math.min(n + PAGE, view.length));

  return (
    <section className="panel overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gold/12 text-gold"><Crown size={15} /></span>
          <h2 className="whitespace-nowrap font-display text-[15px] font-bold tracking-[0.12em] text-white">
            GLOBAL RANKINGS
          </h2>
        </div>
        <div className="mx-2 hidden h-6 w-px bg-white/10 md:block" aria-hidden />
        <div className="flex rounded-full border border-line bg-black/30 p-1">
          {(["This Week", "All Time", "Trending"] as TrendTab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors ${
                tab === t ? "border border-gold/45 bg-gold/12 text-gold-bright" : "text-neutral-400 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 rounded-full border border-line bg-black/30 px-3.5 py-2">
          <Search size={14} className="text-neutral-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            maxLength={48}
            placeholder="Search by name..."
            aria-label="Search ranked figures"
            className="w-36 bg-transparent text-[13px] text-white placeholder:text-neutral-500 focus:outline-none sm:w-48"
          />
        </div>
      </div>

      {/* head */}
      <div className="hidden items-center gap-4 px-4 pt-4 text-[10px] font-black tracking-[0.22em] text-neutral-600 sm:px-6 md:flex">
        <span className="w-11" /> <span className="w-[38px]" /> <span className="flex-1">FIGURE</span>
        <span className="w-24">SCORE</span> <span className="w-[86px]">MOVEMENT</span> <span className="w-[68px]" />
      </div>

      <div className="space-y-2 px-3 py-3 sm:px-5">
        {visible.map((r, i) => (
          <RankRowView key={`${r.rank}-${r.name}`} row={r} index={i} />
        ))}
        {view.length === 0 ? (
          <p className="py-10 text-center text-[13px] text-neutral-500">No figure matches “{q}”.</p>
        ) : null}
      </div>

      {shown < view.length ? (
        <button
          type="button"
          onClick={revealMore}
          className="flex w-full items-center justify-center gap-2 border-t border-line py-3.5 text-[13px] font-semibold text-neutral-400 transition-colors hover:bg-white/4 hover:text-gold-bright"
        >
          Show more ({shown}/{view.length}) <span aria-hidden>↓</span>
        </button>
      ) : null}

      <Link
        href="/rankings"
        className="flex items-center justify-center gap-2 border-t border-line py-3.5 text-[13px] font-semibold text-gold-bright transition-colors hover:bg-gold/6"
      >
        Full 100-figure leaderboard <span aria-hidden>→</span>
      </Link>

      <p className="border-t border-line px-4 py-2.5 text-[10.5px] leading-relaxed text-neutral-600">
        Source: <span className="text-neutral-400">officialchadrankings.com</span> · imported {IMPORT_META.importedAt.slice(0, 10)} ·
        every name, rank and photo mirrors the live official board; identities pending external review carry the
        amber chip. Photos stream from their recorded origins — failures show an explicit placeholder.
      </p>
    </section>
  );
}

export { TREND_COLOR, FALL_COLOR };
