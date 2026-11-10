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

  const intro = $('#top');
  const folders = $('#experience');
  const header = $('#siteHeader');

  /* ───────── greeting: build the objects ───────── */
  const objWrap = $('#objects');
  const objEls = OBJECTS.map((o) => {
    const el = document.createElement('div');
    el.className = 'obj';
    el.innerHTML = `<img src="${o.src}" alt="${o.alt}" draggable="false" decoding="async"><span class="grain" aria-hidden="true"></span>`;
    const g = el.querySelector('.grain');
    g.style.webkitMaskImage = `url("${o.src}")`;
    g.style.maskImage = `url("${o.src}")`;
    objWrap.appendChild(el);
    return el;
  });
  const hello = $('#hello');
  const beads = $('#beads');
  const string = $('#greetString');
  const greet = $('#greet');
  const corners = [$('#cornerL'), $('#cornerR')];
  const hint = $('#scrollHint');

  /* ───────── film roll ───────── */
  const film = $('#film');
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
  const navLinks = { about: $('.nav [data-go="about"]'), experience: $('.nav [data-go="experience"]') };

  /* ───────── layout per mode ───────── */
  function layout() {
    M = mq.matches;
    const W = M ? 390 : 1440;
    const H = M ? 844 : 900;
    const s = Math.min(innerWidth / W, innerHeight / H);
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

    string.setAttribute('width', W);
    string.setAttribute('height', M ? 140 : H);
    string.setAttribute('viewBox', `0 0 ${W} ${M ? 140 : H}`);
    string.innerHTML = M
      ? `<path d="M 70 -6 C 100 50, 160 40, 210 70 C 250 92, 300 50, 400 66" fill="none" stroke="#D9503F" stroke-width="2.5" stroke-linecap="round"/>
         <g fill="none" stroke="#D9503F" stroke-width="2.5" stroke-linecap="round"><ellipse cx="198" cy="60" rx="12" ry="6" transform="rotate(-25 198 60)"/><ellipse cx="222" cy="62" rx="12" ry="6" transform="rotate(25 222 62)"/><path d="M 210 70 C 206 82, 202 90, 194 98"/></g>`
      : `<path d="M 380 -10 C 430 70, 520 60, 600 92 C 690 128, 760 40, 850 74 C 930 104, 990 30, 1090 56" fill="none" stroke="#D9503F" stroke-width="3" stroke-linecap="round"/>
         <g fill="none" stroke="#D9503F" stroke-width="3" stroke-linecap="round"><ellipse cx="584" cy="78" rx="18" ry="9" transform="rotate(-25 584 78)"/><ellipse cx="618" cy="80" rx="18" ry="9" transform="rotate(25 618 80)"/><path d="M 600 92 C 594 110, 588 122, 578 134"/><path d="M 602 92 C 612 112, 620 120, 632 128"/><ellipse cx="1074" cy="44" rx="16" ry="8" transform="rotate(-20 1074 44)"/><ellipse cx="1104" cy="46" rx="16" ry="8" transform="rotate(20 1104 46)"/><path d="M 1090 56 C 1086 74, 1080 84, 1070 94"/></g>`;

    canister.src = M ? 'assets/film/canister-upright.png' : 'assets/film/canister.png';
    intro.style.height = (M ? 560 : 650) + 'vh';
    folders.style.height = `calc(100vh + ${(ENTRIES.length - 1) * (M ? 45 : 50)}vh)`;
    $('#stackHint').textContent = finePointer.matches ? 'Hover a folder to peek · click to open' : 'Tap a folder to peek · tap again to open';
    curStage = -2;
    curBracket = -2;
    update();
  }

  /* ───────── intro timeline ───────── */
  // [progress, frames out of the canister]
  const OUT_KEYS = [[0.18, 0], [0.27, 3], [0.36, 3], [0.46, 6], [0.55, 6], [0.63, 8], [0.74, 8], [0.84, 0]];
  function outAt(p) {
    if (p <= OUT_KEYS[0][0]) return 0;
    for (let i = 1; i < OUT_KEYS.length; i++) {
      const [p1, o1] = OUT_KEYS[i];
      const [p0, o0] = OUT_KEYS[i - 1];
      if (p <= p1) return lerp(o0, o1, ease((p - p0) / (p1 - p0)));
    }
    return 0;
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

  function renderIntro(p) {
    const W = M ? 390 : 1440;
    const H = M ? 844 : 900;

    /* 1 · every object leaves the screen */
    const e = ease(seg(p, 0, 0.11));
    const far = M ? 760 : 1500;
    OBJECTS.forEach((o, i) => {
      const q = M ? o.m : o.d;
      const el = objEls[i];
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      let dx = q.x + w / 2 - W / 2;
      let dy = q.y + h / 2 - H / 2;
      const len = Math.hypot(dx, dy) || 1;
      dx /= len; dy /= len;
      const spin = (dx >= 0 ? 1 : -1) * 35 * e;
      el.style.transform = `translate(${dx * far * e}px, ${dy * far * e}px) rotate(${q.r + spin}deg)`;
      el.style.visibility = e >= 1 ? 'hidden' : 'visible';
    });
    hello.style.transform = `translate(${-far * 0.55 * e}px, ${-far * 0.45 * e}px) ` + (M ? 'rotate(6deg) scale(.654)' : 'rotate(-6deg)');
    beads.style.transform = `translate(${-far * 0.8 * e}px, ${-far * 0.2 * e}px) ` + (M ? 'scale(.667) rotate(-7deg)' : 'rotate(-7deg)');
    string.style.transform = `translateY(${-far * 0.35 * e}px)`;
    const fade = 1 - seg(p, 0, 0.06);
    greet.style.opacity = fade;
    greet.style.transform = `translateY(${-60 * e}px)`;
    corners.forEach((c) => (c.style.opacity = fade));
    hint.style.opacity = 1 - seg(p, 0, 0.025);
    hint.style.pointerEvents = p > 0.02 ? 'none' : '';

    /* 2 · the film roll: closed, then three stages, then it rewinds */
    const appear = seg(p, 0.07, 0.13);
    const out = outAt(p);
    const roll = ease(seg(p, 0.85, 0.95));
    canister.style.opacity = appear;
    canister.style.transform = M
      ? `translate(${roll * 420}px, ${appear < 1 ? (1 - appear) * 40 : 0}px) rotate(${roll * 360}deg)`
      : `translate(${roll * 520}px, ${appear < 1 ? (1 - appear) * 40 : 0}px) rotate(${roll * 540}deg)`;
    film.style.opacity = Math.min(appear, 1 - clamp(roll * 5));
    if (!M) {
      const left = out < 1 ? 1110 - 250 * out : 1059 - 199 * out;
      film.style.left = left + 'px';
      film.style.width = 1200 - left + 'px';
      film.style.top = '';
      film.style.height = '';
    } else {
      film.style.left = '';
      film.style.width = '';
      film.style.height = (out < 1 ? 96 + 97 * out : 193 + 161 * (out - 1)) + 'px';
    }
    frameEls.forEach((img, j) => {
      const shown = out - j;
      if (shown <= 0.01) { img.style.opacity = 0; return; }
      img.style.opacity = 1;
      if (!M) { img.style.left = frameX(j, out) + 'px'; img.style.top = ''; }
      else { img.style.left = ''; img.style.top = frameY(j, out) + 'px'; }
    });

    let k;
    if (p < 0.115 || p > 0.86) k = -1;
    else if (p > 0.74) k = 3;
    else k = out < 1.5 ? 0 : out < 4.5 ? 1 : out < 7 ? 2 : 3;
    setStage(k);
    let b = -1;
    if (p < 0.745) for (let s = 1; s < STAGES.length; s++) if (Math.abs(out - STAGES[s].out) < 0.04) b = s;
    setBracket(b);
  }

  /* ───────── folder stack ───────── */
  let peek = -1;
  let front = 0;
  let cNow = 0;
  function renderStack(q) {
    const n = ENTRIES.length;
    const raw = q * (n - 1);
    const i = Math.floor(raw);
    const f = raw - i;
    const c = Math.min(n - 1, i + ease(clamp((f - 0.15) / 0.7))); // linger on each folder a little
    cNow = c;
    const g = M ? { front: 532, step: 62, ds: 0.033, max: 6 } : { front: 642, step: 76, ds: 0.043, max: 7 };
    lis.forEach((li, k) => {
      const r = k - c;
      let top, sc, op = 1;
      if (r >= 0) {
        top = g.front - g.step * r;
        sc = 1 - g.ds * r;
        if (r > g.max) op = clamp(1 - (r - g.max));
      } else {
        top = g.front - r * -440;
        sc = 1;
        op = clamp(1 + r * 0.9);
      }
      li.style.top = top + 'px';
      li.style.transform = `scale(${sc})`;
      li.style.opacity = op;
      li.style.zIndex = String(500 - Math.round(r * 10));
      li.style.visibility = op <= 0.01 ? 'hidden' : 'visible';
      li.classList.toggle('is-front', Math.abs(r) < 0.5);
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
    counterFill.style.top = (c / (n - 1)) * 124 + 'px';
    applyPeek();
  }
  function applyPeek() {
    const pr = peek >= 0 ? peek - cNow : null;
    lis.forEach((li, k) => {
      li.classList.toggle('is-peek', k === peek);
      li.classList.toggle('is-dim', pr !== null && k - cNow > pr + 0.01);
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
  function update() {
    ticking = false;
    const vh = innerHeight;
    const iTop = intro.offsetTop;
    const iSpan = intro.offsetHeight - vh;
    const p = clamp((scrollY - iTop) / iSpan);
    renderIntro(p);
    const fTop = folders.offsetTop;
    const fSpan = folders.offsetHeight - vh;
    renderStack(clamp((scrollY - fTop) / fSpan));
    header.classList.toggle('is-compact', p > 0.86);
    const inAbout = p > 0.1 && p < 0.97;
    const inExp = scrollY >= fTop - vh * 0.3;
    setCurrent(navLinks.about, inAbout && !inExp);
    setCurrent(navLinks.experience, inExp);
  }
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { layout(); if (!contactLayer.hidden) placeContact(); });
  mq.addEventListener('change', layout);

  /* ───────── navigation ───────── */
  const behavior = () => (reduce.matches ? 'auto' : 'smooth');
  function go(where) {
    const vh = innerHeight;
    let top = 0;
    if (where === 'about') top = intro.offsetTop + 0.165 * (intro.offsetHeight - vh);
    else if (where === 'experience') top = folders.offsetTop + 2;
    scrollTo({ top, behavior: behavior() });
  }
  function goFolder(k, instant) {
    const vh = innerHeight;
    const n = ENTRIES.length;
    const top = folders.offsetTop + (k / (n - 1)) * (folders.offsetHeight - vh) + 2;
    scrollTo({ top, behavior: instant ? 'auto' : behavior() });
  }
  document.querySelectorAll('[data-go]').forEach((a) => a.addEventListener('click', (ev) => { ev.preventDefault(); go(a.dataset.go); }));
  railLinks.forEach((a) => a.addEventListener('click', (ev) => { ev.preventDefault(); goFolder(+a.dataset.jump); }));

  /* folders: hover to peek (mouse), tap to peek then tap to open (touch) */
  lis.forEach((li, k) => {
    const a = li.querySelector('.folder');
    li.addEventListener('pointerenter', (ev) => { if (ev.pointerType === 'mouse') setPeek(k); });
    a.addEventListener('focus', () => setPeek(k));
    a.addEventListener('click', (ev) => {
      ev.preventDefault();
      const touchy = !finePointer.matches;
      if (touchy && peek !== k && Math.abs(k - cNow) > 0.5) { setPeek(k); return; }
      openCard(k);
    });
  });
  stack.addEventListener('pointerleave', (ev) => { if (ev.pointerType === 'mouse') setPeek(-1); });
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
