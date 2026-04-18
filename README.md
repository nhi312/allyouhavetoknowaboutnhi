# 📁 Nhi's Portfolio — Owner's Manual

Hi Nhi! This is your portfolio website. This guide walks you through **everything** you need to know — zero coding knowledge assumed. Save this file, you'll come back to it!

---

## 📦 What's in this folder

```
portfolio/
├── index.html          ← the landing page (folders on the shelf)
├── works.html          ← the works & projects page
├── README.md           ← this file (just for you)
└── images/             ← all your photos & certificates
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

## 🛠️ Tools you need (one-time setup)

1. **A code editor.** Install **[VS Code](https://code.visualstudio.com/)** — it's free and friendly. Open your `portfolio` folder with `File → Open Folder`.
2. **A browser.** Chrome, Safari, Firefox — any works. To preview your site, just double-click `index.html`.
3. **(Later, for GitHub)** A GitHub account at [github.com](https://github.com). Free.

That's it. No Node.js, no npm, no build tools. This is a pure HTML website — open any `.html` file in a browser and it just works.

---

## 🧠 A 60-second tour of how the site is built

Every page is a **single HTML file**. Inside the file, there are three parts stacked on top of each other:

| Section | What lives here |
|---|---|
| `<style>...</style>` at the top | Visual design — colors, fonts, layout |
| `<body>...</body>` in the middle | The actual content you see — text, images, folders |
| `<script>...</script>` at the bottom | The logic — what happens when you click folders |

**You will almost never need to touch `<style>` or `<script>`.** Everything you want to edit lives in one of two places:

- **`index.html`** — change the About Me text, add more schools to Education, edit the timeline
- **`works.html`** — add new projects

Below are copy-paste templates for both.

---

## ✍️ How to edit text (the easy stuff)

Open `index.html` in VS Code, then press **Ctrl+F** (or Cmd+F on Mac) to search for the exact words you want to change.

For example, to change your About Me tagline:
1. Press **Ctrl+F**, search for `I craft simple things`
2. Type a new version right over the old text
3. Save with **Ctrl+S**
4. Refresh your browser to see the change

That's the whole workflow for any text change. Every change = edit → save → refresh.

---

## 📸 How to add a new photo/certificate to an Education pin-board

Let's say you get a new scholarship and want to pin its certificate.

### Step 1 — put the image in the `images/` folder

Drag `my-new-cert.jpg` into the `images/` folder. Use a clear name, no spaces, lowercase.

> **Tip:** if you have an `.HEIC` file (iPhone photos), convert it to `.jpg` first. Use [cloudconvert.com](https://cloudconvert.com/heic-to-jpg) — free, no signup.

### Step 2 — open `index.html` and search for the right pin-board

Press **Ctrl+F**, search for **`wall of what I think is important`**. You'll find it twice — once under NCCU, once under Vinschool. Pick the right one.

### Step 3 — copy-paste this template right before `</div>` of `<div class="pin-items">`

```html
<div class="pin-slot cert yellow">
  <div class="inner has-image">
    <img src="images/my-new-cert.jpg" alt="My New Certificate" />
  </div>
  <div class="caption">My New Certificate 2026</div>
</div>
```

**What you can change in that snippet:**

- **`cert`** — keep this if it's a certificate. **Remove it** if it's a photo. (Certificates get a slight parchment tint.)
- **`yellow`** — the pushpin color. Options: `red`, `blue`, `green`, `yellow`, `pink`, `purple`. Mix them up!
- **`images/my-new-cert.jpg`** — the filename you put in step 1.
- **`alt="..."`** — describe the image (for accessibility). Usually the same as the caption.
- **`My New Certificate 2026`** — the caption shown under the polaroid.

Save and refresh. Done.

---

## 🗂️ How to add a new project (works.html)

This one has two parts: a **folder** on the shelf + the **pin-board content** inside it.

### Step 1 — add the folder on the shelf

Open `works.html`. Press **Ctrl+F** and search for **`<!-- add new projects below -->`** if you see that marker, OR search for **`<article class="folder c7"`** (the last existing folder).

Copy this block and paste it **right above** `<div class="shelf-plank"></div>`:

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

- **`c4`** — folder color. Options: `c1` (red), `c2` (orange), `c3` (yellow), `c4` (green), `c5` (teal), `c6` (blue), `c7` (purple), `c8` (pink).
- **`data-project="my-new-project"`** — a unique ID. No spaces, lowercase, use dashes.
- **`🚀`** and **`✦`** — emojis. Change to anything you like.
- **`project · 04`** — the label shown above the title.
- **`My New Project`** — the folder title.

### Step 2 — add the project's cork-board content

Scroll down in `works.html` and press **Ctrl+F** to find **`const projects = {`**. That's the JavaScript object holding all project details.

Find the line that looks like `p3: { ... },` and paste this **right after** it (keep the `};` at the end of the whole object):

```javascript
"my-new-project": {
  num: "project · 04",
  title: "My New Project",
  tags: ["React", "Figma", "2026"],
  description: `
    <h3>✦ what it is</h3>
    <p>A short paragraph about what this project does and why you made it.</p>
    <p><strong>What I learned:</strong> put interesting lessons here.</p>
  `,
  pins: [
    { type: "polaroid", pin: "red", icon: "📷", label: "screenshot 1", caption: "main view" },
    { type: "polaroid", pin: "blue", icon: "📱", label: "screenshot 2", caption: "mobile" },
    { type: "note", color: "yellow", title: "tools", body: "React, Figma,<br/>lots of coffee ☕" },
    { type: "note", color: "pink", title: "link", body: "<a href='https://example.com' target='_blank' style='color:#2a1f1a;text-decoration:underline;'>visit site →</a>" }
  ]
}
```

**CRITICAL:** the key name (`"my-new-project"` above) **must exactly match** the `data-project="..."` value you set on the folder in Step 1. They connect to each other.

**Customize the pins array:**

- **`type: "polaroid"`** — a photo card. Needs `pin` (color), `icon` (emoji), `label` (small text), `caption` (under the photo).
- **`type: "note"`** — a sticky note. Needs `color`, `title`, `body`. HTML works inside `body` so you can add links, line breaks (`<br/>`), bold (`<strong>`), etc.

**To use real images in a polaroid pin**, you'd need to modify the code that renders polaroids. For now, the pin placeholders just show an emoji + label. If you want real images in projects, tell me and I'll upgrade the template.

### Step 3 — preview

Save. Refresh `works.html` in your browser. Your new folder should be on the shelf. Click it → cork-board should open with your content.

---

## 🚀 Publishing on GitHub Pages (your portfolio goes LIVE on the internet!)

GitHub Pages is **free** and gives you a real URL like `https://yourname.github.io`. Here's how.

