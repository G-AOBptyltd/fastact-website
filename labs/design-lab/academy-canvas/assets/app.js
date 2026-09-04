/* ============================================================
   AGILITY OPS ACADEMY — "CANVAS" — shared behaviour
   Mobile nav · accessible Products drawer · SVG connector
   draw-in · scroll reveal. All page-specific bits guarded.
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile nav ---------- */
  var burger = document.querySelector('[data-burger]');
  var mnav = document.getElementById('mobileNav');
  if (burger && mnav) {
    burger.addEventListener('click', function () {
      mnav.classList.toggle('open');
    });
    mnav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { mnav.classList.remove('open'); });
    });
  }

  /* ---------- Accessible Products drawer ---------- */
  var drawer = document.getElementById('productsDrawer');
  var backdrop = document.getElementById('drawerBackdrop');
  var openers = document.querySelectorAll('[data-drawer-open]');
  var closers = document.querySelectorAll('[data-drawer-close]');
  var lastFocus = null;

  function openDrawer() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    if (backdrop) backdrop.classList.add('open');
    openers.forEach(function (o) { o.setAttribute('aria-expanded', 'true'); });
    document.body.style.overflow = 'hidden';
    var first = drawer.querySelector('.drawer-close, a, button');
    if (first) first.focus();
    document.addEventListener('keydown', onKey);
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    if (backdrop) backdrop.classList.remove('open');
    openers.forEach(function (o) { o.setAttribute('aria-expanded', 'false'); });
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function onKey(e) {
    if (e.key === 'Escape') { closeDrawer(); return; }
    if (e.key === 'Tab' && drawer && drawer.classList.contains('open')) {
      var f = drawer.querySelectorAll('a[href], button:not([disabled])');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
  openers.forEach(function (o) { o.addEventListener('click', openDrawer); });
  closers.forEach(function (c) { c.addEventListener('click', closeDrawer); });
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  /* ---------- Scroll reveal (cards) ---------- */
  var cards = document.querySelectorAll('.card');
  if (cards.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      cards.forEach(function (c) { c.classList.add('in'); });
    } else {
      var io2 = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            var sibs = Array.prototype.slice.call(en.target.parentNode.children);
            en.target.style.transitionDelay = (sibs.indexOf(en.target) % 4) * 0.06 + 's';
            en.target.classList.add('in');
            io2.unobserve(en.target);
          }
        });
      }, { threshold: 0.14 });
      cards.forEach(function (c) { io2.observe(c); });
    }
  }

  /* ---------- Node-graph connector draw-in (guarded) ---------- */
  var frame = document.getElementById('nodeFrame');
  var svg = document.getElementById('nodeWires');
  if (frame && svg) {
    var VB_W = 1160, VB_H = 600;
    // edges declared on the frame as data-edges="from>to[:hot], ..."
    var raw = (frame.getAttribute('data-edges') || '').split(',');
    var edges = raw.map(function (s) {
      s = s.trim(); if (!s) return null;
      var style = ''; if (s.indexOf(':') > -1) { var p = s.split(':'); s = p[0]; style = p[1]; }
      var ab = s.split('>');
      return { from: ab[0].trim(), to: ab[1].trim(), style: style.trim() };
    }).filter(Boolean);

    function ports() {
      var fr = frame.getBoundingClientRect();
      var sx = VB_W / fr.width, sy = VB_H / fr.height;
      var map = {};
      frame.querySelectorAll('.node').forEach(function (n) {
        var r = n.getBoundingClientRect();
        map[n.getAttribute('data-node')] = {
          right: { x: (r.right - fr.left) * sx, y: (r.top - fr.top + r.height / 2) * sy },
          left: { x: (r.left - fr.left) * sx, y: (r.top - fr.top + r.height / 2) * sy }
        };
      });
      return map;
    }

    function draw() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var p = ports();
      edges.forEach(function (e) {
        var a = p[e.from], b = p[e.to];
        if (!a || !b) return;
        var x1 = a.right.x, y1 = a.right.y, x2 = b.left.x, y2 = b.left.y;
        var dx = Math.max(40, Math.abs(x2 - x1) * 0.5);
        var d = 'M ' + x1 + ' ' + y1 + ' C ' + (x1 + dx) + ' ' + y1 + ' ' + (x2 - dx) + ' ' + y2 + ' ' + x2 + ' ' + y2;
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        path.setAttribute('class', 'wire ' + (e.style || ''));
        svg.appendChild(path);
        var len = path.getTotalLength();
        path.style.setProperty('--len', len);
        [[x1, y1], [x2, y2]].forEach(function (pt) {
          var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          c.setAttribute('cx', pt[0]); c.setAttribute('cy', pt[1]); c.setAttribute('r', '3.4');
          c.setAttribute('class', 'handle');
          svg.appendChild(c);
        });
      });
    }

    var nodes = Array.prototype.slice.call(frame.querySelectorAll('.node'));
    nodes.forEach(function (n, i) { n.style.transitionDelay = (0.18 + i * 0.09) + 's'; });

    draw();

    if (reduce || !('IntersectionObserver' in window)) {
      frame.classList.add('drawn');
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { frame.classList.add('drawn'); io.unobserve(frame); }
        });
      }, { threshold: 0.2 });
      io.observe(frame);
    }

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () {
        var was = frame.classList.contains('drawn');
        frame.classList.remove('drawn');
        draw();
        if (was) requestAnimationFrame(function () { frame.classList.add('drawn'); });
      }, 200);
    });
  }
})();
