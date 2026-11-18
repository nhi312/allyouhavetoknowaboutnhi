/* Pop-up card contents. Three folders are drawn in their own design systems
   (IdeaLens, APIE, HaneiRoom); the rest use the archive card.              */
(function () {
  const { I, A } = window.ARCHIVE;

  /* every photo in images/ has an 800px copy in images/sm/ for phones and small tiles */
  const small = (src) => (/^images\/.+\.(jpe?g|png)$/i.test(src) ? src.replace(/^images\//, 'images/sm/') : '');
  const srcAttrs = (src, sizes) => {
    const sm = small(src);
    return sm ? `src="${src}" srcset="${sm} 800w, ${src} 1600w" sizes="${sizes}"` : `src="${src}"`;
  };
  const fig = (m, cls = '', sizes = '(max-width: 767px) 100vw, 560px') => {
    const ar = m.ar || 1.5;
    const inner = m.kind === 'video'
      ? `<video src="${m.src}" poster="${m.poster ? (small(m.poster) || m.poster) : ''}" controls preload="none" playsinline style="aspect-ratio:${ar}"></video>`
      : `<img ${srcAttrs(m.src, sizes)} alt="${m.alt || m.cap || ''}" loading="lazy" decoding="async" style="aspect-ratio:${ar}${m.pos ? `;object-position:${m.pos}` : ''}">`;
    const wrapped = m.url ? `<a href="${m.url}" target="_blank" rel="noopener">${inner}</a>` : inner;
    return `<figure class="g-fig ${cls}" style="--ar:${ar}">${wrapped}${m.cap ? `<figcaption>${m.cap}</figcaption>` : ''}</figure>`;
  };

  const wins = (list, prefix = '', pad = 2) => list.map((w, i) =>
    `<li><span class="w-no">${prefix}${String(i + 1).padStart(pad, '0')}</span><span>${w}</span></li>`).join('');

  const meta = (rows) => `<dl class="c-meta">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`;

  const HERO = '(max-width: 767px) 100vw, 780px';
  const IL_MARK = '<svg class="nstc-mark" role="img" aria-label="IdeaLens logo" viewBox="0 0 56 56"><g stroke="#1e3086" stroke-width="1.7" stroke-linecap="round"><line x1="28" y1="13" x2="11" y2="26"/><line x1="28" y1="13" x2="46" y2="27"/><line x1="11" y1="26" x2="18" y2="44"/></g><path d="M24,24 L32,24 L36,20 L28,20 Z" fill="#e8ebfa"/><path d="M32,24 L32,47 L36,43 L36,20 Z" fill="#17266d"/><path d="M24,24 L32,24 L32,47 L24,47 Z" fill="#1e3086"/><circle cx="11" cy="26" r="4" fill="#1e3086"/><circle cx="9.8" cy="24.8" r="1.4" fill="#ffffed" opacity=".5"/><circle cx="46" cy="27" r="4" fill="#1e3086"/><circle cx="44.8" cy="25.8" r="1.4" fill="#ffffed" opacity=".5"/><circle cx="18" cy="44" r="3.4" fill="#17266d"/><circle cx="28" cy="13" r="6.6" fill="#df3022"/><circle cx="25.8" cy="10.8" r="2.3" fill="#ffffed" opacity=".55"/></svg>';

  /* ───────── 03 · IdeaLens (NSTC) ───────── */
  function nstc() {
    return `
      <div class="c-head">
        <div class="c-titles">
          <span class="nstc-eyebrow">Source 003 · National Science &amp; Technology Council</span>
          <div class="nstc-titlerow">${IL_MARK}<h2 class="c-title" id="cardTitle">IdeaLens</h2></div>
          <span class="c-role">Research Assistant | Product CTO</span>
        </div>
        ${meta([['When', 'Sep 2026 – Present'], ['With', 'NCCU DSE Research Team'], ['Tags', 'Research, EdTech, Data Visualization, Startup Pitch']])}
      </div>
      <div class="c-hero">
        ${fig({ src: I('idealens-pitch.jpg'), cap: 'Fig. 1 · The pitch, Fukuoka', alt: 'Pitching IdeaLens in Fukuoka', ar: 700 / 397 }, 'c-hero-fig', HERO)}
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
          <img class="apie-ig" src="${A('ig-apie-2026.jpg')}" decoding="async" alt="The @apie.teacher.vn Instagram profile" style="aspect-ratio:${696 / 393}">
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
          <h2 class="c-title" id="cardTitle"><img class="hanei-logo" src="${A('haneiai-logo.png')}" alt="HaneiAI"></h2>
          <span class="c-role">Co-Founder / CMO</span>
        </div>
        ${meta([['When', 'Jun 2025 - Dec 2025'], ['Live', '<a href="https://haneiroom.com" target="_blank" rel="noopener">haneiroom.com ↗</a>'], ['Tags', 'Startup, AI, Marketing, Co-founder']])}
      </div>
      <div class="c-hero">
        ${fig({ src: I('haneiroom-hero.jpg'), cap: 'haneiroom.com, live and on the App Store', alt: 'The HaneiRoom landing page', ar: 700 / 397 }, 'c-hero-fig', HERO)}
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

  /* ───────── 06 · buildtolaunch ───────── */
  const PX = (rows, pal, w) => {
    const g = {};
    rows.forEach((r, y) => [...r].forEach((c, x) => { if (c !== ' ') (g[c] = g[c] || []).push(`M${x} ${y}h1v1h-1z`); }));
    return `<svg aria-hidden="true" viewBox="0 0 ${Math.max(...rows.map((r) => r.length))} ${rows.length}" shape-rendering="crispEdges" style="width:${w}px">${Object.keys(g).map((k) => `<path d="${g[k].join('')}" fill="${pal[k]}"/>`).join('')}</svg>`;
  };
  const HEAD = 'oklch(0.3 0.04 275)', SUN = 'oklch(84% 0.14 78)', BLUSH = 'oklch(80% 0.11 20)', BLUE = 'oklch(0.55 0.22 274)', LEAF = 'oklch(78% 0.15 150)';
  const SPR = {
    rocket: [['    b    ', '   bbb   ', '  bbbbb  ', '  bbbbb  ', '  bwwwb  ', '  bwwwb  ', '  bbbbb  ', '  bbbbb  ', ' fbbbbbf ', 'ffbbbbbff', 'ff bbb ff', '   mmm   ', '    m    '], { b: HEAD, w: SUN, f: BLUSH, m: SUN }],
    chat: [[' xxxxxxxxx ', 'xxxxxxxxxxx', 'xxxxxxxxxxx', 'xxdxxdxxdxx', 'xxxxxxxxxxx', 'xxxxxxxxxxx', ' xxxxxxxxx ', ' xxx       ', ' xx        '], { x: BLUE, d: '#fff' }],
    star: [['   x   ', '   x   ', '  xxx  ', 'xxxxxxx', '  xxx  ', '   x   ', '   x   '], { x: SUN }],
    tulip: [[' b b b ', ' bbbbb ', ' bbbbb ', '  bbb  ', '   s   ', ' sss   ', '   s   ', '   sss ', '   s   '], { b: BLUSH, s: LEAF }]
  };
  const sprite = (n, w) => PX(SPR[n][0], SPR[n][1], w);
  const sticker = (n, w, cls) => `<span class="b2l-sticker ${cls}" aria-hidden="true">${sprite(n, w)}</span>`;
  function b2l() {
    const s = '(max-width: 767px) 50vw, 360px';
    return `
      <div class="b2l-top">
        <span class="b2l-pill">${sprite('rocket', 18)}<span class="b2l-word">build<i>to</i>launch</span></span>
      </div>
      <div class="c-head">
        <div class="c-titles">
          <span class="b2l-eyebrow">Build to Launch · community</span>
          <h2 class="c-title" id="cardTitle">build<i>to</i>launch</h2>
          <div class="b2l-rolerow"><span class="b2l-role">Community Manager</span><span class="b2l-plus">+ content and social media</span></div>
        </div>
        ${meta([['When', 'Nov 2025 – Present'], ['Live', '<a href="https://buildtolaunch.org" target="_blank" rel="noopener">buildtolaunch.org →</a>'], ['Tags', 'Community, Social Media, Content, Partnerships, Events']])}
      </div>
      <div class="c-hero">
        <figure class="g-fig c-hero-fig b2l-panel" style="--ar:${16 / 9}">
          <img ${srcAttrs(I('b2l-shebuilds-recap.jpg'), HERO)} alt="She Builds #1 recap thumbnail: the group photo with pixel flowers and a Recap tag" decoding="async" style="aspect-ratio:${16 / 9}">
          <figcaption>She Builds #1 recap, the thumbnail I designed for our socials</figcaption>
          ${sticker('rocket', 64, 'st-rocket')}
        </figure>
        <div class="c-wins b2l-panel"><span class="b2l-h">What I do</span><ol>${wins([
          '<b>Community manager</b> for a free builder community of university students across Southeast Asia',
          '<b>Content + social</b>: I produce the posts and run our Instagram, Facebook and LinkedIn pages',
          '<b>Built for partners</b>: most of our social exists to land and serve partnerships, like Base44',
          '<b>Events</b>: She Builds #1, Vibe-a-thon Saigon and the Builder to Builder podcast'])}</ol></div>
      </div>
      <div class="c-story b2l-panel"><span class="b2l-h">My story</span>
        <p>On paper I’m the community manager. In practice I also make the content and run our <mark>Instagram, Facebook and LinkedIn</mark>. Most of what we post is there to win and serve partnerships, so the work is half community, half partner marketing.</p>
        ${sticker('chat', 56, 'st-chat')}
      </div>
      <section class="c-gallery b2l-gallery" aria-label="Events we ran">
        <div class="c-gallery-head"><span class="b2l-h b2l-h--lg">Events we ran</span><span class="b2l-eyebrow">She Builds #1 · Vibe-a-thon Saigon</span></div>
        <div class="g-row">
          ${fig({ src: I('b2l-shebuilds-speakers.jpg'), cap: 'She Builds #1, the speakers', alt: 'Speakers on stage at She Builds #1', ar: 1.5 }, '', s)}
          ${fig({ src: I('b2l-vibeathon-group.jpg'), cap: 'Vibe-a-thon Saigon, with Base44', alt: 'Everyone at Vibe-a-thon Saigon', ar: 1.5 }, '', s)}
          ${fig({ src: I('b2l-vibeathon-organizers.jpg'), cap: 'Vibe-a-thon, the organizers', alt: 'The Vibe-a-thon organizers', ar: 1.5 }, '', s)}
        </div>
        ${sticker('star', 40, 'st-star')}
      </section>
      <section class="c-gallery b2l-gallery" aria-label="Posts I made">
        <div class="c-gallery-head"><span class="b2l-h b2l-h--lg">Posts I made</span><span class="b2l-eyebrow">Partner posts + community updates</span></div>
        <div class="g-row">
          ${fig({ src: I('b2l-post-vibeathon.jpg'), cap: 'Vibe-a-thon × Base44', alt: 'Build what you wish existed, the Vibe-a-thon post with Base44', ar: 1 }, '', s)}
          ${fig({ src: I('b2l-post-invite.jpg'), cap: 'The invite', alt: 'Community update inviting builders to the Vibe-a-thon', ar: 224 / 340, pos: 'top' }, '', s)}
          ${fig({ src: I('b2l-post-recap.jpg'), cap: 'The recap', alt: 'Vibe-a-thon Saigon recap in the community update', ar: 270 / 340, pos: 'top' }, '', s)}
          ${fig({ src: I('b2l-post-podcast.jpg'), cap: 'Builder to Builder', alt: 'Builder to Builder podcast section of the community update', ar: 187 / 340, pos: 'top' }, '', s)}
        </div>
        ${sticker('tulip', 36, 'st-tulip')}
      </section>`;
  }

  /* ───────── archive card (everything else) ───────── */
  function archive(e) {
    const photos = e.media.filter((m) => m.kind !== 'video');
    const hero = photos[0];
    const rest = e.cover ? e.media : e.media.filter((m) => m !== hero);
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
        ${e.cover ? `<figure class="g-fig c-hero-fig arc-cover"><div class="arc-cover-grid" role="img" aria-label="${e.coverCap || ''}">${e.cover.map((c) => `<img ${srcAttrs(c, '(max-width: 767px) 50vw, 400px')} alt="" loading="lazy" decoding="async">`).join('')}</div><figcaption>${e.coverCap || ''}</figcaption></figure>` : fig(hero, 'c-hero-fig', HERO)}
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
    if (e.theme === 'b2l') return b2l();
    return archive(e);
  };
})();
