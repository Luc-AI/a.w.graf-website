# Handover: A.W. Graf AG website, variant 2c "Textfeld im Bild"

You are implementing a finished design. Its signature is **light or dark text cards that overlap photos**: the hero card overlaps the bottom of the hero photo, the "Was wir tun" card overlaps an image from the left, and a dark team card overlaps the team photo from the right. Goal: near pixel-perfect at desktop, fully mobile friendly. Do not redesign, change copy or add sections.

## 1. Sources of truth

| File | What it is |
|---|---|
| `reference/original-artboard.html` + `screenshots/original-artboard-1280.png` | The design exactly as drawn: one fixed 1280px desktop artboard (from the "AW Graf Layout-Richtungen" page, variant 2c). There was no mobile design. |
| `reference/index.html` | **Responsive reference and the thing to match.** At 1280px it renders identically to the artboard (verified: same 3722px height, 0.14% pixel difference, all of it image resampling and the arrow). Below 1280 it contains the responsive behaviour in §5. Above 1280 photos run full-bleed and the content grid stays aligned to a centered 1280 frame. |
| `reference/screenshots/` | `desktop-1440`, `desktop-1280`, `tablet-1024`, `tablet-768`, `mobile-390` (full page + `-fold`), `mobile-390-menu-open`. Mobile at @2x. |
| `public/` | Production assets. Copy as-is. |
| `reference/assets/` | Originals, only for re-export. |

`reference/index.html` already uses classes, tokens and CSS grid. Port it to components; **don't ship it unchanged**.

## 2. Stack

- Next.js App Router + TypeScript, `output: 'export'`, deploy on Vercel.
- Plain CSS: `globals.css` with tokens + CSS Modules per section. If the repo uses Tailwind, map tokens exactly.
- Fonts via `next/font/local` from `public/fonts` (self-hosted; no Google requests, relevant for Swiss nDSG / GDPR).
- Images via `<picture>` / `next/image` (`unoptimized: true` for static export) using the pre-sized files.
- `lang="de-CH"`, Swiss orthography (ss, no ß). Copy verbatim into one `content.ts`.
- Client JS only for the mobile menu.

## 3. Tokens

```css
:root {
  --bg: #F6F3EC;          /* page, hero card */
  --tile: #ECE7DC;        /* "Was wir tun" card */
  --ink: #171715;         /* text, team card, Kontakt/footer band, menu */
  --img-fallback: #2a2a27; --img-placeholder: #ccc;
  --rule: rgba(23,23,21,0.15);            /* Werte hairlines */
  --on-dark-60: rgba(246,243,236,0.60);   /* dt labels, footer text */
  --on-dark-rule: rgba(246,243,236,0.20); /* footer top border */
  --sans: 'Inter', system-ui, sans-serif;  /* 400, 500 */
  --serif: 'Newsreader', Georgia, serif;   /* variable with opsz axis, use 400 */

  --max: 1280px;
  --pad: clamp(24px, 5vw, 64px);           /* 64 at 1280 */
  --sec: clamp(88px, 10.9375vw, 140px);    /* 140 */
  --sec-120: clamp(72px, 9.375vw, 120px);  /* 120 */
  --off-80: clamp(48px, 6.25vw, 80px);     /* 80: card offsets */
  --gap-12col: clamp(16px, 2.5vw, 32px);   /* 32 */
  --card-pad: clamp(32px, 3.75vw, 48px);   /* 48 */
  --h2: clamp(34px, 3.4375vw, 44px);       /* 44 */
  --edge: max(0px, (100vw - 1280px) / 2);  /* viewport edge → 1280 frame edge */
}
```

Every fluid value hits the artboard value exactly at 1280. Don't round them.

Base: `body { font: 400 17px/1.6 var(--sans); color: var(--ink); background: var(--bg); -webkit-font-smoothing: antialiased; overflow-x: clip }`. Links: no underline; hover underline with `text-underline-offset: 4px`. `:focus-visible { outline: 2px solid currentColor; outline-offset: 4px }`. Keep Newsreader's optical sizing on (default).

### Type