### One-time setup: install GitHub Desktop (easiest for beginners)

1. Download **[GitHub Desktop](https://desktop.github.com/)** → install → sign in with your GitHub account.

### Step 1 — create a new repository

On github.com, click the green **"New"** button to create a repository.

- **Repository name:** type `yourusername.github.io` — **important!** Replace `yourusername` with your real GitHub username. If your username is `nhihoang`, name the repo `nhihoang.github.io`.
- **Public** (required for free Pages)
- **Do not** tick "Add a README" — we already have one
- Click **Create repository**

GitHub will show you some commands. Ignore them and do this instead:

### Step 2 — clone it to your computer

1. Open GitHub Desktop
2. `File → Clone repository → URL`
3. Paste the URL of the repo you just made (e.g. `https://github.com/nhihoang/nhihoang.github.io`)
4. Pick a folder on your computer to save it (Desktop is fine)
5. Click **Clone**

Now you have an empty folder linked to GitHub.

### Step 3 — move your portfolio files into it

Open the folder GitHub Desktop just created. **Copy all of these into it:**

- `index.html`
- `works.html`
- `README.md` (this file)
- the whole `images/` folder

### Step 4 — push it

Back in GitHub Desktop, you'll see all your files in the left sidebar.

1. At the bottom, type a **Summary** like "first version of portfolio"
2. Click **Commit to main**
3. Click the big **Push origin** button at the top

Wait ~60 seconds. Your site is live at `https://yourusername.github.io` 🎉

### Step 5 — check if Pages is enabled

Go to your repo on github.com:
`Settings → Pages` (left sidebar) → make sure **"Source"** is set to **"Deploy from a branch"** and **"Branch"** is `main` + `/ (root)`. Click Save if you changed anything.

Give it 1–2 minutes, then visit `https://yourusername.github.io`.

### Making updates later

Every time you edit a file:
1. Save it
2. Open GitHub Desktop — it'll show your changes
3. Write a short summary ("added new project", "fixed typo")
4. **Commit to main** → **Push origin**
5. Site updates within a minute

---

## 🎨 Folder color cheat sheet

Use these class names in your HTML:

| Class | Color |
|-------|-------|
| `c1` | 🔴 red |
| `c2` | 🟠 orange |
| `c3` | 🟡 yellow |
| `c4` | 🟢 green |
| `c5` | 🐬 teal |
| `c6` | 🔵 blue |
| `c7` | 🟣 purple |
| `c8` | 💗 pink |

Same color names work for pin-slots and sticky-notes too.

---

## 🆘 Common problems & fixes

**"My image isn't showing up."**
- Check the file is actually in `images/` folder
- Check the filename in the HTML matches **exactly** — `Me.jpg` and `me.jpg` are different on GitHub!
- Refresh with **Ctrl+Shift+R** (hard refresh, bypasses cache)

**"The folder I added is broken / empty."**
- Check `data-project="..."` on the folder matches the key name in `const projects = { ... }` **exactly**
- Make sure you didn't delete a closing `}` or `;` in the JavaScript

**"GitHub Pages shows 404."**
- Make sure the repo name is exactly `yourusername.github.io`
- Make sure `index.html` is at the **top level** of the repo, not inside a subfolder

**"My HEIC photos won't display."**
- HEIC is an iPhone format browsers don't support. Convert to JPG at [cloudconvert.com](https://cloudconvert.com/heic-to-jpg).

---

## 🎥 Adding the Instagram vlog video

Download your reel as an `.mp4` (on phone: open reel → "..." → Save), then drop it in the `images/` folder named exactly **`vlog.mp4`**. The NCCU pin-board will automatically switch from the fallback card to the autoplaying silent loop.

---

## 💬 When in doubt

Save a backup of the whole folder before making big changes. That way if anything breaks, you can always revert.

Good luck with the portfolio! ♡

— your friendly Claude
