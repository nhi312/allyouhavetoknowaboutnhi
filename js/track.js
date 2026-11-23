/* Visitor tracking for the archive.
   - Google Analytics 4: where visitors come from, how long each folder stays open,
     and a named event for every click.
   - Microsoft Clarity: click heatmaps, scroll maps and session replays.
   Fill in the two IDs below. Either one left empty is simply skipped.
   Add ?track-debug to the address to see every event in the browser console. */
(function () {
  const GA_ID = 'G-QZ54S8L3T4'; // analytics.google.com → Admin → Data streams
  const CLARITY_ID = '';  // e.g. 'abcd1234ef'    (clarity.microsoft.com → Settings → Overview)

  const debug = /[?&]track-debug\b/.test(location.search);
  const local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  const live = !local || debug; // don't count your own local testing

  /* ───────── load the tools ───────── */
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  if (GA_ID && live) {
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA_ID, debug ? { debug_mode: true } : {});
  }
  if (CLARITY_ID && live) {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY_ID);
  }

  function send(name, params) {
    if (debug) console.log('[track]', name, params);
    if (!live) return;
    if (GA_ID) gtag('event', name, params);
    if (CLARITY_ID && window.clarity) {
      clarity('event', name);
      if (params && params.card_id) clarity('set', 'card', params.card_id);
    }
  }
  window.track = send;

  /* ───────── where they came from (also captured automatically by GA) ───────── */
  const ref = document.referrer;
  const fromSite = ref && new URL(ref).hostname !== location.hostname;
  send('landing', {
    referrer: fromSite ? ref : '(direct)',
    referrer_host: fromSite ? new URL(ref).hostname : '(direct)',
    landing_hash: location.hash.slice(1) || '(home)',
  });

  /* ───────── time spent on each folder ─────────
     app.js fires 'archive:card' on open and close. The clock pauses while the
     tab is hidden, so a folder left open in a background tab isn't over-counted. */
  let card = null;      // { id, no, cat, ms, since }
  function stopClock() { if (card && card.since) { card.ms += performance.now() - card.since; card.since = 0; } }
  function startClock() { if (card && !card.since) card.since = performance.now(); }
  function finish(reason) {
    if (!card) return;
    stopClock();
    const secs = Math.round(card.ms / 100) / 10;
    send('card_time', { card_id: card.id, card_no: card.no, card_cat: card.cat, seconds: secs, value: secs, left_by: reason });
    card = null;
  }
  addEventListener('archive:card', (ev) => {
    const d = ev.detail;
    if (d.open) {
      if (card && card.id === d.id) return;
      finish(d.via === 'prev' || d.via === 'next' ? 'switched' : 'closed');
      card = { id: d.id, no: d.no, cat: d.cat, ms: 0, since: document.hidden ? 0 : performance.now() };
      send('card_open', { card_id: d.id, card_no: d.no, card_cat: d.cat, via: d.via });
    } else {
      finish(d.via || 'closed');
    }
  });
  document.addEventListener('visibilitychange', () => (document.hidden ? stopClock() : startClock()));
  // leaving the site with a folder open still records the time
  addEventListener('pagehide', () => finish('left_site'));

  /* ───────── every click ───────── */
  function label(el) {
    const t = el.dataset.track || el.getAttribute('aria-label') || el.getAttribute('alt') || el.textContent || '';
    return t.replace(/\s+/g, ' ').trim().slice(0, 80) || el.tagName.toLowerCase();
  }
  function area(el) {
    if (el.closest('#sheet')) return 'folder:' + (card ? card.id : '?');
    if (el.closest('#contactLayer')) return 'contact';
    if (el.closest('.site-header')) return 'header';
    if (el.closest('.rail')) return 'rail';
    if (el.closest('#stack')) return 'stack';
    if (el.closest('#top')) return 'intro';
    if (el.closest('.site-footer')) return 'footer';
    return 'page';
  }
  document.addEventListener('click', (ev) => {
    const target = ev.target instanceof Element ? ev.target : null;
    if (!target) return;
    const el = target.closest('a, button, video, img, [data-track], .folder, [role="button"]') || target;
    const p = { click_text: label(el), click_area: area(el), click_tag: el.tagName.toLowerCase() };
    if (card) p.card_id = card.id;
    const a = el.closest('a[href]');
    if (a) {
      const url = new URL(a.href, location.href);
      p.link_url = a.href.startsWith('mailto:') ? 'mailto' : url.href;
      p.outbound = url.protocol.startsWith('http') && url.hostname !== location.hostname;
    }
    send('click', p);
  }, { capture: true, passive: true });

  /* videos inside folders */
  document.addEventListener('play', (ev) => {
    if (!(ev.target instanceof HTMLVideoElement)) return;
    send('video_play', { video: (ev.target.currentSrc || '').split('/').pop(), card_id: card ? card.id : '' });
  }, true);
})();
