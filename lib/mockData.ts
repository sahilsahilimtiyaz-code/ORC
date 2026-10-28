/**
 * Data adapters — every leaderboard fact below is derived from the verified
 * creator database (data/creators.db.json), imported verbatim from the LIVE
 * officialchadrankings.com PublicFigure dataset (2026-10-28 snapshot).
 * No name, rank, score, photo, bio or statistic is invented here.
 *
 * Provenance rules:
 *  - ranks/scores/movement come from the board's own published fields;
 *  - photos stream from their recorded source origin, never rehosted;
 *  - where a fact does not exist in the source (rank history, votes) the
 *    field stays empty — the UI renders an explicit empty state instead of
 *    a fabricated trend;
 *  - vote/battle/community sample pools are clearly-labelled illustrative
 *    samples that render explicit placeholder avatars, never photographs
 *    presented as real members.
 */
import { boardCreators, datasetStats, movements, publicLeaderboard, type CreatorRecord } from "@/lib/creators";

// --- clearly-labelled sample name pool (vote/battle/community demos only) -----
const N1 = ["Nightfall", "Northside", "Pinnacle", "Cascade", "Apex", "Summit", "Obsidian", "Regal"];
const N2 = ["Rival", "Talon", "Circuit", "Vector", "Vertex", "Surge", "Onyx", "Legend"];

export function placeholderName(i: number): string {
  return `${N1[i % N1.length]} ${N2[i % N2.length]}`;
}

// --- global rankings ---------------------------------------------------------
export type VerificationStatus = "verified" | "needs_verification" | "disputed" | "rejected";

export type RankRow = {
  rank: number;
  name: string;
  archetype: string;
  /** influence score as published by the official board; null when unpublished */
  score: number | null;
  /** movement this cycle per the board's published previous_rank; null when unpublished */
  delta: number | null;
  /** the source publishes no rank history — always []; UI shows an explicit empty state */
  spark: number[];
  /** portrait streamed from its recorded source origin (never rehosted) */
  photo?: string;
  /** page/record establishing that this portrait belongs to this figure */
  photoSource?: string;
  verification: VerificationStatus;
  realName?: string | null;
  socials: string[];
  bio?: string | null;
  tags: string[];
  /** the board's own special marker ("Current Protagonist", "Duo") */
  badge?: string | null;
};

function toRankRow(c: CreatorRecord): RankRow {
  return {
    rank: c.rank ?? 0,
    name: c.displayName,
    archetype: c.rankTitle ?? "",
    score: c.influenceScore,
    delta: c.previousRank != null && c.rank != null ? c.previousRank - c.rank : null,
    spark: [],
    photo: c.imageUrl ?? undefined,
    photoSource: c.imageSourceUrl ?? undefined,
    verification: c.verificationStatus,
    realName: c.realName,
    socials: c.socialProfiles,
    bio: c.shortBio,
    tags: c.tags,
    badge: c.specialBadge,
  };
}

/** The public leaderboard — verbatim from the official board, ranks 1..100. */
export const RANK_TABLE: RankRow[] = publicLeaderboard().map(toRankRow);
export const PODIUM: RankRow[] = RANK_TABLE.slice(0, 3);

export type TrendTab = "This Week" | "All Time" | "Trending";

/** sort semantics per tab; rank renumbering kept for This Week only */
export function rowsForTab(tab: TrendTab, source: RankRow[]): RankRow[] {
  const c = [...source];
  const nullsLast = (v: number | null) => (v == null ? -Infinity : v);
  if (tab === "All Time") {
    c.sort((a, b) => nullsLast(b.score) - nullsLast(a.score));
    return c.map((row, i) => ({ ...row, rank: i + 1 }));
  }
  if (tab === "Trending") {
    c.sort((a, b) => Math.abs(nullsLast(b.delta)) - Math.abs(nullsLast(a.delta)));
    return c.map((row, i) => ({ ...row, rank: i + 1 }));
  }
  c.sort((a, b) => a.rank - b.rank);
  return c;
}

