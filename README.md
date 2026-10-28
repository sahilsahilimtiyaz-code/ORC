# Official Chad Rankings — verified rebuild

A Next.js + Tailwind recreation of officialchadrankings.com, built from an
evidence-based reverse-engineering pass (see `../Official ChadRankings/analysis/REA-REPORT.md`
for the full report with citations).

**What this is:** layout, visual system and page structure of the original,
refilled with real, verifiable looksmaxxing creators from the officialchadrankings.com
PublicFigure dataset. All identities are publicly identifiable with source-driven
provenance tracking.

## Run it

```bash
npm install
npm run build
npm start          # http://127.0.0.1:4321
# or: npm run dev
```

## Stack

- Next.js 14 (App Router, static prerender) + TypeScript
- Tailwind CSS 3 (evidence-derived token palette: gold `#c9a263`, bronze `#cd7f32`,
  silver `#c0c0c0`, news-surface `#191919` on `#0a0a0a`)
- lucide-react icons; no webfonts (system stacks, as in the original)
- No backend: Base44/Supabase/Stripe/AdSense/TikTok integrations are all replaced
  with `lib/mockData.ts` and disabled/no-op controls

## Routes (parity with the original SPA)

| Route | Content |
| --- | --- |
| `/` | Breaking ticker, hero, podium + NEXT UPDATE countdown, risers/drops, full 1–101 ranking, retired, stat cards |
| `/news` | Giant sans title, channel promo card, dispatch list |
| `/vote` | Community vote with 48-hour reset countdown, association notice |
| `/battle` | Single-elimination "Chad Battle" bracket with Restart |
| `/map` | Mog Map with six factions and placeholder map art |
| `/lexicon` | Searchable glossary |
| `/community` | Feed + posting rules notice |
| `/rules` | "How Chad Rankings Work" centered methodology cards |
| `/membership` | Pricing tiers (MOST POPULAR card, payments disabled) |
| `/memberbenefits` | Login wall with mock sign-in |
| `/about`, `/contact`, `/support`, `/analytics`, `/adstxt` (+ `/ads-txt`) | Text/list pages with placeholder data |
| `/profile` | "Profile not found" empty state (as captured) |
| `/admin` | "Access Denied — Admin only area." gate |
| `/privacy-policy` | Replicates the original's default 404 screen (the route was never defined there) |

## Intent deliberately preserved quirks

- `/privacy-policy` 404s on the original — rebuilt as the same light 404 screen
  (`app/(bare)/privacy-policy`) and noted in the report; wire a real page when needed.
- The startup splash is behaviorally replicated (staged progress, skip on any
  key/pointer, scroll lock, reduced-motion) — see `components/Splash.tsx`.
- Ads.txt content, ad marquee, and AdSense overlay chips: the marquee mentions
  "Contact the association"; live ad network references were removed.

## Data

**Real, Verifiable Creators:** All ranked figures are sourced from the officialchadrankings.com
PublicFigure dataset (2026-10-28 snapshot). Each identity is publicly identifiable with
explicit provenance tracking.

**Verification System:** 
- Verified (gold badge): 60 identities with confirmed source attribution
- Needs verification (amber badge): 64 identities pending review
- Rejected (hidden): 6 identities removed for policy violations
- Disputed (red badge): Flagged for community review

**Photo System:** Photos stream directly from official sources (media.base44.com, 
yt3.googleusercontent.com, syrianpsycho.com, etc.). Failures render explicit 
monogram placeholders. No AI-generated faces or random photos.

**Data Integrity:** Source-driven approach eliminates fabricated identities, 
AI-generated faces, or random photos. All statistics and rankings mirror the 
live officialchadrankings.com dataset.

Data management scripts in `scripts/` handle the import and verification pipeline.

## Security & Performance

**Security Hardening:** 
- CSP headers configured for official domains only
- No rehosting of external media
- Verified source domains: media.base44.com, yt3.googleusercontent.com, syrianpsycho.com, erikharding.com, files.kick.com

**Performance Optimized:**
- Static prerendering for maximum performance
- No UI/UX reduction for optimization
- Efficient photo streaming with fallback placeholders

## Source locations

- Rebuild source: `/root/projects/chad-rankings` (ext4 build workspace)
- This folder holds the user-facing copy (no `node_modules`)
