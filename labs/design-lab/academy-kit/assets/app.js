/* ============================================================
   AOB WEB KIT — Agility Ops Academy
   Shared behaviour: mobile nav, Products drawer (accessible),
   scroll-reveal, home hero animation. All page-specific bits guarded.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("mobileNav");
  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- Products drawer (accessible) ---------- */
  var drawer = document.getElementById("productsDrawer");
  var backdrop = document.getElementById("drawerBackdrop");
  var lastFocused = null;

  function openDrawer() {
    if (!drawer || !backdrop) return;
    lastFocused = document.activeElement;
    drawer.classList.add("open");
    backdrop.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    document.querySelectorAll("[data-drawer-open]").forEach(function (b) {
      b.setAttribute("aria-expanded", "true");
    });
    // close the mobile sheet if it was open
    if (mobileNav) { mobileNav.classList.remove("open"); }
    if (navToggle) { navToggle.setAttribute("aria-expanded", "false"); }
    var closeBtn = drawer.querySelector("[data-drawer-close]");
    if (closeBtn) { closeBtn.focus(); }
  }

  function closeDrawer() {
    if (!drawer || !backdrop) return;
    drawer.classList.remove("open");
    backdrop.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    document.querySelectorAll("[data-drawer-open]").forEach(function (b) {
      b.setAttribute("aria-expanded", "false");
    });
    if (lastFocused && typeof lastFocused.focus === "function") { lastFocused.focus(); }
  }

  document.querySelectorAll("[data-drawer-open]").forEach(function (b) {
    b.addEventListener("click", openDrawer);
  });
  document.querySelectorAll("[data-drawer-close]").forEach(function (b) {
    b.addEventListener("click", closeDrawer);
  });
  if (backdrop) { backdrop.addEventListener("click", closeDrawer); }

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (drawer && drawer.classList.contains("open")) { closeDrawer(); }
  });

  /* Focus trap within the open drawer */
  if (drawer) {
    drawer.addEventListener("keydown", function (e) {
      if (e.key !== "Tab" || !drawer.classList.contains("open")) return;
      var focusables = drawer.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });
  }

  /* ---------- Scroll-reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add("in"); });
    }
  }

  /* ---------- Home hero animation (guarded) ---------- */
  var needle = document.getElementById("compassNeedle");
  if (needle && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // Gently settle the compass needle from a wide swing to true bearing.
    var swings = [-52, 34, -18, 9, -4, 0];
    var i = 0;
    var settle = setInterval(function () {
      needle.setAttribute("transform", "rotate(" + swings[i] + " 250 200)");
      i++;
      if (i >= swings.length) { clearInterval(settle); }
    }, 260);
  }
})();
