"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { RANK_TABLE } from "@/lib/mockData";
import { PhotoAvatar } from "@/components/ui";

/** Global figure search: filters the roster, Enter navigates to Rankings. */
export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 40);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const hits = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return RANK_TABLE.slice(0, 8);
    return RANK_TABLE.filter((r) => (r.name + " " + r.archetype + " " + (r.realName ?? "")).toLowerCase().includes(s)).slice(0, 24);
  }, [q]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} aria-hidden="true" />
      <div className="relative mx-auto mt-28 w-[min(620px,92vw)] overflow-hidden rounded-3xl border border-gold/25 bg-[#0b0d14]/95 shadow-glow-lg">
        <div className="flex items-center gap-3 border-b border-line px-5 py-4">
          <Search size={17} className="text-gold" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search ranked figures..."
            className="w-full bg-transparent text-[15px] text-white placeholder:text-neutral-500 focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && hits[0]) {
                onClose();
                router.push("/rankings");
              }
            }}
          />
          <button onClick={onClose} aria-label="Close search" className="rounded-lg p-1.5 text-neutral-500 hover:text-white">
            <X size={16} />
          </button>
        </div>
        <ul className="max-h-[46vh] overflow-y-auto p-2">
          {hits.map((r) => (
            <li key={r.rank}>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push("/rankings");
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/5"
              >
                <span className={`grid h-8 w-10 place-items-center rounded-lg font-display text-[13px] font-bold ${r.rank === 1 ? "bg-gold/15 text-gold-bright" : "bg-white/5 text-neutral-300"}`}>
                  {String(r.rank).padStart(2, "0")}
                </span>
                <PhotoAvatar url={r.photo} name={r.name} seed={r.rank * 5} gold={r.rank === 1} size={30} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold text-white">{r.name}</span>
                  <span className="block truncate text-[12px] text-neutral-500">{r.archetype}</span>
                </span>
                <span className="font-display text-[14px] font-bold text-gold-bright stat-num">{r.score != null ? r.score.toFixed(1) : "—"}</span>
              </button>
            </li>
          ))}
          {hits.length === 0 ? (
            <li className="px-4 py-8 text-center text-[13px] text-neutral-500">No figure matches “{q}”.</li>
          ) : null}
        </ul>
        <div className="border-t border-line px-5 py-2.5 text-[11px] text-neutral-600">
          Official board roster — press Enter to open the Global Rankings · Esc to close
        </div>
      </div>
    </div>
  );
}
