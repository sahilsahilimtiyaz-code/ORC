"use client";
import Image from "next/image";
import { FIVE_FACTIONS } from "@/lib/mockData";

/** Real Earth (NASA Blue Marble equirectangular) with faction pins + allegiance pick. */
export function WorldMapFlat({ selected, onSelect }: { selected: string | null; onSelect: (id: string) => void }) {
  return (
    <div className="map-frame relative">
      <Image
        src="/textures/earth.jpg"
        alt="World map — NASA Blue Marble equirectangular"
        width={2048}
        height={1024}
        className="earth"
      />
      {/* vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 55%, rgba(2,3,6,0.78) 100%)" }}
      />
      {FIVE_FACTIONS.map((f) => {
        const sel = selected === f.id;
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onSelect(f.id)}
            aria-label={`Faction ${f.label}`}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${f.map.x}%`, top: `${f.map.y}%` }}
          >
            <span className="relative grid place-items-center">
              <span
                className={`block rounded-full ${sel ? "bg-gold-bright" : "bg-gold/70"}`}
                style={{ width: sel ? 11 : 8, height: sel ? 11 : 8, boxShadow: "0 0 12px rgba(240,215,140,0.85)" }}
              />
              <span
                className={`absolute rounded-full border ${sel ? "h-6 w-6 border-gold/60 opacity-100" : "h-5 w-5 border-gold/30 opacity-70"}`}
                style={{ animation: "pulseSoft 2.4s ease-in-out infinite" }}
              />
              <span className="absolute left-1/2 top-[130%] -translate-x-1/2 whitespace-nowrap font-display text-[10px] font-bold tracking-[0.2em] text-gold-bright drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]">
                {f.label.toUpperCase()}
              </span>
            </span>
          </button>
        );
      })}
      <div className="pointer-events-none absolute bottom-3 right-4 rounded-full border border-line bg-black/70 px-3 py-1.5 text-[10px] font-bold tracking-[0.16em] text-neutral-400">
        REAL EARTH — NASA BLUE MARBLE · EQUIRECTANGULAR
      </div>
    </div>
  );
}
