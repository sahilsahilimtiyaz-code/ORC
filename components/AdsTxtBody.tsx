import type { Metadata } from "next";
import PageHead from "@/components/PageHead";

export const metadata: Metadata = { title: "ads.txt — Official Chad Rankings" };

const BODY = `# Placeholder ads.txt for the sample rebuild.
# The original site served its live advertising-network
# authorization here; no network is configured in this
# rebuild, so no records are published. Replace these
# lines with your own ads.txt records.`;

export function AdsTxtBody() {
  return (
    <div>
      <PageHead title="Ads.txt" />
      <pre className="mt-8 overflow-x-auto rounded-xl border border-white/10 bg-black/60 p-5 font-display text-[13px] leading-relaxed text-neutral-400">
        {BODY}
      </pre>
    </div>
  );
}
