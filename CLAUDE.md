# FACT Website — Claude Code Project Intelligence

## Project Identity

Standalone marketing website for FACT — the training, coaching, facilitation, and AI advisory brand of Agility Ops Business Pty Ltd. FACT replaces the legacy "Fast Agile Coaching & Training" positioning and now encompasses Applied AI training, agile coaching, team building, facilitation, keynote speaking, AI Cognitive Governance advisory, and partnership programmes.

**Owner:** Agility Ops Business Pty Ltd (AOB)
**Domain:** https://fastact.com.au
**GitHub:** https://github.com/G-AOBptyltd/fastact-website
**Visibility:** Public repo
**Hosting:** Netlify (auto-deploys from main branch)
**Netlify subdomain:** https://fastact.netlify.app
**Parent brand:** https://agilityops.com.au
**DNS:** GoDaddy → A record @ → 75.2.60.5, CNAME www → fastact.netlify.app
**SSL:** Let's Encrypt via Netlify (auto-provisioned)
**Status:** Live (deployed March 6, 2026)

## Brand Positioning

FACT is the people capability arm of Agility Ops. While SprintINSite and PortfolioInSite are software products, FACT is the services brand.

**Six service offerings:**
1. **Agile Training & Coaching** — Scrum, Kanban, SAFe, hands-on coaching
2. **Team Building** — Gallup CliftonStrengths, psychometric tools, team dynamics
3. **Facilitation** — Workshops, PI Planning, strategy sessions, leadership offsites
4. **Speaker & Keynotes** — Conferences, executive offsites, industry events
5. **AI Cognitive Governance & Context Saturation™** — Flagship advisory (formerly GSD Framework)
6. **Partnership Programmes** — Gallup, AI partners, Atlassian ecosystem, conference co-delivery

**Three delivery models:**
- Fully Virtual (available now)
- In-House Training (available now)
- Public Training (coming soon — waitlist)

