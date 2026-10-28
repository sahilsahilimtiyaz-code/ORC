#!/usr/bin/env node
/**
 * Fold external identity-verification evidence into data/creators.db.json.
 *
 * Inputs (JSON arrays produced by the research phase, saved verbatim):
 *   data/raw/verification/board-*.json    — officialchadrankings.com board figures
 *   data/raw/verification/creators-*.json — separate verified-creators directory
 *
 * Rules:
 *  - Only a record whose verificationStatus is "verified" in the research file
 *    gets upgraded; needs_verification records stay pending.
 *  - realName is only stored when the research phase found it publicly
 *    documented; otherwise left null.
 *  - The official board's own photo stays the primary portrait; an official
 *    channel avatar is used only when the board record has none.
 *  - Nothing is invented: missing facts stay null.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const DB = "data/creators.db.json";
const VER_DIR = "data/raw/verification";
const today = new Date().toISOString().slice(0, 10);

const db = JSON.parse(readFileSync(DB, "utf8"));
const byName = new Map(
  db.records.map((r) => [r.displayName.toLowerCase().replace(/\s+/g, " "), r]),
);

const files = readdirSync(VER_DIR).filter((f) => f.endsWith(".json"));
const DIRECTORY_LICENSE =
  "Official public profile avatar, streamed (hotlinked, not rehosted) from its origin; copyright remains with the respective owner.";

/** documented board aliases (alias → board display name), so external research
 *  that uses a real name still lands on the right board record */
const ALIAS_MAP = {
  "kareem shami": "k shami",
  "syrian psycho": "k shami",
};

const report = { boardUpgraded: [], boardStillPending: [], directoryAdded: [], directoryPending: [], skipped: [] };

