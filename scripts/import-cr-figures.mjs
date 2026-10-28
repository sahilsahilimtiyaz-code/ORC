#!/usr/bin/env node
/**
 * Import officialchadrankings.com PublicFigure records into data/creators.db.json.
 *
 * Source of truth: the live official leaderboard's own public API snapshot,
 * saved at data/raw/cr-figures-<date>.json. Rankings, names, bios, tags and
 * photos are imported verbatim with provenance. No rank, name, bio, or photo
 * is invented here. Records that are not identifiable people (the site's own
 * "To be Revealed" mystery slots, the "MOG NEWS" role account) are marked
 * rejected-as-identity and kept only for traceability.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const RAW = "data/raw/cr-figures-2026-10-28.json";
const OUT = "data/creators.db.json";
const FETCHED_AT = new Date().toISOString().slice(0, 10);
const SOURCE = "officialchadrankings.com";
const SOURCE_URL = "https://officialchadrankings.com/";
const SOURCE_ENDPOINT =
  "https://base44.app/api/apps/69912bf501cd81dc0b521cee/entities/PublicFigure?limit=300&sort=current_rank";
const LICENSE_NOTE =
  "Streamed (hotlinked, not rehosted) from officialchadrankings.com public leaderboard assets; copyright remains with the respective owners/uploaders; attribution to officialchadrankings.com as the data source.";

const raw = JSON.parse(readFileSync(RAW, "utf8"));

const isPerson = (r) =>
  !/^(To be Revealed|MOG NEWS)$/i.test((r.name || "").trim()) ||
  r.current_rank <= 100;

const records = raw.map((r) => {
  const role = /to be revealed|mog news/i.test(r.name || "");
  const unrankedSlot = Number(r.current_rank) > 100 && !Number.isFinite(r.community_votes);
  const identity = role || (Number(r.current_rank) > 100 && /to be revealed|mog news/i.test(r.name));

  const rec = {
    // ── identity ──────────────────────────────────────────────────────────
    id: r.id,
    displayName: r.name,
    alias: null,
    realName: null, // filled only when publicly documented (verification phase)
    category: r.category || null,
    rankTitle: r.title || null, // the board's own archetype ("Genetic Apex", …)
    tags: Array.isArray(r.tags) ? r.tags : [],

    // ── leaderboard (source-driven; never invented) ───────────────────────
    rank: Number.isFinite(r.current_rank) ? r.current_rank : null,
    previousRank: Number.isFinite(r.previous_rank) ? r.previous_rank : null,
    influenceScore: Number.isFinite(r.influence_score) ? r.influence_score : null,
    rankChangeReason: r.rank_change_reason || null,
    specialBadge: r.special_badge || null,
    communityVotes: Number.isFinite(r.community_votes) ? r.community_votes : null,
    rankingSource: SOURCE,
    rankingSourceUrl: SOURCE_ENDPOINT,
    rankingImportedAt: FETCHED_AT,

    // ── content authored by the official board (imported text, attributed) ─
    shortBio: r.short_bio || null,
    detailedDescription: r.detailed_description || null,

    // ── photo provenance ──────────────────────────────────────────────────
    imageUrl: r.image_url || null,
    imageSourceUrl: r.image_url ? SOURCE_URL : null,
    imageLicenseOrPermission: r.image_url ? LICENSE_NOTE : null,

    // ── verification state machine ────────────────────────────────────────
    verificationStatus: identity ? "rejected" : "needs_verification",
    lastVerifiedAt: null,
    verificationNotes: identity
      ? "Official board's own unrevealed mystery slot / site role account — not an identifiable person. Excluded from the public leaderboard; retained for traceability of the live source."
      : "Imported verbatim from the live officialchadrankings.com PublicFigure dataset (public API) on " + FETCHED_AT + ". Identity corroboration against external public sources pending.",
    sourceProfileUrl: SOURCE_URL,
    socialProfiles: [],
    isRoleRecord: !!identity,
    importFlags: [],
  };

  if (!role && Number(r.current_rank) > 100) {
    rec.importFlags.push("unranked-slot");
  }
  if (r.name === "True Atom") rec.importFlags.push("duplicate-name-on-live-board");
  if (!r.image_url) rec.importFlags.push("no-photo-on-source");

  return rec;
});

const db = {
  meta: {
    format: "ocr.creators.db/1",
    importedAt: new Date().toISOString(),
    source: SOURCE,
    sourceUrl: SOURCE_URL,
    sourceEndpoint: SOURCE_ENDPOINT,
    rawSnapshot: "data/raw/" + RAW.split("/").pop(),
    policy: [
      "Names, ranks, titles, bios, tags and photos are imported verbatim from the live source with attribution; nothing is invented.",
      "verificationStatus ∈ {verified, needs_verification, disputed, rejected}. Only records whose identity/alias was corroborated against independent public sources, or whose rank is documented by the live source, may appear publicly; unverified ones surface in the admin review queue.",
      "Photos are hotlinked from their recorded origin with provenance; failures fall back to an explicit placeholder, never a substitute face.",
      "role records (mystery slots / MOG NEWS) are kept for source traceability but never rendered as creators.",
    ],
  },
  records,
};

writeFileSync(OUT, JSON.stringify(db, null, 2) + "\n");
const stats = {
  total: records.length,
  onBoard: records.filter((r) => r.rank !== null && r.rank <= 100 && !r.isRoleRecord).length,
  roleRecords: records.filter((r) => r.isRoleRecord).length,
  withPhoto: records.filter((r) => r.imageUrl).length,
  verified: records.filter((r) => r.verificationStatus === "verified").length,
  needsVerification: records.filter((r) => r.verificationStatus === "needs_verification").length,
};
console.log("imported →", OUT, JSON.stringify(stats));
if (!existsSync("data/raw")) console.error("warning: raw snapshot missing");
