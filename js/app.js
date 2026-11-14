/* Scroll scenes: greeting → film roll → folder stack, plus the pop-up card
   and the contact card. Desktop works on a 1440 × 900 board, mobile on
   390 × 844; the board is scaled to fit the window.                       */
(function () {
  const { OBJECTS, FRAMES, STAGES, ENTRIES } = window.ARCHIVE;
  const $ = (s, r = document) => r.querySelector(s);
  const root = document.documentElement;
  const mq = matchMedia('(max-width: 767px)');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  let M = mq.matches;

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const seg = (p, a, b) => clamp((p - a) / (b - a));

  /* write a style only when it changes: the scroll loop touches ~40 elements a
     frame and most of them are standing still                               */
  const set = (el, prop, v) => {
    const c = el._s || (el._s = {});
    if (c[prop] !== v) { c[prop] = v; el.style[prop] = v; }
  };
  const flag = (el, name, on) => {
    const c = el._f || (el._f = {});
    if (c[name] !== on) { c[name] = on; el.classList.toggle(name, on); }
  };

  const scenes = $('#scenes');
  const intro = $('#top');
  const folders = $('#experience');
  const header = $('#siteHeader');

  /* ───────── greeting: build the objects ───────── */
  const objWrap = $('#objects');
  const objEls = OBJECTS.map((o) => {
    const el = document.createElement('div');
    el.className = 'obj';
    el.innerHTML = `<img src="${o.src}" alt="${o.alt}" draggable="false" decoding="async"><span class="grain" aria-hidden="true"></span>`;
    const img = el.querySelector('img');
    const ready = () => el.classList.add('is-ready'); // grain waits for its image, or it shows as a grey box
    if (img.complete && img.naturalWidth) ready();
    img.addEventListener('load', () => { ready(); measureObjects(); dirty(); });
    const g = el.querySelector('.grain');
    g.style.webkitMaskImage = `url("${o.src}")`;
    g.style.maskImage = `url("${o.src}")`;
    objWrap.appendChild(el);
    return el;
  });
  const hello = $('#hello');
  const beads = $('#beads');
  const greet = $('#greet');
  const corners = [$('#cornerL'), $('#cornerR')];
  const hint = $('#scrollHint');

  /* ───────── film roll ───────── */
  const film = $('#film');
  const aboutStage = $('#about-stage');
  const canister = $('#canister');
  const aboutTitle = $('#aboutTitle');
  const bracket = $('#bracket');
  const bracketLabel = bracket.querySelector('.bracket-label');
  const bracketSvg = bracket.querySelector('svg');
  const bracketPath = bracket.querySelector('path');
  const framesWrap = $('#frames');
  const frameEls = FRAMES.map((f) => {
    const img = document.createElement('img');
    img.className = 'frame' + (f.logo ? ' is-logo' : '');
    img.src = f.src;
    img.alt = f.alt;
    img.decoding = 'async';
    if (f.pos) img.style.objectPosition = f.pos;
    framesWrap.appendChild(img);
    return img;
  });

  /* ───────── folders ───────── */
  const NICK = { nstc: 'NSTC', apie: 'APIE', hanei: 'HaneiAI', upyouth: 'UpYouth', luminara: 'Luminara', epiphany: 'Epiphany', virtue: 'Virtue’s Spring', vrupc: 'VRUPC', yearbook: 'Yearbook', freelance: 'Freelance', framing: 'Framing' };
  const stack = $('#stack');
  const lis = ENTRIES.map((e, k) => {
    const li = document.createElement('li');
    li.className = 'folder-li';
    li.style.setProperty('--c', e.color);
    li.style.setProperty('--ink', e.ink);
    const slipBg = k % 3 === 1 ? '#FFFFFF' : '#F3EEE4';
    const slipRot = [-1.2, 1, -0.8, 1.4, -1.4, 0.8, -1][k % 7];
    li.innerHTML = `
      <a class="folder" href="#${e.id}" data-k="${k}" aria-label="Folder ${e.no}: ${e.stackTitle.replace(/&amp;/g, '&')}, ${e.role.replace(/&amp;/g, '&')}. Open">
        <span class="folder-in">
          <span class="folder-slip" style="background:${slipBg};transform:rotate(${slipRot}deg)"></span>
          <span class="folder-tab">№ ${e.no} · ${e.cat}</span>
          <span class="folder-body">
            <span class="folder-strip"><b>${e.stackTitle}</b><span>${e.stackMeta}</span></span>
            <span class="folder-paper">
              <span class="fp-meta"><span>Folder ${e.no} / 13 · ${e.cat}</span><span>${e.when}</span></span>
              <span class="fp-title"><b>${e.stackTitle}</b><i>${e.role}</i></span>
              <span class="fp-row">
                <span class="fp-text">
                  <span class="fp-short">${e.short}</span>
                  <span class="fp-tags">${e.tags.map((t) => `<span>${t}</span>`).join('')}</span>
                  <span class="fp-open">Open folder <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 10 L10 2 M4 2 H10 V8"/></svg></span>
                </span>
                ${e.thumb || (e.media && e.media[0]) ? `<img class="fp-thumb" src="${e.thumb || e.media.find((m) => m.kind !== 'video').src}" alt="" loading="lazy">` : ''}
              </span>
            </span>
          </span>
        </span>
      </a>`;
    stack.appendChild(li);
    return li;
  });
  const railLinks = [...document.querySelectorAll('.rail a')];
  const railNow = $('#railNow');
  const counterNo = $('#counterNo');
  const counterFill = $('#counterFill');
  const mCounter = $('#mCounter');
  const stackChrome = [$('.rail'), $('.counter'), $('.m-top'), $('#stackHint')];
  const navLinks = { about: $('.nav [data-go="about"]'), experience: $('.nav [data-go="experience"]') };

  /* each object flies out along the line from the board centre; measured once, not per frame */
  const objDir = [];
  function measureObjects() {
    const W = M ? 390 : 1440;
    const H = M ? 844 : 900;
    OBJECTS.forEach((o, i) => {
      const q = M ? o.m : o.d;
      const el = objEls[i];
      const w = q.w;
      const h = q.h || el.offsetHeight || w;
      let dx = q.x + w / 2 - W / 2;
      let dy = q.y + h / 2 - H / 2;
      const len = Math.hypot(dx, dy) || 1;
      objDir[i] = [dx / len, dy / len];
    });
  }

  /* scroll lengths in px, cached so the frame loop never reads layout */
  let VH = innerHeight;
  let S0 = 0; // where the scenes start
  let LI = 1; // intro timeline length
  let LF = 1; // folder timeline length

  /* ───────── layout per mode ───────── */
  function layout() {
    M = mq.matches;
    VH = innerHeight;
    const W = M ? 390 : 1440;
    const H = M ? 844 : 900;
    const s = Math.min(innerWidth / W, VH / H);
    root.style.setProperty('--W', W + 'px');
    root.style.setProperty('--H', H + 'px');
    root.style.setProperty('--s', s.toFixed(4));

    OBJECTS.forEach((o, i) => {
      const p = M ? o.m : o.d;
      const el = objEls[i];
      el.style.left = p.x + 'px';
      el.style.top = p.y + 'px';
      el.style.width = p.w + 'px';
      el.style.height = p.h ? p.h + 'px' : '';
      el.style.zIndex = p.z;
    });

    canister.src = M ? 'assets/film/canister-upright.webp' : 'assets/film/canister.webp';
    LI = (M ? 4.6 : 5.5) * VH;
    LF = (ENTRIES.length - 1) * (M ? 0.45 : 0.5) * VH;
    scenes.style.height = Math.round(LI + LF + VH) + 'px';
    S0 = scenes.offsetTop;
    $('#stackHint').textContent = finePointer.matches ? 'Hover a folder to peek · click to open' : 'Tap a folder to peek · tap again to open';
    measureObjects();
    // forget cached styles: the mode may have changed what every value means
    [...objEls, ...frameEls, ...lis, hello, beads, greet, film, canister, aboutStage, intro, folders, ...stackChrome, ...corners, hint, counterFill].forEach((el) => { el._s = null; });
    lastP = -1;
    lastQ = -1;
    curStage = -2;
    curBracket = -2;
    update();
  }

  /* ───────── intro timeline ───────── */
  // [progress, frames out of the canister]
  const OUT_KEYS = [[0.16, 0], [0.23, 3], [0.31, 3], [0.37, 5], [0.45, 5], [0.5, 6], [0.58, 6], [0.65, 8], [0.76, 8]]; // stays fully pulled out: it leaves the screen with the canister
  function outAt(p) {
    if (p <= OUT_KEYS[0][0]) return 0;
    for (let i = 1; i < OUT_KEYS.length; i++) {
      const [p1, o1] = OUT_KEYS[i];
      const [p0, o0] = OUT_KEYS[i - 1];
      if (p <= p1) return lerp(o0, o1, ease((p - p0) / (p1 - p0)));
    }
    return OUT_KEYS[OUT_KEYS.length - 1][1];
  }
  const frameX = (j, out) => 1169 - 199 * (out - j); // desktop: newest frame sits next to the canister
  const frameY = (j, out) => 225 + 161 * (out - j); // mobile: newest frame hangs right under it

  let curStage = -2;
  let curBracket = -2;
  let titleTimer = 0;
  function setStage(k) {
    if (k === curStage) return;
    curStage = k;
    aboutTitle.classList.remove('is-on');
    clearTimeout(titleTimer);
    titleTimer = setTimeout(() => {
      if (k < 0) return;
      aboutTitle.innerHTML = STAGES[k].title;
      aboutTitle.classList.add('is-on');
    }, k < 0 ? 0 : 200);
  }
  function setBracket(k) {
    if (k === curBracket) return;
    curBracket = k;
    if (k < 1) { bracket.classList.remove('is-on'); return; }
    const st = STAGES[k];
    bracketLabel.textContent = st.label;
    if (!M) {
      const left = frameX(st.from, st.out);
      const w = frameX(st.to, st.out) + 185 - left;
      const c = w / 2;
      bracket.style.left = left + 'px';
      bracket.style.top = '296px';
      bracket.style.width = w + 'px';
      bracket.style.height = '';
      bracketSvg.setAttribute('width', w);
      bracketSvg.setAttribute('height', 38);
      bracketSvg.setAttribute('viewBox', `0 0 ${w} 38`);
      bracketPath.setAttribute('d', `M 2 36 Q 2 19 24 19 L ${c - 23} 19 Q ${c} 19 ${c} 3 Q ${c} 19 ${c + 23} 19 L ${w - 24} 19 Q ${w - 2} 19 ${w - 2} 36`);
    } else {
      const top = frameY(st.to, st.out);
      const bottom = Math.min(frameY(st.from, st.out) + 149, 840);
      const h = bottom - top;
      const m = h / 2;
      bracket.style.left = '330px';
      bracket.style.top = top + 'px';
      bracket.style.width = '22px';
      bracket.style.height = h + 'px';
      bracketSvg.setAttribute('width', 22);
      bracketSvg.setAttribute('height', h);
      bracketSvg.setAttribute('viewBox', `0 0 22 ${h}`);
      bracketPath.setAttribute('d', `M 2 2 Q 10 2 10 22 L 10 ${m - 20} Q 10 ${m} 18 ${m} Q 10 ${m} 10 ${m + 20} L 10 ${h - 22} Q 10 ${h - 2} 2 ${h - 2}`);
    }
    requestAnimationFrame(() => bracket.classList.add('is-on'));
  }

  const px = (v) => Math.round(v * 10) / 10;
  function renderIntro(p) {
    /* the greeting's paper grain only runs while the greeting is at rest */
    flag(intro, 'grain-on', p < 0.002 && !reduce.matches);
    set(intro, 'visibility', p >= 1 ? 'hidden' : 'visible');
    // no early return at p = 1: pieces with their own visibility must be hidden too (it only runs when p changes)

    /* 1 · every object leaves the screen */
    const e = ease(seg(p, 0, 0.11));
    const far = M ? 760 : 1500;
    OBJECTS.forEach((o, i) => {
      const q = M ? o.m : o.d;
      const el = objEls[i];
      const [dx, dy] = objDir[i];
      const spin = (dx >= 0 ? 1 : -1) * 35 * e;
      set(el, 'transform', `translate3d(${px(dx * far * e)}px, ${px(dy * far * e)}px, 0) rotate(${px(q.r + spin)}deg)`);
      set(el, 'visibility', e >= 1 ? 'hidden' : 'visible');
    });
    set(hello, 'transform', `translate3d(${px(-far * 0.55 * e)}px, ${px(-far * 0.45 * e)}px, 0) ` + (M ? 'rotate(6deg) scale(.654)' : 'rotate(-6deg)'));
    set(beads, 'transform', `translate3d(${px(-far * 0.8 * e)}px, ${px(-far * 0.2 * e)}px, 0) ` + (M ? 'scale(.667) rotate(-7deg)' : 'rotate(-7deg)'));
    const fade = 1 - seg(p, 0, 0.06);
    set(greet, 'opacity', String(fade));
    set(greet, 'transform', `translate3d(0, ${px(-60 * e)}px, 0)`);
    set(greet, 'visibility', fade <= 0 ? 'hidden' : 'visible');
    corners.forEach((c) => set(c, 'opacity', String(fade)));
    set(hint, 'opacity', String(1 - seg(p, 0, 0.025)));
    set(hint, 'pointerEvents', p > 0.02 ? 'none' : '');

    /* 2 · the film roll: closed, then three stages, then it rewinds */
    const appear = seg(p, 0.07, 0.13);
    const out = outAt(p);
    /* the canister and its film are one piece: they slide off to the right together, then the folders come in */
    const a0 = seg(p, 0.78, 0.88);
    const roll = a0 * a0 * a0; // gentle start, then away
    set(aboutStage, 'transform', `translate3d(${px(roll * (M ? 440 : 2020))}px, 0, 0)`);
    set(aboutStage, 'visibility', roll >= 1 ? 'hidden' : 'visible');
    set(canister, 'opacity', String(appear));
    set(canister, 'visibility', appear <= 0 ? 'hidden' : 'visible');
    set(canister, 'transform', `translate3d(0, ${px(appear < 1 ? (1 - appear) * 40 : 0)}px, 0)`);
    const filmOp = appear;
    set(film, 'opacity', String(filmOp));
    set(film, 'visibility', filmOp <= 0 ? 'hidden' : 'visible');
    /* the strip slides out of its fixed window (.film-clip): transform only, so
       the compositor moves it without repainting (clip-path repainted every frame) */
    if (!M) {
      const L = px((out < 1 ? 1110 - 250 * out : 1059 - 199 * out) + 560); // window starts at -560
      set(film, 'transform', `translate3d(${L}px, 0, 0)`);
    } else {
      const h = px(out < 1 ? 96 + 97 * out : 193 + 161 * (out - 1));
      set(film, 'transform', `translate3d(0, ${px(h - 1400)}px, 0)`); // strip is 1400px tall, notch at its bottom
    }
    frameEls.forEach((img, j) => {
      const shown = out - j;
      if (shown <= 0.01 || filmOp <= 0) { set(img, 'visibility', 'hidden'); return; }
      set(img, 'visibility', 'visible');
      set(img, 'transform', M ? `translate3d(0, ${px(frameY(j, out))}px, 0)` : `translate3d(${px(frameX(j, out))}px, 0, 0)`);
    });

    let k;
    if (p < 0.115 || p > 0.8) k = -1;
    else { k = 0; for (let s = 1; s < STAGES.length; s++) if (out >= (STAGES[s - 1].out + STAGES[s].out) / 2) k = s; }
    setStage(k);
    let b = -1;
    if (p < 0.77) for (let s = 1; s < STAGES.length; s++) if (Math.abs(out - STAGES[s].out) < 0.04) b = s;
    setBracket(b);
  }

  /* ───────── folder stack ───────── */
  /* Carousel stack, like flicking through cards in Wallet. Folders wait in a
     fan above the front one, in order; the rest sit behind the fan as a thin
     deck. Scrolling down, the front folder drops past the bottom edge, slides
     up BEHIND everything and lands at the very back of the deck, behind the
     last folder, while the next one comes down into the front. The order is
     a loop, so after folder 13 the first folders are waiting again.
     h = folder height, front = its top, step = gap between fanned folders,
     ds = shrink per fanned folder, max = folders fanned out, fall = how far
     the front folder drops, edge = gap between folders in the deck.       */
  const GEO = {
    d: { h: 500, front: 642, step: 76, ds: 0.043, max: 7, fall: 930, edge: 2.5 },
    m: { h: 500, front: 316, step: 58, ds: 0.045, max: 3, fall: 880, edge: 2 }
  };
  let peek = -1;
  let front = 0;
  let cNow = 0;
  const order = []; // each folder's place in the loop: 0 = front, 1 = next …
  function slot(g, r) {
    // r ≥ 0, place in the loop → [top, scale]
    if (r <= g.max) return [g.front - g.step * r, 1 - g.ds * r];
    const sc = 1 - g.ds * (g.max + 1);
    const top = g.front - g.step * g.max;
    if (r <= g.max + 1) return [top - (r - g.max) * g.step * 0.5, lerp(1 - g.ds * g.max, sc, r - g.max)];
    return [top - g.step * 0.5 - (r - g.max - 1) * g.edge, sc];
  }
  function renderStack(q, deal) {
    const n = ENTRIES.length;
    const raw = q * (n - 1);
    const i = Math.floor(raw);
    const f = raw - i;
    const c = Math.min(n - 1, i + ease(clamp((f - 0.15) / 0.7))); // linger on each folder a little
    cNow = c;
    const g = M ? GEO.m : GEO.d;
    lis.forEach((li, k) => {
      const d = k - c;
      let y, sc, z, r;
      const op = 1;
      if (d < 0 && d > -1) {
        /* the folder leaving the front */
        const t = -d;
        r = n - t;
        if (t <= 0.5) {
          /* still in front: it drops down past the bottom edge */
          const a = t / 0.5;
          y = lerp(g.front, g.fall, a * a);
          sc = 1;
          z = 1100;
        } else {
          /* now behind everything: it slides up and lands at the back of the deck */
          const [by, bs] = slot(g, n - 1);
          const a = (t - 0.5) / 0.5;
          y = lerp(g.fall, by, ease(a));
          sc = lerp(1, bs, Math.sqrt(a)); // shrink early so it stays hidden behind the fan
          z = 1000 - Math.round(n * 10);
        }
      } else {
        r = d < 0 ? d + n : d; // loop: folders already seen wait at the back
        [y, sc] = slot(g, r);
        z = 1000 - Math.round(r * 10);
        if (deal < 1) {
          /* first arrival, once the film has left: folders drop in from the top, front one first, settling softly */
          const a = clamp((deal - (Math.min(r, g.max + 1) / (g.max + 1)) * 0.35) / 0.6);
          const t = 1 - Math.pow(1 - a, 3);
          y -= (1 - t) * (g.fall * 0.85 + Math.min(r, g.max + 1) * 50);
          if (t <= 0) { set(li, 'visibility', 'hidden'); order[k] = r; return; }
        }
      }
      order[k] = r;
      set(li, 'transform', `translate3d(0, ${px(y)}px, 0) scale(${sc.toFixed(4)})`);
      set(li, 'opacity', String(px(op)));
      set(li, 'zIndex', String(z));
      set(li, 'visibility', op <= 0.01 ? 'hidden' : 'visible');
      flag(li, 'is-front', r < 0.5 || r > n - 0.5);
      flag(li, 'is-deep', r > g.max + 0.5 && r <= n - 0.5);
    });
    const nf = Math.round(c);
    if (nf !== front || !counterNo.textContent) {
      front = nf;
      const e = ENTRIES[front];
      counterNo.textContent = e.no;
      mCounter.textContent = e.no;
      railNow.innerHTML = e.cat;
      railLinks.forEach((a) => a.classList.toggle('is-on', a.textContent.replace(/[\d–]/g, '').trim() === railNow.textContent));
    }
    set(counterFill, 'transform', `translate3d(0, ${px((c / (n - 1)) * 124)}px, 0)`);
    const chrome = seg(deal, 0.35, 1);
    stackChrome.forEach((el) => set(el, 'opacity', String(px(chrome))));
    set(folders, 'visibility', deal <= 0 ? 'hidden' : 'visible');
    set(folders, 'pointerEvents', deal < 0.9 ? 'none' : '');
    applyPeek();
  }
  function applyPeek() {
    const pr = peek >= 0 ? order[peek] : null;
    lis.forEach((li, k) => {
      flag(li, 'is-peek', k === peek);
      flag(li, 'is-dim', pr !== null && order[k] > pr + 0.01);
    });
  }
  function setPeek(k) {
    if (k === peek) return;
    peek = k;
    applyPeek();
  }

  const setCurrent = (el, on) => (on ? el.setAttribute('aria-current', 'true') : el.removeAttribute('aria-current'));

  /* ───────── frame loop ───────── */
  let ticking = false;
  let lastP = -1;
  let lastQ = -1;
  let lastDeal = -1;
  function update() {
    ticking = false;
    const y = scrollY - S0;
    const p = clamp(y / LI);
    const q = clamp((y - LI) / LF);
    const deal = seg(p, 0.88, 1);
    /* skip whichever scene is not on screen and has not moved */
    if (p !== lastP) { renderIntro(p); lastP = p; }
    if (q !== lastQ || deal !== lastDeal) { renderStack(q, deal); lastQ = q; lastDeal = deal; }
    flag(header, 'is-compact', p > 0.9);
    const inExp = p > 0.93;
    setCurrent(navLinks.about, p > 0.1 && !inExp);
    setCurrent(navLinks.experience, inExp);
  }
  function dirty() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  const onScroll = dirty;
  addEventListener('scroll', onScroll, { passive: true });
  /* phones fire resize whenever the URL bar slides in or out; rescaling the
     whole board then is what made scrolling stutter, so ignore height-only
     wobbles on touch screens                                              */
  let sizeW = innerWidth;
  let sizeH = innerHeight;
  addEventListener('resize', () => {
    const w = innerWidth;
    const h = innerHeight;
    if (!finePointer.matches && w === sizeW && Math.abs(h - sizeH) < 160) return;
    sizeW = w; sizeH = h;
    layout();
    if (!contactLayer.hidden) placeContact();
  });
  mq.addEventListener('change', layout);

  /* ───────── navigation ───────── */
  const behavior = () => (reduce.matches ? 'auto' : 'smooth');
  function go(where) {
    let top = 0;
    if (where === 'about') top = S0 + 0.165 * LI;
    else if (where === 'experience') top = S0 + LI + 2;
    scrollTo({ top, behavior: behavior() });
  }
  function goFolder(k, instant) {
    const n = ENTRIES.length;
    const top = S0 + LI + (k / (n - 1)) * LF + 2;
    scrollTo({ top, behavior: instant ? 'auto' : behavior() });
  }
  document.querySelectorAll('[data-go]').forEach((a) => a.addEventListener('click', (ev) => {
    ev.preventDefault();
    go(a.dataset.go);
    if (a.classList.contains('skip')) lis[0].querySelector('.folder').focus({ preventScroll: true });
  }));
  railLinks.forEach((a) => a.addEventListener('click', (ev) => { ev.preventDefault(); goFolder(+a.dataset.jump); }));

  /* folders: hover to peek (mouse), tap to peek then tap to open (touch) */
  lis.forEach((li, k) => {
    const a = li.querySelector('.folder');
    li.addEventListener('pointerenter', (ev) => { if (ev.pointerType === 'mouse' && !scrolling) setPeek(k); });
    a.addEventListener('focus', () => {
      if (order[k] > (M ? GEO.m : GEO.d).max + 0.5) goFolder(k); // back in the deck: bring it round to the front
      else setPeek(k);
    });
    a.addEventListener('click', (ev) => {
      ev.preventDefault();
      if (order[k] > (M ? GEO.m : GEO.d).max + 0.5) { setPeek(-1); goFolder(k); return; } // a folder in the deck comes round to the front
      const touchy = !finePointer.matches;
      if (touchy && peek !== k && order[k] > 0.5) { setPeek(k); return; }
      openCard(k);
    });
  });
  stack.addEventListener('pointerleave', (ev) => { if (ev.pointerType === 'mouse') setPeek(-1); });

  /* no hover peeking while the page scrolls: folders would jump up under a
     resting mouse. Once scrolling settles, peek whatever is under the pointer */
  let scrolling = false;
  let scrollIdle = 0;
  let mouse = null;
  addEventListener('pointermove', (ev) => { if (ev.pointerType === 'mouse') mouse = [ev.clientX, ev.clientY]; }, { passive: true });
  addEventListener('scroll', () => {
    if (!scrolling) {
      scrolling = true;
      stack.classList.add('is-scrolling');
      if (finePointer.matches) setPeek(-1);
    }
    clearTimeout(scrollIdle);
    scrollIdle = setTimeout(() => {
      scrolling = false;
      stack.classList.remove('is-scrolling');
      if (!mouse || !finePointer.matches || !modal.hidden) return;
      const hit = document.elementFromPoint(mouse[0], mouse[1]);
      const li = hit && hit.closest('.folder-li');
      if (li) setPeek(lis.indexOf(li));
    }, 180);
  }, { passive: true });
  $('#folderStage').addEventListener('click', (ev) => { if (!ev.target.closest('.folder')) setPeek(-1); });

  /* ───────── the opened folder ───────── */
  const modal = $('#modal');
  const sheet = $('#sheet');
  const paper = $('#sheetPaper');
  const sheetBody = $('#sheetBody');
  const sheetTab = $('#sheetTab');
  const sheetWhere = $('#sheetWhere');
  const prevBtn = $('#sheetPrev');
  const nextBtn = $('#sheetNext');
  const closeBtn = modal.querySelector('.sheet-close');
  let openIdx = -1;
  let lastFocus = null;
  let closeTimer = 0;

  function navLabel(k, dir) {
    const e = ENTRIES[k];
    if (!e) return '';
    return dir < 0 ? `← <span class="long">${e.no} ${NICK[e.id]}</span>` : `<span class="long">${e.no} ${NICK[e.id]} </span>→`;
  }
  function openCard(k) {
    const e = ENTRIES[k];
    if (!e) return;
    clearTimeout(closeTimer);
    openIdx = k;
    sheet.style.setProperty('--c', e.cardColor || e.color);
    sheet.style.setProperty('--ink', e.ink);
    paper.className = 'sheet-paper t-' + (e.theme || 'archive');
    paper.style.setProperty('--acc', e.theme ? '' : (e.id === 'virtue' ? '#8A6D3B' : e.color));
    if (e.theme) paper.style.removeProperty('--acc');
    sheetTab.innerHTML = `№ ${e.no} · ${e.cat}`;
    sheetWhere.innerHTML = `Folder ${e.no} / 13<span class="long"> · ${e.cat}</span>`;
    prevBtn.innerHTML = navLabel(k - 1, -1);
    nextBtn.innerHTML = navLabel(k + 1, 1);
    prevBtn.hidden = k === 0;
    nextBtn.hidden = k === ENTRIES.length - 1;
    prevBtn.setAttribute('aria-label', k > 0 ? `Previous folder: ${NICK[ENTRIES[k - 1].id]}` : '');
    nextBtn.setAttribute('aria-label', k < ENTRIES.length - 1 ? `Next folder: ${NICK[ENTRIES[k + 1].id]}` : '');
    sheetBody.innerHTML = window.renderCard(e);
    paper.scrollTop = 0;
    if (modal.hidden) {
      lastFocus = document.activeElement;
      modal.hidden = false;
      root.style.overflow = 'hidden';
      requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('is-open')));
    }
    history.replaceState(null, '', '#' + e.id);
    closeBtn.focus({ preventScroll: true });
  }
  function closeCard() {
    if (modal.hidden) return;
    modal.classList.remove('is-open');
    sheetBody.querySelectorAll('video').forEach((v) => v.pause());
    root.style.overflow = '';
    history.replaceState(null, '', location.pathname + location.search);
    closeTimer = setTimeout(() => { modal.hidden = true; sheetBody.innerHTML = ''; }, reduce.matches ? 0 : 450);
    openIdx = -1;
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  prevBtn.addEventListener('click', () => openCard(openIdx - 1));
  nextBtn.addEventListener('click', () => openCard(openIdx + 1));
  modal.querySelectorAll('[data-close-modal]').forEach((b) => b.addEventListener('click', closeCard));

  /* ───────── contact card ───────── */
  const contactBtn = $('#contactBtn');
  const contactLayer = $('#contactLayer');
  const contactCard = $('#contactCard');
  const cString = $('#contactString');
  let contactTimer = 0;
  function placeContact() {
    const b = contactBtn.getBoundingClientRect();
    const cx = b.left + b.width / 2;
    let clipX;
    if (!M) {
      const left = clamp(cx - 343, 16, innerWidth - 576);
      contactCard.style.left = left + 'px';
      clipX = left + 343;
    } else {
      contactCard.style.left = '';
      clipX = innerWidth - 12 - 57;
    }
    const top = M ? 70 : 112;
    const y0 = b.bottom - 4;
    const y1 = top - 8;
    cString.setAttribute('viewBox', `0 0 ${innerWidth} ${innerHeight}`);
    const [path, e1, e2] = cString.children;
    path.setAttribute('d', `M ${cx} ${y0} C ${cx - 4} ${y0 + (y1 - y0) * 0.5}, ${clipX + 6} ${y1 - (y1 - y0) * 0.4}, ${clipX} ${y1}`);
    e1.setAttribute('cx', cx - 12); e1.setAttribute('cy', y0 + 6); e1.setAttribute('rx', 13); e1.setAttribute('ry', 6.5); e1.setAttribute('transform', `rotate(-30 ${cx - 12} ${y0 + 6})`);
    e2.setAttribute('cx', cx + 12); e2.setAttribute('cy', y0 + 6); e2.setAttribute('rx', 13); e2.setAttribute('ry', 6.5); e2.setAttribute('transform', `rotate(30 ${cx + 12} ${y0 + 6})`);
  }
  function openContact() {
    clearTimeout(contactTimer);
    contactLayer.classList.remove('is-closing');
    contactLayer.hidden = false;
    placeContact();
    requestAnimationFrame(() => contactLayer.classList.add('is-open'));
    contactBtn.setAttribute('aria-expanded', 'true');
    contactLayer.querySelector('.contact-close').focus({ preventScroll: true });
  }
  function closeContact() {
    if (contactLayer.hidden) return;
    contactLayer.classList.remove('is-open');
    contactLayer.classList.add('is-closing');
    contactBtn.setAttribute('aria-expanded', 'false');
    contactTimer = setTimeout(() => { contactLayer.hidden = true; contactLayer.classList.remove('is-closing'); }, reduce.matches ? 0 : 340);
    contactBtn.focus({ preventScroll: true });
  }
  contactBtn.addEventListener('click', () => (contactLayer.hidden ? openContact() : closeContact()));
  contactLayer.querySelectorAll('[data-close-contact]').forEach((b) => b.addEventListener('click', closeContact));

  /* keyboard: Esc closes, Tab stays inside an open dialog */
  addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      if (!contactLayer.hidden) closeContact();
      else if (!modal.hidden) closeCard();
      return;
    }
    if (ev.key !== 'Tab') return;
    const scope = !contactLayer.hidden ? contactCard : !modal.hidden ? sheet : null;
    if (!scope) return;
    const items = [...scope.querySelectorAll('a[href], button:not([hidden]), video, [tabindex]:not([tabindex="-1"])')].filter((n) => n.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
    else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
  });

  /* ───────── footer: the name bounces like an old DVD logo ─────────
     Runs only while the footer is on screen; it changes colour on every
     wall it hits. Reduced motion: it simply sits in the middle.          */
  const foot = $('#siteFooter');
  const dvd = $('#dvd');
  const DVD_COLORS = ['#EE8DB5', '#9CC3E6', '#E8CD62', '#D9503F', '#B9A6F0', '#8FD19E', '#F2ECE2'];
  const D = { W: 0, H: 0, w: 0, h: 0, x: 0, y: 0, vx: 1, vy: 1, c: 0, raf: 0, last: 0, placed: false };
  function dvdMeasure() {
    D.W = foot.clientWidth; D.H = foot.clientHeight;
    D.w = dvd.offsetWidth; D.h = dvd.offsetHeight;
    if (!D.placed) { D.x = (D.W - D.w) * 0.3; D.y = (D.H - D.h) * 0.25; D.placed = true; }
    if (reduce.matches) { D.x = (D.W - D.w) / 2; D.y = (D.H - D.h) / 2; }
    D.x = clamp(D.x, 0, Math.max(0, D.W - D.w));
    D.y = clamp(D.y, 0, Math.max(0, D.H - D.h));
    dvd.style.transform = `translate3d(${D.x.toFixed(1)}px, ${D.y.toFixed(1)}px, 0)`;
  }
  function dvdTick(t) {
    const dt = D.last ? Math.min(0.05, (t - D.last) / 1000) : 0;
    D.last = t;
    const sp = M ? 72 : 120; // px per second
    D.x += D.vx * sp * dt;
    D.y += D.vy * sp * dt;
    let hit = false;
    const mx = D.W - D.w;
    const my = D.H - D.h;
    if (D.x <= 0) { D.x = 0; D.vx = 1; hit = true; } else if (D.x >= mx) { D.x = mx; D.vx = -1; hit = true; }
    if (D.y <= 0) { D.y = 0; D.vy = 1; hit = true; } else if (D.y >= my) { D.y = my; D.vy = -1; hit = true; }
    if (hit) { D.c = (D.c + 1) % DVD_COLORS.length; dvd.style.color = DVD_COLORS[D.c]; }
    dvd.style.transform = `translate3d(${D.x.toFixed(1)}px, ${D.y.toFixed(1)}px, 0)`;
    D.raf = requestAnimationFrame(dvdTick);
  }
  function dvdRun(on) {
    cancelAnimationFrame(D.raf);
    D.raf = 0;
    D.last = 0;
    if (on && !reduce.matches) D.raf = requestAnimationFrame(dvdTick);
  }
  dvdMeasure();
  if (document.fonts) document.fonts.ready.then(dvdMeasure); // the pixel font changes the name's width
  if ('ResizeObserver' in window) new ResizeObserver(dvdMeasure).observe(foot);
  if ('IntersectionObserver' in window) new IntersectionObserver((es) => dvdRun(es[0].isIntersecting)).observe(foot);
  else dvdRun(true);

  /* ───────── start ───────── */
  function fromHash() {
    const hash = location.hash.slice(1);
    const linked = ENTRIES.findIndex((e) => e.id === hash);
    if (linked >= 0) {
      if (modal.hidden) goFolder(linked, true);
      if (linked !== openIdx) openCard(linked);
    } else if (hash === 'about' || hash === 'experience') {
      go(hash);
    }
  }
  layout();
  requestAnimationFrame(fromHash);
  addEventListener('hashchange', fromHash);
})();