for (const f of files) {
  const batch = JSON.parse(readFileSync(`${VER_DIR}/${f}`, "utf8"));
  const isDirectoryBatch = /creators/.test(f);
  for (const v of batch) {
    if (!v || !v.searchedName) continue;
    let name = String(v.searchedName).trim();
    // research artifacts like "Rheed/" or trailing qualifiers
    const cleaned = name.replace(/[/\\]+$/, "").trim();

    if (isDirectoryBatch) {
      // directory batch: names like "Kareem Shami aka Syrian Psycho" are aliases;
      // the board's own figures must NOT be duplicated into the directory
      const aliasKeys = name
        .replace(/[/\\]+$/, "")
        .split(/\s+\/\s+|\s+aka\s+|\s+\((.+)\)\s*$/i)
        .filter((s) => typeof s === "string")
        .map((s) => s.trim().toLowerCase().replace(/\s+/g, " "))
        .filter(Boolean);
      const seen = new Set();
      const existingBoard = aliasKeys
        .map((k) => byName.get(ALIAS_MAP[k] ?? k))
        .filter((r) => {
          if (!r || seen.has(r.id)) return false;
          // only BOARD records may be folded here — never the directory records
          // this same merge adds (they'd otherwise re-match on a second run)
          if (r.importFlags.includes("verified-directory") || r.importFlags.includes("verified-directory-pending"))
            return false;
          seen.add(r.id);
          return true;
        });
      if (existingBoard.length) {
        // belongs to the board — fold evidence into the board record instead
        for (const rec of existingBoard) {
          if (v.verificationStatus === "verified") {
            rec.verificationStatus = "verified";
            rec.lastVerifiedAt = today;
            if (!rec.verificationNotes || rec.verificationNotes.startsWith("Imported verbatim"))
              rec.verificationNotes = "";
            const evNote = `External corroboration (${today}): ${v.evidence}`;
            if (!rec.verificationNotes.includes(evNote)) {
              rec.verificationNotes =
                (rec.verificationNotes ? rec.verificationNotes + " · " : "") + evNote;
            }
            if (v.realName && !rec.realName) rec.realName = v.realName;
            if (v.officialProfileUrl && !rec.socialProfiles.includes(v.officialProfileUrl))
              rec.socialProfiles.push(v.officialProfileUrl);
            if (!rec.imageUrl && v.photoUrl) {
              rec.imageUrl = v.photoUrl;
              rec.imageSourceUrl = v.photoSourceUrl ?? v.officialProfileUrl ?? null;
              rec.imageLicenseOrPermission = DIRECTORY_LICENSE;
            }
          }
        }
        report.boardUpgraded.push(...existingBoard.map((r) => r.displayName));
        continue;
      }
      // brand-new directory record
      if (v.verificationStatus === "verified") {
        const slug = cleaned.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const dirId = `dir-${slug}`;
        if (db.records.some((r) => r.id === dirId)) {
          report.directoryAdded.push(`${cleaned} (already present — skipped)`);
          continue;
        }
        db.records.push({
          id: dirId,
          displayName: cleaned,
          alias: cleaned !== (v.realName ?? null) ? v.realName : null,
          realName: v.realName ?? null,
          category: v.category ?? null,
          rankTitle: null,
          tags: ["verified-directory"],
          rank: null,
          previousRank: null,
          influenceScore: null,
          rankChangeReason: null,
          specialBadge: null,
          communityVotes: null,
          rankingSource: null,
          rankingSourceUrl: null,
          rankingImportedAt: today,
          shortBio: null,
          detailedDescription: null,
          imageUrl: v.photoUrl ?? null,
          imageSourceUrl: v.photoSourceUrl ?? v.officialProfileUrl ?? null,
          imageLicenseOrPermission: v.photoUrl ? DIRECTORY_LICENSE : null,
          verificationStatus: "verified",
          lastVerifiedAt: today,
          verificationNotes: `External corroboration (${today}): ${v.evidence}`,
          sourceProfileUrl: v.officialProfileUrl ?? null,
          socialProfiles: [v.officialProfileUrl].filter(Boolean),
          isRoleRecord: false,
          importFlags: ["verified-directory"],
        });
        report.directoryAdded.push(cleaned);
      } else {
        report.directoryPending.push(cleaned);
        // keep documented-but-unconfirmed candidates visible in the review queue
        if (v.officialProfileUrl || v.evidence) {
          const slug = cleaned.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          const dirId = `dir-${slug}`;
          if (!db.records.some((r) => r.id === dirId)) {
            db.records.push({
              id: dirId,
              displayName: cleaned,
              alias: null,
              realName: v.realName ?? null,
              category: v.category || null,
              rankTitle: null,
              tags: ["verified-directory-pending"],
              rank: null,
              previousRank: null,
              influenceScore: null,
              rankChangeReason: null,
              specialBadge: null,
              communityVotes: null,
              rankingSource: null,
              rankingSourceUrl: null,
              rankingImportedAt: today,
              shortBio: null,
              detailedDescription: null,
              imageUrl: null,
              imageSourceUrl: null,
              imageLicenseOrPermission: null,
              verificationStatus: "needs_verification",
              lastVerifiedAt: null,
              verificationNotes: `Research attempt (${today}) inconclusive: ${v.evidence || "no credible public documentation found"}`,
              sourceProfileUrl: v.officialProfileUrl ?? null,
              socialProfiles: [v.officialProfileUrl].filter(Boolean),
              isRoleRecord: false,
              importFlags: ["verified-directory-pending"],
            });
          }
        }
      }
      continue;
    }

    // board batch: searchedName is the board's own display name
    const rec = byName.get(cleaned.toLowerCase().replace(/\s+/g, " "));
    if (!rec) {
      report.skipped.push(`${cleaned} (not on board)`);
      continue;
    }
    if (v.verificationStatus === "verified") {
      rec.verificationStatus = "verified";
      rec.lastVerifiedAt = today;
      rec.verificationNotes = `External corroboration (${today}): ${v.evidence}`;
      if (v.realName && !rec.realName) rec.realName = v.realName;
      if (v.officialProfileUrl && !rec.socialProfiles.includes(v.officialProfileUrl))
        rec.socialProfiles.push(v.officialProfileUrl);
      if (!rec.imageUrl && v.photoUrl) {
        rec.imageUrl = v.photoUrl;
        rec.imageSourceUrl = v.photoSourceUrl ?? v.officialProfileUrl ?? null;
        rec.imageLicenseOrPermission = DIRECTORY_LICENSE;
      }
      report.boardUpgraded.push(rec.displayName);
    } else {
      rec.verificationNotes = `Imported verbatim from the live officialchadrankings.com PublicFigure dataset. External corroboration attempt (${today}) inconclusive: ${v.evidence || v.notes || "no public documentation found"}`;
      report.boardStillPending.push(rec.displayName);
    }
  }
}

db.meta.verificationBatches = (db.meta.verificationBatches ?? []).concat(
  files.map((f) => ({ file: `data/raw/verification/${f}`, mergedAt: new Date().toISOString() })),
);
writeFileSync(DB, JSON.stringify(db, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
