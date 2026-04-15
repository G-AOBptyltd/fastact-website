# FACT Website — Notion CMS Integration

## Architecture

```
Browser (fastact.com.au)
    ↓ fetch('/api/cms?type=workshops')
Netlify Function (notion-cms.js)
    ↓ Notion API (secret key, server-side only)
Notion Databases (AOB Website CMS)
    ↓ JSON response
Browser renders cards from CMS data
```

**Key principle**: Static HTML loads first (fast, SEO-friendly), then CMS content replaces it via JavaScript. If CMS is unavailable, the static fallback remains visible.

## Setup Steps

### 1. Create a Notion Integration

1. Go to https://www.notion.so/my-integrations
2. Click "New Integration"
3. Name: `AOB Website CMS`
4. Associated workspace: Your AOB workspace
5. Capabilities: Read content only
6. Copy the **Internal Integration Token** (starts with `secret_`)

### 2. Share Databases with the Integration

In Notion, open each database and click "Share" → invite the `AOB Website CMS` integration:

| Database | ID |
|----------|-----|
| Sites | `c5aa7d3a-eedf-4a61-8434-b7e52a6ed3a1` |
| Instructors | `7e68996a-76be-449b-b949-9d2991fafb0b` |
| Workshops | `bb9a4863-5c0c-4741-992c-b135cc5bb903` |
| Guides | `b706bd3e-cd8c-409c-b3c8-ab425a929faa` |
| Courses | `ca7693d4-f98e-4013-afa4-2dcd864c5775` |

### 3. Set Environment Variables in Netlify

In the Netlify dashboard → Site settings → Environment variables, add:

```
NOTION_API_KEY        = secret_xxxxxxxxxxxxxxxxxxxxx
NOTION_SITES_DB       = c5aa7d3aeedf4a618434b7e52a6ed3a1
NOTION_INSTRUCTORS_DB = 7e68996a76be449bb9499d2991fafb0b
NOTION_WORKSHOPS_DB   = bb9a48635c0c4741992cb135cc5bb903
NOTION_GUIDES_DB      = b706bd3ecd8c409cb3c8ab425a929faa
NOTION_COURSES_DB     = ca7693d4f98e4013afa42dcd864c5775
```

Note: Database IDs are the same as above but without dashes.

### 4. Deploy

Push to GitHub and deploy. The Netlify function will automatically be built from `netlify/functions/notion-cms.js`.

## API Endpoints

Once deployed, the CMS is available at:

```
GET https://fastact.com.au/api/cms?type=workshops
GET https://fastact.com.au/api/cms?type=guides
GET https://fastact.com.au/api/cms?type=courses
GET https://fastact.com.au/api/cms?type=instructors
GET https://fastact.com.au/api/cms?type=sites
```

Responses are cached for 5 minutes at the CDN level.

## How Content Updates Work

1. Edit content in Notion (change a workshop title, add a new course, update Greg's bio)
2. Changes appear on the live site within 5 minutes (CDN cache TTL)
3. No code deployment needed for content changes

## Files

| File | Purpose |
|------|---------|
| `netlify/functions/notion-cms.js` | Serverless function — proxies Notion API |
| `js/notion-cms.js` | Frontend client — fetches and renders CMS content |
| `netlify.toml` | Netlify config — function setup and URL redirects |
| `index.html` | Static HTML with CMS script tag |

## Notion Database Schema

### Sites
Site Name, Domain, Platform, GitHub Repo, Status, Brand Colour, Description

### Instructors
Name, Role, Bio, Photo URL, Email, Initials, Active, Sites (relation)

### Workshops
Workshop Title, Instructor (relation), Site (relation), Date, Level, Status, Description, Emoji, Duration, Tags, Published

### Guides
Guide Title, Author (relation), Site (relation), Level, Status, Description, Emoji, Tags, Published

### Courses
Course Title, Instructor (relation), Site (relation), Modules, Duration, Level, Status, Description, Subtitle, Label, Tier, Tags, Published

## Extending to Other Sites

The same Notion CMS can power all AOB websites. Each site filters by its own Site relation. To add a new site:

1. Add a new entry in the Sites database
2. Create content entries linked to that site
3. Add the `notion-cms.js` pattern to the new site
4. Set the same environment variables in the new site's Netlify config
