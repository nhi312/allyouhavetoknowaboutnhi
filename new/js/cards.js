/* Pop-up card contents. Three folders are drawn in their own design systems
   (IdeaLens, APIE, HaneiRoom); the rest use the archive card.              */
(function () {
  const { I, A } = window.ARCHIVE;

  const fig = (m, cls = '') => {
    const ar = m.ar || 1.5;
    const inner = m.kind === 'video'
      ? `<video src="${m.src}" poster="${m.poster || ''}" controls preload="none" playsinline style="aspect-ratio:${ar}"></video>`
      : `<img src="${m.src}" alt="${m.alt || m.cap || ''}" loading="lazy" style="aspect-ratio:${ar}${m.pos ? `;object-position:${m.pos}` : ''}">`;
    const wrapped = m.url ? `<a href="${m.url}" target="_blank" rel="noopener">${inner}</a>` : inner;
    return `<figure class="g-fig ${cls}" style="--ar:${ar}">${wrapped}${m.cap ? `<figcaption>${m.cap}</figcaption>` : ''}</figure>`;
  };

  const wins = (list, prefix = '', pad = 2) => list.map((w, i) =>
    `<li><span class="w-no">${prefix}${String(i + 1).padStart(pad, '0')}</span><span>${w}</span></li>`).join('');

  const meta = (rows) => `<dl class="c-meta">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`;

  /* ───────── 03 · IdeaLens (NSTC) ───────── */
  function nstc() {
    return `
      <div class="c-head">
        <div class="c-titles">
          <span class="nstc-eyebrow">Source 003 · National Science &amp; Technology Council</span>
          <h2 class="c-title" id="cardTitle">IdeaLens</h2>
          <span class="c-role">Research Assistant | Product CTO</span>
        </div>
        ${meta([['When', 'Sep 2026 – Present'], ['With', 'NCCU DSE Research Team'], ['Tags', 'Research, EdTech, Data Visualization, Startup Pitch']])}
      </div>
      <div class="c-hero">
        ${fig({ src: I('idealens-pitch.jpg'), cap: 'Fig. 1 · The pitch, Fukuoka', alt: 'Pitching IdeaLens in Fukuoka', ar: 700 / 397 }, 'c-hero-fig')}
        <div class="c-wins"><span class="c-label">Wins</span><ol>${wins([
          '<b>PARKS Global Youth Innovation Showcase</b>, Fukuoka',
          '5-minute <b>pitch</b> + 60-minute <b>live demo</b>',
          'Startup + website built in <b>14 days</b>',
          '1 of 10 teams from <b>Taiwan, Japan, South Korea</b>'])}</ol></div>
      </div>
      <div class="c-story"><span class="c-label">My story</span>
        <p>A few weeks into the job, Kyushu University invited us to Fukuoka. 14 days to turn a research method into a startup - website, posters, pitch.</p>
      </div>
      <section class="c-gallery" aria-label="Gallery">
        <div class="c-gallery-head"><span class="c-label">Gallery · 14 days in Fukuoka</span><span class="c-label">Fig. 2 - 4</span></div>
        <div class="g-row">
          ${fig({ src: I('fukuoka-ici-team.jpg'), cap: 'Fig. 2 · Team ICI, Fukuoka', ar: 325 / 244 })}
          ${fig({ src: I('parks-idealens-team.jpg'), cap: 'Fig. 3 · Team IdeaLens', ar: 434 / 244 })}
          ${fig({ src: I('parks-showcase.jpg'), cap: 'Fig. 4 · The PARKS showcase', ar: 325 / 244 })}
        </div>
      </section>`;
  }

  /* ───────── 04 · APIE ───────── */
  function apie() {
    return `
      <div class="c-head">
        <div class="c-titles">
          <div class="apie-brand"><span class="apie-word">APIE<span class="apie-dot">.</span></span><img src="${A('apie-logo.svg')}" alt="APIE logo mark" class="apie-mark"></div>
          <h2 class="c-title" id="cardTitle">Teacher Tool</h2>
          <span class="c-role">Growth &amp; Marketing Intern</span>
        </div>
        ${meta([['When', 'May 2026 - Present'], ['Live', '<a href="https://teacher.apie.vn" target="_blank" rel="noopener">teacher.apie.vn ↗</a>'], ['Tags', 'EdTech, Social Media, Growth, AI Workflow']])}
      </div>
      <div class="c-hero">
        <figure class="g-fig c-hero-fig" style="--ar:${696 / 393}">
          <img class="apie-ig" src="${A('ig-apie-2026.jpg')}" alt="The @apie.teacher.vn Instagram profile" style="aspect-ratio:${696 / 393}">
          <figcaption>Fig. 01 · @apie.teacher.vn on Instagram</figcaption>
        </figure>
        <div class="c-wins"><span class="c-label">Wins</span><ol>${wins([
          '<b>Instagram</b>: 0 to +1.8K followers / +89K monthly views',
          '<b>TikTok</b>: 3,424 followers / 79.9K likes',
          'Personal outreach that <b>contributed to user growth (+5K - +12K)</b>',
          '<b>Community</b>: 100+ teacher users',
          'Internal tools built with <b>Claude</b>'], 'N° ')}</ol></div>
      </div>
      <div class="c-story"><span class="c-label">My story</span>
        <p>I manage content across 4 social channels and coordinate a 4-person content team plus <span class="apie-hl">freelancers</span>.</p>
      </div>
      <section class="c-gallery" aria-label="Gallery">
        <div class="c-gallery-head"><span class="c-label">Gallery · the work behind the numbers</span><span class="c-label">Fig. 02 - 06</span></div>
        <div class="g-row">
          ${fig({ src: I('tiktok-social.jpg'), cap: 'Fig. 02 · TikTok, 3,424 followers', alt: 'The @apieforteacher TikTok profile', ar: 523 / 345, pos: 'top' })}
          ${fig({ src: I('linkedin-post.jpg'), cap: 'Fig. 03 · The power-users post', alt: 'APIE LinkedIn post about teacher power-users', ar: 252 / 345, pos: 'top' })}
          ${fig({ src: I('apie-des-1.jpg'), cap: 'Fig. 04 · Prompt in 30 secs', alt: 'APIE carousel: a lesson prompt in 30 seconds', ar: 277 / 345 })}
        </div>
        <div class="g-row">
          ${fig({ src: I('apie-des-2.jpg'), cap: 'Fig. 05 · Teachers’ thoughts', alt: 'APIE carousel: what teachers think', ar: 276 / 345 })}
          ${fig({ src: I('apie-des-3.jpg'), cap: 'Fig. 06 · 5 prompts, carousel', alt: 'APIE carousel: five prompts for teachers', ar: 276 / 345 })}
          <figure class="g-fig apie-note" style="--ar:${500 / 345}">
            <div class="apie-note-box">
              <span>Behind the numbers</span>
              <p>Every post, carousel and teacher reply here went out through <em>our</em> content team.</p>
            </div>
          </figure>
        </div>
      </section>`;
  }

  /* ───────── 05 · HaneiAI ───────── */
  function hanei() {
    return `
      <div class="c-head">
        <div class="c-titles">
          <h2 class="c-title" id="cardTitle">Hanei<span>AI</span></h2>
          <span class="c-role">Co-Founder / CMO</span>
        </div>
        ${meta([['When', 'Jun 2025 - Dec 2025'], ['Live', '<a href="https://haneiroom.com" target="_blank" rel="noopener">haneiroom.com ↗</a>'], ['Tags', 'Startup, AI, Marketing, Co-founder']])}
      </div>
      <div class="c-hero">
        ${fig({ src: I('haneiroom-hero.jpg'), cap: 'haneiroom.com, live and on the App Store', alt: 'The HaneiRoom landing page', ar: 700 / 397 }, 'c-hero-fig')}
        <div class="c-wins"><span class="c-label">Wins</span><ol>${wins([
          'Launched on the <b>App Store</b>',
          '+5,000 <b>landing page views</b> at soft launch',
          'Soft launch: <b>Drexel University</b> + <b>NCCU</b>',
          '<b>User research</b> that redirected the roadmap'])}</ol></div>
      </div>
      <div class="c-story"><span class="c-label">My story</span>
        <p>Addicted to building houses on Bloxburg, so I figured I would build something that lets people do it in real life - and then actually get the stuff.</p>
      </div>
      <section class="c-gallery" aria-label="Gallery">
        <div class="c-gallery-head"><span class="c-label">Gallery · the product</span></div>
        <div class="g-row">
          ${fig({ src: I('haneiroom-on-phone.jpg'), cap: 'HaneiRoom, on your phone', ar: 530 / 300 })}
          ${fig({ src: I('haneiai-on-web.jpg'), cap: 'HaneiAI, on the web', ar: 530 / 300 })}
        </div>
        <div class="g-row g-row--part">
          ${fig({ src: I('hanei-on-appstore.jpg'), cap: 'on the App Store', ar: 445 / 360 })}
          ${fig({ src: I('the-hanei-team.jpg'), cap: 'the team', alt: 'Polaroid of the Hanei founding team', ar: 214 / 360 })}
        </div>
      </section>`;
  }

  /* ───────── archive card (everything else) ───────── */
  function archive(e) {
    const photos = e.media.filter((m) => m.kind !== 'video');
    const hero = photos[0];
    const rest = e.media.filter((m) => m !== hero);
    const links = (e.links || []).map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener">${t} ↗</a>`).join('<br>');
    const rows = [['When', e.when]];
    if (links) rows.push(['Links', links]);
    rows.push(['Tags', e.tags.join(', ')]);
    return `
      <div class="c-head">
        <div class="c-titles">
          <h2 class="c-title" id="cardTitle">${e.title}</h2>
          ${e.subtitle ? `<span class="arc-sub">${e.subtitle}</span>` : ''}
          <span class="c-role">${e.role}</span>
        </div>
        ${meta(rows)}
      </div>
      <div class="c-hero">
        ${fig(hero, 'c-hero-fig')}
        <div class="c-wins"><span class="c-label">${e.winsLabel || 'Wins'}</span><ol>${wins(e.wins)}</ol></div>
      </div>
      <div class="c-story"><span class="c-label">My story</span><p>${e.story}</p></div>
      ${e.credits ? `<p class="arc-credits">${e.credits}</p>` : ''}
      ${rest.length ? `<section class="c-gallery" aria-label="Gallery">
        <div class="c-gallery-head"><span class="c-label">Gallery</span><span class="c-label">${rest.length} more</span></div>
        <div class="g-wrap">${rest.map((m) => fig(m)).join('')}</div>
      </section>` : ''}`;
  }

  window.renderCard = function (e) {
    if (e.theme === 'nstc') return nstc();
    if (e.theme === 'apie') return apie();
    if (e.theme === 'hanei') return hanei();
    return archive(e);
  };
})();
