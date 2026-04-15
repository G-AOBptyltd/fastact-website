// ============================================
// FACT Website — Notion CMS API Function
// Netlify Serverless Function
// ============================================
//
// This function proxies requests to the Notion API,
// keeping the API key secure on the server side.
//
// Environment variables required (set in Netlify dashboard):
//   NOTION_API_KEY        — Notion integration token (secret_xxx)
//   NOTION_WORKSHOPS_DB   — Workshops database ID
//   NOTION_GUIDES_DB      — Guides database ID
//   NOTION_COURSES_DB     — Courses database ID
//   NOTION_INSTRUCTORS_DB — Instructors database ID
//   NOTION_SITES_DB       — Sites database ID
//
// Endpoints:
//   GET /.netlify/functions/notion-cms?type=workshops
//   GET /.netlify/functions/notion-cms?type=guides
//   GET /.netlify/functions/notion-cms?type=courses
//   GET /.netlify/functions/notion-cms?type=instructors
//   GET /.netlify/functions/notion-cms?type=sites
// ============================================

const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

// Database ID map (from environment variables)
function getDbId(type) {
  const map = {
    workshops: process.env.NOTION_WORKSHOPS_DB,
    guides: process.env.NOTION_GUIDES_DB,
    courses: process.env.NOTION_COURSES_DB,
    instructors: process.env.NOTION_INSTRUCTORS_DB,
    sites: process.env.NOTION_SITES_DB,
  };
  return map[type] || null;
}

// Fetch all pages from a Notion database
async function queryDatabase(databaseId, filter) {
  const body = {
    page_size: 100,
  };

  // Only show published content on the live site
  if (filter) {
    body.filter = filter;
  }

  const response = await fetch(`${NOTION_API}/databases/${databaseId}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Notion API error: ${response.status} — ${error}`);
  }

  return response.json();
}

// Extract clean properties from a Notion page
function extractProperties(page) {
  const props = page.properties;
  const result = { id: page.id };

  for (const [key, value] of Object.entries(props)) {
    switch (value.type) {
      case 'title':
        result[key] = value.title?.map(t => t.plain_text).join('') || '';
        break;
      case 'rich_text':
        result[key] = value.rich_text?.map(t => t.plain_text).join('') || '';
        break;
      case 'select':
        result[key] = value.select?.name || null;
        break;
      case 'multi_select':
        result[key] = value.multi_select?.map(s => s.name) || [];
        break;
      case 'number':
        result[key] = value.number;
        break;
      case 'checkbox':
        result[key] = value.checkbox;
        break;
      case 'url':
        result[key] = value.url || '';
        break;
      case 'email':
        result[key] = value.email || '';
        break;
      case 'date':
        result[key] = value.date?.start || null;
        break;
      case 'relation':
        result[key] = value.relation?.map(r => r.id) || [];
        break;
      default:
        result[key] = null;
    }
  }

  // Include icon if it's an emoji
  if (page.icon?.type === 'emoji') {
    result._icon = page.icon.emoji;
  }

  return result;
}

// Main handler
exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=60, s-maxage=300', // Cache for 5 min at CDN
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const type = event.queryStringParameters?.type;

  if (!type || !getDbId(type)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: 'Invalid type. Use: workshops, guides, courses, instructors, sites',
      }),
    };
  }

  try {
    const databaseId = getDbId(type);
    const data = await queryDatabase(databaseId);
    const pages = data.results.map(extractProperties);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        type,
        count: pages.length,
        results: pages,
      }),
    };
  } catch (error) {
    console.error('Notion CMS error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch from Notion CMS' }),
    };
  }
};
