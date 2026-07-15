# HackerZ

A standalone, modern, email-inbox-style reader for
[Hacker News](https://news.ycombinator.com/), built with
[HeroUI](https://heroui.com/) (React + Tailwind CSS v4). No backend — it
fetches stories and comments live from the official
[HN Firebase API](https://github.com/HackerNews/API).

An always-3-pane dashboard shell, modeled on
[HeroUI's dashboard template](https://heroui.com/en/themes?template=dashboard):

- **Left: a collapsible icon-rail sidebar** — Top/New/Best/Ask/Show/Jobs as
  nav items, with Settings and About pinned at the bottom. The logo doubles
  as a home button (goes to Top Stories). Collapse/expand lives in the
  header, next to the list's title.
- **Middle: the story list** — one row per story, favicon as avatar, title as
  subject, domain/author/time as the "from" line, points and comment count
  stacked vertically on the right (out of the title's way). The whole row is
  a single click target that opens the comments.
- **Right: a resizable reading panel, always open** — a large welcome screen
  (live clock, a "good afternoon"-style greeting, the date, and day-of-year)
  until you pick a story, like Apple Mail/Files on iPad. On wide windows it's
  a persistent side-by-side split-view — drag the divider to resize it — on
  narrow ones the story takes over as a full-screen slide-over instead (the
  welcome screen is a wide-window-only concept; there's no room for 3 columns
  on a narrow one). The story is the header message, with an **Open** (new
  tab) button always present, plus two off-by-default, opt-in buttons (see
  below): **Read** (opens the live article in a large in-app dialog via an
  `<iframe>`) and **Archive** (same dialog, pointed at the page's
  [Wayback Machine](https://web.archive.org/) snapshot instead). Comments are
  nested replies with collapse/expand per sub-thread. Clicking another row
  swaps the panel's content in place without closing it, and the active row
  stays highlighted.

Read and Archive are **off by default** — each has its own toggle under
Settings → Reader tools — to keep the comments screen fast and simple by
default: Archive's check and Read's iframe both cost something (a network
request, an embedded page), so opting in is on the reader, not automatic.

**Archive** only appears once a snapshot is confirmed to exist — it checks
Archive.org's own (CORS-open) [availability API](https://archive.org/wayback/available)
before showing the button, rather than guessing (and skips that request
entirely when the Archive toggle is off).

**Read** can't be pre-checked the same way: whether a site blocks embedding
is set via `X-Frame-Options`/CSP response headers, which aren't readable
cross-origin from client-side JS (and there's no reliable "blocked" event on
`<iframe>` either — a blocked frame still fires `load`). The only real way to
check is server-side. So when enabled, Read is always shown, with an "Open in
new tab" fallback link in the dialog for when it doesn't render.

Comment pages are `/item?id=…`; list pages are `/`, `/news`, `/newest`,
`/best`, `/ask`, `/show`, `/jobs`. All routing is client-side (no full page
reload); the browser's back/forward buttons, and Escape to close the panel,
work as expected.

The Settings item opens a larger dialog, similar in spirit to the theme
switcher on [heroui.com](https://heroui.com/):

- **Appearance** — Light / Dark / System
- **Accent color** — 16 presets (yellow by default) at matched
  lightness/chroma, so every color contrasts the same against text; bright
  ones (yellow, amber, orange, cyan) automatically switch to dark foreground
  text instead of white so they stay legible
- **Readability** — font size (Small/Medium/Large/X-Large, scales the whole
  UI) and row spacing (Comfortable/Compact)
- **Reader tools** — the Read/Archive toggles described above, off by default

All of it — theme, accent, font size, density, sidebar collapsed state,
reader-tool toggles, and panel width — persists across visits via
`localStorage`.

## Develop

```bash
npm install
npm run dev
```

Opens the app at `http://localhost:5173`.

## Build

```bash
npm run build
```

Produces a `dist/` folder — a plain static site (`index.html` + `assets/` +
`icons/`) deployable to any static host (Vercel, Netlify, Cloudflare Pages,
GitHub Pages, S3, etc.).

`npm run preview` serves that `dist/` build locally to sanity-check it before
deploying.

## Deploying

Because routing is entirely client-side, your host needs to serve
`index.html` for *every* path (`/newest`, `/item`, etc.), not just `/` —
otherwise a direct visit or refresh on those URLs 404s. This repo includes:

- `public/_redirects` — picked up automatically by Netlify and Cloudflare
  Pages
- `vercel.json` — a rewrite rule for Vercel

Deploying to something else (GitHub Pages, S3 + CloudFront, nginx, ...)?
Configure an equivalent "serve `index.html` for unknown paths" rule for that
host.
