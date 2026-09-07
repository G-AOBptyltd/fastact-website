# AOB Design Lab — Session Handover

> Pick-up doc for the AOB website design-refresh exploration. Read this first in any
> new session, then `git checkout feature/design-lab-inspiration` and open the preview URLs below.
> **Last updated:** 2026-09-07

---

## 1. The goal (Greg's own words)

> "Simplify the managed websites, improve significantly the look and feel UI & UX, and
> create simple standards that are easy to understand."

This is an **exploration + standards-setting** exercise pointing toward a unified design system
across the AOB / InSite-suite websites. Nothing here is production. We build candidate looks,
Greg assesses them, we lock standards, and only then (deliberately, separately) does anything
migrate to a live site.

## 2. Hard constraints (NEVER break these)

- **Never touch production.** All work lives on branch `feature/design-lab-inspiration`, under
  `labs/design-lab/`, served only via Netlify branch preview. Production updates only on a
  deliberate, separately-run merge-to-main that Greg triggers after confirming a preview.
- **No licensed assets.** OSS fonts only (Inter, Plus Jakarta Sans, Space Grotesk, Fraunces,
  IBM Plex Mono, Space Mono, EB Garamond). Self-made inline SVG imagery only — no external images.
  **Never** put an inspiration brand's name in shipped output (throxy, typeform, tally, ikea,
  figma, weave, making software, groth). Our style names are AOB-owned (Kit, Console, Editorial,
  Minimal, Catalogue, Canvas, Manual, Journal).
- **Every page is `noindex`** (`<meta name="robots" content="noindex, nofollow">`).
- **Canonical footer, exact string:**
  `© 2026 Agility Ops Business Pty Ltd (ABN 37 650 141 950). All rights reserved.`
- **Australian English** throughout.
- **FACT / Academy R&D language:** never "R&D-backed" / "funding secured" / "government-funded".
  OK: "developed within our R&D program", "practitioner-led", "applied AI training".
- **No `Co-Authored-By` / Claude trailer** on commits (per user memory).
- **VF1 / VillageFirst is strictly separate** from AOB — not involved here, but the zero-crossover
  rule stands.

## 3. Where everything lives

- **Worktree / branch:** `feature/design-lab-inspiration` (worktree at
  `.../worktrees/bwi-migration-tool`). Work from this dir; do not `cd` to the repo root.
- **All artifacts:** `labs/design-lab/`
- **Preview base URL:** `https://feature-design-lab-inspiration--fastact.netlify.app/labs/design-lab/`
  (Netlify caches; bust with `?v=N`.)
- **The reusable skill:** `~/.claude/skills/agilityweb/` — `SKILL.md` + `references/`
  (typeform.md, tally.md, ikea.md, throxy.md, weave.md, making-software.md, groth.md,
  brand-rules.md, products.md, licensing.md). Invoked like `/agilityweb --throxy <sitename>`.
  Two modes: **Explore** (throwaway concept pages) vs **Build** (locked AOB kit chrome).

## 4. Locked decisions (from the standards report)

Source: `aob-website-standards-decisions-2026-09-04 (1).json` (the "(1)" file is current; the
non-(1) one is superseded — it had `headerModel: corporate`).

| Decision | Choice | Meaning |
|----------|--------|---------|
| direction | **rework** | Full rework to unified standards, not incremental patching |
| aestheticBase | **warm-light** | Warm off-white base (not dark) |
| skillScope | **two-modes** | agilityweb has Explore + Build modes |
| headerModel | **reconcile** | One standard header shell = product's own nav **+** a right-side "Products drawer" listing the suite, so users aren't bounced off-site |
| pricing | **hybrid** | Standard checkout look & feel, but products (e.g. CareerInSite) keep their own Stripe catalogue/product types |
| testTarget | **portfolioinsite** | PortfolioInSite chosen as the complex test build |

**Standards — all `adopt`:** type = Inter + Plus Jakarta Sans · buttons = pill 9999px, `#0f172a`→accent ·
logo = monogram box + wordmark (no asset) · footer = full canonical everywhere · colours = navy/warm
base + per-product accent · spacing = 1200px, 100px sections, 12–20px radii.

