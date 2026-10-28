import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { StatueTile } from "@/components/ui";

/** Logged-out profile state (parity with the original's "Profile not found" screen). */
export default function ProfilePage() {
  return (
    <div className="grid min-h-[64vh] place-items-center text-center">
      <div>
        <div className="float-y mx-auto w-fit opacity-80">
          <StatueTile seed={5} size={140} />
        </div>
        <Sparkles size={18} className="mx-auto mt-6 text-gold/70" aria-hidden />
        <p className="mt-4 font-display text-[22px] tracking-[0.08em] text-neutral-300">Profile not found</p>
        <p className="mt-1 text-[12.5px] text-neutral-600">No member is bound to this session in the sample rebuild.</p>
        <Link href="/" className="btn btn-gold mx-auto mt-7">
          <ArrowLeft size={15} /> Back to Rankings
        </Link>
      </div>
    </div>
  );
}
