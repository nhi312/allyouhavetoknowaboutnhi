# 📁 Nhi's Portfolio — Owner's Manual

Hi Nhi! This is your portfolio website. This guide walks you through **everything** you'll need to maintain it yourself — zero coding experience assumed. Save this file, you'll come back to it!

---

## 📦 Your folder structure

```
portfolio/
├── index.html          ← the landing page
├── works.html          ← the works & projects page
├── README.md           ← this guide
└── images/             ← all your photos, certificates, videos
    ├── me.jpg
    ├── taiwan-moe-scholarship.jpg
    ├── josenian-panelists-choice.jpg
    ├── josenian-participation.jpg
    ├── virtue-spring-2025-k-hospital.jpg
    ├── teacher-day-2024-mr-thuy.jpg
    ├── senior-prom-2024-epiphany.jpg
    └── senior-prom-2025-luminara.jpg
```

---

## 🛠️ One-time setup

1. **Code editor:** install **[VS Code](https://code.visualstudio.com/)** — free. Open your `portfolio` folder with **File → Open Folder**.
2. **Preview:** just double-click `index.html` to open it in your browser.
3. **GitHub account:** sign up at [github.com](https://github.com) if you don't have one.

---

# 🖼️ PART 1 — Working with images

This is the #1 thing that trips beginners up. Read carefully!

## Rule #1: Filenames must match EXACTLY

GitHub Pages (where your site will live) is **case-sensitive**. That means:

- ✅ `me.jpg` in your folder + `me.jpg` in the HTML = works
- ❌ `Me.JPG` in your folder + `me.jpg` in the HTML = **broken image**
- ❌ `me photo.jpg` (space in filename) = **may break**

### Safe filename rules:

| Rule | Good | Bad |
|------|------|-----|
| All lowercase | `graduation.jpg` | `Graduation.JPG` |
| Dashes, not spaces | `senior-prom-2024.jpg` | `senior prom 2024.jpg` |
| No special characters | `vinschool-photo.jpg` | `vinschool's photo!.jpg` |
| English letters only | `teacher-day.jpg` | `ngày-nhà-giáo.jpg` |

## Rule #2: Convert HEIC → JPG before uploading

iPhone photos are often `.HEIC` format, which browsers can't display. Convert them first:

- Use **[cloudconvert.com/heic-to-jpg](https://cloudconvert.com/heic-to-jpg)** (free, no signup)
- Or on iPhone: **Settings → Camera → Formats → "Most Compatible"** so new photos save as JPG directly

## Rule #3: Keep file sizes under 1 MB per image

Big images make your site slow. Before uploading, resize and compress:

- **[squoosh.app](https://squoosh.app/)** — free, drag-and-drop, gives you a slider to pick quality
- Good target: **1200-1600px wide**, **80-85% quality**, result under **500 KB**

---

## 📤 How to add an image to GitHub (the proper way)

Here's the full beginner-friendly flow using **GitHub Desktop** (easiest — no command line needed).

### Step-by-step:

**1. Prepare the image on your computer.**
- Rename it: lowercase, dashes, no spaces (e.g. `new-project-photo.jpg`)
- Make sure it's `.jpg` or `.png` (not `.HEIC`)
- Check the file size is reasonable (< 1 MB)

**2. Drag the image into your local portfolio folder.**
- Open the folder on your computer where `index.html` lives
- Drop the image inside the **`images/`** subfolder

**3. Edit the HTML to use the new image.**
- Open `index.html` or `works.html` in VS Code
- Find where you want to use it — see the templates below
- Use the path **`images/your-filename.jpg`** (always prefix with `images/`)

**4. Save + push to GitHub.**
- Open **GitHub Desktop**
- You'll see your changes listed in the left panel
- At the bottom: write a summary like "added new project photo"
- Click **Commit to main** → then **Push origin** (top button)
- Wait ~60 seconds, your live site updates automatically ✨

### 🐛 Troubleshooting "broken image" bugs:

**Image shows as a little broken-picture icon?**
- Open your live site in the browser → right-click the broken image → "Open image in new tab"
- Look at the URL. If it says something like `.../images/Photo.JPG` but your file is `photo.jpg`, the case is mismatched
- **Fix:** either rename the file OR update the HTML — they must be identical

**Image loads locally but not on GitHub?**
- 99% of the time it's a **case mismatch** (Mac is forgiving, GitHub isn't)
- Check the filename has no spaces or special characters

**Image is blurry or huge?**
- The original file is too big. Run it through [squoosh.app](https://squoosh.app/)

---

# 📝 PART 2 — Where the content lives

Every page is one HTML file with three zones. You'll only ever edit the **middle** (content):

| Zone | Location | What to touch? |
|------|----------|----------------|
| Top — styling | `<style>...</style>` | Don't touch unless you know CSS |
| Middle — content | `<body>...</body>` | ✏️ Edit this |
| Bottom — logic | `<script>...</script>` | ✏️ Edit project data (see Part 4) |

Use **Ctrl+F** (Cmd+F on Mac) to search inside a file and jump to what you want to change.

---

# 🎓 PART 3 — Adding photos / certificates to Education

### To add a new school:
Open `index.html`, search for **`<!-- high school -->`** (or similar), then copy and paste a full `<div class="tl-item">...</div>` block to duplicate the structure. Edit the school name, years, GPA, and awards list.

### To add a new photo/certificate to an existing pin-board:

1. Drop your image into `images/` (follow naming rules above)
2. In `index.html`, press **Ctrl+F**, search for the school's pin-board. Look for `<div class="pin-items">`
3. Paste this snippet **inside** the pin-items div, before it closes:

```html
<div class="pin-slot cert yellow">
  <div class="inner has-image">
    <img src="images/your-file.jpg" alt="Description of the image" />
  </div>
  <div class="caption">Caption shown below the photo</div>
</div>
```

**Customize:**

| Part | What to change | Options |
|------|----------------|---------|
| `cert` | Keep for certificates, **remove** for photos | (parchment tint vs plain white) |
| `yellow` | Pushpin color | `red`, `blue`, `green`, `yellow`, `pink`, `purple` |
| `images/your-file.jpg` | Image path | Must match filename exactly |
| `alt="..."` | Screen-reader description | Describe what the image shows |
| Caption text | What appears under the polaroid | Usually the event/cert name |

**Pro tip — make captions match your filenames:**
If your file is `senior-prom-2025-luminara.jpg`, a natural caption is:
> `Senior Prom 2025 · Luminara — Behind the Campaign`

This keeps the file and caption feeling connected, and if you ever lose the caption, the filename tells the story.

---

# 🎨 PART 4 — Adding a new project (the new template!)

Each project has **two pieces**: a **folder** on the shelf + **cork-board content** when clicked. You'll edit `works.html` for both.

## 🧩 Step 1 — Add the folder to the shelf

Open `works.html`, search for **`<article class="folder c7"`** (the last existing folder). Paste this block right above `<div class="shelf-plank"></div>`:

```html
<article class="folder c4" data-project="my-new-project" tabindex="0" role="button" aria-label="Open My New Project">
  <div class="clip"></div>
  <div class="folder-tab"></div>
  <div class="folder-body"></div>
  <div class="paper-peek">
    <span class="margin-line"></span>
    <span class="peek-label">notes</span>
    <div class="folder-doodle">🚀</div>
    <div class="folder-lines"><span></span><span></span><span></span><span></span></div>
  </div>
  <div class="folder-front">
    <div class="folder-emoji">✦</div>
    <div class="folder-number">project · 04</div>
    <div class="folder-title">My New Project</div>
  </div>
  <span class="read-more">read more <span class="arr">→</span></span>
</article>
```

**What to customize:**

| Field | What it is | Options |
|-------|------------|---------|
| `c4` | Folder color | `c1` red, `c2` orange, `c3` yellow, `c4` green, `c5` teal, `c6` blue, `c7` purple, `c8` pink |
| `data-project="my-new-project"` | 🔑 **Unique ID** (no spaces, lowercase) | Must match the key in Step 2! |
| `🚀` / `✦` | Emojis | Any emoji you want |
| `project · 04` | Small label on cover | `project · 05`, `project · 06`, etc. |
| `My New Project` | Big title on cover | Whatever you want |

## 🧩 Step 2 — Add the cork-board content (NEW TEMPLATE!)

Search for **`const projects = {`** in `works.html`. Inside it, paste your project after `p3: { ... },`:

### 🎯 The Template

```javascript
"my-new-project": {
  title:     "My New Project",
  position:  "Designer & Editor",
  timeframe: "Mar 2024 — Jun 2024",
  tags:      ["Figma", "Adobe Premiere", "Teamwork"],
  media: [
    { type: "image", src: "images/project-photo-1.jpg", caption: "opening ceremony",  pin: "red" },
    { type: "image", src: "images/project-photo-2.jpg", caption: "team at work",      pin: "blue" },
    { type: "image", src: "images/project-photo-3.jpg", caption: "final moment",      pin: "green" },
    { type: "video", src: "images/project-reel.mp4",    caption: "highlight reel",    pin: "yellow" }
  ],
  description: `
    <span class="story-label">✦ the story</span>
    <p>One or two paragraphs about <strong>what the project was</strong> — the context, the goal.</p>

    <h3>my role</h3>
    <p>What you actually did: led a team, designed visuals, wrote copy, shot & edited videos, whatever it was.</p>

    <h3>the result</h3>
    <p>What happened? Numbers if you have them: "raised 50M VND", "reached 1000 students", "won X award".</p>
  `
}
```

### 📋 Field-by-field reference

| Field | Required? | What it does | Example |
|-------|-----------|--------------|---------|
| `"unique-id"` | ✅ **required** | Matches `data-project` on folder | `"luminara-2025"` |
| `title` | ✅ | The big name shown on the cork board | `"Luminara — Senior Prom 2025"` |
| `position` | optional | Your role, shown as a teal pill | `"Campaign Lead"` |
| `timeframe` | optional | When it happened, shown next to position | `"Feb — May 2025"` |
| `tags` | optional | Yellow pill labels (skills, tools) | `["Figma", "Leadership"]` |
| `media` | optional | Array of 3-4 photos/videos | see below |
| `description` | optional | Full story — HTML allowed | see below |

### 🎞️ The `media` array

Each media item looks like:

```javascript
{ type: "image", src: "images/xyz.jpg", caption: "what this shows", pin: "red" }
```

| Property | Values | Notes |
|----------|--------|-------|
| `type` | `"image"` or `"video"` | video auto-plays, loops, muted |
| `src` | `"images/filename.jpg"` | Always prefix with `images/` |
| `caption` | any short text | Shown below the polaroid |
| `pin` | `red`, `blue`, `green`, `yellow`, `pink`, `purple` | Pushpin color |

**3-4 media items is the sweet spot** — the grid looks balanced. Too few feels sparse, too many feels crowded.

**🎬 Video tips:**
- Accepted formats: `.mp4` (best), `.webm`, `.mov`
- Keep videos **under 10 MB** or GitHub will complain
- Recommended size: 720p or 1080p vertical for portrait reels
- Videos autoplay silently and loop — if you want full audio/controls, the user can interact with them

### 📖 The `description` field

It's HTML inside a template string (the backticks `` ` ``). Useful tags:

- `<p>text</p>` — a paragraph
- `<strong>bold</strong>` — bold (also adds yellow highlighter)
- `<em>italic</em>` — italic
- `<h3>section heading</h3>` — small orange heading
- `<br/>` — line break within a paragraph
- `<a href="https://url.com" target="_blank">link text</a>` — opens in new tab
- `<span class="story-label">✦ the story</span>` — the red "the story" tag at the top

**Template you can copy:**

```html
<span class="story-label">✦ the story</span>
<p>What the project was about in 1-2 sentences.</p>

<h3>my role</h3>
<p>What you specifically did.</p>

<h3>the result</h3>
<p>What outcome or impact came from it.</p>
```

## 🧩 Step 3 — Save & preview

1. Save `works.html` in VS Code (Ctrl+S)
2. Refresh `works.html` in your browser
3. Your new folder should appear on the shelf
4. Hover it to see the "read more" CTA pop up
5. Click it to see your cork-board

If something's broken: press **F12** in Chrome/Firefox → **Console** tab. Any red errors will tell you what's wrong (usually a missing comma or bracket).

---

# 🚀 PART 5 — Publishing on GitHub Pages

GitHub Pages gives you a **free public URL** like `https://yournickname.github.io`.

## 🔧 First-time setup

**1. Install GitHub Desktop.**
Download from [desktop.github.com](https://desktop.github.com/) → install → sign in.

**2. Create a new repository.**
On [github.com](https://github.com), click the green **New** button.
- **Repository name:** `yourusername.github.io` ← *exact format!*
  (Example: if your GitHub username is `nhihoang`, name it `nhihoang.github.io`)
- Set to **Public**
- Leave "Initialize with README" unchecked
- Click **Create repository**

**3. Clone it to your computer.**
- Open GitHub Desktop → **File → Clone repository → URL**
- Paste your repo URL (e.g. `https://github.com/nhihoang/nhihoang.github.io`)
- Choose a folder on your computer (Desktop is fine)
- Click **Clone**

**4. Move your portfolio files into the cloned folder.**
Copy these into the newly-cloned folder:
- `index.html`
- `works.html`
- `README.md`
- the whole `images/` folder

**5. Push to GitHub.**
- Back in GitHub Desktop, you'll see all files listed
- Write a summary: "initial portfolio upload"
- Click **Commit to main**
- Click **Push origin**
- Wait ~1 minute

**6. Enable Pages.**
- Go to your repo on github.com
- **Settings → Pages** (left sidebar)
- Under **Source**: select **Deploy from a branch**
- Branch: `main`, folder: `/ (root)` → **Save**
- Wait 1-2 minutes, then visit `https://yourusername.github.io` 🎉

## 🔄 Making updates later

Once it's set up, the loop is dead simple:

```
Edit a file → Save → Commit to main → Push origin → Site updates
```

1. Edit `index.html` or `works.html` in VS Code
2. Save (Ctrl+S)
3. Open GitHub Desktop — it automatically detects changes
4. Write a summary like "added new project"
5. **Commit to main** → **Push origin**
6. Live site updates within ~60 seconds

That's it. You never need to touch the command line.

---

# 🎨 Quick reference — color cheatsheet

Use these short names everywhere:

| Class | Color | Best for |
|-------|-------|----------|
| `c1` / `red` | 🔴 red | energy, urgency, love |
| `c2` / `orange` | 🟠 orange | warmth, creativity |
| `c3` / `yellow` | 🟡 yellow | happy, highlight |
| `c4` / `green` | 🟢 green | growth, balance |
| `c5` / `teal` | 🐬 teal | calm, professional |
| `c6` / `blue` | 🔵 blue | trust, focus |
| `c7` / `purple` | 🟣 purple | creative, dreamy |
| `c8` / `pink` | 💗 pink | playful, soft |

---

# 🆘 Common problems

**"My image doesn't show up online."**
→ Filename case mismatch. `Me.jpg` ≠ `me.jpg`. Check both file and HTML are lowercase.

**"My new project folder shows 'coming soon' even though I added content."**
→ The `data-project="..."` on the folder doesn't match the `"key"` in `const projects = {}`. Make them identical.

**"My site is missing on GitHub Pages (404 error)."**
→ Either repo isn't named `username.github.io` OR `index.html` isn't in the root (it's inside another folder).

**"Video doesn't autoplay on iPhone."**
→ iPhones need `playsinline` attribute (already in the template). Also, videos with audio might not autoplay without user interaction — this is a browser rule, not something we can change.

**"Nothing I do updates the live site."**
→ Did you click **Push origin** in GitHub Desktop after committing? Without the push, nothing reaches GitHub.

**"Everything broke after I edited works.html."**
→ You probably deleted a comma or closing bracket in the `projects` object. Open browser console (F12) to see the error. Or restore the file from backup / git history.

---

# 💬 Saving yourself from disasters

1. **Make backups before big edits.** Copy the whole folder to Desktop as `portfolio-backup-2026-04-17` or similar before major changes.

2. **Use GitHub as your safety net.** Every time you push, you create a save point. To roll back: in GitHub Desktop → **History** → right-click an old commit → **Revert changes**.

3. **Test locally first.** Always double-click `index.html` and refresh to check your changes before pushing to GitHub.

---

Good luck with the portfolio, Nhi! It's yours to grow — feel free to make it messier, more personal, more you.

— your friendly Claude ♡
