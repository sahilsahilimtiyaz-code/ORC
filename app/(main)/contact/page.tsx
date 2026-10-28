"use client";
import { useState } from "react";
import { Check, Copy, Mail, Megaphone, Send } from "lucide-react";
import PageHead from "@/components/PageHead";
import { CONTACT_EMAILS } from "@/lib/mockData";
import { Reveal } from "@/components/ui";

export default function ContactPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (addr: string) => {
    try {
      await navigator.clipboard.writeText(addr);
    } catch {
      /* clipboard blocked — selection fallback not needed for the sample */
    }
    setCopied(addr);
    setTimeout(() => setCopied((c) => (c === addr ? null : c)), 1600);
  };

  return (
    <div>
      <PageHead
        eyebrow="DEVELOPER REACH & FEEDBACK"
        title="Contact"
        lead="Questions, feedback or business inquiries — reach the developers directly. Below are the official channels of the association."
      />

      {/* The three official mailboxes */}
      <Reveal className="mt-6">
        <div className="panel glow-ring relative overflow-hidden p-6">
          <div className="flex items-center gap-2 text-[10.5px] font-black tracking-[0.3em] text-gold">
            <Mail size={14} /> OFFICIAL MAILBOXES
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {CONTACT_EMAILS.map((addr, i) => (
              <div
                key={addr}
                className="group rounded-2xl border border-line bg-black/30 p-4 transition-all duration-300 hover:border-gold/40 hover:bg-gold/5"
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold/12 text-gold">
                    <Mail size={15} />
                  </span>
                  <span className="text-[10px] font-black tracking-[0.2em] text-neutral-600">
                    CHANNEL {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="mt-3 break-all font-mono text-[14.5px] font-semibold text-neutral-100 transition-colors group-hover:text-gold-bright">
                  {addr}
                </div>
                <div className="mt-4 flex gap-2">
                  <a href={`mailto:${addr}`} className="btn btn-gold !px-4 !py-2 !text-[12px]">
                    <Send size={13} /> Write
                  </a>
                  <button
                    type="button"
                    onClick={() => copy(addr)}
                    className="btn btn-ghost !px-3.5 !py-2 !text-[12px]"
                    aria-label={`Copy ${addr}`}
                  >
                    {copied === addr ? <Check size={13} className="text-rise" /> : <Copy size={13} />}
                    {copied === addr ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 border-t border-line pt-3.5 text-[11.5px] text-neutral-600">
            These mailbox names are wired as mailto links in the sample rebuild — they only open your
            local mail client. Nothing is sent automatically.
          </p>
        </div>
      </Reveal>

      {/* Channels grid */}
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Reveal delay={60}>
          <div className="panel panel-hover relative overflow-hidden border-t-[3px] !border-t-gold p-6">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold/12 text-gold">
              <Megaphone size={17} />
            </span>
            <h2 className="mt-4 font-display text-[18px] font-bold text-white">Business &amp; Sponsorship</h2>
            <p className="mt-2 text-[13.5px] leading-relaxed text-neutral-400">
              Advertising, sponsorship and acquisition inquiries are handled by the association
              office — use any mailbox above and mark the subject line &ldquo;BUSINESS&rdquo;.
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="panel panel-hover relative overflow-hidden border-t-[3px] !border-t-gold p-6">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold/12 text-gold">
              <Send size={17} />
            </span>
            <h2 className="mt-4 font-display text-[18px] font-bold text-white">Community Feedback</h2>
            <p className="mt-2 text-[13.5px] leading-relaxed text-neutral-400">
              Every ranking dispute, lexicon suggestion and rules remark is read through candidate
              review each cycle. Feedback threads also run in the community forum.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