| Role | Font | Size (1280 → mobile) | Line-height | Notes |
|---|---|---|---|---|
| Hero H1 (in card) | serif 400 | `clamp(44px, 5.625vw, 72px)` | 1.02 | -0.015em |
| H2 Über uns / Werte | serif 400 | `var(--h2)` | 1.1 | |
| H2 "Was wir tun." and "A.W. Graf AG" | serif 400 | `var(--h2)` | **1.6** desktop, 1.2 stacked | 1.6 is inherited in the design and sets the spacing; keep it |
| Body | sans 400 | 17px | 1.6 | |
| Item labels (Bewirtschaftung, Kontinuität…) | sans 500 | 17px | 1.6 | |
| Nav | sans 400 | 16px | 1.6 | cream; "Kontakt" boxed |
| Team eyebrow | sans 400 | 13px | 1.6 | 0.18em, uppercase |
| Team lead | serif 400 | `clamp(19px, 1.71875vw, 22px)` | 1.5 | |
| Footer | sans 400 | 14px | 1.6 | `--on-dark-60` |

## 4. Sections (values at 1280)

The three overlap sections are **CSS grids where photo and card share tracks**, not absolute positioning, so a card can grow with its text and push the section taller instead of overflowing. Port that approach.

1. **Header**, absolutely positioned over the hero photo, not sticky. Inner bar in the 1280 frame, `padding: 32px var(--pad)`, space-between, cream. White logo 60px high (224px wide). Nav `gap: 28px`, 16px: Über uns, Tätigkeit, Werte, Team, and "Kontakt" as a box (`border: 1px solid rgba(246,243,236,.7); padding: 4px 14px; margin: -5px 0`).
2. **Hero** `#top`: grid, `min-height: clamp(680px, 68.75vw, 880px)` (880).
   - Columns: `calc(var(--edge) + var(--pad))` | `min(640px, max(440px, 50vw))` | `1fr`. Rows: `1fr` | `auto` | `clamp(80px, 9.375vw, 120px)`.
   - Photo spans all columns, rows 1–2 (so it ends 120px above the section bottom: 760 of 880). Top gradient overlay 180px `rgba(0,0,0,.4) → 0`. Photo is LCP: `fetchpriority="high"`, never lazy.
   - Card: column 2, rows 2–3, `--bg`, padding `56px 56px 48px` (fluid: `clamp(36px,4.375vw,56px) clamp(32px,4.375vw,56px) clamp(32px,3.75vw,48px)`), column `gap: 28px`: H1 "Immobilien mit Bestand.", paragraph, CTA "In Kontakt treten →" (`align-self: flex-start; border-bottom: 1px solid var(--ink); padding-bottom: 4px`). Draw the arrow as the inline SVG from the reference: the subset fonts don't contain "→", so the glyph falls back to a different system font per OS.
3. **Über uns** `#ueber-uns`: 1280 frame, `padding: var(--sec-120) var(--pad) var(--sec)`, 12-col grid `gap: var(--gap-12col)`. H2 "Ein Unternehmen aus Illnau." cols 1–4; text cols 6–12, column `gap: 20px`, two paragraphs.
4. **Tätigkeit** `#taetigkeit`: grid, `min-height: clamp(506px, 56.25vw, 720px)` (720), `margin-bottom: var(--sec)`.
   - Columns: `calc(var(--edge) + var(--pad))` | `min(296px, 23.125vw)` | `min(224px, 17.5vw)` | `1fr`. Rows: `var(--off-80)` | `auto` | `1fr`.
   - Image (Dorf im Tal) cols 3 → end (starts at x=360, runs to the right viewport edge), all rows. Lazy.
   - Card cols 2–3 (x 64→584, width 520), row 2 (80px from top), `--tile`, `padding: var(--card-pad)`, column `gap: 28px`: H2 "Was wir tun.", then two items (`gap: 8px`: label 500 + text).
