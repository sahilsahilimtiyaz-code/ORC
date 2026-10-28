import type { ReactNode } from "react";

/** Bare chrome — mirrors the original's default 404 shell (no header/footer). */
export default function BareLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-lg place-items-center px-6 text-center">
        {children}
      </div>
    </div>
  );
}
