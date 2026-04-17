// ============================================
// FACT Website — Notion CMS Client (v2)
// Fetches content from AOB Central API
// ============================================

const CMS_API = '/api/cms';
const SITE_SLUG = 'fact';

// Cache to avoid repeated fetches during a session
const cmsCache = {};

/**
 * Fetch content from Central CMS API
 * @param {string} type - content | pricing | products | instructors | sites
 * @returns {Promise<Array>} Array of items
 */
async function fetchCMS(type) {
  if (cmsCache[type]) return cmsCache[type];

  try {
    const url = `${CMS_API}?type=${type}&site=${SITE_SLUG}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`CMS fetch failed: ${response.status}`);
    const json = await response.json();
    cmsCache[type] = json.data || [];
    return cmsCache[type];
  } catch (error) {
    console.warn(`CMS fetch failed for ${type}, using static fallback:`, error);
    return null; // null signals "use static content"
  }
}

/**
 * Filter content items by Type select property
 */
function filterByType(items, typeName) {
  if (!items) return null;
  return items.filter(item => item.type === typeName);
}

/**
 * Render workshops from CMS data into the card row
 */
function renderWorkshops(workshops) {
  const row = document.querySelector('.workshops-row');
  if (!row || !workshops || workshops.length === 0) return;

  row.innerHTML = workshops.map(w => `
    <div class="workshop-card">
      <div class="workshop-thumb" style="${getThumbGradient(w.level)}">
        ${w.emoji || '📅'}
        <div class="workshop-tag tag-coming-soon">${w.status || 'COMING SOON'}</div>
        <div class="workshop-date">${w.date || 'Dates TBA'}</div>
      </div>
      <div class="workshop-body">
        <div class="workshop-title">${escapeHtml(w.title)}</div>
        <div class="workshop-instructor" data-instructor-id="${(w.instructorIds || [])[0] || ''}">
          <div class="instructor-avatar">G</div>
          Taught by Greg
        </div>
        <div class="workshop-level ${getLevelClass(w.level)}">${w.level || 'Beginner'}</div>
        <div class="workshop-actions">
          ${w.slug
            ? `<a href="/content/${w.slug}" class="btn btn-purple btn-sm">View Details</a>`
            : `<a href="#waitlist" class="btn btn-purple btn-sm">Register Interest</a>`
          }
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Render guides from CMS data into the card row
 */
function renderGuides(guides) {
  const row = document.querySelector('.guides-row');
  if (!row || !guides || guides.length === 0) return;

  row.innerHTML = guides.map(g => `
    <div class="guide-card">
      <div class="guide-thumb" style="${getThumbGradient(g.level)}">
        ${g.emoji || '📖'}
      </div>
      <div class="guide-body">
        <div class="guide-title">${escapeHtml(g.title)}</div>
        <div class="workshop-instructor" data-instructor-id="${(g.instructorIds || [])[0] || ''}">
          <div class="instructor-avatar">G</div>
          By Greg
        </div>
        <div class="workshop-level ${getLevelClass(g.level)}">${g.level || 'Beginner'}</div>
      </div>
    </div>
  `).join('');
}

/**
 * Render courses from CMS data into the card row
 */
function renderCourses(courses) {
  const row = document.querySelector('.courses-row');
  if (!row || !courses || courses.length === 0) return;

  row.innerHTML = courses.map(c => `
    <div class="course-card">
      <div class="course-thumb">
        <div class="course-thumb-bg ${getCourseThemeClass(c.label)}">
          <div class="course-thumb-label">${escapeHtml(c.label || '')}</div>
          <div class="course-thumb-title">${escapeHtml(c.subtitle || c.title)}</div>
        </div>
      </div>
      <div class="course-body">
        <div class="course-title">${escapeHtml(c.title)}</div>
        <div class="course-meta-row">${c.modules || '?'} modules &bull; ${c.duration || 'TBA'}</div>
        <div class="workshop-instructor" data-instructor-id="${(c.instructorIds || [])[0] || ''}">
          <div class="instructor-avatar">G</div>
          Taught by Greg
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Resolve instructor names from IDs (replaces "Greg" placeholders with CMS data)
 */
async function resolveInstructors() {
  const instructors = await fetchCMS('instructors');
  if (!instructors) return;

  // Build ID-to-name map
  const instructorMap = {};
  instructors.forEach(i => {
    instructorMap[i.id] = {
      name: i.name,
      initials: i.initials || i.name?.charAt(0) || '?',
      role: i.role,
    };
  });

  // Update all instructor references in the DOM
  document.querySelectorAll('.workshop-instructor[data-instructor-id]').forEach(el => {
    const id = el.dataset.instructorId;
    if (id && instructorMap[id]) {
      const inst = instructorMap[id];
      const avatar = el.querySelector('.instructor-avatar');
      if (avatar) avatar.textContent = inst.initials;

      // Update text - find the text node
      const textNodes = Array.from(el.childNodes).filter(n => n.nodeType === 3);
      const prefix = el.closest('.guide-card') ? 'By ' : 'Taught by ';
      textNodes.forEach(node => {
        if (node.textContent.includes('Taught by') || node.textContent.includes('By ')) {
          node.textContent = `\n              ${prefix}${inst.name}\n            `;
        }
      });
    }
  });
}

// ========== HELPERS ==========

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function getLevelClass(level) {
  switch ((level || '').toLowerCase()) {
    case 'beginner': return 'level-beginner';
    case 'intermediate': return 'level-intermediate';
    case 'advanced': return 'level-advanced';
    default: return 'level-beginner';
  }
}

function getThumbGradient(level) {
  switch ((level || '').toLowerCase()) {
    case 'intermediate': return 'background: linear-gradient(135deg, rgba(37,99,235,0.2), rgba(6,182,212,0.3));';
    case 'advanced': return 'background: linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.2));';
    default: return '';
  }
}

function getCourseThemeClass(label) {
  if (!label) return '';
  if (label.toLowerCase().includes('flagship')) return 'cg';
  if (label.toLowerCase().includes('applied') || label.toLowerCase().includes('ai')) return 'agile';
  if (label.toLowerCase().includes('team')) return 'strengths';
  return '';
}

// ========== INITIALIZATION ==========

/**
 * Initialize CMS content loading
 * Falls back gracefully to static HTML if CMS is unavailable
 */
async function initNotionCMS() {
  try {
    // Fetch all published content for this site in one call
    const allContent = await fetchCMS('content');

    if (allContent) {
      // Split unified content by Type
      const workshops = filterByType(allContent, 'Workshop');
      const guides = filterByType(allContent, 'Guide');
      const courses = filterByType(allContent, 'Course');

      // Only render if CMS returned data for that type
      if (workshops && workshops.length > 0) renderWorkshops(workshops);
      if (guides && guides.length > 0) renderGuides(guides);
      if (courses && courses.length > 0) renderCourses(courses);
    }

    // Resolve instructor names from CMS
    await resolveInstructors();

    // Re-initialize card row arrows after content is replaced
    if (typeof initCardRowArrows === 'function') {
      initCardRowArrows();
    }

    console.log('CMS content loaded from central API');
  } catch (error) {
    console.warn('Central CMS unavailable, using static content:', error);
    // Static HTML content remains — no action needed
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNotionCMS);
} else {
  initNotionCMS();
}
