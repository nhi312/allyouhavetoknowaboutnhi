/* Content for the archive. Media paths are relative to index.html.
   images/ is the shared photo folder.                                   */
(function () {
  const I = (f) => 'images/' + f;
  const A = (f) => 'assets/' + f;

  /* ───────── greeting objects ─────────
     d = desktop artboard (1440 × 900), m = mobile artboard (390 × 844)
     x, y, w, (h), r = rotation, z = stacking                              */
  const OBJECTS = [
    { id: 'notebook', src: A('objects/notebook.png'), alt: 'Navy croc-leather notebook with leopard stars and studs',
      d: { x: 953, y: 72, w: 233, h: 341, r: -157, z: 3 }, m: { x: 298, y: 236, w: 112, r: 132, z: 3 } },
    { id: 'instax', src: A('objects/instax.png'), alt: 'Pink Instax Mini 9 with stickers',
      d: { x: 130, y: 318, w: 280, r: -16, z: 6 }, m: { x: -34, y: 214, w: 160, r: -16, z: 6 } },
    { id: 'kyocera', src: A('objects/kyocera.png'), alt: 'Silver Kyocera film camera with stickers',
      d: { x: 1190, y: 336, w: 220, r: -11, z: 3 }, m: { x: 247, y: 583, w: 150, r: -11, z: 3 } },
    { id: 'plate', src: A('objects/plate.png'), alt: 'Handmade ceramic plate with a red lobster and blue stripes',
      d: { x: -46, y: 596, w: 340, r: -8, z: 3 }, m: { x: -62, y: 588, w: 212, r: -8, z: 3 } },
    { id: 'ixus', src: A('objects/ixus.png'), alt: 'Black Canon IXUS with a beaded charm strap',
      d: { x: 296, y: 615, w: 250, r: 18, z: 7 }, m: { x: 90, y: 604, w: 152, r: 18, z: 7 } },
    { id: 'purse', src: A('objects/purse.png'), alt: 'Embroidered Little My coin purse',
      d: { x: 1139, y: 505, w: 300, r: 6, z: 5 }, m: { x: 272, y: 652, w: 170, r: 6, z: 5 } },
    { id: 'pass', src: A('objects/pass.png'), alt: 'Hanoi to Taipei boarding pass',
      d: { x: 885, y: 642, w: 274, h: 373, r: -4, z: 6 }, m: { x: 168, y: 672, w: 104, r: -4, z: 6 } },
    { id: 'avatar', src: A('objects/avatar.png'), alt: "Nhi's Roblox avatar profile card",
      d: { x: 1309, y: 83, w: 128, r: 9, z: 4 }, m: { x: 146, y: 226, w: 82, r: 9, z: 4 } },
    { id: 'matcha', src: A('objects/matcha.png'), alt: 'Iced matcha with a brûlée top',
      d: { x: 902, y: 336, w: 122, r: 8, z: 6 }, m: { x: 332, y: 438, w: 74, r: 8, z: 6 } },
    { id: 'giftcard', src: A('objects/giftcard.png'), alt: 'Roblox gift card',
      d: { x: -36, y: 286, w: 170, r: -18, z: 2 }, m: { x: -46, y: 478, w: 104, r: -18, z: 2 } },
    { id: 'udon', src: A('objects/udon.png'), alt: 'Udon with egg yolks, bacon and chopsticks',
      d: { x: 1000, y: 449, w: 290, r: -5, z: 6 }, m: { x: 14, y: 744, w: 172, r: -5, z: 6 } }
  ];

  /* ───────── about me film roll ───────── */
  const FRAMES = [
    { src: A('film/club-of-the-year.jpg'), alt: 'Vinschool Ocean Park end-of-year ceremony' },
    { src: A('film/grad-pic-2.jpg'), alt: 'Graduation day, class of 2025', pos: '40% 30%' },
    { src: A('film/25event-recap3.jpg'), alt: 'The crowd at Luminara, my last prom' },
    { src: A('film/taiwan-moe-scholarship.jpg'), alt: 'Taiwan Scholarship award certificate', pos: '50% 15%' },
    { src: I('logo-nccu.png'), alt: 'National Chengchi University', logo: true },
    { src: A('film/the-hanei-team.jpg'), alt: 'Polaroid of the Hanei founding team', pos: '50% 45%' },
    { src: A('film/parks-idealens-team.jpg'), alt: 'The IdeaLens team' },
    { src: A('film/fukuoka-ici-team.jpg'), alt: 'Team ICI in Fukuoka' }
  ];

  /* the film roll's storyline: each line pulls frames from..to out of the canister */
  const STAGES = [
    { title: 'Hi there, I’m Nessa / Nhi / <span lang="zh-Hant" class="zh">鈴兒</span>', out: 0 },
    { title: 'Born and raised in Hanoi, Vietnam', out: 3, from: 0, to: 2, label: 'Hanoi' },
    { title: '…But now I’m based in Taipei, Taiwan as a full-time Bachelor student', out: 5, from: 3, to: 4, label: 'Taipei' },
    { title: 'I build web and applications to solve tiny problems of mine', out: 6, from: 5, to: 5, label: 'for me' },
    { title: '…But I believe it might solve someone else’s pain too', out: 8, from: 6, to: 7, label: 'for you too' }
  ];

  /* ───────── the folders (03 - 13) ───────── */
  const ENTRIES = [
    {
      id: 'nstc', theme: 'nstc', cat: 'Personal Projects', color: '#2F57D6', ink: '#F5F3EE',
      stackTitle: 'National Science &amp; Technology Council', stackMeta: 'Research Assistant · Sep 2026 – Present',
      when: 'Sep 2026 – Present', role: 'Research Assistant | Product CTO',
      short: 'Research assistant behind IdeaLens - a tool that shows how ideas connect, which we built in 14 days and pitched in Fukuoka.',
      tags: ['Research', 'EdTech', 'Data Visualization', 'Startup Pitch'],
      thumb: I('idealens-pitch.jpg')
    },
    {
      id: 'apie', theme: 'apie', cat: 'Personal Projects', color: '#b8a5e3', cardColor: '#8b6fc7', ink: '#1B120F',
      stackTitle: 'APIE Teacher Tool', stackMeta: 'Growth &amp; Marketing Intern · 2026',
      when: 'May 2026 - Present', role: 'Growth &amp; Marketing Intern',
      short: 'Internal tools built with Claude, a 4-channel content operation, and personal outreach that contributed to user growth.',
      tags: ['EdTech', 'Social Media', 'Growth', 'AI Workflow'],
      thumb: A('ig-apie-2026.jpg')
    },
    {
      id: 'hanei', theme: 'hanei', cat: 'Personal Projects', color: '#ff912c', ink: '#1E1215',
      stackTitle: 'HaneiAI', stackMeta: 'Co-Founder / CMO · Jun – Dec 2025',
      when: 'Jun 2025 - Dec 2025', role: 'Co-Founder / CMO',
      short: 'User research and a two-university soft launch that put Hanei Room on the App Store.',
      tags: ['Startup', 'AI', 'Marketing', 'Co-founder'],
      thumb: I('haneiroom-hero.jpg')
    },
    {
      id: 'upyouth', cat: 'Personal Projects', color: '#E7C54B', ink: '#1D1806',
      title: 'UpYouth', stackTitle: 'UpYouth', stackMeta: 'Growth · Nov 2025 – Present',
      role: 'Growth', when: 'Nov 2025 – Present',
      tags: ['Growth', 'Youth Org', 'Community Building'],
      short: 'A 10K+ follower page, community work for Build to Launch, and an internal planning tool I built.',
      story: 'I joined their Junior StartUp School program over the summer - and went from being one of their builders to being the one who goes out and finds them. Suddenly building in tech doesn’t sound that bad. Or at least that’s what I thought? lol.',
      wins: ['10K+ <b>followers</b> on the page I manage', '<b>Build Stuff With Us</b>: 10K+ YouTube views', 'Built an internal <b>planning + tracking tool</b>', '<b>User outreach</b> across US + Vietnam', '<b>Junior StartUp School</b>, summer program'],
      media: [
        { src: I('build-stuffs-with-us.jpg'), cap: 'Build Stuff With Us', ar: 1.414 },
        { src: I('uy-internship-sprint.jpg'), cap: 'the sprint', ar: 1.83 },
        { src: I('junior-start-up-school.jpg'), cap: 'Start-up School', ar: 0.61 }
      ],
      links: [['upyouth.org', 'https://upyouth.org'], ['buildtolaunch.org', 'https://buildtolaunch.org/'], ['@_upyouth', 'https://www.instagram.com/_upyouth']]
    },
    {
      id: 'luminara', cat: 'Marketing &amp; Events', color: '#5B3360', ink: '#F4E9F3',
      title: 'GLORIOUS 25’ · Luminara', stackTitle: 'GLORIOUS 25’ · Luminara', stackMeta: 'Director of Marketing · 2025',
      role: 'Director of Marketing', when: 'Jan – May 2025',
      tags: ['Senior Prom', 'Event Marketing', 'Creative Direction', 'Campaign'],
      short: 'Built the marketing and brand for Luminara, Vinschool’s 2025 senior prom: 600+ attendees, 150M+ VNĐ in sponsorship.',
      story: 'Been obsessed with Noo Phuoc Thinh since 5th grade, so I tried my best to get him to my senior prom. It was also my last year, so I had to leave a massive bomb behind - something they would never forget.',
      wins: ['600+ <b>attendees</b>', '150M+ VNĐ in <b>sponsorship</b>', 'Full <b>visual identity</b> + <b>campaign strategy</b>', 'Artists: <b>Noo Phuoc Thinh</b>, <b>Hoang Dung</b>, <b>Binh Gold</b>, <b>Bac Si Hai</b>', 'Partner: <b>Muoi Studio</b>'],
      media: [
        { src: I('senior-prom-2025-luminara.jpg'), cap: 'Luminara 2025', ar: 0.75 },
        { src: I('25event-recap2.jpg'), cap: 'the recap', ar: 1.503 },
        { src: I('25event-recap3.jpg'), cap: 'the recap', ar: 1.5 },
        { src: I('noo-phuoc-thinh.jpg'), cap: 'Noo Phuoc Thinh', ar: 0.8 },
        { src: I('artist.mp4'), cap: 'the performance', kind: 'video', ar: 1.778, poster: I('posters/artist.jpg') },
        { src: I('25event-post-2.jpg'), cap: 'the campaign', ar: 1.0 }
      ],
      links: [['@vsc.ocp', 'https://www.instagram.com/vsc.ocp']]
    },
    {
      id: 'epiphany', cat: 'Marketing &amp; Events', color: '#C79A5B', ink: '#1F160A',
      title: 'GLORIOUS 24’ · Epiphany', stackTitle: 'GLORIOUS 24’ · Epiphany', stackMeta: 'Marketing &amp; ER Lead · 2024',
      role: 'Marketing &amp; External Relations Lead', when: 'Jan – May 2024',
      tags: ['Senior Prom', 'Event Marketing', 'Performance', 'Campaign'],
      short: 'Built the campaign for Vinschool’s 2024 prom: 10M+ TikTok views, 200M+ VNĐ in sales, 300+ on the night.',
      story: 'Not my senior prom yet, but still a huge opportunity. First time I actually built a campaign and ran an event from scratch. I liked this kind of thing way too much, so I stayed. Until my last minute.',
      wins: ['10M+ <b>TikTok views</b>', '9M-view campaign reposted by <b>The Anh 28</b>', '+200,000,000 VNĐ in <b>total sales</b>', '+300 <b>attendees</b>, aged 15-20', 'Artists: <b>Wxrdie</b>, <b>24K Right</b>'],
      media: [
        { src: I('senior-prom-2024-epiphany.jpg'), cap: 'Epiphany 2024', ar: 0.75 },
        { src: I('the-anh-28.jpg'), cap: 'The Anh 28', ar: 0.683 },
        { src: I('recap-vid.mp4'), cap: 'the recap', kind: 'video', ar: 1.778, poster: I('posters/recap-vid.jpg') },
        { src: I('24event-post.jpg'), cap: 'the campaign', ar: 1.0 },
        { src: I('24event-post-2.jpg'), cap: 'the campaign', ar: 1.5 },
        { src: I('24event-recap.jpg'), cap: 'the recap', ar: 1.5 }
      ],
      links: [['@vsc.ocp', 'https://www.instagram.com/vsc.ocp']]
    },
    {
      id: 'virtue', cat: 'Marketing &amp; Events', color: '#EDE3CF', ink: '#241E15',
      title: 'Virtue’s Spring Charity Concert', stackTitle: 'Virtue’s Spring Charity Concert', stackMeta: 'Marketing Lead · 2024 – 25',
      role: 'Marketing &amp; External Relations Lead', when: 'Nov 2024 – Jan 2025',
      tags: ['Charity', 'Concert', 'Marketing', 'Fundraising'],
      short: 'Marketing lead for a student-run charity concert that raised 350M+ VNĐ.',
      story: 'Combined my two high school specialties: eventing and community service. Celebrating our Tết, the Lunar New Year, a little differently.',
      wins: ['+350,000,000 VNĐ <b>raised</b>', '<b>End-to-end campaign</b>: pre, live, post', '<b>Sponsor</b>, <b>model</b> and <b>studio</b> partnerships'],
      media: [
        { src: I('virtue-spring-2025-k-hospital.jpg'), cap: 'K Hospital', ar: 1.608 },
        { src: I('spring-event-recap.jpg'), cap: 'the recap', ar: 1.5 },
        { src: I('spring-event-post-2.jpg'), cap: 'the campaign', ar: 1.0 },
        { src: I('spring-event-post-3.jpg'), cap: 'the campaign', ar: 1.0 },
        { src: I('spring-event.mp4'), cap: 'Virtue’s Spring', kind: 'video', ar: 1.778, poster: I('posters/spring-event.jpg') },
        { src: I('cheap-moment.mp4'), cap: 'behind the scenes', kind: 'video', ar: 0.562, poster: I('posters/cheap-moment.jpg') }
      ],
      links: [['@vsc.ocp', 'https://www.instagram.com/vsc.ocp']]
    },
    {
      id: 'vrupc', cat: 'Other', color: '#1F2A4D', ink: '#E9E6F2',
      title: 'VRUPC', stackTitle: 'VRUPC', stackMeta: 'Co-Founder &amp; President · 2022 – 2025',
      subtitle: 'Vinschool Really Useful People’s Community',
      role: 'Co-Founder &amp; President', when: '2022 – 2025',
      tags: ['Charity', 'Community', 'Leadership', 'Fundraising'],
      short: 'Founded and led a student charity club - 80+ members across four Vinschool campuses.',
      story: 'First time joining a club, so of course first time being a president - VRUPC was lowkey one of the first clubs founded at Vinschool Ocean Park. Student-run clubs were so new that the Student Council founded a Club Management Department for them, and of course I stepped up as Vice President in charge.',
      wins: ['+80 <b>members</b>', 'All <b>four Vinschool campuses</b>', '<b>ĐÔNG</b> 2022: 20,000,000 VNĐ + 500 meals', '<b>Page of Halcyon</b> 2023: 500 books donated', '<b>LULLABY</b> 2024: 10,000,000 VNĐ', '<b>Club with excellent performance</b>, 2023'],
      media: [
        { src: I('president.jpg'), cap: 'president', ar: 0.892 },
        { src: I('dong-2022-hospital.jpg'), cap: 'ĐÔNG 2022', ar: 1.5 },
        { src: I('lullaby-notebooks-sale.jpg'), cap: 'LULLABY notebooks', ar: 1.5 },
        { src: I('the-page-of-halcyon-donation.jpg'), cap: '500 books', ar: 1.778 },
        { src: I('the-page-of-halcyon.mp4'), cap: 'Page of Halcyon', kind: 'video', ar: 1.775, poster: I('posters/the-page-of-halcyon.jpg') },
        { src: I('club-of-the-year.jpg'), cap: 'Club of the Year', ar: 1.335 }
      ],
      links: [['@vrupc.vsc', 'https://www.instagram.com/vrupc.vsc']]
    },
    {
      id: 'yearbook', cat: 'Other', color: '#A4442F', ink: '#F8ECE8',
      title: 'Class of 2025 Yearbook', stackTitle: 'Class of 2025 Yearbook', stackMeta: 'Director · Mar – May 2025',
      role: 'Director', when: 'Mar – May 2025',
      tags: ['Editorial', 'Creative Direction', 'Publishing', 'Photography'],
      short: 'Directed a two-week shoot for 300+ seniors, then took the yearbook from blank pages to a bound book.',
      story: 'I found a way for everyone in high school to not forget me: sign my name in every single yearbook, as the director.',
      wins: ['300+ <b>students photographed</b>', '<b>Two-week shoot</b>, externally coordinated', 'Full <b>creative direction</b>', 'Blank pages to a <b>bound publication</b>'],
      credits: 'Special thanks to <b>Hien Vu</b>, Head of Design, Student Council, and <b>Vu Quang Anh</b>, Vice Head of Media, Student Council.',
      media: [
        { src: I('mine.jpg'), cap: 'my page', ar: 1.41 },
        { src: I('yearbook-bts.jpg'), cap: 'behind the scenes', ar: 1.477 },
        { src: I('product.jpg'), cap: 'the finished book', ar: 1.169 },
        { src: I('yearbook-video.mp4'), cap: 'the film', kind: 'video', ar: 0.562, poster: I('posters/yearbook-video.jpg') }
      ],
      links: []
    },
    {
      id: 'freelance', cat: 'Other', color: '#4E7A5A', ink: '#EEF3EC',
      title: 'Freelance', stackTitle: 'Freelance', stackMeta: 'Web &amp; UI-UX Designer · Nov 2025 – Present',
      role: 'Web &amp; UI-UX Designer · Builder', when: 'Nov 2025 – Present',
      tags: ['Web Design', 'UI-UX', 'Front-end', 'Prototyping'],
      short: 'Client web design, plus things I build for fun with Claude.',
      story: 'People helped me with my applications, now it’s my turn. Client web and UI-UX projects, plus small tools I build for fun. Case studies coming soon.',
      winsLabel: 'What I make',
      wins: ['Client <b>web design and UI-UX</b> projects', '<b>Mandarin stroke order</b> - a tool for practising character strokes', '<b>TheseStreets</b> - a landing page', '<b>Folks</b> - your guide to studying abroad in Taiwan (coming soon)'],
      media: [
        { src: I('thesestreets-landing.jpg'), cap: 'TheseStreets, landing page', ar: 1.5, url: 'https://nhi312.github.io/TheseStreets/index.html' },
        { src: I('mandarin-stroke-order.jpg'), cap: 'Mandarin stroke order', ar: 1.5, url: 'https://nhi312.github.io/mandarinstrokeorder/' }
      ],
      links: [['TheseStreets', 'https://nhi312.github.io/TheseStreets/index.html'], ['Mandarin stroke order', 'https://nhi312.github.io/mandarinstrokeorder/']]
    },
    {
      id: 'framing', cat: 'Other', color: '#8C8C3E', ink: '#1D1D0C',
      title: 'Framing Projects', stackTitle: 'Framing Projects', stackMeta: 'Director &amp; Creator · 2024 – Present',
      role: 'Director &amp; Creator', when: '2024 – Present',
      tags: ['Video', 'Direction', 'Editing', 'Storytelling'],
      short: 'I direct, so I edit. Being a content creator seems fun during this era.',
      story: 'Every video I’ve directed lives in this folder. The name comes from the fundamental question of filmmaking: what do you include in the frame, and what do you leave out?',
      winsLabel: 'In this folder',
      wins: ['<b>Teacher’s Day 2024</b> - "10 things Mr. Thuy can’t live without"', '<b>Bookweek 2024 podcast</b> - "The Spoiled Kid"', '<b>Snapshots from Taiwan</b> - life in Taipei'],
      media: [
        { src: I('teacher-day-2024-mr-thuy.jpg'), cap: 'Teacher’s Day 2024, behind the scenes', ar: 0.75 },
        { src: I('teacher-day.mp4'), cap: 'Teacher’s Day 2024', kind: 'video', ar: 1.778, poster: I('posters/teacher-day.jpg') },
        { src: I('podcast.mp4'), cap: 'The Spoiled Kid', kind: 'video', ar: 1.778, poster: I('posters/podcast.jpg') },
        { src: I('vlog.mp4'), cap: 'Snapshots, Taipei', kind: 'video', ar: 1.778, poster: I('posters/vlog.jpg') }
      ],
      links: []
    }
  ];

  ENTRIES.forEach((e, i) => { e.no = String(i + 3).padStart(2, '0'); });

  window.ARCHIVE = { OBJECTS, FRAMES, STAGES, ENTRIES, I, A };
})();
