# Handover: A.W. Graf AG website, variant 2d "Index-Kacheln"

> **Status:** the site has since been deliberately restyled (type scale, mobile spacing, shared left edge, Kontakt link instead of the burger from 768px, phone crop of the hero). The values below describe the original design. For the current look, the code and the updated baselines in `screenshots/` are the source of truth; `screenshots/original-artboard-1280.png` stays as the record of the design as drawn and is no longer tested against.

You are implementing a finished design: a one-pager with a full-height photo hero, a centered intro, two content tiles, three values, and a dark team/contact block. Goal: near pixel-perfect at desktop, fully mobile friendly. Do not redesign, change copy or add sections.

## 1. Sources of truth

| File | What it is |
|---|---|
| `reference/original-artboard.html` + `screenshots/original-artboard-1280.png` | The design exactly as drawn: one fixed 1280px desktop artboard. There was no mobile design. |
| `reference/index.html` | **Responsive reference and the thing to match.** At a 1280px viewport it renders identically to the artboard (verified: same 3323px height, 0.02% pixel difference, only the arrow and image resampling). Below 1280 it contains the responsive behaviour defined in §5. Above 1280 the hero goes full-bleed and content stays centered at 1280. |
| `reference/screenshots/` | `desktop-1440`, `desktop-1280`, `tablet-768`, `mobile-390` (full page + `-fold`), `tablet-768-menu-open`, `mobile-390-menu-open`. Mobile at @2x. |
| `public/` | Production assets (fonts, images, logo). Copy as-is. |
| `reference/assets/` | Original assets, only for re-export. |

`reference/index.html` is already written with classes and tokens, so it's a good base to port. **Don't ship it unchanged**; port it to components.

## 2. Stack

- Next.js App Router + TypeScript, `output: 'export'`, deploy on Vercel.
- Plain CSS: `globals.css` with the tokens below + CSS Modules per section. If the repo already uses Tailwind, map tokens exactly.
- Fonts via `next/font/local` from `public/fonts` (self-hosted, no requests to Google; matters for Swiss nDSG / GDPR).
- Images: `<picture>`/`next/image` (`unoptimized: true` for static export) with the pre-sized files in `public/images`.
- `lang="de-CH"`, Swiss orthography (ss, no ß). Copy verbatim into one `content.ts`.
- Client JS only for the menu (one small client component).

## 3. Tokens

```css
:root {
  --bg: #F6F3EC;          /* page */
  --tile: #ECE7DC;        /* Tätigkeit tiles */
  --ink: #171715;         /* text, team/contact block, footer, menu overlay */
  --hero-fallback: #2a2a27;
  --on-dark-60: rgba(246,243,236,0.60);   /* <dt> labels */
  --on-dark-65: rgba(246,243,236,0.65);   /* footer text, menu meta */
  --on-dark-rule: rgba(246,243,236,0.12); /* footer top border */
  --sans: 'Inter', system-ui, sans-serif;     /* 400, 500 */
  --serif: 'Newsreader', Georgia, serif;      /* variable, opsz axis, use 400 */

  --max: 1280px;                              /* content width = artboard width */
  --sec-y: clamp(88px, 10.9375vw, 140px);     /* 140 at 1280 */
  --pad-64: clamp(24px, 5vw, 64px);           /* 64 at 1280 */
  --pad-44: clamp(24px, 3.4375vw, 44px);      /* 44 at 1280 */
  --frame: clamp(12px, 1.5625vw, 20px);       /* 20 at 1280 */
}
```

Every fluid value is written so it hits the artboard value exactly at 1280 and its mobile value at ~390. Don't round them.

Base: `body { font: 400 17px/1.6 var(--sans); background: var(--bg); color: var(--ink); -webkit-font-smoothing: antialiased }`. Links: no underline; hover `text-decoration: underline; text-underline-offset: 4px`. `:focus-visible { outline: 2px solid currentColor; outline-offset: 4px }`.

Keep Newsreader's optical-size axis active (default `font-optical-sizing: auto`); the 132px headline depends on it.

### Type

| Role | Font | Size (1280 → mobile) | Line-height | Other |
|---|---|---|---|---|
| Hero H1 | serif 400 | `clamp(56px, 10.3125vw, 132px)` | 0.95 | -0.02em, cream, forced break after "Immobilien" |
| Section H2 | serif 400 | `clamp(36px, 4.0625vw, 52px)` | **1.6** desktop, 1.2 below 768 | the 1.6 is inherited in the design and sets the vertical rhythm; keep it on desktop |
| Tile H3 | serif 400 | `clamp(30px, 3.125vw, 40px)` | 1.6 desktop, 1.2 below 768 | |
| Eyebrow | sans 400 | 13px | 1.6 | 0.18em, uppercase |
| Body | sans 400 | 17px | 1.6 | |
| Values label | sans 500 | 17px | 1.6 | |
| Header nav | sans 400 | 15px | 1.6 | cream |
| Team lead | serif 400 | `clamp(21px, 2.03125vw, 26px)` | 1.6 | |
| Footer | sans 400 | 14px | 1.6 | `--on-dark-65` |

