"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import SearchOverlay from "@/components/SearchOverlay";

/**
 * Client shell: desktop rail + sticky topbar + mobile drawer + search overlay
 * + a persistent decorative footer. Children stay server-rendered.
 */
export default function ShellChrome({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [lights, setLights] = useState(false);

  useEffect(() => {
    const tog = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearch((s) => !s);
      }
    };
    window.addEventListener("keydown", tog);
    return () => window.removeEventListener("keydown", tog);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--ovr-bg-0", lights ? "#07080f" : "#050609");
    document.documentElement.style.setProperty("--ovr-bg-1", lights ? "#0d1020" : "#0a0c16");
  }, [lights]);

  return (
    <div id="app-root" className="min-h-screen">
      <Sidebar open={menu} onClose={() => setMenu(false)} />
      <div className="flex min-h-screen flex-col lg:pl-[264px]">
        <Topbar
          onMenu={() => setMenu(true)}
          onSearch={() => setSearch(true)}
          lights={lights}
          toggleLights={() => setLights((l) => !l)}
        />
        <main className="mx-auto w-full max-w-content flex-1 px-4 py-7 lg:px-8">{children}</main>
        <footer className="border-t border-line px-6 py-7">
          <div className="mx-auto flex max-w-content flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-[11.5px] text-neutral-600">
            <span className="font-display text-[12px] font-bold text-neutral-500">OFFICIAL CHAD RANKINGS</span>
            <span aria-hidden>·</span>
            <span>Better men. A higher standard.</span>
            <span aria-hidden>·</span>
            <span>Sample rebuild — fictional data &amp; placeholder art only</span>
          </div>
        </footer>
      </div>
      <SearchOverlay open={search} onClose={() => setSearch(false)} />
    </div>
  );
}
