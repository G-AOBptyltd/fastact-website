# FACT Website — Claude Code Project Intelligence

> **Shared rules apply.** See `../.claude/rules/` for brand voice, git workflow, deployment, legal compliance, and API integration rules that govern all AOB repos. See `../CLAUDE.md` for the full AOB context, repo map, and Notion IDs.

## Project Identity

Standalone marketing website for FACT — the training, coaching, facilitation, and AI advisory brand of AOB.

**Domain:** https://fastact.com.au
**GitHub:** https://github.com/G-AOBptyltd/fastact-website (public)
**Hosting:** Netlify (auto-deploys from main)
**Netlify subdomain:** https://fastact.netlify.app
**DNS:** GoDaddy → A record @ → 75.2.60.5, CNAME www → fastact.netlify.app
**Analytics:** Google Analytics G-XPLEWG5GR4
**Status:** Live (deployed March 6, 2026)

## Brand Positioning

FACT is the people capability arm of Agility Ops — services, not software.

**Six service offerings:**
1. Agile Training & Coaching
2. Team Building (Gallup CliftonStrengths)
3. Facilitation (workshops, PI Planning, strategy sessions)
4. Speaker & Keynotes
5. AI Cognitive Governance & Context Saturation (flagship advisory — formerly GSD Framework)
6. Partnership Programmes (Gallup, AI partners, Atlassian)

**Delivery models:** Fully Virtual, In-House Training (both live), Public Training (coming — waitlist)

**Brand colour:** Purple/Violet (#a855f7 primary, #7c3aed deep)

## Page Standards (MANDATORY for ALL new pages)

Every new FACT page — playbooks, guides, landing pages, anything — MUST adopt the shared site chrome. No bespoke variants. End of story.

- **Footer:** use the canonical `.footer-mini` exactly. Markup:
  `© 2026 Agility Ops Business Pty Ltd (ABN 37 650 141 950). All rights reserved.` on the left,
  and on the right: Tools & Games (`/tools-games`) · Agility Ops · Privacy · Terms (the two legal links point to the
  canonical pages on agilityops.com.au, `target="_blank" rel="noopener"`). Dark navy band (`--navy`). ABN is required.
- **Sidebar:** use the canonical left `.sidebar` nav (logo "F" → FACT Training, "by Agility Ops", search w/ ⌘K,
  nav-links with icons, active + `sidebar-bottom`). New top-level destinations get a nav-link here.
- **Free tool playbooks** live under the **Launchpad** section (new). Sidebar item: 🚀 Launchpad. Playbook pages are
  light-content within the dark FACT chrome; hero in FACT purple; section nav uses the "Jump to" pattern (label + icons + scroll-spy).
- **Claude-ecosystem content** uses Anthropic clay/terracotta accents (`--clay #cc785c` on cream `--cream #f7f4ec`),
  kept visually distinct from FACT purple. Hint at depth; never claim official Anthropic partnership/endorsement publicly.

## GSD Framework Context

The GSD Framework ("The Human Operating System for the AI Age") evolved into AI Cognitive Governance & Context Saturation. The GSD name is retained with a "Previously known as" reference. Five pillars: Cognitive Load Diagnostics, Attention Architecture, Demand Governance, AI Guardrail Design, Deep Work Protection.

**SprintINSite exception:** SprintINSite is a commercial product, NOT part of the R&D application. Do not reference R&D on SprintINSite content.

## CMS Integration

- **Site slug:** `fact`
- **CMS client:** `js/notion-cms.js` (SITE_SLUG = 'fact')
- **Content page:** `pages/content.html` — `/content/{slug}`
- **Product page:** `pages/product.html` — `/product/{slug}`
- **Legacy function:** `netlify/functions/notion-cms.js` — no longer deployed; proxy in netlify.toml handles it
- **Setup docs:** `NOTION-CMS-SETUP.md`

## Tech Stack

- Static HTML/CSS/JS (no build tools)
- Fonts: Inter + Plus Jakarta Sans
- Hosting: Netlify, CMS via Central API

## File Structure

```
fastact-website/
├── index.html              — Homepage (6 services, advisory, partnerships)
├── NOTION-CMS-SETUP.md     — CMS setup docs
├── netlify.toml            — SPA redirects, API proxy, headers
├── css/styles.css
├── js/
│   ├── main.js             — Mobile nav, scroll reveal, form handlers
│   └── notion-cms.js       — CMS client v2
├── netlify/functions/
│   └── notion-cms.js       — LEGACY (no longer deployed)
├── img/
└── pages/
    ├── content.html        — Dynamic content detail
    └── product.html        — Dynamic product detail
```

## Netlify Forms

- Waitlist form: `fact-waitlist` on `index.html`
- Future: `fact-contact` form prepared

## Deployment History

| Date | Change |
|------|--------|
| 2026-03-06 | Initial build — 6 services, 3 delivery models, waitlist, DNS, SSL, forms |
| 2026-04-15 | Central API integration — notion-cms.js v2, API proxy, content + product pages |
| 2026-04-16 | Product page brand filter restored |
| 2026-05-20 | SEO overhaul — dedicated GA4 G-XPLEWG5GR4, OG tags, JSON-LD, sitemap, og:image |

## Key Learnings

- Body background is WHITE — all text must be dark colours
- GSD Framework retained as "Previously known as" — don't remove reference
- FACT was formerly "Fast Agile Coaching & Training" — abbreviation kept, full name retired
- DNS was forwarding to agilityops.com.au — had to remove forwarding in GoDaddy before A records could be edited
- **GA4:** fastact.com.au has its own property (G-XPLEWG5GR4) — do not revert to shared G-LLJ1KPTDMK
- **og:image:** Generated via Python/Pillow from `agility_ops_logo_master.svg` at `img/og-image.png`
- **Product pages are brand-scoped:** product.html fetches `brand=fact` so only FACT products appear