## 4. Sections (values at 1280)

1. **Hero** (`<header>`), full-bleed. Height `clamp(560px, 100svh, 800px)` (800 in the design). Photo `object-fit: cover`, centered; overlay gradient `linear-gradient(180deg, rgba(0,0,0,.5) 0%, rgba(0,0,0,.2) 30%, rgba(0,0,0,.2) 45%, rgba(0,0,0,.72) 100%)`. Inner content sits in a centered 1280 container:
   - Top bar: `position:absolute; padding: 28px var(--pad-44)`, space-between. White logo, height 56px (209px wide). Nav: Über uns, Tätigkeit, Werte, Team, then a hamburger (two 1px cream lines, 26px wide, 5px apart), `gap: 32px`. The hamburger needs a 44×44 hit area without moving the lines (negative margin).
   - H1 "Immobilien<br>mit Bestand." absolutely positioned `left/right: var(--pad-44); bottom: 56px`.
   - Not sticky; the header scrolls away with the hero (as designed).
   - LCP element: `fetchpriority="high"`, never lazy.
2. **Über uns** `#ueber-uns`: `padding: var(--sec-y) var(--pad-64)`, centered column, `gap: 28px`: eyebrow, H2 "Ein Unternehmen aus Illnau.", paragraph `max-width: 58ch; text-wrap: pretty`, CTA "In Kontakt treten →" (`inline-flex; gap: 10px; margin-top: 12px; padding-bottom: 4px; border-bottom: 1px solid var(--ink)`, no underline on hover). Draw the arrow as the inline SVG from the reference: the subset fonts don't contain "→", so the glyph would fall back to different system fonts.
3. **Tätigkeit** `#taetigkeit`: `padding: 0 var(--frame) var(--sec-y)`, column, `gap: 48px`. Heading block indented by `calc(var(--pad-64) - var(--frame))` so the text lines up with the other sections, `gap: 20px`. Tiles: 2-col grid, `gap: 20px`; each tile `--tile` bg, padding `clamp(40px,5vw,64px) clamp(24px,4.375vw,56px)`, column `gap: 20px`, H3 + paragraph.
4. **Werte** `#werte`: `padding: 0 var(--pad-64) var(--sec-y)`, column, `gap: 56px`. Heading block `gap: 20px`. List: 3-col grid, `gap: 48px`; each item `border-top: 1px solid var(--ink); padding-top: 20px`, column `gap: 12px`, label 500 + text.
5. **Team / Kontakt** `#team` (the contact block inside is `#kontakt`, the menu's "Kontakt" target): full-bleed `--ink` background; inside the 1280 container `padding: var(--frame)`, 2-col grid `gap: 20px`.
   - Left: square image (`aspect-ratio: 1`, cover). Lazy-load.
   - Right: cream text, `padding: 64px`, column with `justify-content: space-between; gap: 48px`. Top group `gap: 24px`: eyebrow "Eigentümergeführt seit Generationen" (use it as the section's H2, styled as eyebrow) + serif lead. Bottom: `<dl>` grid `120px minmax(0,1fr)`, `gap: 12px 24px`, `<dt>` in `--on-dark-60`. Phone `tel:+41523461377`.
6. **Footer** on `--ink`, 1280 container, `padding: 40px var(--pad-44)`, `border-top: 1px solid var(--on-dark-rule)`, space-between, 14px `--on-dark-65`: "© A.W. Graf AG · Illnau" | Impressum, Datenschutz (`gap: 28px`).

Semantics added vs. the artboard (no visual change): the hero headline is the page's only `<h1>`; section headings are `<h2>`, tile titles `<h3>`; values are a `<ul>`; anchors/ids on sections; nav links point to the ids.

## 5. Responsive spec (not in the design, built into `reference/index.html`)

| Width | Changes |
|---|---|
| ≥ 1281 | Hero image full-bleed; logo, nav and H1 stay aligned to the centered 1280 container. Everything else centered at 1280 on `--bg` / `--ink` full-bleed bands. |
| 1280 | Identical to the artboard. |
| ≤ 1100 | Team text padding `clamp(24px, 5vw, 64px)`. |
| ≤ 899 | Werte: 1 column, `gap: 32px`, section gap 40px. Team: 1 column (image on top, no gap), text padding `48px calc(var(--pad-64) - var(--frame)) 40px`, gap 40px. |
| ≤ 767 | Header padding `20px 24px`, logo 40px. Nav links hidden; only the hamburger. H1 `bottom: 40px`. Hero image `object-position: 70% center` (keeps the church in frame). H2/H3 line-height 1.2. Tiles 1 column, `gap: 12px`; section gap 36px. `<dl>` columns `88px minmax(0,1fr)`, gap `12px 16px`. Footer stacks (`gap: 12px`), links get a 44px hit area. |

All other sizes scale fluidly through the clamps. No other breakpoints.

**Menu (all widths).** The hamburger opens a full-screen overlay (the design shows the icon but not what it opens): `position: fixed; inset: 0;` `--ink` background, cream text, opacity fade .25s. The top bar stays visible on top (white logo; the two lines rotate into an ×, .25s). Links stacked: Über uns, Tätigkeit, Werte, Team, Kontakt in Newsreader `clamp(40px, 4.375vw, 56px)` / 1.1, -0.01em, `padding: 8px 0`. Bottom: address and phone, 15px `--on-dark-65`. Padding: top clears the header (+40px), sides `--pad-44`, bottom `40px + env(safe-area-inset-bottom)`. Behaviour: `aria-expanded` / `aria-controls`, label toggles "Menü öffnen" / "Menü schliessen", body scroll locked, focus moves to the first link and back to the button on close, focus trapped, closes on link tap and Escape. See `mobile-390-menu-open.png`.

Mobile hygiene: no horizontal overflow from 320px (reference verified at 320 to 1920); `viewport` without `maximum-scale`; `100svh` not `100vh`; tap targets ≥ 44px; respect `prefers-reduced-motion` (smooth scroll + menu transitions off).

## 6. Assets (`public/`)

| File | Use | Notes |
|---|---|---|
| `images/aw-graf-logo-white.png` | Header logo, 56px high (40 mobile) | 896×240. Transparent padding is baked in (≈5% left/right, ≈11% top, ≈16% bottom); the design uses it that way, don't crop. |
| `images/aw-graf-logo-dark.png` | Only for the Impressum/Datenschutz stub pages | Same size and padding as the white logo. |
| `images/hero-illnau-{800,1200,1500}.{webp,jpg}` | Hero | Source is only 1500×1125. It's fine at 1280×800, but soft on large screens and at @2x on phones. **Ask the client for the original drone photo (≥ 2560px wide)** and re-export 800/1200/1600/2400. |
| `images/team-square-{600,900,1088}.{webp,jpg}` | Team | Pre-cropped to 1:1, centered. |
| `fonts/inter-latin-{400,500}-normal.woff2`, `fonts/newsreader-latin-opsz-normal.woff2` | Fonts | `display: swap`, enable fallback metrics (`adjustFontFallback`) to avoid layout shift. |

## 7. Open content (don't invent)

- Team names "[Vorname Name] und [Vorname Name]" and E-Mail "[Platzhalter]" stay as is. When the e-mail is known, make it a `mailto:` link.
- `/impressum` and `/datenschutz` as stub pages (same footer, a small header on `--bg` with the dark logo, H1 + "Inhalt folgt."). Use `images/aw-graf-logo-dark.png` there (44px high).
- Favicon not designed: add a simple placeholder ("AWG" serif, `--ink` on `--bg`) and flag it.
- Copy note: the "Über uns" text here differs from the main "AW Graf Website" page (it's the merged version). Use this variant's text.

## 8. SEO / meta

`<title>` "A.W. Graf AG · Immobilien in Illnau"; description = the Über uns paragraph's first sentence; Open Graph with the hero image (1200 wide), `og:locale de_CH`; JSON-LD `Organization` (A.W. Graf AG, Im Riet 7, 8308 Illnau, CH, +41 52 346 13 77, foundingDate 1927); `theme-color` `#171715` (the page opens on the dark hero).

## 9. Acceptance criteria

1. Playwright visual tests against `reference/screenshots/`: full page at 1280×900 and 1440×900 (dpr 1), 768×1024 (dpr 1), 390×844 (dpr 2), plus `-menu-open` at 768 and 390. Fonts loaded before capture. `maxDiffPixelRatio ≤ 0.01`; the hero photo region may differ slightly if you swap in a higher-res image (mask it then).
2. At 1280 also compare against `original-artboard-1280.png` (≤ 0.01). This is the design itself.
3. Spot checks at 1280: logo 209×56 at (44, 28); H1 box top at y=493; hero 800px; document height 3323px. At 390×844: logo 149×40 at (24, 20); document height ≈ 4113px.
4. No horizontal overflow at 320, 360, 375, 390, 414, 600, 768, 900, 1024, 1100, 1280, 1440, 1920.
5. Lighthouse mobile: Performance ≥ 95, Accessibility 100, Best Practices 100, SEO 100, CLS < 0.02.
6. Keyboard: all links + menu reachable, visible focus, Escape closes the menu.
7. No external requests at runtime.

## 10. Don'ts

- Don't change copy, colours, spacing or sizes. The odd-looking clamp values map exactly to the artboard.
- Don't make the header sticky or add a scrolled header state (not in the design).
- Don't add libraries (UI kits, icon packs, animation), carousels, forms or maps.
- Don't load Google Fonts from Google.
