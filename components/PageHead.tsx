import Link from "next/link";

/**
 * Interior-page header: gold eyebrow, serif display title, muted lead.
 * No back-link (the sidebar rail replaces it) — aligned with the new comps.
 */
export default function PageHead({
  eyebrow,
  title,
  lead,
  right,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="pt-4">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.14em] text-neutral-500 transition-colors hover:text-gold-bright"
      >
        <span aria-hidden>←</span> BACK
      </Link>
      {eyebrow ? <div className="eyebrow mt-5">{eyebrow}</div> : null}
      <div className="mt-2 flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="font-display text-[clamp(2.1rem,4.6vw,3.2rem)] font-bold leading-[1.08] text-white">
            {title}
            <span className="text-gold">.</span>
          </h1>
          {lead ? <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-neutral-400">{lead}</p> : null}
        </div>
        {right}
      </div>
      <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}
