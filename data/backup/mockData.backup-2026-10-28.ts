// Mock dataset — every figure, name and number below is fictional placeholder
// data for the rebuild. Swap in your real data here. Structure mirrors the
// owner's design comps (podium, global rankings, statistics, movements).

// --- placeholder name generators (declared before all consumers) -------------
const N1 = ["Nightfall", "Northside", "Pinnacle", "Cascade", "Apex", "Summit", "Obsidian", "Regal"];
const N2 = ["Rival", "Talon", "Circuit", "Vector", "Vertex", "Surge", "Onyx", "Legend"];
const T = [
  "Momentum Min",
  "Aurora Aesthetic",
  "Photogenic Squarejaw",
  "The Ledger",
  "Golden Ratio",
  "Specimen G",
  "Bright Cut",
  "The Chaperone",
];

export function placeholderName(i: number): string {
  return `${N1[i % N1.length]} ${N2[i % N2.length]}`;
}

// --- global rankings ---------------------------------------------------------
export type RankRow = {
  rank: number;
  name: string;
  archetype: string;
  score: number;
  delta: number; // movement this week (positive = riser)
  spark: number[]; // 7d trend, normalized 0..1
  /** Optional hand-picked portrait URL. Empty => deterministic CC0 photo. */
  photo?: string;
};

/**
 * Portrait registry — mirrors how the original site streams each looksmaxer's
 * photo onto its name cards (its Supabase storage is off-limits per IP policy).
 * Add real URLs here keyed by figure name to override the generated ranking
 * photos; any card without an override gets a stable CC0 photograph chosen
 * deterministically from its name+rank so cards never shuffle between loads.
 *
 * Example: { "ZENITH": "https://your-cdn/zenith.jpg" }
 */
export const PHOTO_OVERRIDES: Record<string, string> = {};

/** Stable per-figure photo (pravatar CC0 set, indexed 1..70). */
export function avatarUrl(row: Pick<RankRow, "name" | "rank">): string {
  const override = PHOTO_OVERRIDES[row.name];
  if (override) return override;
  const h = 1 + (row.rank * 37 + row.name.length * 13) % 70;
  return `https://i.pravatar.cc/300?img=${h}`;
}


const ARCHETYPES = [
  "The Complete Package",
  "Pure Physique",
  "Genetic Apex",
  "Style Icon",
  "Charisma Central",
  "Golden Ratio",
  "Dark Horse",
  "Community Pick",
  "Roman Profile",
  "Precision Cut",
  "Iron Build",
  "Signature Presence",
];

export const PODIUM: RankRow[] = [
  { rank: 1, name: "ZENITH", archetype: "The Complete Package", score: 99.8, delta: 4.2, spark: [0.42, 0.5, 0.48, 0.6, 0.66, 0.74, 0.92] },
  { rank: 2, name: "VEXOR", archetype: "Pure Physique", score: 98.7, delta: 2.1, spark: [0.5, 0.46, 0.58, 0.55, 0.62, 0.6, 0.7] },
  { rank: 3, name: "KAEL", archetype: "Genetic Apex", score: 97.9, delta: 1.8, spark: [0.44, 0.52, 0.5, 0.58, 0.56, 0.64, 0.68] },
];

function seededSpark(rank: number, delta: number): number[] {
  // deterministic 7-point trend shaped by the weekly movement
  const pts: number[] = [];
  for (let i = 0; i < 7; i++) {
    const drift = (delta / 20) * i; // riser climbs, dropper slides
    const wob = (((rank * 7919 + i * 104729) % 23) - 11) / 46; // ±0.24 wobble
    pts.push(Math.min(0.95, Math.max(0.08, 0.48 + drift + wob)));
  }
  return pts;
}

