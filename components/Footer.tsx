import Link from "next/link";

const GROUPS = [
  {
    head: "RANKINGS",
    links: [
      ["Leaderboard", "/"],
      ["Vote", "/vote"],
      ["Battle", "/battle"],
      ["Analytics", "/analytics"],
    ],
  },
  {
    head: "REFERENCE",
    links: [
      ["Lexicon", "/lexicon"],
      ["Ranking Criteria", "/rules"],
      ["News", "/news"],
      ["Community", "/community"],
    ],
  },
  {
    head: "ASSOCIATION",
    links: [
      ["About Us", "/about"],
      ["Membership", "/membership"],
      ["Contact", "/contact"],
      ["Privacy Policy", "/privacy-policy"],
    ],
  },
];

/** Placeholder crest stamp (original uses a laurel ring mark; asset not copied). */
function Stamp() {
  return (
    <span
      aria-hidden="true"
      className="grid h-14 w-14 place-items-center rounded-full border-2 border-gold/70 text-[15px] font-black tracking-tight text-gold"
    >
      CR
    </span>
  );
}

export default function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden border-t border-white/10 bg-[#090909]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 left-6 select-none whitespace-nowrap font-black leading-none text-white/[0.04]"
        style={{ fontSize: "clamp(7rem, 20vw, 15rem)" }}
      >
        RANKINGS
      </div>
      <div className="relative mx-auto grid max-w-content gap-10 px-4 py-12 md:grid-cols-4">
        <div>
          <Stamp />
          <div className="mt-5 text-[19px] font-black leading-6 tracking-[0.12em] text-white">
            CHAD
            <br />
            RANKINGS
          </div>
          <div className="mt-1 text-[10px] font-bold tracking-[0.22em] text-gold">
            OFFICIAL STANDINGS
          </div>
          <p className="mt-4 max-w-[220px] text-[13px] leading-relaxed text-neutral-500">
            The official leaderboard of the Looksmaxxing Verse, reviewed and published every cycle
            by the Chad Ranking Association.
          </p>
        </div>
        {GROUPS.map((g) => (
          <div key={g.head}>
            <div className="text-[12px] font-bold tracking-[0.18em] text-[#9b958a]">{g.head}</div>
            <ul className="mt-4 space-y-3">
              {g.links.map(([label, href]) => (
                <li key={label}>
                  <Link className="text-[14px] text-neutral-400 hover:text-gold hover:underline" href={href}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
