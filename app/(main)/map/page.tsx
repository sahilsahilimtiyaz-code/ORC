"use client";
import Link from "next/link";
import { useState } from "react";
import { Globe as GlobeIcon, Hand, Lock } from "lucide-react";
import PageHead from "@/components/PageHead";
import Globe from "@/components/Globe";
import { WorldMapFlat } from "@/components/WorldMapFlat";
import { FIVE_FACTIONS } from "@/lib/mockData";
import { Reveal } from "@/components/ui";

const FACTIONS_FOR_GLOBE = FIVE_FACTIONS.map((f) => ({ id: f.id, label: f.label, lat: f.lat, lon: f.lon }));

export default function MapPage() {
  const [sel, setSel] = useState<string | null>(null);
  const picked = FIVE_FACTIONS.find((f) => f.id === sel);

  return (
    <div>
      <PageHead
        eyebrow="SIX FACTIONS · ONE ALLEGIANCE"
        title="Looksmaxxing Verse: Mog Map"
        lead="Explore the real world, meet its factions and choose where you belong. Your allegiance is permanent."
        right={
          <div className="chip">
            <Hand size={13} className="text-gold" /> Drag the globe to spin
          </div>
        }
      />

      {/* Globe flagship */}
      <div className="glow-ring relative mt-8 overflow-hidden rounded-3xl border border-line bg-[#04050a] p-6">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-royal/10 blur-3xl" />
          <div className="absolute left-[18%] top-[12%] h-40 w-40 rounded-full bg-gold/10 blur-3xl" />
        </div>
        <div className="relative">
          <div className="flex items-center justify-center gap-2 text-[11px] font-black tracking-[0.3em] text-gold">
            <GlobeIcon size={14} /> THE VERSE GLOBE
          </div>
          <div className="relative mx-auto mt-2 w-fit pb-2">
            <Globe
              size={420}
              factions={FACTIONS_FOR_GLOBE}
              selectedId={sel}
              onSelect={(id) => setSel(id)}
              className="animate-none"
            />
          </div>
          <div className="mx-auto mt-1 flex max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {FIVE_FACTIONS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSel(f.id)}
                className={`flex items-center gap-2 text-[12px] font-semibold transition-colors ${
                  sel === f.id ? "text-gold-bright" : "text-neutral-400 hover:text-white"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${sel === f.id ? "bg-gold-bright" : "bg-gold/60"}`} />
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Flat real map */}
      <Reveal className="mt-6">
        <WorldMapFlat selected={sel} onSelect={setSel} />
      </Reveal>

      {picked && (
        <div className="reveal in mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-gold/35 bg-gold/8 px-5 py-4">
          <Lock size={15} className="text-gold" />
          <span className="text-[14px] text-neutral-200">
            Allegiance declared: <b className="font-display text-gold-bright">{picked.label}</b> — {picked.blurb}
          </span>
          <button type="button" onClick={() => setSel(null)} className="ml-auto text-[12px] font-bold text-neutral-500 hover:text-white">
            Reset (sample state)
          </button>
        </div>
      )}

      {/* faction cards */}
      <div className="mt-6 grid gap-4 pb-2 md:grid-cols-3">
        {FIVE_FACTIONS.map((f, i) => {
          const isPicked = sel === f.id;
          return (
            <Reveal key={f.id} delay={i * 60}>
              <button
                type="button"
                onClick={() => setSel(f.id)}
                className={`panel panel-hover w-full p-5 text-left ${isPicked ? "!border-gold/55 shadow-glow" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-[16px] font-bold tracking-[0.06em] text-white">{f.label}</span>
                  <span className={`h-2.5 w-2.5 rounded-full ${isPicked ? "bg-gold-bright" : "bg-white/15"}`} />
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-neutral-500">{f.blurb}</p>
                <div className="mt-3 text-[10.5px] font-black tracking-[0.22em] text-gold">
                  {isPicked ? "ALLEGIANCE LOCKED" : "DECLARE ALLEGIANCE"}
                </div>
              </button>
            </Reveal>
          );
        })}
      </div>

      <p className="mt-4 pb-2 text-center text-[11.5px] text-neutral-600">
        Earth imagery: NASA Blue Marble (public domain). Faction state is a memory-held sample; reload resets it.
      </p>
    </div>
  );
}
