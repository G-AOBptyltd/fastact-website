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

## Tech Stack

- **Framework:** Static HTML/CSS/JS (no build tools)
- **Fonts:** Inter + Plus Jakarta Sans (Google Fonts) — matches all AOB properties
- **Styling:** Custom CSS with CSS variables, responsive grid
- **Hosting:** Netlify (auto-deploy from GitHub main branch)
- **SEO:** OG tags, Twitter cards, canonical URLs

## File Structure

```
fastact-website/
├── index.html              — Homepage (all services, advisory, delivery, partnerships)
├── CLAUDE.md               — This file
├── css/
│   └── styles.css          — Main stylesheet (purple brand theme)
├── js/
│   └── main.js             — Mobile nav, scroll reveal, Netlify form handlers
├── img/                    — Images (to be populated)
└── pages/                  — Future subpages (individual service detail pages)
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

## Related Repositories

| Repo | Purpose |
|------|---------|
| `aob-corporate-hub` | AOB corporate website (parent brand) |
| `sprintinsite-website` | SprintINSite product website |
| `portfolioinsite-website` | PortfolioInSite product website |

## Deployment History

| Date | Change | Branch |
|------|--------|--------|
| 2026-03-06 | Initial site build — 6 services, 3 delivery models, waitlist form, purple brand | main |
| 2026-03-06 | Netlify connected, DNS configured, SSL provisioned, form detection enabled | main |

## Key Learnings

- Site design matches AOB/PortfolioInSite look and feel: same fonts, layout patterns, card components
- Body background is WHITE — all text must be dark colours (headings #1e293b, body #334155)
- GSD Framework is retained as "Previously known as" — do not remove the reference entirely
- All external links to AOB properties use full URLs with target="_blank"
- FACT was formerly called "Fast Agile Coaching & Training" — the abbreviation FACT is retained but the full name is no longer used
- DNS was previously set to forward fastact.com.au → agilityops.com.au — this forwarding was removed in GoDaddy to allow Netlify hosting
- GoDaddy A records are locked when forwarding is active — must remove forwarding first to unlock DNS editing
- Domain architecture document (v3) tracks all AOB brand domains, hosting, and email config

## Workflow Preferences

- **Test branches:** ALWAYS create a test branch before making changes to `main`. Never commit directly to `main` — use a branch, verify, then merge.
- **GitHub uploads:** If bulk file uploads or image uploads to GitHub are needed, ask the user to do it directly — provide the file list and instructions
- **Deployment .txt files:** When GitHub connector isn't available, provide `<page>-PASTE-THIS.txt` files for manual paste into GitHub web editor