**Per-product accents:** Corporate `#2563eb` · SprintINSite `#10b981` · PortfolioInSite `#0891b2` ·
SurveyInSite `#6366f1` · ReportInSite `#6d28d9` · CareerInSite `#f59e0b` · Academy/FACT clay `#cc785c`.

## 5. What's been built (all committed, all live on preview)

**Hub & tooling**
- `index.html` — Lab hub (Round 1 + Round 2 studies + site-mode card).
- `website-standards-audit.html` — Interactive audit + 6 decisions + 6 standards, JSON export/import.
- `aob-web-kit.html` — AOB Web Kit v1: unified warm-light system with live accent switcher (7 product pills).
- `aob-design-playground.html` — **⭐ combined playground**: 8-style switcher × accent switcher (Auto +
  7 products + custom). Two independent dials; keys 1–8; persists via localStorage `aobPgStyle`/`aobPgAccent`.
- `academy-compare.html` — hub linking the two full Academy builds (Kit vs Canvas).

**Round 1 single-page studies (SprintINSite content):** `conversational.html` (Typeform),
`minimal.html` (Tally), `bold.html` (IKEA).

**Round 2 single-page studies:** `console.html` (Throxy/SurveyInSite), `canvas.html` (Weave/SurveyInSite),
`manual.html` (Making Software/Academy clay), `editorial.html` (Groth/Academy clay).

**Full multi-page BUILD-mode sites** (shared `assets/styles.css` + `assets/app.js`, byte-identical
header/drawer/footer chrome verified across pages):
- `console-surveyinsite-site/` — SurveyInSite, 4 pages (index, features, pricing, contact). First site-mode proof.
- `portfolioinsite-site/` — **the locked test target**. 5 pages (index, features, tools, pricing,
  contact) + `style-lab.html` (live 8-theme switcher on real content). Warm-light AOB Kit, teal `#0891b2`,
  reconcile header + Products drawer, canonical footer, hybrid pricing.
- `academy-kit/` — Agility Ops Academy in AOB Kit + clay `#cc785c`, 4 pages (index, learning-path,
  workshops, advisory). Compass hero with settling-needle animation. **Has the live accent switcher**
  in `assets/app.js` (committed b4cd1d9).
- `academy-canvas/` — same Academy content in "Canvas" blueprint language: blueprint grid, huge thin
  type, mono labels, corner-docked CTA, animated six-module node-graph. 4 pages.

## 6. Verified invariants (spot-check before shipping any new page)

Across all build-mode sites we confirmed via grep/md5: `noindex` present · exact ABN footer string ·
no inspiration-brand names · OSS fonts only · no external images · no forbidden R&D phrases ·
Australian English · header/drawer/footer byte-identical across a site's pages.

## 7. Open questions / next steps (nothing in-flight — awaiting Greg)

- **Academy look decision:** Kit vs Canvas — Greg was assessing via `academy-compare.html`; **no
  decision recorded yet.**
- **Playground assessment:** Greg confirmed `aob-design-playground.html` is what he wanted (style ×
  accent dials). He may next pick a favourite style/accent combo, or ask to apply one to a site.
- Not started / offered but not accepted: take a winning style to a production-ready build; wire the
  locked decisions into the `agilityweb` skill defaults.

## 8. Gotchas learned

- Netlify/browser cache shows stale content after a push — always cache-bust with `?v=N` when re-opening.
- Inline `style` on `document.body`/`documentElement` beats class-selector custom properties for
  descendants — that's how the accent switcher overrides a theme's default accent; "Auto" calls
  `removeProperty` to restore.
- accent-deep is computed ~18% darker; accent-ink flips to dark ink when accent luminance > ~0.62,
  else white — keeps button labels legible on any accent.
- Greg prefers **conversational clarification + an HTML report** over rigid AskUserQuestion modals
  (the 4-standards modal was rejected in favour of the report).
- When Greg says he's assessing/deciding, **stop building and give a concise list** — don't
  pre-emptively build the next thing.

## 9. Deploy / branch discipline

- Continue on the existing branch: `git checkout feature/design-lab-inspiration`.
- Commit + push to the branch; Netlify auto-builds the preview.
- **Never** hand Greg a bare `git push` — a merge-to-main is always a separate, clearly-labelled
  step he runs only after confirming a preview. The skill itself never merges or deploys.
