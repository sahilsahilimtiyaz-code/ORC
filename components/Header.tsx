"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Megaphone } from "lucide-react";

const NAV = [
  { href: "/", label: "Rankings" },
  { href: "/news", label: "News" },
  { href: "/vote", label: "Vote" },
  { href: "/map", label: "Map" },
  { href: "/battle", label: "Battle" },
  { href: "/lexicon", label: "Lexicon" },
  { href: "/community", label: "Community" },
  { href: "/memberbenefits", label: "Members" },
];

/** Placeholder crest — replaces the original graphic asset per instructions. */
function Crest() {
  return (
    <span
      aria-hidden="true"
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-gold/70 bg-gradient-to-b from-[#2a2417] to-black text-[10px] font-black tracking-tight text-gold"
    >
      CR
    </span>
  );
}

export function Marquee() {
  const line = "for advertising, sponsorship, or acquisition enquiries";
  return (
    <div className="relative overflow-hidden border-b border-white/10 bg-[#101010] py-1.5 text-[13px]">
      <div className="re-marquee-track">
        {[0, 1].map((k) => (
          <span key={k} className="flex items-center gap-3 pr-8 text-news-copy/90">
            <span className="font-bold text-gold animate-[re-coin-drift_6s_ease-in-out_infinite]">📢</span>
            <a className="text-neutral-300 underline-offset-2 hover:underline" href="/contact">
              <span className="font-bold text-gold">Contact the association</span> {line}
            </a>
            <span className="font-bold text-gold animate-[re-coin-drift_6s_ease-in-out_infinite]">📢</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  return (
    <>
      <Marquee />
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur">
        <div className="mx-auto flex max-w-content items-center gap-6 px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <Crest />
            <span className="leading-tight">
              <span className="block text-[15px] font-black tracking-[0.14em] text-white">
                CHAD RANKINGS
              </span>
              <span className="block text-[9px] font-bold tracking-[0.22em] text-gold">
                OFFICIAL ASSOCIATION
              </span>
            </span>
          </Link>
          <nav aria-label="Main" className="hidden flex-1 items-center gap-1 md:flex">
            {NAV.map((n) => {
              const active = pathname === n.href;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`rounded-md border px-3.5 py-2 text-[15px] transition-colors ${
                    active
                      ? "border-white/15 bg-[#161616] text-white"
                      : "border-transparent text-neutral-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </div>
        {/* gold divider bar under header (evidence: 3px gold line) */}
        <div className="h-[3px] w-full bg-gold" />
      </header>
    </>
  );
}
