"use client";
import { useEffect, useId, useRef, useState } from "react";
import type { VerificationStatus } from "@/lib/creators";

/* =========================================================================
   Shared visual primitives for the OCR rebuild.
   Everything here is generative — no external image assets are embedded.
   ========================================================================= */

/** Deterministic classical bust silhouette (no photo assets used). */
export function StatueTile({
  seed = 0,
  size = 44,
  gold = false,
  label,
  className = "",
}: {
  seed?: number;
  size?: number;
  gold?: boolean;
  label?: string;
  className?: string;
}) {
  const tilt = [-8, 0, 8][Math.abs(Math.floor(seed)) % 3];
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const id = `st${uid}`;
  const skin = gold
    ? ["#2a2114", "#4a3a14", "#8a6a24", "#f0d78c"]
    : ["#141824", "#1d2233", "#2b3552", "#8c9ec9"];
  return (
    <span
      aria-hidden={label ? true : undefined}
      className={`relative inline-grid shrink-0 place-items-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size} className="rounded-full">
        <defs>
          <radialGradient id={`${id}b`} cx="38%" cy="30%" r="80%">
            <stop offset="0%" stopColor={gold ? "#463613" : "#20263a"} />
            <stop offset="55%" stopColor={gold ? "#241c0d" : "#12161f"} />
            <stop offset="100%" stopColor="#05060a" />
          </radialGradient>
          <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={skin[2]} />
            <stop offset="100%" stopColor={skin[0]} />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill={`url(#${id}b)`} />
        <g transform={`rotate(${tilt} 50 52)`}>
          {/* bust: neck + shoulders */}
          <path
            d="M50 34 q10 0 12 12 q2 10 -2 14 q6 4 16 6 q10 2 14 10 l0 24 l-80 0 l0 -24 q4 -8 14 -10 q10 -2 16 -6 q-4 -4 -2 -14 q2 -12 12 -12 z"
            fill={`url(#${id}s)`}
            opacity="0.9"
          />
          {/* head */}
          <path
            d="M50 8 q10 0 12 10 q1 7 -3 11 q2 3 -0 6 q-4 5 -9 5 q-5 0 -9 -5 q-2 -3 0 -6 q-4 -4 -3 -11 q2 -10 12 -10 z"
            fill={`url(#${id}s)`}
          />
          {/* rim light - side only, not crossing face */}
          <path
            d="M38 12 q-2 8 0 12 q-4 4 -10 6"
            fill="none"
            stroke={skin[3]}
            strokeWidth="1.4"
            opacity="0.65"
          />
        </g>
      </svg>
      {label ? (
        <span className="absolute bottom-0 translate-y-1/3 rounded-full border border-gold/40 bg-black/80 px-2 py-0.5 text-[9px] font-black tracking-widest text-gold-bright">
          {label}
        </span>
      ) : null}
      <span
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{ boxShadow: `inset 0 0 0 1px ${gold ? "rgba(240,215,140,0.55)" : "rgba(255,255,255,0.14)"}` }}
      />
    </span>
  );
}

/* single-icon fallback for avatars in dense tables */
export function MonoTile({ name, size = 34 }: { name: string; size?: number }) {
  return (
    <span
      className="inline-grid shrink-0 place-items-center rounded-full border border-line bg-panel2 font-display text-[13px] font-bold text-gold-bright"
      style={{ width: size, height: size }}
    >
      {name.slice(0, 1)}
    </span>
  );
}

/* ---------- photo avatar (like the original's contestant cards) ------------ */
/**
 * Streams a figure's portrait onto the card, mirroring the original site's
 * photo-per-name-card behavior. Deterministic CC0 photo per figure, with the
 * gold statue silhouette as an automatic offline/error fallback so the UI
 * never shows a broken image. Lazy + no-referrer + fixed box (zero CLS).
 */
/**
 * Photo-fetched avatar with provenance discipline:
 *  - renders the recorded source photo when one exists;
 *  - on absence OR load failure renders an EXPLICIT placeholder (monogram
 *    tile) — never a random or generated face standing in for a person.
 */
export function PhotoAvatar({
  url,
  name,
  seed = 0,
  size = 40,
  gold = false,
  className = "",
  eager = false,
}: {
  url?: string | null;
  name?: string;
  seed?: number;
  size?: number;
  gold?: boolean;
  className?: string;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const show = failed || !url;
  if (show) {
    const initial = (name || "◈").trim().charAt(0).toUpperCase() || "◈";
    return (
      <span
        role="img"
        aria-label={name ? `No verified photo — placeholder for ${name}` : "No verified photo — placeholder"}
        title="No verified photo — explicit placeholder"
        className={`relative inline-grid shrink-0 select-none place-items-center overflow-hidden rounded-full font-display font-bold ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: gold ? "#1b1508" : "#12141d",
          color: gold ? "rgba(240,215,140,0.8)" : "rgba(140,158,201,0.75)",
          fontSize: Math.max(11, Math.round(size * 0.36)),
          letterSpacing: "0.04em",
        }}
      >
        <span aria-hidden>{initial}</span>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            boxShadow: `inset 0 0 0 1.5px ${gold ? "rgba(240,215,140,0.5)" : "rgba(255,255,255,0.12)"}${
              gold ? ", inset 0 0 10px rgba(240,215,140,0.2)" : ""
            }`,
            background: "repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0 6px, transparent 6px 12px)",
          }}
        />
      </span>
    );
  }
  return (
    <span
      className={`relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size, backgroundColor: gold ? "#1b1508" : "#12141d" }}
    >
      <img
        src={url}
        alt=""
        width={size}
        height={size}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover object-top"
        style={{ display: "block" }}
      />
      {/* gold rim inner shadow — keeps the cards on-brand even with photos */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{ boxShadow: `inset 0 0 0 1.5px ${gold ? "rgba(240,215,140,0.75)" : "rgba(255,255,255,0.16)"}${gold ? ", inset 0 0 12px rgba(240,215,140,0.25)" : ""}` }}
      />
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full" style={{ background: "linear-gradient(180deg, rgba(5,6,9,0) 62%, rgba(5,6,9,0.55) 100%)" }} />
    </span>
  );
}

/* ---------- verification state chip -------------------------------------- */
const VERIFY_STYLES: Record<VerificationStatus, { label: string; cls: string; title: string }> = {
  verified: {
    label: "VERIFIED",
    cls: "text-gold-bright border-gold/40 bg-gold/10",
    title: "Identity corroborated against independent public sources",
  },
  needs_verification: {
    label: "PENDING",
    cls: "text-amber-300 border-amber-400/35 bg-amber-400/10",
    title: "Name, rank and photo imported verbatim from the official source; external identity corroboration pending",
  },
  disputed: {
    label: "DISPUTED",
    cls: "text-red-300 border-red-400/35 bg-red-400/10",
    title: "Identity disputed — held out of verified surfaces",
  },
  rejected: {
    label: "HIDDEN",
    cls: "text-neutral-400 border-line bg-white/5",
    title: "Not an identifiable person (source role record)",
  },
};

export function VerificationChip({
  status,
  compact = false,
}: {
  status: VerificationStatus;
  compact?: boolean;
}) {
  const s = VERIFY_STYLES[status];
  return (
    <span
      title={s.title}
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-1.5 py-0.5 text-[8.5px] font-black tracking-[0.18em] ${s.cls}`}
    >
      {status === "verified" ? <span aria-hidden>✓</span> : null}
      {compact ? s.label.slice(0, 3) : s.label}
    </span>
  );
}

/* ---------- animated SVG sparkline ------------------------------------- */
export function Sparkline({
  data,
  color = "#67e8f9",
  w = 200,
  h = 52,
  fill = true,
  delay = 0,
  dot = true,
  className = "",
}: {
  data: number[];
  color?: string;
  w?: number;
  h?: number;
  fill?: boolean;
  delay?: number;
  dot?: boolean;
  className?: string;
}) {
  const n = data.length;
  // the source publishes no rank history — render an explicit empty state
  if (!data || n < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = Math.max(0.08, max - min);
  const px = (i: number) => (i / (n - 1)) * (w - 8) + 4;
  const py = (v: number) => h - 6 - ((v - min) / span) * (h - 14);
  const pts = data.map((v, i) => [px(i), py(v)] as const);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${d} L${pts[n - 1][0].toFixed(1)},${h - 2} L${pts[0][0].toFixed(1)},${h - 2} Z`;
  const last = pts[n - 1];
  const gid = `sg${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      className={className}
      style={{ overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill ? <path d={area} fill={`url(#${gid})`} opacity="0.5" /> : null}
      <path
        className="spark-path"
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        style={{
          animationDelay: `${delay}ms`,
          filter: "drop-shadow(0 0 5px currentColor)",
        }}
      />
      {dot ? (
        <circle
          cx={last[0]}
          cy={last[1]}
          r="3"
          fill={color}
          style={{ animation: "pulseSoft 2.6s ease-in-out infinite", animationDelay: `${delay + 1500}ms` }}
        />
      ) : null}
    </svg>
  );
}

/* ---------- movement delta chip ---------------------------------------- */
export function DeltaChip({ value, big = false }: { value: number | null | undefined; big?: boolean }) {
  if (value == null || value === 0) return <span className="text-[12px] text-neutral-500">—</span>;
  const up = value > 0;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-black ${
        big ? "px-2.5 py-1 text-[13px]" : "px-2 py-0.5 text-[11px]"
      } ${up ? "bg-rise/10 text-rise" : "bg-fall/10 text-fall"}`}
      style={{ boxShadow: `inset 0 0 0 1px ${up ? "rgba(52,211,153,0.25)" : "rgba(248,113,113,0.25)"}` }}
    >
      {up ? "▲" : "▼"} {up ? "+" : ""}
      {value}
    </span>
  );
}

/* ---------- animated meter bar ------------------------------------------ */
export function Meter({ value, max = 100, color = "var(--ovr-gold)" }: { value: number; max?: number; color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && el.classList.add("in")),
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const w = Math.max(0.02, Math.min(1, value / max));
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-white/8">
      <div
        ref={ref}
        className="meter h-full w-full rounded-full"
        style={
          {
            "--w": w,
            background: color,
            boxShadow: "0 0 8px rgba(212,175,55,0.6)",
          } as React.CSSProperties
        }
      />
    </div>
  );
}

/* ---------- count-up number --------------------------------------------- */
export function CountUp({
  value,
  decimals = 0,
  className = "",
  prefix = "",
  suffix = "",
}: {
  value: number;
  decimals?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState<string>(() => format(value, decimals));
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShown(format(value * 0.86, decimals));
    const io = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const dur = 900;
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        setShown(format(value - (value * 0.14) * (1 - eased), decimals));
        if (p < 1) requestAnimationFrame(tick);
        else setShown(format(value, decimals));
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
  }, [value, decimals]);
  return (
    <span ref={ref} className={`stat-num ${className}`}>
      {prefix}
      {shown}
      {suffix}
    </span>
  );
}
function format(v: number, d: number) {
  if (d === 0) return Math.round(v).toLocaleString("en-US");
  return v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

/* ---------- reveal on scroll --------------------------------------------- */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      });
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ---------- section header ------------------------------------------------ */
export function SectionHead({
  icon,
  title,
  sub,
  right,
}: {
  icon?: React.ReactNode;
  title: string;
  sub?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {icon ? (
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
            {icon}
          </span>
        ) : null}
        <div>
          <h2 className="font-display text-[17px] font-bold tracking-[0.08em] text-white">{title}</h2>
          {sub ? <p className="mt-0.5 text-[12.5px] text-neutral-500">{sub}</p> : null}
        </div>
      </div>
      {right}
    </div>
  );
}

/* ---------- gold particle field (hero decor) ------------------------------- */
export function ParticleField({ count = 14 }: { count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: `${(i * 61) % 100}%`,
            bottom: `${8 + ((i * 37) % 30)}%`,
            animationDuration: `${5 + ((i * 13) % 6)}s`,
            animationDelay: `${(i * 0.9) % 5}s`,
            transform: `scale(${0.7 + ((i * 29) % 10) / 12})`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------- crown mark ------------------------------------------------------ */
export function CrownMark({ size = 26, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path
        d="M3 8.5 7 12l5-6 5 6 4-3.5-1.6 9a2 2 0 0 1-2 1.5H6.6a2 2 0 0 1-2-1.5L3 8.5Z"
        fill="none"
        stroke="url(#crownGrad)"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="crownGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5dc93" />
          <stop offset="100%" stopColor="#b98f28" />
        </linearGradient>
      </defs>
    </svg>
  );
}
