import { ExternalLink, HeartHandshake, Mail } from "lucide-react";
import PageHead from "@/components/PageHead";
import { CONTACT_EMAILS } from "@/lib/mockData";
import { Reveal } from "@/components/ui";

export default function SupportPage() {
  return (
    <div>
      <PageHead
        eyebrow="KEEP THE LIGHTS GOLD"
        title="Support Our Team"
        lead="The association runs on volunteer nights and your support."
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5 text-[15.5px] leading-relaxed text-neutral-400">
          <p>
            We&apos;re a small, passionate team that puts in a lot of work to bring you the most
            up-to-date rankings in the community. This paragraph is placeholder sample copy.
          </p>
          <p>
            Maintaining and growing this website takes real effort — servers, editorial nights and
            endless tie-breaker meetings. Support keeps the standings free for everyone. This
            paragraph is also placeholder sample copy.
          </p>
          <Reveal>
            <div className="rounded-2xl border border-line bg-black/25 p-5">
              <div className="flex items-center gap-2 text-[10.5px] font-black tracking-[0.3em] text-gold">
                <Mail size={13} /> DIRECT LINE TO THE DEVELOPERS
              </div>
              <ul className="mt-3 flex flex-wrap gap-2">
                {CONTACT_EMAILS.map((a) => (
                  <li key={a}>
                    <a href={`mailto:${a}`} className="chip hover:!border-gold/45 hover:!text-gold-bright font-mono !text-[12.5px]">
                      {a}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
        <aside className="space-y-4">
          <button
            type="button"
            disabled
            className="btn w-full justify-center gap-2 !rounded-2xl !py-4 !text-[15px] font-bold text-black"
            style={{
              background: "linear-gradient(115deg,#f3dc8d,#d4af37 55%,#a8842a)",
              boxShadow: "0 0 30px rgba(212,175,55,0.35), inset 0 1px 0 rgba(255,255,255,0.5)",
              opacity: 0.92,
            }}
          >
            Donate <ExternalLink size={15} />
          </button>
          <div className="flex items-start gap-2.5 rounded-2xl border border-line bg-black/30 px-4 py-3.5 text-[12px] leading-relaxed text-neutral-500">
            <HeartHandshake size={15} className="mt-0.5 shrink-0 text-gold" />
            Payments are disabled in the placeholder rebuild — the original donation and subscription
            links were removed per IP policy. Wire this button to your own provider to go live.
          </div>
        </aside>
      </div>
    </div>
  );
}