// --- statistics + movement (dataset facts only — nothing invented) -----------
const DS = datasetStats();

export const HOT_STATS = [
  { label: "Board Figures", value: DS.board, icon: "users" },
  { label: "Verified Identities", value: DS.verified, icon: "user" },
  { label: "Photos Sourced", value: DS.withPhotos, icon: "globe" },
  { label: "Movers This Cycle", value: DS.movers, icon: "trend" },
] as const;

const MV = movements();
const toMovement = (m: { figure: CreatorRecord; delta: number }) => ({
  name: m.figure.displayName,
  from: m.figure.previousRank ?? m.figure.rank ?? 0,
  to: m.figure.rank ?? 0,
  delta: m.delta,
  photo: m.figure.imageUrl ?? undefined,
  photoSource: m.figure.imageSourceUrl ?? undefined,
  reason: m.figure.rankChangeReason ?? undefined,
});

export const FEATURED_MOVEMENT = {
  rise: MV.risers[0] ? toMovement(MV.risers[0]) : null,
  fall: MV.droppers[0] ? toMovement(MV.droppers[0]) : null,
};

/** movement mix this cycle, derived from the board's published previous ranks */
export const MOVERS_MIX = { risers: MV.risers.length, droppers: MV.droppers.length, stable: MV.stable } as const;

// --- hall of fame (board markers + derived notes; no invented careers) --------
export const HALL_OF_FAME = [
  ...RANK_TABLE.filter((r) => r.badge).map((r) => ({
    name: r.name,
    note: `Named "${r.badge}" by the official board — rank #${r.rank}`,
  })),
  ...RANK_TABLE.slice(0, 3)
    .filter((r) => !r.badge)
    .map((r) => ({
      name: r.name,
      note:
        r.score != null
          ? `Official board #${r.rank} · published score ${r.score}`
          : `Official board #${r.rank}`,
    })),
] as const;

// --- pinned CTA ---------------------------------------------------------------
export const CTA_RANK = {
  title: "YOUR RANK MATTERS",
  body: "Get analyzed. Get ranked.\nBe the best version of yourself.",
  cta: "Start Now",
};

// --- content blocks ------------------------------------------------------------
/** cycle news derived from the board's own published movement data */
export const NEWS_ITEMS = [
  ...(FEATURED_MOVEMENT.rise
    ? [
        {
          time: "cycle",
          title: `${FEATURED_MOVEMENT.rise.name} climbs ${FEATURED_MOVEMENT.rise.delta} places to #${FEATURED_MOVEMENT.rise.to}`,
          href: "/movements",
        },
      ]
    : []),
  ...(FEATURED_MOVEMENT.fall
    ? [
        {
          time: "cycle",
          title: `${FEATURED_MOVEMENT.fall.name} drops ${Math.abs(FEATURED_MOVEMENT.fall.delta)} places to #${FEATURED_MOVEMENT.fall.to}`,
          href: "/movements",
        },
      ]
    : []),
  ...MV.risers.slice(1, 3).map((m) => ({
    time: "cycle",
    title: `${m.figure.displayName} up ${m.delta} to #${m.figure.rank}`,
    href: "/movements",
  })),
  {
    time: "import",
    title: `Leaderboard synced from officialchadrankings.com (${DS.importedAt.slice(0, 10)})`,
    href: "/methodology",
  },
];

export const LEXICON_TERMS = [
  { term: "Looksmaxxing", def: "The practice of maximizing one's physical attractiveness." },
  { term: "Mogging", def: "To dominate or outshine someone in appearance." },
  { term: "Chadlite", def: "Above-average tier with notable traits." },
  { term: "Canthoplasty", def: "A surgical eye-corner alteration procedure." },
  { term: "Mewing", def: "A tongue-posture technique aimed at the jawline." },
  { term: "Bonesmashing", def: "A pseudo-physical theory discussed in the lexicon." },
  { term: "Hardmaxxer", def: "Someone pursuing extreme improvement methods." },
  { term: "Softmaxxer", def: "Someone improving via styling and grooming." },
  { term: "Tyrone", def: "A tier archetype within the ranking culture." },
  { term: "Unc", def: "An older participant archetype." },
];

