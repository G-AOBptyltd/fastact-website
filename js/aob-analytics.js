/*!
 * Agility Ops — shared analytics loader
 * ------------------------------------------------------------------
 * Loads Google Analytics once per page and reports to BOTH:
 *   1. G-ZS5QZ6YQPM  "Agility Ops — All Sites"  (suite-wide roll-up,
 *                     the same ID on every AOB site; split by Hostname)
 *   2. G-XPLEWG5GR4  FACT — Applied AI Training
 *
 * Add or change measurement IDs HERE ONLY — never paste a gtag block
 * into an individual page, or the estate drifts out of sync again.
 * ------------------------------------------------------------------
 */
(function () {
  var MEASUREMENT_IDS = ['G-ZS5QZ6YQPM', 'G-XPLEWG5GR4'];

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  var tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_IDS[0];
  document.head.appendChild(tag);

  gtag('js', new Date());
  MEASUREMENT_IDS.forEach(function (id) { gtag('config', id); });
})();
