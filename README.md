# Generative AI & LLMs for Financial Markets — KDD 2026 Tutorial Website

A fast, dependency-free static website for the KDD 2026 lecture-style tutorial
*"Generative AI and Large Language Models for Financial Markets: From Behavioral
Prediction to Autonomous Trading."*

## What's here

```
website/
├── index.html          # all content, single page
├── css/styles.css      # design system (no framework)
├── js/main.js          # nav, scroll-reveal, animated hero, copy-cite (vanilla JS)
├── assets/
│   ├── favicon.svg
│   └── og-image.svg    # social-share preview
├── .nojekyll           # serve files as-is on GitHub Pages
└── README.md
```

No build step, no npm, no dependencies. Everything is static and loads instantly.
Fonts come from Google Fonts over CDN.

---

## Preview locally

From inside the `website/` folder:

```bash
python3 -m http.server 8080
```

Then open <http://localhost:8080>. (Any static server works; opening
`index.html` directly also works, though a server matches production better.)

---

## Deploy on GitHub Pages (recommended)

GitHub Pages is free, the de-facto standard for KDD tutorial sites, and needs no
configuration beyond a toggle.

### Option A — dedicated repository (simplest)

1. Create a new public repo, e.g. `genai-finance-kdd2026`.
2. Put the **contents of this `website/` folder at the repo root** (so
   `index.html` is at the top level), then push:
   ```bash
   cd website
   git init
   git add .
   git commit -m "KDD 2026 tutorial website"
   git branch -M main
   git remote add origin https://github.com/<you>/genai-finance-kdd2026.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment**. Set
   **Source = Deploy from a branch**, **Branch = `main` / `(root)`**, Save.
4. Wait ~1 minute. Your site is live at:
   `https://<you>.github.io/genai-finance-kdd2026/`

### Option B — keep it inside this paper repo

If you'd rather not make a separate repo, push this whole project and in
**Settings → Pages** choose **Branch = `main` / `/website` folder** (GitHub lets
you publish from `/root` or `/docs` — to use an arbitrary folder, rename
`website/` to `docs/` and pick `/docs`).

```bash
# from the project root
git mv website docs   # if you choose the /docs route
```

### Custom domain (optional)

Add a file named `CNAME` (no extension) containing your domain, e.g.
`genai-finance.org`, then point a DNS `CNAME` record at `<you>.github.io`.

---

## Alternative one-click hosts

Drag-and-drop the `website/` folder onto either and you get a URL in seconds:

- **Netlify Drop** — <https://app.netlify.com/drop>
- **Cloudflare Pages** — connect the repo, framework preset = *None*, output dir = `/`
- **Vercel** — `vercel` CLI, framework = *Other*

All three serve this site as-is.

---

## Updating content

Everything is hand-editable HTML — no templating language to learn.

- **Slides / notebooks:** in `index.html`, find the `#resources` section. Each
  card is an `<a class="resource …>`. Replace the `<a>` (currently
  `resource--soon`) with a real link and drop the `resource__status` "Coming
  soon" line:
  ```html
  <a class="resource" href="https://colab.research.google.com/…" target="_blank" rel="noopener">
  ```
- **Citation:** update the `<code id="bibtex">` block once the ACM DOI page is live.
- **Colors / fonts:** all tokens live at the top of `css/styles.css` under `:root`.
- **Speaker links:** wrap a name in an `<a>` to link to a personal page or ORCID.

---

## Notes

- Respects `prefers-reduced-motion` (disables the animated hero and reveals).
- Fully responsive down to ~360px.
- Meets the KDD requirement set: presenters + bios, tutorial outline, and what
  participants will learn — plus schedule, resources, and citation.
