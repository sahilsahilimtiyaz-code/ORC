import { Shield } from "lucide-react";
import { StatueTile } from "@/components/ui";

/** Auth wall parity with the original's access gate. */
export default function AdminPage() {
  return (
    <div className="grid min-h-[64vh] place-items-center text-center">
      <div>
        <div className="opacity-80">
          <StatueTile seed={99} size={120} />
        </div>
        <div className="mx-auto mt-5 grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-black/30 text-neutral-500">
          <Shield size={26} strokeWidth={1.5} />
        </div>
        <h1 className="mt-5 font-display text-[30px] font-bold tracking-[0.06em] text-white">Access Denied</h1>
        <p className="mt-2 text-[15px] text-neutral-500">Admin only area.</p>
      </div>
    </div>
  );
}