5. **Werte** `#werte`: 1280 frame, `padding: 0 var(--pad) var(--sec)`, 12-col grid. H2 cols 1–4. List cols 6–12 with `border-bottom: 1px solid var(--rule)`; each row grid `180px minmax(0,1fr)`, `gap: 24px; padding: 22px 0; border-top: 1px solid var(--rule)`.
6. **Team** `#team`: grid, `min-height: clamp(478px, 53.125vw, 680px)` (680).
   - Columns: `1fr` | `min(184px, 14.375vw)` | `min(296px, 23.125vw)` | `calc(var(--edge) + var(--pad))`. Rows: `1fr` | `auto` | `var(--off-80)`.
   - Image cols 1–2 (from the left viewport edge to x=920), all rows. Lazy.
   - Dark card cols 2–3 (x 736→1216, width 480), row 2 (80px from bottom), `--ink`, cream, `padding: var(--card-pad)`, column `gap: 20px`: eyebrow "Eigentümergeführt seit Generationen" (semantically the section H2) + serif lead.
7. **Kontakt + footer** `#kontakt`: full-bleed `--ink` band; inside the 1280 frame `padding: var(--sec-120) var(--pad) 40px`, column `gap: 80px`.
   - 12-col grid: H2 "A.W. Graf AG" cols 1–5; `<dl>` cols 7–12, grid `120px minmax(0,1fr)`, `gap: 12px 24px`, `<dt>` in `--on-dark-60`. Phone becomes `tel:+41523461377` (no underline, as designed).
   - Footer row: `border-top: 1px solid var(--on-dark-rule); padding-top: 24px`, space-between, 14px `--on-dark-60`: "© A.W. Graf AG · Illnau" | Impressum, Datenschutz (`gap: 24px`).

Semantics added vs. the artboard (no visual change): the hero headline is the only `<h1>`; section headings `<h2>`; Werte is a `<ul>`; ids on sections; nav links point to them.

## 5. Responsive spec (not in the design, built into `reference/index.html`)

| Width | Behaviour |
|---|---|
| ≥ 1281 | Photos full-bleed (hero: both sides; Tätigkeit: to the right edge; Team: from the left edge). Cards, text and header stay on the centered 1280 frame via `--edge`. See `desktop-1440.png`. |
| 1280 | Identical to the artboard. |
| 900–1279 | Same overlap composition; columns, offsets, paddings and type scale with the clamps. Cards grow taller as text wraps (that's why it's grid). See `tablet-1024.png`. |
| ≤ 899 (stacked) | Grids become blocks. Overlap kept as a vertical offset; each card sits flush with one screen edge, leaving a `var(--pad)` gap on the other side, mirroring the desktop asymmetry: |
| | • Hero photo `height: clamp(440px, 75svh, 640px)`, `object-position: 70% center` (keeps the church in frame). Card `margin: -88px var(--pad) 0 0` (flush left), `max-width: 640px`, `padding: 40px var(--pad) 32px`, gap 24px. |
| | • Über uns / Werte / Kontakt: single column, `gap: 24px`; Über uns top padding `var(--sec)`. H2 `max-width: 14ch`. Werte rows stack (label above text, `gap: 4px`), list `margin-top: 16px`. |
| | • Tätigkeit: image `aspect-ratio: 4/3; margin-left: var(--pad)`; card below `margin: -64px var(--pad) 0 0` (flush left), `padding: 40px var(--pad)`, gap 24px. |
| | • Team: image `aspect-ratio: 5/4; margin-right: var(--pad)`; dark card `margin: -64px 0 0 var(--pad)` (flush right), `padding: 40px var(--pad)`. |
| | • "Was wir tun." / "A.W. Graf AG" line-height 1.2. Kontakt gap 56px; `<dl>` `88px minmax(0,1fr)`, gap `12px 16px`. |
| ≤ 767 | Header padding `20px 24px`, logo 40px. Nav links hidden; the boxed "Kontakt" is replaced by a boxed **"Menü"** button in the same style (44px hit area). Footer stacks, links get 44px hit areas. |

