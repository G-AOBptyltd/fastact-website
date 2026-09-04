/* ============================================================
   AOB WEB KIT — PortfolioInSite · shared behaviour
   Every bit is guarded so it no-ops on pages where the
   markup is absent. No external libraries, no build step.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  function initMobileNav() {
    var toggle = document.querySelector(".nav-toggle");
    var sheet = document.getElementById("mobileNav");
    if (!toggle || !sheet) return;
    toggle.addEventListener("click", function () {
      var open = sheet.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // close on link click
    sheet.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        sheet.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Products drawer (accessible) ---------- */
  function initDrawer() {
    var drawer = document.getElementById("productsDrawer");
    var backdrop = document.getElementById("drawerBackdrop");
    if (!drawer || !backdrop) return;

    var openers = document.querySelectorAll("[data-drawer-open]");
    var closers = drawer.querySelectorAll("[data-drawer-close]");
    var lastFocused = null;

    function focusables() {
      return drawer.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
    }

    function open() {
      lastFocused = document.activeElement;
      drawer.classList.add("open");
      backdrop.classList.add("open");
      drawer.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      openers.forEach(function (o) { o.setAttribute("aria-expanded", "true"); });
      var f = focusables();
      if (f.length) f[0].focus();
      document.addEventListener("keydown", onKey);
    }

    function close() {
      drawer.classList.remove("open");
      backdrop.classList.remove("open");
      drawer.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      openers.forEach(function (o) { o.setAttribute("aria-expanded", "false"); });
      document.removeEventListener("keydown", onKey);
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    function onKey(e) {
      if (e.key === "Escape") { close(); return; }
      if (e.key === "Tab") {
        var f = focusables();
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    }

    openers.forEach(function (o) {
      o.addEventListener("click", function (e) {
        e.preventDefault();
        drawer.classList.contains("open") ? close() : open();
      });
    });
    closers.forEach(function (c) { c.addEventListener("click", close); });
    backdrop.addEventListener("click", close);
  }

  /* ---------- Scroll-reveal ---------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Home hero: animated portfolio visual ---------- */
  function initHeroVisual() {
    var svg = document.getElementById("heroViz");
    if (!svg) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Animate the "health score" ring sweep + score count-up.
    var ring = svg.querySelector("#scoreRing");
    var label = svg.querySelector("#scoreNum");
    if (ring) {
      var len = ring.getTotalLength ? ring.getTotalLength() : 440;
      ring.style.strokeDasharray = len;
      ring.style.strokeDashoffset = len;
      ring.style.transition = "stroke-dashoffset 1.6s cubic-bezier(.2,.8,.2,1)";
    }
    var target = 82; // illustrative health score
    var started = false;

    function run() {
      if (started) return;
      started = true;
      if (ring) {
        var l = ring.getTotalLength ? ring.getTotalLength() : 440;
        // reveal ~82% of the ring
        requestAnimationFrame(function () {
          ring.style.strokeDashoffset = l * (1 - target / 100);
        });
      }
      if (label) {
        var n = 0, t0 = null;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / 1500, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          label.textContent = Math.round(eased * target);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }
    }

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { run(); io.disconnect(); } });
      }, { threshold: 0.4 });
      io.observe(svg);
    } else {
      run();
    }
  }

  function init() {
    initMobileNav();
    initDrawer();
    initReveal();
    initHeroVisual();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
