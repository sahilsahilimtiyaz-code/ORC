"use client";
import { useState } from "react";
import { Info, Lock, Sparkles } from "lucide-react";
import PageHead from "@/components/PageHead";
import { MEMBER_BENEFITS } from "@/lib/mockData";
import { Reveal, StatueTile } from "@/components/ui";

export default function MemberBenefitsPage() {
  const [signedIn, setSignedIn] = useState(false);
  return (
    <div>
      <PageHead
        eyebrow="MEMBERS ONLY"
        title="Members"
        lead="Please log in to access Members Only features."
      />
      <Reveal className="mt-6">
        <div className="panel p-10 text-center">
          {!signedIn ? (
            <>
              <div className="mx-auto w-fit opacity-70">
                <StatueTile seed={7} size={110} />
              </div>
              <div className="mt-2 flex items-center justify-center gap-2 text-gold">
                <Info size={13} />
                <span className="eyebrow">RESTRICTED AREA</span>
              </div>
              <h2 className="mt-3 font-display text-[26px] font-bold text-white">The member vault</h2>
              <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-neutral-500">
                Early cycle feeds, live chat, internal server and the battle rewards exchange live
                behind this door. Sign in with the sample session to preview.
              </p>
              <button
                type="button"
                onClick={() => setSignedIn(true)}
                className="btn btn-gold mx-auto mt-6"
              >
                <Lock size={14} /> Member Sign In
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center gap-2 text-gold">
                <Sparkles size={13} />
                <span className="eyebrow">SIGNED IN AS PLACEHOLDER-MEMBER</span>
              </div>
              <h2 className="mt-3 font-display text-[24px] font-bold text-white">Your benefits</h2>
              <ul className="mx-auto mt-6 max-w-md space-y-3 text-left">
                {MEMBER_BENEFITS.map((b) => (
                  <li key={b} className="flex items-start gap-3 rounded-xl border border-line bg-black/30 px-4 py-3">
                    <span className="mt-0.5 text-gold">◆</span>
                    <span className="text-[14px] text-neutral-200">{b}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[11.5px] text-neutral-600">Mock session — reload resets state.</p>
            </>
          )}
        </div>
      </Reveal>
    </div>
  );
}
