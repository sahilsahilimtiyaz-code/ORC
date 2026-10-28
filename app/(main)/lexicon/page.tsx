"use client";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import PageHead from "@/components/PageHead";
import { LEXICON_TERMS } from "@/lib/mockData";
import { Reveal } from "@/components/ui";

export default function LexiconPage() {
  const [q, setQ] = useState("");
  const hits = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return LEXICON_TERMS;
    return LEXICON_TERMS.filter((t) => (t.term + " " + t.def).toLowerCase().includes(s));
  }, [q]);

  return (
    <div>
      <PageHead
        eyebrow="THE DICTIONARY OF THE VERSE"
        title="Chad Lexicon"
        lead="Essential terminology and definitions — searchable, and always expanding."
      />
      <div className="mt-6 flex items-center gap-3 rounded-full border border-line bg-black/30 px-5 py-3.5 transition-colors focus-within:border-gold/40">
        <Search size={17} className="shrink-0 text-gold" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search terms..."
          aria-label="Search terms"
          className="w-full bg-transparent text-[15px] text-white placeholder:text-neutral-500 focus:outline-none"
        />
        <span className="hidden text-[11px] text-neutral-600 sm:block">{hits.length} / {LEXICON_TERMS.length}</span>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {hits.map((t, i) => (
          <Reveal key={t.term} delay={i * 40}>
            <article className="panel panel-hover h-full p-5">
              <h2 className="font-display text-[17px] font-bold tracking-[0.05em] text-gold-bright">{t.term}</h2>
              <p className="mt-2 text-[13.5px] leading-relaxed text-neutral-400">{t.def}</p>
            </article>
          </Reveal>
        ))}
      </div>
      {hits.length === 0 ? (
        <p className="py-12 text-center text-[13px] text-neutral-500">No term matches “{q}”.</p>
      ) : null}
    </div>
  );
}
