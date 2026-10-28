"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crown, Home, Menu, Moon, Newspaper, Search, Shield, Sun, TrendingUp, Trophy } from "lucide-react";
import { MiniBrand } from "@/components/Sidebar";

const TOP_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/rankings", label: "Rankings", icon: Trophy },
  { href: "/movements", label: "Movements", icon: TrendingUp },
  { href: "/hall-of-fame", label: "Hall of Fame", icon: Crown },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/methodology", label: "Methodology", icon: Shield },
];

/** Topbar: hamburger + brand, center pill nav (wide screens), search / lights / sign-in. */
export default function Topbar({
  onMenu,
  onSearch,
  lights,
  toggleLights,
}: {
  onMenu: () => void;
  onSearch: () => void;
  lights: boolean;
  toggleLights: () => void;
}) {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[#06070b]/88 backdrop-blur-md">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-7">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open menu"
          className="rounded-xl border border-line p-2.5 text-neutral-300 transition-colors hover:border-gold/40 hover:text-gold-bright lg:hidden"
        >
          <Menu size={18} />
        </button>
        <MiniBrand />
        <nav aria-label="Sections" className="mx-auto hidden items-center gap-1 xl:flex whitespace-nowrap">
          {TOP_ITEMS.map((t) => {
            const active = pathname === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-[13.5px] font-medium transition-all whitespace-nowrap ${
                  active
                    ? "bg-gold/10 text-gold-bright shadow-[inset_0_0_0_1px_rgba(212,175,55,0.35)]"
                    : "text-neutral-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <t.icon size={15} /> {t.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2 whitespace-nowrap">
          <button
            type="button"
            onClick={onSearch}
            aria-label="Search figures"
            className="rounded-full border border-line p-2.5 text-neutral-300 transition-all hover:border-gold/40 hover:text-gold-bright"
          >
            <Search size={17} />
          </button>
          <button
            type="button"
            onClick={toggleLights}
            aria-pressed={lights}
            aria-label={lights ? "Dim the lighting" : "Cinematic lighting"}
            title="Toggle lighting"
            className="rounded-full border border-line p-2.5 text-neutral-300 transition-all hover:border-gold/40 hover:text-gold-bright"
          >
            {lights ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <Link
            href="/profile"
            className="btn hidden !rounded-full !px-4 !py-2 !text-[13px] sm:inline-flex whitespace-nowrap"
            style={{
              border: "1px solid rgba(212,175,55,0.4)",
              background: "linear-gradient(115deg, rgba(212,175,55,0.14), rgba(212,175,55,0.04))",
              color: "#f0d78c",
            }}
          >
            Sign in <span aria-hidden>+</span>
          </Link>
        </div>
      </div>
      {/* top hairline sheen */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
    </header>
  );
}
