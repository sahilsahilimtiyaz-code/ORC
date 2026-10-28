import PageHead from "@/components/PageHead";
import { BadgeCheck, Clock, FileWarning, Scale, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { IMPORT_META, datasetStats, reviewQueue, verifiedDirectory } from "@/lib/creators";
import { Reveal, VerificationChip } from "@/components/ui";

const POLICY = [
  {
    icon: Scale,
    title: "Source-Driven Ranks",
    body: "Every rank, influence score and movement on this site is imported verbatim from the officialchadrankings.com PublicFigure dataset — the live leaderboard's own public records. No rank is assigned by guesswork, AI judgement or community noise.",
  },
  {
    icon: ShieldCheck,
    title: "Traceable Identities",
    body: "Each record carries its display name, documented aliases where established, and links to official public profiles found during identity verification. Nothing is published as a real person without at least the official source's own documentation.",
  },
  {
    icon: BadgeCheck,
    title: "Photo Provenance",
    body: "Portraits stream (hotlinked, never rehosted) from their recorded origins — the official board's own leaderboard assets or the creator's official channel avatar. Failed loads render an explicit placeholder tile, never a substitute face.",
  },
  {
    icon: FileWarning,
    title: "No Fabricated Data",
    body: "Fields the source does not publish (rank history series, live vote tallies) are rendered as explicit empty states rather than invented trends. Role records and mystery slots are excluded from public surfaces.",
  },
];

const STATUS_LABEL: Record<string, string> = {
  verified: "VERIFIED",
  needs_verification: "PENDING REVIEW",
  disputed: "DISPUTED",
  rejected: "ROLE RECORD",
};

export default function ReviewPage() {
  const queue = reviewQueue();
  const stats = datasetStats();
  const directory = verifiedDirectory();
  const pending = queue.filter((c) => c.verificationStatus === "needs_verification");
  const rejected = queue.filter((c) => c.verificationStatus === "rejected");

  return (
    <div>
      <PageHead
        eyebrow="DATA INTEGRITY · TRANSPARENCY"
        title="Data & Review"
        lead="Every name, rank and photograph on this site is traceable. This page documents the pipeline and holds the live review queue."
        right={
          <div className="flex max-w-xs gap-3 border-l-[3px] border-gold pl-4 text-[13px] leading-relaxed text-neutral-400">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-gold" />
            Data integrity matters more than filled profile cards.
          </div>
        }
      />

      {/* pipeline summary */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "ON BOARD", value: stats.board, icon: Scale, tone: "text-white" },
          { label: "VERIFIED", value: stats.verified, icon: BadgeCheck, tone: "text-gold-bright" },
          { label: "PENDING REVIEW", value: stats.pending, icon: Clock, tone: "text-amber-300" },
          { label: "ROLE RECORDS", value: stats.rejected, icon: FileWarning, tone: "text-neutral-500" },
        ].map(({ label, value, icon: Icon, tone }, i) => (
          <Reveal key={label} delay={i * 60}>
            <div className="rounded-2xl border border-line bg-black/25 p-4">
              <Icon size={15} className="text-gold" />
              <div className={`mt-2 font-display text-[26px] font-bold stat-num ${tone}`}>{value}</div>
              <div className="text-[10px] font-black tracking-[0.2em] text-neutral-500">{label}</div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-line bg-black/30 px-5 py-4 text-[12.5px] leading-relaxed text-neutral-400">
        <span className="font-bold text-white">Import snapshot:</span> {IMPORT_META.importedAt.slice(0, 10)} ·{" "}
        <span className="text-neutral-300">{IMPORT_META.source}</span> via its public dataset endpoint ·{" "}
        {stats.withPhotos} of {stats.board} board figures carry a source-recorded photo.
        Sample/illustrative surfaces (vote arena, battle bracket, community posts) are labelled as samples and use
        explicit placeholder tiles — they never present a real identity.
      </div>

      {/* policy pillars */}
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {POLICY.map((p, i) => (
          <Reveal key={p.title} delay={i * 70}>
            <div className="panel h-full p-5">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-gold/12 text-gold">
                  <p.icon size={15} />
                </span>
                <h2 className="font-display text-[15px] font-bold tracking-[0.08em] text-white">{p.title}</h2>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-neutral-400">{p.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* verified directory (separate research database — unranked by design) */}
      {directory.length > 0 ? (
        <div className="mt-8">
          <h2 className="font-display text-[18px] font-bold tracking-[0.1em] text-white">
            VERIFIED CREATORS DIRECTORY
          </h2>
          <p className="mt-1 text-[12px] text-neutral-500">
            Externally corroborated looksmaxxing &amp; grooming creators — kept separate from the official board&apos;s
            ranking (no rank is implied).
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {directory.map((c, i) => (
              <Reveal key={c.id} delay={i * 40}>
                <div className="flex items-center gap-3 rounded-2xl border border-line bg-black/25 p-4">
                  <span className="grid h-9 w-11 shrink-0 place-items-center rounded-xl bg-gold/12 font-display text-[13px] font-bold text-gold-bright">
                    DIR
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14.5px] font-bold text-white">{c.displayName}</div>
                    <div className="truncate text-[12px] text-neutral-500">
                      {c.category ?? "creator"}{c.realName ? ` · ${c.realName}` : ""}
                    </div>
                  </div>
                  <VerificationChip status="verified" compact />
                  {c.sourceProfileUrl ? (
                    <a
                      href={c.sourceProfileUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="rounded-full border border-line px-2.5 py-1 text-[11px] text-neutral-300 transition-colors hover:border-gold/40 hover:text-gold-bright"
                    >
                      Profile ↗
                    </a>
                  ) : null}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      ) : null}

      {/* pending review queue */}
      <div className="mt-8">
        <h2 className="font-display text-[18px] font-bold tracking-[0.1em] text-white">REVIEW QUEUE</h2>
        <p className="mt-1 text-[12px] text-neutral-500">
          {pending.length} board figures whose identity corroboration is still in progress, plus {rejected.length}{" "}
          source role records held back from public surfaces.
        </p>
        <div className="mt-4 overflow-hidden rounded-2xl border border-line">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-line bg-black/40 text-[9.5px] font-black tracking-[0.2em] text-neutral-500">
                <th className="px-4 py-3">RANK</th>
                <th className="px-3 py-3">FIGURE</th>
                <th className="px-3 py-3">STATUS</th>
                <th className="hidden px-3 py-3 md:table-cell">NOTES</th>
                <th className="px-3 py-3 text-right">SOURCE</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((c) => (
                <tr key={c.id} className="border-b border-line/50 last:border-0 hover:bg-white/[0.03]">
                  <td className="px-4 py-3 font-display text-[13px] font-bold text-neutral-300">
                    {c.rank && c.rank <= 100 ? String(c.rank).padStart(2, "0") : "—"}
                  </td>
                  <td className="px-3 py-3 text-[13.5px] font-bold text-white">{c.displayName}</td>
                  <td className="px-3 py-3">
                    <VerificationChip
                      status={c.verificationStatus}
                      compact={c.verificationStatus === "needs_verification"}
                    />
                  </td>
                  <td className="hidden max-w-[420px] truncate px-3 py-3 text-[12px] text-neutral-500 md:table-cell">
                    {c.verificationNotes}
                  </td>
                  <td className="px-3 py-3 text-right">
                    {c.sourceProfileUrl ? (
                      <a
                        href={c.sourceProfileUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="text-[11.5px] font-semibold text-neutral-400 transition-colors hover:text-gold-bright"
                      >
                        official source ↗
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11.5px] text-neutral-600">
          Status vocabulary — <span className="text-gold-bright">verified</span>: externally corroborated;{" "}
          <span className="text-amber-300">pending review</span>: imported from the official source, identity check
          in progress; <span className="text-neutral-400">role record</span>: the board&apos;s own non-person slots
          (mystery reveals, news desk), never rendered as creators.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/rankings" className="btn btn-gold">
          See the verified leaderboard <span aria-hidden>→</span>
        </Link>
        <Link href="/methodology" className="btn btn-ghost">
          Methodology
        </Link>
      </div>
    </div>
  );
}