export const RANK_TABLE: RankRow[] = Array.from({ length: 101 }, (_, i) => {
  const r = i + 1;
  if (r <= 3) return PODIUM[i];
  if (r === 101)
    return { rank: 101, name: "NEWS DESK", archetype: "Official News Reporter", score: 4.4, delta: 0, spark: [0.3, 0.32, 0.31, 0.29, 0.33, 0.3, 0.31] };
  // scores fall from ~97 as rank grows, with gentle determinism
  const score = Math.round((97.2 - (r - 4) * 0.92 - ((r * 37) % 23) / 60) * 10) / 10;
  const delta = Math.round(((((r * 131) % 71) - 33) / 10) * 10) / 10;
  const base = placeholderName(r);
  const name = r % 7 === 0 ? `${base} Prime` : r % 11 === 0 ? `${base} II` : base;
  return {
    rank: r,
    name,
    archetype: ARCHETYPES[r % ARCHETYPES.length],
    score: Math.max(4.5, score),
    delta,
    spark: seededSpark(r, delta),
  };
});

export type TrendTab = "This Week" | "All Time" | "Trending";

export function rowsForTab(tab: TrendTab, source: RankRow[]): RankRow[] {
  const c = [...source];
  if (tab === "All Time") c.sort((a, b) => b.score - a.score);
  else if (tab === "Trending") c.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  else c.sort((a, b) => a.rank - b.rank);
  return c.map((row, i) => (tab === "This Week" ? row : { ...row, rank: i + 1 }));
}

// --- statistics + movement ---------------------------------------------------
export const HOT_STATS = [
  { label: "Total Figures", value: 10482, icon: "users" },
  { label: "Active Users", value: 1842, icon: "user" },
  { label: "Countries", value: 156, icon: "globe" },
  { label: "Growth", value: 12.6, icon: "trend", suffix: "%", prefix: "+" },
] as const;

export const FEATURED_MOVEMENT = {
  rise: { name: "RAVEN", from: 18, to: 5, delta: 13 },
  fall: { name: "KAIRO", from: 6, to: 23, delta: -17 },
};

/** overall trend curve (weekly), normalized */
export const OVERALL_TREND = [0.22, 0.3, 0.27, 0.44, 0.52, 0.61, 0.6, 0.75, 0.8, 0.94];

// --- hall of fame -------------------------------------------------------------
export const HALL_OF_FAME = [
  { name: "The Founder", note: "First cycle curator" },
  { name: "Roman Standard", note: "87 consecutive top-3 weeks" },
  { name: "Iron Physique", note: "Retired undefeated" },
  { name: "Communityheart", note: "Union of the early vote" },
] as const;

// --- pinned CTA ---------------------------------------------------------------
export const CTA_RANK = {
  title: "YOUR RANK MATTERS",
  body: "Get analyzed. Get ranked.\nBe the best version of yourself.",
  cta: "Start Now",
};

// --- content blocks kept from the first rebuild --------------------------------
export const NEWS_ITEMS = [
  { time: "2h", title: "Placeholder headline one — cycle updates continue", href: "#" },
  { time: "6h", title: "Placeholder headline two — portal maintenance window", href: "#" },
  { time: "1d", title: "Placeholder headline three — community vote results", href: "#" },
  { time: "2d", title: "Placeholder headline four — new season seeding", href: "#" },
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
  { author: "Member One", ago: "12m", body: "Placeholder post — thoughts on this cycle's podium." },
  { author: "Member Two", ago: "48m", body: "Placeholder post — predictions for the battle bracket." },
  { author: "Member Three", ago: "2h", body: "Placeholder post — lexicon suggestion thread." },
  { author: "Member Four", ago: "5h", body: "Placeholder post — agreeing with the risers column." },
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
  { q: "How are rankings calculated?", a: "Placeholder answer describing methodology categories." },
  { q: "When is the weekly update?", a: "Placeholder answer about publication cadence." },
  { q: "How can I participate?", a: "Placeholder answer on joining cycles." },
  { q: "How do withdrawals work?", a: "Placeholder answer on standing down." },
  { q: "Who runs the association?", a: "Placeholder answer about administration." },
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
