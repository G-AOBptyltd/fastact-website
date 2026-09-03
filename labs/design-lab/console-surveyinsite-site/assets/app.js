/* =========================================================================
   SurveyInSite — "Console" shared behaviour
   Loaded on every page (defer). All page-specific bits are guarded so they
   no-op where their target element is absent.
   ========================================================================= */
(function () {
  "use strict";

  /* --------------------------------------------------------- Mobile nav */
  function initNav() {
    var header = document.querySelector(".site-header");
    var toggle = document.querySelector(".nav-toggle");
    if (!header || !toggle) return;
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // Close on nav link tap (mobile)
    header.querySelectorAll(".site-nav__link").forEach(function (a) {
      a.addEventListener("click", function () {
        header.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------------------------------------- Scroll-reveal on scroll */
  function initReveal() {
    var els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------- Home dashboard self-play (guarded) */
  function initDashboard() {
    var dash = document.getElementById("liveDash");
    if (!dash) return; // no-op on pages without the dashboard

    var reduce = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Sample data — for illustration only.
    // Likert 1-5 distribution (percent of respondents).
    var likert = [
      { key: "Strongly disagree", pct: 6,  tint: "" },
      { key: "Disagree",          pct: 11, tint: "" },
      { key: "Neutral",           pct: 18, tint: "" },
      { key: "Agree",             pct: 37, tint: "mint" },
      { key: "Strongly agree",    pct: 28, tint: "lilac" }
    ];

    var fills = dash.querySelectorAll(".likert__fill");
    var vals  = dash.querySelectorAll(".likert__val");
    var countEl = dash.querySelector(".dash__count");
    var TARGET = 1284;

    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

    function play() {
      dash.classList.add("is-playing");

      // Bars
      likert.forEach(function (row, i) {
        if (fills[i]) {
          if (reduce) { fills[i].style.width = row.pct + "%"; }
          else { setTimeout(function () { fills[i].style.width = row.pct + "%"; }, 120 + i * 90); }
        }
        if (vals[i]) vals[i].textContent = row.pct + "%";
      });

      // Counter ease-up, then live tick
      if (countEl) {
        if (reduce) {
          countEl.textContent = TARGET.toLocaleString("en-AU");
          startLiveTick();
        } else {
          var dur = 1500, start = null;
          function step(ts) {
            if (start === null) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            var v = Math.round(easeOutCubic(p) * TARGET);
            countEl.textContent = v.toLocaleString("en-AU");
            if (p < 1) requestAnimationFrame(step);
            else startLiveTick();
          }
          requestAnimationFrame(step);
        }
      }
    }

    var current = TARGET;
    function startLiveTick() {
      if (reduce) return;
      setInterval(function () {
        // small, believable increments
        current += Math.floor(Math.random() * 3) + 1;
        if (countEl) countEl.textContent = current.toLocaleString("en-AU");
      }, 2600);
    }

    if (!("IntersectionObserver" in window)) { play(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { play(); io.disconnect(); }
      });
    }, { threshold: 0.35 });
    io.observe(dash);
  }

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    initNav();
    initReveal();
    initDashboard();
  });
})();
