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

  /* ---------- Quick accent switcher (design-lab helper) ---------- */
  (function accentSwitcher() {
    var PRESETS = [
      { name: "Academy clay", hex: "#cc785c" },
      { name: "Terracotta", hex: "#b8552f" },
      { name: "Corporate blue", hex: "#2563eb" },
      { name: "SprintINSite green", hex: "#10b981" },
      { name: "PortfolioInSite teal", hex: "#0891b2" },
      { name: "SurveyInSite indigo", hex: "#6366f1" },
      { name: "ReportInSite violet", hex: "#6d28d9" },
      { name: "CareerInSite amber", hex: "#f59e0b" },
      { name: "Plum", hex: "#9d174d" },
      { name: "Forest", hex: "#166534" },
      { name: "Slate", hex: "#334155" },
      { name: "Ember", hex: "#dc2626" }
    ];
    function hexToRgb(h) { h = h.replace("#", ""); if (h.length === 3) { h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]; } var n = parseInt(h, 16); return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }; }
    function tc(x) { x = Math.max(0, Math.min(255, Math.round(x))); var s = x.toString(16); return s.length < 2 ? "0" + s : s; }
    function darken(h, f) { var c = hexToRgb(h); return "#" + tc(c.r * (1 - f)) + tc(c.g * (1 - f)) + tc(c.b * (1 - f)); }
    function lum(h) { var c = hexToRgb(h); return (0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b) / 255; }
    function apply(hex) {
      var s = document.documentElement.style, c = hexToRgb(hex);
      s.setProperty("--accent", hex);
      s.setProperty("--accent-deep", darken(hex, 0.18));
      s.setProperty("--accent-wash", "rgba(" + c.r + "," + c.g + "," + c.b + ",0.08)");
      s.setProperty("--accent-ink", lum(hex) > 0.62 ? "#1c1a17" : "#ffffff");
      try { localStorage.setItem("aobAccent", hex); } catch (e) {}
      var lbl = document.getElementById("accentNow"); if (lbl) lbl.textContent = hex.toUpperCase();
      Array.prototype.forEach.call(document.querySelectorAll(".accsw-dot"), function (d) {
        d.classList.toggle("on", d.getAttribute("data-hex").toLowerCase() === hex.toLowerCase());
      });
    }
    var style = document.createElement("style");
    style.textContent =
      ".accsw{position:fixed;right:16px;bottom:16px;z-index:9999;background:#fff;border:1px solid #e9e4db;border-radius:14px;box-shadow:0 12px 34px rgba(28,26,23,.20);padding:13px 15px;font-family:Inter,system-ui,sans-serif;width:224px}" +
      ".accsw h6{font:600 11px/1 Inter,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#6b6660;margin:0 0 11px;display:flex;justify-content:space-between;align-items:center}" +
      ".accsw h6 span{font-weight:600;color:#1c1a17;letter-spacing:.02em}" +
      ".accsw-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-bottom:11px}" +
      ".accsw-dot{width:22px;height:22px;border-radius:50%;cursor:pointer;border:2px solid #fff;box-shadow:0 0 0 1px #e9e4db;transition:transform .15s}" +
      ".accsw-dot:hover{transform:scale(1.18)}" +
      ".accsw-dot.on{box-shadow:0 0 0 2px #1c1a17}" +
      ".accsw-row{display:flex;align-items:center;gap:9px}" +
      ".accsw-row label{font:500 12px Inter,sans-serif;color:#6b6660}" +
      ".accsw-row input[type=color]{width:30px;height:26px;border:1px solid #e9e4db;border-radius:6px;background:none;cursor:pointer;padding:0}" +
      ".accsw .x{cursor:pointer;color:#9a948b;font-size:13px;line-height:1;padding:2px 4px}" +
      ".accsw-min{position:fixed;right:16px;bottom:16px;z-index:9999;height:38px;padding:0 15px;border-radius:99px;border:1px solid #e9e4db;background:#fff;box-shadow:0 8px 20px rgba(28,26,23,.18);cursor:pointer;display:none;align-items:center;gap:7px;font:600 12px Inter,sans-serif;color:#1c1a17}" +
      ".accsw-min i{width:13px;height:13px;border-radius:50%;background:var(--accent,#cc785c);display:inline-block}";
    document.head.appendChild(style);
    var dots = PRESETS.map(function (p) { return '<span class="accsw-dot" data-hex="' + p.hex + '" title="' + p.name + '" style="background:' + p.hex + '"></span>'; }).join("");
    var panel = document.createElement("div");
    panel.className = "accsw";
    panel.innerHTML = '<h6>Accent <span id="accentNow">#CC785C</span> <b class="x" title="Hide">Hide</b></h6>' +
      '<div class="accsw-grid">' + dots + "</div>" +
      '<div class="accsw-row"><label for="accswCustom">Custom colour</label><input type="color" id="accswCustom" value="#cc785c"></div>';
    document.body.appendChild(panel);
    var min = document.createElement("button");
    min.className = "accsw-min"; min.innerHTML = "<i></i> Accent";
    document.body.appendChild(min);
    panel.querySelector(".x").addEventListener("click", function () { panel.style.display = "none"; min.style.display = "inline-flex"; });
    min.addEventListener("click", function () { panel.style.display = "block"; min.style.display = "none"; });
    Array.prototype.forEach.call(panel.querySelectorAll(".accsw-dot"), function (d) {
      d.addEventListener("click", function () { apply(d.getAttribute("data-hex")); });
    });
    var custom = panel.querySelector("#accswCustom");
    custom.addEventListener("input", function () { apply(custom.value); });
    var saved; try { saved = localStorage.getItem("aobAccent"); } catch (e) {}
    apply(saved || "#cc785c");
    if (saved) { custom.value = saved; }
  })();
})();
