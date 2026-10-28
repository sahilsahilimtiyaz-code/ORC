"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Building2,
  Crown,
  Globe,
  HeartHandshake,
  Home,
  Newspaper,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Swords,
  ThumbsUp,
  TrendingUp,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { CrownMark } from "@/components/ui";
import type { LucideIcon } from "lucide-react";

const MAIN_NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/rankings", label: "Rankings", icon: Trophy },
  { href: "/movements", label: "Movements", icon: TrendingUp },
  { href: "/hall-of-fame", label: "Hall of Fame", icon: Crown },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/methodology", label: "Methodology", icon: Shield },
  { href: "/review", label: "Data & Review", icon: ShieldCheck },
];

type NavItem = { href: string; label: string; icon: LucideIcon };
type NavGroup = { head: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    head: "THE ARENA",
    items: [
      { href: "/battle", label: "Chad Battle", icon: Swords },
      { href: "/vote", label: "Community Vote", icon: ThumbsUp },
      { href: "/map", label: "Verse Globe", icon: Globe },
    ],
  },
  {
    head: "LIBRARY & CLUB",
    items: [
      { href: "/lexicon", label: "Lexicon", icon: BookOpen },
      { href: "/community", label: "Community", icon: Users },
      { href: "/membership", label: "Membership", icon: Star },
    ],
  },
  {
    head: "ASSOCIATION",
    items: [
      { href: "/memberbenefits", label: "Member Benefits", icon: Sparkles },
      { href: "/about", label: "About", icon: Building2 },
      { href: "/contact", label: "Contact", icon: HeartHandshake },
      { href: "/analytics", label: "Site Analytics", icon: BarChart3 },
    ],
  },
];

export function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const row = (item: NavItem) => {
    const { href, label, icon: Icon } = item;
    const active = pathname === href;
    return (
      <Link
        key={href}
        href={href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-all duration-300 ${
          active
            ? "border border-gold/35 bg-gradient-to-r from-gold/15 to-gold/5 text-gold-bright shadow-[0_0_18px_rgba(212,175,55,0.15)]"
            : "border border-transparent text-neutral-400 hover:bg-white/4 hover:text-white"
        }`}
      >
        <Icon size={17} />
        {label}
        {active ? <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gold" style={{ boxShadow: "0 0 8px rgba(240,215,140,0.9)" }} /> : null}
      </Link>
    );
  };
  return (
    <nav aria-label="Primary" className="space-y-6">
      <div className="space-y-1">{MAIN_NAV.map((n) => row(n))}</div>
      {NAV_GROUPS.map((g) => (
        <div key={g.head} className="space-y-1">
          <div className="px-3 pb-1 pt-2 text-[10px] font-black tracking-[0.28em] text-neutral-600">{g.head}</div>
          {g.items.map((n) => row(n))}
        </div>
      ))}
    </nav>
  );
}

/** Fixed desktop rail + mobile drawer shell (brand colors per comps). */
export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  return (
    <>
      {/* desktop rail */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col border-r border-line bg-[#07080d]/95 lg:flex">
        <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar px-3 py-5">
          <BrandMark />
          <div className="mt-6 flex-1">
            <NavList />
          </div>
          <div className="mt-6 space-y-4 px-1 pb-2">
            <div className="text-[11px] font-black leading-5 tracking-[0.26em] text-neutral-600">
              BETTER
              <br /> MEN
              <br />
              <span className="text-gold/80">A HIGHER</span>
              <br />
              <span className="text-gold/80">STANDARD.</span>
            </div>
            <div className="opacity-40"><CrownMark size={20} /></div>
            <div className="rounded-2xl border border-line bg-panel2/80 p-4">
              <div className="text-[13.5px] font-bold text-white">Join the Community</div>
              <p className="mt-1 text-[12px] leading-relaxed text-neutral-500">
                Be part of the real chad movement.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push("/membership");
                }}
                className="btn btn-ghost mt-3 w-full justify-between !rounded-full !text-[13px]"
              >
                Join Now <span aria-hidden>→</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* mobile drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}>
        <div
          onClick={onClose}
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          aria-hidden="true"
        />
        <aside
          className={`absolute inset-y-0 left-0 flex w-[280px] flex-col overflow-y-auto border-r border-line bg-[#07080d] transition-transform duration-300 no-scrollbar ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-3 py-4">
            <BrandMark compact />
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="rounded-lg border border-line p-2 text-neutral-400 hover:text-white"
            >
              <X size={17} />
            </button>
          </div>
          <div className="flex-1 px-3 pb-8">
            <NavList onNavigate={onClose} />
            <div className="mt-6 rounded-2xl border border-line bg-panel2/80 p-4">
              <div className="text-[13.5px] font-bold text-white">Join the Community</div>
              <p className="mt-1 text-[12px] text-neutral-500">Be part of the real chad movement.</p>
              <Link onClick={onClose} href="/membership" className="btn btn-ghost mt-3 w-full justify-between !text-[13px]">
                Join Now <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

export function BrandMark({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.push("/")}
      className="group flex items-center gap-2.5 rounded-xl px-1.5 py-1 text-left"
    >
      <span className="relative grid place-items-center">
        <CrownMark size={compact ? 22 : 26} className="transition-transform duration-500 group-hover:-translate-y-0.5" />
      </span>
      <span className="leading-none">
        <span className="gold-leaf font-display text-[26px] font-bold tracking-[0.04em]">OCR</span>
        {!compact && (
          <span className="mt-1.5 block text-[10.5px] font-bold tracking-[0.18em] text-white/90">
            OFFICIAL CHAD RANKINGS
          </span>
        )}
        {!compact && (
          <span className="mt-0.5 block text-[8.5px] font-black tracking-[0.3em] text-gold/90">
            REAL MEN. REAL STANDARDS.
          </span>
        )}
      </span>
    </button>
  );
}

export function MiniBrand() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <CrownMark size={20} />
      <span className="gold-leaf font-display text-[20px] font-bold">OCR</span>
      <span className="hidden truncate text-[10px] font-bold tracking-[0.22em] text-white/80 sm:block">
        OFFICIAL CHAD RANKINGS
      </span>
    </Link>
  );
}

/* re-export for the topbar center nav */
export { MAIN_NAV };
export const SearchIcon = Search;
