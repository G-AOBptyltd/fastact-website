/**
 * AOB InSite Suite — "Your Licensed Apps" nav component
 * Reads aob_lic_* localStorage keys to detect which tools are licensed on this device.
 * Injects a "Your Apps" dropdown into .nav-links or .hdr-right containers.
 *
 * Tool codes:
 *   SIS = SprintINSite Web        (sprintinsite.com)
 *   FLW = FlowInSite              (sprintinsite.com)
 *   POI = PortfolioInSite Web     (portfolioinsite.com.au)
 *   FCT = ForecastInSite          (portfolioinsite.com.au)
 *   PLN = PlanInSite              (portfolioinsite.com.au)
 *
 * Note: localStorage is origin-scoped. This script detects licences for tools
 * served from the SAME origin. Cross-origin tools show as links only.
 */
(function () {
  'use strict';

  var PRICING_URL = 'https://agilityops.com.au/pages/pricing';

  var SUITE = [
    { name: 'SprintINSite Web', tc: 'SIS', color: '#0052CC',
      desc: 'Sprint velocity & analytics',  url: 'https://sprintinsite.com/tools/sprintinsite' },
    { name: 'FlowInSite',       tc: 'FLW', color: '#10b981',
      desc: 'Team flow & capacity',          url: 'https://sprintinsite.com/tools/flowinsite' },
    { name: 'PortfolioInSite',  tc: 'POI', color: '#7c3aed',
      desc: 'Portfolio & backlog management',url: 'https://portfolioinsite.com.au/tools/portfolioinsite' },
    { name: 'ForecastInSite',   tc: 'FCT', color: '#0284c7',
      desc: 'Delivery forecasting',          url: 'https://portfolioinsite.com.au/tools/forecastinsite' },
    { name: 'PlanInSite',       tc: 'PLN', color: '#d97706',
      desc: 'Sprint capacity planning',      url: 'https://portfolioinsite.com.au/tools/planinsite' },
  ];

  /* ─── Licence check ─────────────────────────────────────────────── */

  function isLicensed(tc) {
    try {
      var raw = localStorage.getItem('aob_lic_' + tc);
      if (!raw) return false;
      var d = JSON.parse(raw);
      if (!d || !d.expires) return false;
      var y = d.expires.substring(0, 4);
      var m = d.expires.substring(4, 6);
      var day = d.expires.substring(6, 8);
      var exp = new Date(y + '-' + m + '-' + day);
      return !isNaN(exp.getTime()) && exp > new Date();
    } catch (e) { return false; }
  }

  /* ─── Build panel HTML ──────────────────────────────────────────── */

  function buildPanelHTML() {
    var licCount = 0;
    var itemsHTML = SUITE.map(function (p) {
      var lic = isLicensed(p.tc);
      if (lic) licCount++;
      return lic
        ? '<a href="' + p.url + '" class="aob-apps-item aob-apps-item--lic" target="_blank" rel="noopener">' +
            '<span class="aob-apps-dot aob-apps-dot--lic"></span>' +
            '<span class="aob-apps-info">' +
              '<span class="aob-apps-name" style="color:' + p.color + '">' + p.name + '</span>' +
              '<span class="aob-apps-desc">' + p.desc + '</span>' +
            '</span>' +
            '<span class="aob-apps-action aob-apps-action--lic">Open ›</span>' +
          '</a>'
        : '<a href="' + PRICING_URL + '" class="aob-apps-item aob-apps-item--unlic">' +
            '<span class="aob-apps-dot aob-apps-dot--unlic"></span>' +
            '<span class="aob-apps-info">' +
              '<span class="aob-apps-name aob-apps-name--unlic">' + p.name + '</span>' +
              '<span class="aob-apps-desc">' + p.desc + '</span>' +
            '</span>' +
            '<span class="aob-apps-action aob-apps-action--unlic">Get access</span>' +
          '</a>';
    }).join('');

    var footerMsg = licCount === 0
      ? 'No tools active on this device'
      : licCount + ' of ' + SUITE.length + ' tools licensed';

    return '<div class="aob-apps-header">' +
             '<span class="aob-apps-label">InSite Suite</span>' +
             '<span class="aob-apps-tagline">Your licensed tools</span>' +
           '</div>' +
           '<div class="aob-apps-list">' + itemsHTML + '</div>' +
           '<div class="aob-apps-footer">' +
             '<span class="aob-apps-count">' + footerMsg + '</span>' +
             '<a href="' + PRICING_URL + '" class="aob-apps-pricinglink">View plans →</a>' +
           '</div>';
  }

  /* ─── Styles ────────────────────────────────────────────────────── */

  var CSS = [
    '.aob-apps-wrap{position:relative;display:inline-flex;align-items:center;}',

    /* Button */
    '.aob-apps-btn{display:inline-flex;align-items:center;gap:4px;background:none;border:none;',
    'cursor:pointer;padding:6px 2px;font-size:.875rem;font-weight:500;color:inherit;',
    'font-family:inherit;line-height:1;white-space:nowrap;}',
    '.aob-apps-btn:hover{opacity:.75;}',
    '.aob-apps-btn svg{transition:transform .18s ease;flex-shrink:0;}',
    '.aob-apps-btn[aria-expanded="true"] svg{transform:rotate(180deg);}',
    /* Small dot indicator — shows licensed count */
    '.aob-apps-pip{display:inline-flex;align-items:center;justify-content:center;',
    'width:16px;height:16px;border-radius:50%;background:#10b981;color:#fff;',
    'font-size:.6rem;font-weight:700;margin-left:4px;line-height:1;}',
    '.aob-apps-pip--zero{background:#d1d5db;color:#6b7280;}',

    /* Panel */
    '.aob-apps-panel{position:absolute;top:calc(100% + 10px);right:0;',
    'background:#fff;border:1px solid #e5e7eb;border-radius:12px;',
    'box-shadow:0 8px 32px rgba(0,0,0,.14);min-width:295px;',
    'z-index:9999;overflow:hidden;display:none;animation:aobFadeIn .15s ease;}',
    '.aob-apps-panel.aob-open{display:block;}',
    '@keyframes aobFadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}',

    /* Panel — header */
    '.aob-apps-header{display:flex;align-items:baseline;justify-content:space-between;',
    'padding:11px 16px 9px;border-bottom:1px solid #f3f4f6;}',
    '.aob-apps-label{font-size:.68rem;font-weight:700;letter-spacing:.08em;',
    'text-transform:uppercase;color:#9ca3af;}',
    '.aob-apps-tagline{font-size:.68rem;color:#c4c9d4;}',

    /* Items */
    '.aob-apps-list{padding:5px 0;}',
    '.aob-apps-item{display:flex;align-items:center;gap:10px;padding:8px 16px;',
    'text-decoration:none;transition:background .1s;}',
    '.aob-apps-item:hover{background:#f9fafb;}',

    /* Status dot */
    '.aob-apps-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:1px;}',
    '.aob-apps-dot--lic{background:#10b981;box-shadow:0 0 0 2px rgba(16,185,129,.18);}',
    '.aob-apps-dot--unlic{background:#e5e7eb;}',

    /* Name + desc */
    '.aob-apps-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px;}',
    '.aob-apps-name{font-size:.83rem;font-weight:600;line-height:1.3;color:#111827;}',
    '.aob-apps-name--unlic{color:#c4c9d4!important;}',
    '.aob-apps-desc{font-size:.7rem;color:#9ca3af;line-height:1.2;}',

    /* Action label */
    '.aob-apps-action{font-size:.7rem;font-weight:600;white-space:nowrap;flex-shrink:0;}',
    '.aob-apps-action--lic{color:#10b981;}',
    '.aob-apps-action--unlic{color:#d1d5db;}',

    /* Footer */
    '.aob-apps-footer{display:flex;align-items:center;justify-content:space-between;',
    'padding:9px 16px;border-top:1px solid #f3f4f6;background:#f9fafb;}',
    '.aob-apps-count{font-size:.68rem;color:#9ca3af;}',
    '.aob-apps-pricinglink{font-size:.7rem;font-weight:600;color:#6366f1;text-decoration:none;}',
    '.aob-apps-pricinglink:hover{text-decoration:underline;}',

    /* Dark-mode */
    '@media(prefers-color-scheme:dark){',
    '.aob-apps-panel{background:#1e2433;border-color:#2d3748;}',
    '.aob-apps-header{border-color:#2d3748;}',
    '.aob-apps-footer{background:#161d2e;border-color:#2d3748;}',
    '.aob-apps-item:hover{background:#161d2e;}',
    '.aob-apps-name{color:#f3f4f6;}',
    '.aob-apps-desc{color:#6b7280;}',
    '.aob-apps-label{color:#4b5563;}',
    '.aob-apps-tagline{color:#374151;}',
    '.aob-apps-count{color:#6b7280;}',
    '}',
  ].join('');

  function injectStyles() {
    if (document.getElementById('aob-suite-nav-css')) return;
    var s = document.createElement('style');
    s.id = 'aob-suite-nav-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ─── Inject ────────────────────────────────────────────────────── */

  function injectInto(container, insertBeforeClass) {
    if (!container || document.getElementById('aob-apps-wrap')) return;

    /* Count licensed tools for the pip badge */
    var licCount = SUITE.filter(function (p) { return isLicensed(p.tc); }).length;

    var wrap = document.createElement('div');
    wrap.className = 'aob-apps-wrap';
    wrap.id = 'aob-apps-wrap';

    var btn = document.createElement('button');
    btn.className = 'aob-apps-btn';
    btn.id = 'aob-apps-btn';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-haspopup', 'true');
    var pipClass = licCount > 0 ? 'aob-apps-pip' : 'aob-apps-pip aob-apps-pip--zero';
    btn.innerHTML =
      'Your Apps' +
      '<span class="' + pipClass + '">' + licCount + '</span>' +
      '<svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13" style="margin-left:2px">' +
      '<path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>' +
      '</svg>';

    var panel = document.createElement('div');
    panel.className = 'aob-apps-panel';
    panel.id = 'aob-apps-panel';
    panel.innerHTML = buildPanelHTML();

    wrap.appendChild(btn);
    wrap.appendChild(panel);

    /* Find insertion point: before Pricing / nav-cta / btn / btn-outline */
    var children = Array.prototype.slice.call(container.children);
    var target = null;
    for (var i = 0; i < children.length; i++) {
      var el = children[i];
      var txt = (el.textContent || '').trim().toLowerCase();
      if (insertBeforeClass && el.classList.contains(insertBeforeClass)) { target = el; break; }
      if (txt === 'pricing' || el.classList.contains('nav-cta') ||
          el.classList.contains('btn') || el.classList.contains('btn-outline') ||
          el.classList.contains('btn-primary') || el.classList.contains('nav-pricing')) {
        target = el; break;
      }
    }
    if (target) container.insertBefore(wrap, target);
    else container.appendChild(wrap);

    /* Toggle */
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = panel.classList.contains('aob-open');
      panel.classList.toggle('aob-open', !open);
      btn.setAttribute('aria-expanded', String(!open));
    });
    document.addEventListener('click', function () {
      panel.classList.remove('aob-open');
      btn.setAttribute('aria-expanded', 'false');
    });
    panel.addEventListener('click', function (e) { e.stopPropagation(); });
  }

  /* ─── Sidebar variant (fastact-style fixed sidebar) ────────────── */

  function injectSidebar(container) {
    if (!container || document.getElementById('aob-apps-sidebar-btn')) return;

    var licCount = SUITE.filter(function (p) { return isLicensed(p.tc); }).length;

    /* Add extra sidebar CSS — fixed panel that opens to the right */
    var extraCSS = [
      '.aob-apps-sidebar-btn{display:flex;align-items:center;gap:8px;width:100%;',
      'background:none;border:none;cursor:pointer;padding:10px 16px;',
      'font-size:.84rem;font-weight:500;color:inherit;font-family:inherit;',
      'border-radius:8px;transition:background .12s;text-align:left;}',
      '.aob-apps-sidebar-btn:hover{background:rgba(255,255,255,.07);}',
      '.aob-apps-sidebar-btn .aob-apps-pip{flex-shrink:0;}',
      /* Fixed panel for sidebar — opens to the right of sidebar */
      '.aob-apps-panel--sidebar{position:fixed;top:auto;bottom:80px;left:220px;right:auto;}',
    ].join('');
    var extraStyle = document.createElement('style');
    extraStyle.textContent = extraCSS;
    document.head.appendChild(extraStyle);

    var pipClass = licCount > 0 ? 'aob-apps-pip' : 'aob-apps-pip aob-apps-pip--zero';

    var btn = document.createElement('button');
    btn.className = 'aob-apps-sidebar-btn';
    btn.id = 'aob-apps-sidebar-btn';
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML =
      '<span style="font-size:1rem">🔧</span>' +
      '<span style="flex:1">Your Apps</span>' +
      '<span class="' + pipClass + '">' + licCount + '</span>';

    var panel = document.createElement('div');
    panel.className = 'aob-apps-panel aob-apps-panel--sidebar';
    panel.id = 'aob-apps-panel';
    panel.innerHTML = buildPanelHTML();
    document.body.appendChild(panel);

    container.insertBefore(btn, container.firstChild);

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = panel.classList.contains('aob-open');
      panel.classList.toggle('aob-open', !open);
      btn.setAttribute('aria-expanded', String(!open));
    });
    document.addEventListener('click', function () {
      panel.classList.remove('aob-open');
      btn.setAttribute('aria-expanded', 'false');
    });
    panel.addEventListener('click', function (e) { e.stopPropagation(); });
  }

  function init() {
    injectStyles();
    /* Try standard top-nav → playbook hdr-right → sidebar-bottom */
    var navLinks   = document.querySelector('.nav-links');
    var hdrRight   = document.querySelector('.hdr-right');
    var sidebarBot = document.querySelector('.sidebar-bottom');

    if (navLinks || hdrRight) {
      injectInto(navLinks || hdrRight);
    } else if (sidebarBot) {
      injectSidebar(sidebarBot);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
