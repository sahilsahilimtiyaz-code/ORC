import Link from "next/link";
import { ChevronRight, Newspaper, Radio } from "lucide-react";
import { NEWS_ITEMS } from "@/lib/mockData";
import { Reveal } from "@/components/ui";

export default function NewsPage() {
  return (
    <div>
      <div className="pt-4">
        <Link href="/" className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.14em] text-neutral-500 transition-colors hover:text-gold-bright">
          <span aria-hidden>←</span> BACK
        </Link>
        <div className="eyebrow mt-5">THE DISPATCHES</div>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-5">
          <h1 className="font-display text-[clamp(2.6rem,7vw,4.6rem)] font-black leading-none text-white">
            News<span className="text-gold">.</span>
          </h1>
          <span className="chip"><Radio size={13} className="text-gold" /> LIVE WIRE</span>
        </div>
        <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* channel promo */}
      <Reveal className="mt-6">
        <div className="panel flex items-center gap-4 p-5">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold/12 text-gold">
            <Newspaper size={18} />
          </span>
          <div className="min-w-0">
            <div className="font-display text-[16px] font-bold tracking-[0.06em] text-white">MOG NEWS — official channel</div>
            <div className="mt-0.5 text-[10.5px] font-black tracking-[0.26em] text-neutral-500">
              SAMPLE REBUILD · EXTERNAL LINKS REMOVED
            </div>
          </div>
        </div>
      </Reveal>

      {/* dispatches */}
      <div className="mt-5 space-y-3">
        {NEWS_ITEMS.map((n, i) => (
          <Reveal key={n.title} delay={i * 60}>
            <article className="panel panel-hover flex items-center gap-4 p-5">
              <span className="w-16 shrink-0 font-display text-[13px] font-bold text-gold">{n.time}</span>
              <span className="min-w-0 flex-1 border-l border-line pl-4">
                <span className="block text-[15.5px] font-bold text-white">{n.title}</span>
                <span className="mt-1 block text-[12px] text-neutral-500">Sample placeholder dispatch — full copy lives with your feed.</span>
              </span>
              <ChevronRight size={17} className="shrink-0 text-neutral-600" />
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
