import Link from "next/link";
import { Home } from "lucide-react";

/**
 * Parity replica: on the original, /privacy-policy is NOT a defined SPA route —
 * its footer link lands on the platform's default light "404 Page Not Found"
 * screen (evidence: analysis/orig-privacy-policy.png). Rebuilt 1:1 on purpose;
 * swap in a real policy page when desired.
 */
export default function PrivacyPolicyPage() {
  return (
    <div>
      <div className="text-[7rem] font-light leading-none text-slate-300">404</div>
      <div className="mx-auto mt-6 h-px w-24 bg-slate-300" />
      <h1 className="mt-8 text-[26px] font-semibold text-slate-800">Page Not Found</h1>
      <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-slate-500">
        The page &quot;privacy-policy&quot; could not be found in this application.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-[15px] font-medium text-slate-800 shadow-sm hover:bg-slate-50"
      >
        <Home size={15} /> Go Home
      </Link>
    </div>
  );
}