**Menu (≤ 767).** Full-screen overlay `--ink`, cream, opacity fade .25s. Header stays on top (white logo; button label "Schliessen"). Links Über uns, Tätigkeit, Werte, Team, Kontakt in Newsreader 40px / 1.1, -0.01em, `padding: 8px 0`. Address + phone at the bottom, 15px `--on-dark-60`. Padding `120px 24px calc(40px + env(safe-area-inset-bottom))`. `aria-expanded` / `aria-controls`; body scroll locked; focus to first link on open, back to the button on close; focus trap; closes on link tap, Escape and resize to ≥ 768. See `mobile-390-menu-open.png`.

Mobile hygiene: no horizontal overflow from 320px (verified 320 to 1920); `viewport` without `maximum-scale`; `svh` not `vh`; tap targets ≥ 44px; `prefers-reduced-motion` disables smooth scroll and menu transition.

## 6. Assets (`public/`)

| File | Use | Notes |
|---|---|---|
| `images/aw-graf-logo-white.png` | Header logo | 896×240; transparent padding baked in (≈5% left/right, ≈11% top, ≈16% bottom). The design uses it like that, don't crop. |
| `images/aw-graf-logo-dark.png` | Impressum/Datenschutz stub pages | |
| `images/hero-illnau-{800,1200,1500}.{webp,jpg}` | Hero | Source only 1500×1125: soft on wide screens and phone retina. **Ask the client for the original drone photo (≥ 2560px)**. |
| `images/dorf-im-tal-{800,1200,1800}.{webp,jpg}` | Tätigkeit image | Unsplash photo by urban vintage (free Unsplash license, credit optional). It's a placeholder village, not Illnau: flag it, a real photo of their property should replace it. |
| `images/team-{700,1000,1344}.{webp,jpg}` | Team image | 1344×1088. |
| `fonts/*.woff2` | Inter 400/500, Newsreader variable (wght + opsz) | `display: swap` + fallback metrics. |

## 7. Open content (don't invent)

- Team names "[Vorname Name] und [Vorname Name]" and E-Mail "[Platzhalter]" stay. When the e-mail is known, render it as `mailto:`.
- `/impressum` and `/datenschutz` as stub pages (cream page, dark logo, H1 + "Inhalt folgt.", same dark footer).
- Favicon not designed: simple placeholder ("AWG" serif, `--ink` on `--bg`), flag it.
- The Tätigkeit photo is a stock placeholder (see §6).

## 8. SEO / meta

`<title>` "A.W. Graf AG · Immobilien in Illnau"; description = hero paragraph; Open Graph with the hero image (1200 wide), `og:locale de_CH`; JSON-LD `Organization` (A.W. Graf AG, Im Riet 7, 8308 Illnau, CH, +41 52 346 13 77, foundingDate 1927); `theme-color` `#F6F3EC`.

## 9. Acceptance criteria

1. Playwright visual tests vs. `reference/screenshots/`: full page at 1440×900, 1280×900, 1024×768, 768×1024 (dpr 1) and 390×844 (dpr 2), plus `mobile-390-menu-open`. Fonts loaded first. `maxDiffPixelRatio ≤ 0.01` (mask photos if you swap in higher-res images).
2. At 1280 also compare against `original-artboard-1280.png` (≤ 0.01). This is the design itself.
3. Spot checks at 1280: logo 224×60 at (64, 32); hero card 640×421 at (64, 459); H1 at (120, 515); document height 3722px. At 390×844: logo 149×40 at (24, 20); hero card 366px wide at x=0; document height ≈ 4018px.
4. No horizontal overflow at 320, 360, 375, 390, 414, 600, 768, 900, 1024, 1100, 1280, 1440, 1920.
5. Lighthouse mobile: Performance ≥ 95, Accessibility 100, Best Practices 100, SEO 100, CLS < 0.02.
6. Keyboard: all links + menu reachable, focus visible, Escape closes the menu.
7. No external requests at runtime.

## 10. Don'ts

- Don't change copy, colours, spacing or sizes; the clamp values map exactly to the artboard.
- Don't rebuild the overlaps with absolute positioning and fixed heights (cards will overflow on mid-size screens).
- Don't make the header sticky; don't add hover animations, parallax or scroll effects.
- Don't add libraries, forms, maps or carousels. Don't load Google Fonts from Google.