**Brand colour:** Purple/Violet (#a855f7 primary, #7c3aed deep)

## GSD Framework — Rebranding Context

The GSD Framework ("The Human Operating System for the AI Age™") has been evolved into the **AI Cognitive Governance & Context Saturation™** advisory practice. The GSD name is retained with a "Previously known as" reference. The five pillars are:
1. Cognitive Load Diagnostics
2. Attention Architecture
3. Demand Governance
4. AI Guardrail Design
5. Deep Work Protection

## R&D Language Rules (MANDATORY)

- **NEVER use:** "R&D-backed" (implies funding secured)
- **ALWAYS use:** "Developed within our R&D program" or "Methodology under active R&D development"
- R&D Tax Incentive application is in progress — not approved

## Notion CMS Integration (Live)

FACT is the first site using the AOB centralised CMS. Content is managed in Notion and rendered dynamically with static HTML fallback.

**For full CMS/payment architecture details, see:** `../CLAUDE-aob-payment-platform.md`

- **Central API:** `https://api.agilityops.com.au/api/cms` (LIVE — Phase 1 complete)
- **Site slug:** `fact`
- **Frontend client:** `js/notion-cms.js` — fetches from central API, renders workshop/guide/course cards
- **Content detail page:** `pages/content.html` — dynamic SPA-style page, reads slug from `/content/{slug}` URL
- **Product detail page:** `pages/product.html` — dynamic SPA-style page, reads slug from `/product/{slug}` URL, fetches all active products (no brand filter) and pricing
- **Serverless function:** `netlify/functions/notion-cms.js` — LEGACY, no longer used (functions config removed from netlify.toml). Netlify proxy redirects route `/api/cms` to central API instead.
- **CMS setup docs:** `NOTION-CMS-SETUP.md`
- **Netlify routing:** SPA-style redirects in `netlify.toml` — `/content/*` → `pages/content.html`, `/product/*` → `pages/product.html`
- **API proxy:** `/api/cms` → `https://api.agilityops.com.au/api/cms` (backward-compatible passthrough)

## Tech Stack

- **Framework:** Static HTML/CSS/JS (no build tools)
- **Fonts:** Inter + Plus Jakarta Sans (Google Fonts) — matches all AOB properties
- **Styling:** Custom CSS with CSS variables, responsive grid
- **Hosting:** Netlify (auto-deploy from GitHub main branch)
- **CMS:** Notion via AOB Central API (`api.agilityops.com.au`)
- **SEO:** OG tags, Twitter cards, canonical URLs

## File Structure

```
fastact-website/
├── index.html              — Homepage (all services, advisory, delivery, partnerships)
├── CLAUDE.md               — This file
├── NOTION-CMS-SETUP.md     — CMS integration setup docs
├── netlify.toml            — Netlify config (SPA redirects, API proxy, headers)
├── css/
│   └── styles.css          — Main stylesheet (purple brand theme)
├── js/
│   ├── main.js             — Mobile nav, scroll reveal, Netlify form handlers
│   └── notion-cms.js       — CMS client v2 (fetches from central API, renders cards)
├── netlify/
│   └── functions/
│       └── notion-cms.js   — LEGACY serverless function (no longer deployed)
├── img/                    — Images (to be populated)
└── pages/
    ├── content.html        — Dynamic content detail page (workshops, guides, courses)
    └── product.html        — Dynamic product detail page (apps, tools)
```

## Netlify Forms

- Waitlist form on `index.html` uses **Netlify Forms** with `data-netlify="true"` attribute
- Form name: `fact-waitlist`
- **Form detection:** Enabled in Netlify dashboard (March 6, 2026)
- Form handler in `js/main.js` uses `fetch()` POST with `x-www-form-urlencoded` encoding
- Also prepared for a `fact-contact` form for future contact page

## Legal Pages

- **Privacy Policy and Terms of Service** are served from the parent company site: `https://agilityops.com.au/pages/privacy.html` and `https://agilityops.com.au/pages/terms.html`
- Footer links use `target="_blank"` to open in new tab
- No local legal pages — all legal content centralised on agilityops.com.au

## Related Repositories & CLAUDE.md Files

| Repo / File | Purpose |
|------|---------|
| `aob-corporate-hub` | AOB corporate website (parent brand) |
| `sprintinsite-website` | SprintINSite product website |
| `portfolioinsite-website` | PortfolioInSite product website |
| `aob-api` (planned) | Central API for CMS + payments |
| `../CLAUDE-aob-payment-platform.md` | **Payment platform & CMS architecture** (use for cross-site work) |
| `../CLAUDE-blog-content.md` | Blog content engine |

## Deployment History

| Date | Change | Branch |
|------|--------|--------|
| 2026-03-06 | Initial site build — 6 services, 3 delivery models, waitlist form, purple brand | main |
| 2026-03-06 | Netlify connected, DNS configured, SSL provisioned, form detection enabled | main |
| 2026-04-15 | Central API integration — notion-cms.js v2, netlify.toml updated, API proxy | main |
| 2026-04-15 | Content detail page (pages/content.html) — dynamic SPA-style landing pages | main |
| 2026-04-15 | Product detail page (pages/product.html) — dynamic product landing pages | main |
| 2026-04-16 | Product page fix — removed brand filter so all active products match by slug | pending |

## Key Learnings

- Site design matches AOB/PortfolioInSite look and feel: same fonts, layout patterns, card components
- Body background is WHITE — all text must be dark colours (headings #1e293b, body #334155)
- GSD Framework is retained as "Previously known as" — do not remove the reference entirely
- All external links to AOB properties use full URLs with target="_blank"
- FACT was formerly called "Fast Agile Coaching & Training" — the abbreviation FACT is retained but the full name is no longer used
- DNS was previously set to forward fastact.com.au → agilityops.com.au — this forwarding was removed in GoDaddy to allow Netlify hosting
- GoDaddy A records are locked when forwarding is active — must remove forwarding first to unlock DNS editing
- Domain architecture document (v3) tracks all AOB brand domains, hosting, and email config
- **CORS:** Sites database Domain field MUST include `https://` prefix (e.g., `https://fastact.com.au` not `fastact.com.au`). Browser `Origin` header includes the protocol.
- **API cache:** Central API has 5-minute in-memory cache. After Notion data changes, wait up to 5 minutes for API to reflect updates.
- **Product pages are brand-agnostic:** product.html fetches ALL active products (no brand filter) and matches by slug. This allows any product to have a landing page on any site.
- **Content pages are site-specific:** content.html fetches content filtered by `site=fact` so only FACT-branded content appears.
- **Cowork + Git:** Cowork sandbox cannot remove `.git/index.lock` files. If git operations fail in Cowork, do them from the Mac terminal instead.

## Workflow Preferences

- **Test branches:** ALWAYS create a test branch before making changes to `main`. Never commit directly to `main` — use a branch, verify, then merge.
- **GitHub uploads:** If bulk file uploads or image uploads to GitHub are needed, ask the user to do it directly — provide the file list and instructions
- **Deployment .txt files:** When GitHub connector isn't available, provide `<page>-PASTE-THIS.txt` files for manual paste into GitHub web editor