export const COMMUNITY_POSTS = [
  { author: "Sample Member 1", ago: "12m", body: "Sample post — thoughts on this cycle's podium." },
  { author: "Sample Member 2", ago: "48m", body: "Sample post — predictions for the battle bracket." },
  { author: "Sample Member 3", ago: "2h", body: "Sample post — lexicon suggestion thread." },
  { author: "Sample Member 4", ago: "5h", body: "Sample post — agreeing with the risers column." },
];

export const PRICING = [
  {
    tier: "Associate",
    price: "$9",
    period: "/cycle",
    blurb: "For solo members who want to follow each publication closely.",
    perks: ["Ad-free feed streaming", "Comment access", "Vote weighting x1", "Standard support"],
    icon: "trophy" as const,
    popular: false,
  },
  {
    tier: "Full Member",
    price: "$24",
    period: "/cycle",
    blurb: "The complete association experience for regular contributors.",
    perks: ["Everything in Associate", "Early access to rankings", "Vote weighting x3", "Battle bet credits", "Priority support"],
    icon: "star" as const,
    popular: true,
  },
  {
    tier: "Council Tier",
    price: "$99",
    period: "/cycle",
    blurb: "For serious community engagement and sponsorship participation.",
    perks: ["Everything in Full Member", "Council forum access", "Co-author draft rights", "Vote weighting x12", "Concierge support"],
    icon: "crown" as const,
    popular: false,
  },
];

export const MEMBER_BENEFITS = [
  "Free updates for members",
  "Live Chat + Internal Server",
  "Battle Rewards Exchanges",
  "Early seeding roles",
  "Community moderation powers",
];

export const FAQ = [
  {
    q: "How are rankings calculated?",
    a: "Ranks are imported verbatim from the officialchadrankings.com leaderboard — the authoritative source this site mirrors. Our own community voting is tracked separately and never changes an official rank.",
  },
  {
    q: "When is the weekly update?",
    a: "Whenever the official board publishes a new cycle. The import date of the current snapshot is shown on every leaderboard page.",
  },
  {
    q: "How can I participate?",
    a: "Join the community spaces, cast sample votes in the Vote Arena, and back your picks in the Battle bracket.",
  },
  {
    q: "How do withdrawals work?",
    a: "Figures who step down are handled per the official board's cycle rules; review-queue records stay pending until identity checks clear.",
  },
  {
    q: "Who runs the association?",
    a: "OCR is curated by its three owners — see the Contact page. Data integrity policy: every published figure and photo carries its recorded source.",
  },
];

export const FIVE_FACTIONS = [
  { id: "north", label: "North District", map: { x: 18, y: 16 }, lat: 58, lon: -100, blurb: "Placeholder faction." },
  { id: "east", label: "Eastern Europe", map: { x: 56, y: 26 }, lat: 52, lon: 28, blurb: "Placeholder faction." },
  { id: "south", label: "South Rim", map: { x: 52, y: 62 }, lat: -28, lon: 24, blurb: "Placeholder faction." },
  { id: "west", label: "West Atlas", map: { x: 26, y: 45 }, lat: 32, lon: -48, blurb: "Placeholder faction." },
  { id: "sea", label: "Sea Nexus", map: { x: 84, y: 55 }, lat: -34, lon: 151, blurb: "Placeholder faction." },
  { id: "core", label: "Core Pavilion", map: { x: 74, y: 40 }, lat: 36, lon: 138, blurb: "Placeholder faction." },
];

/** Contact channels requested by the owner. */
export const CONTACT_EMAILS = [
  "Lorcyfx@gmail.com",
  "Octavianfx96@gmail.com",
  "Sahilsahilimtiyaz@gmail.com",
];
