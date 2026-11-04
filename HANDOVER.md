# Handover: A.W. Graf AG website (one-pager)

> **Status:** the site has since been deliberately restyled (type scale, mobile spacing, fewer hairlines). The values below describe the original design. For the current look, the code and the updated baselines in `reference/screenshots/` are the source of truth.

You are implementing a finished design. The goal is a near pixel-perfect build of the design that is fully mobile friendly. Do not redesign, "improve" spacing, change copy or add sections.

## 1. Sources of truth (read in this order)

| File | What it is |
|---|---|
| `reference/index.html` | **Visual source of truth.** Static, self-contained export of the Claude Design file with all design options resolved to their defaults. Open it in a browser. Every value in this document comes from it. |
| `reference/screenshots/*.png` | Rendered reference at 1440 / 768 / 390 px (full page, above the fold, scrolled header, mobile menu open). Mobile shots are @2x. |
| `public/` | Production-ready assets (fonts, optimized images, logos). Copy as-is into the project's `public/`. |
| `reference/assets/` | Original full-res assets, only for re-export. |

`reference/index.html` uses inline styles because it was exported from a design tool. **Do not ship it.** Rebuild it cleanly (components + one stylesheet with tokens), keeping every computed value identical.

The only intentional deviations from the design file are the mobile changes in §5, which are already built into `reference/index.html` under the comment `MOBILE ADDITION`.

## 2. Stack

- Next.js (App Router, TypeScript) with `output: 'export'` (fully static, deploy to Vercel).
- Styling: plain CSS (`app/globals.css` with custom properties + CSS Modules per section). No Tailwind needed; if the repo already uses Tailwind, map tokens to the theme and keep values exact.
- Fonts via `next/font/local` from `public/fonts` (self-hosted, no Google Fonts requests; relevant for Swiss nDSG / GDPR).
- Images via `next/image` with `unoptimized: true` (static export) using the pre-sized files and a `srcset`, or plain `<picture>`. Pre-sized variants are already in `public/images`.
- `lang="de-CH"`. All copy is Swiss German orthography (ss, no ß). Keep it exactly.
- No client JS except the header scroll state and the mobile menu (one small client component).

## 3. Design tokens

```css
:root {
  /* colour */
  --bg: #F6F3EC;            /* cream, page + header background */
  --ink: #171715;           /* near black, text + Kontakt section bg */
  --ink-60: rgba(23,23,21,0.60);  /* footer text, image caption */
  --rule: rgba(23,23,21,0.15);    /* hairlines / dividers */
  --rule-header: rgba(23,23,21,0.12); /* header bottom border when scrolled */
  --placeholder: rgba(23,23,21,0.05); /* image background while loading */
  --on-dark-60: rgba(246,243,236,0.60); /* <dt> labels in Kontakt */

  /* type */
  --font-sans: 'Inter', system-ui, sans-serif;      /* 400, 500 */
  --font-serif: 'Newsreader', Georgia, serif;       /* variable, opsz axis, use 400 */

  /* layout */
  --container: 1228px;                       /* max-width incl. gutters */
  --gutter: clamp(24px, 5vw, 64px);          /* left/right padding of container */
  --section-y: clamp(112px, 14vw, 140px);    /* vertical rhythm */
}
```

Base: `body { font: 400 18px/1.6 var(--font-sans); color: var(--ink); background: var(--bg); -webkit-font-smoothing: antialiased; }`, `* { box-sizing: border-box }`, `html { scroll-behavior: smooth }` (disable under `prefers-reduced-motion: reduce`), `::selection { background: var(--ink); color: var(--bg) }`.

Links: `color: inherit; text-decoration-thickness: 1px; text-underline-offset: 4px;` hover: `text-decoration-thickness: 2px`. Nav links have no underline.

Newsreader must keep its optical-size axis active (`font-optical-sizing: auto`, the default). Large headlines rely on the display optical size. The font file `newsreader-latin-opsz-normal.woff2` contains both `wght` and `opsz` axes.

### Type scale

| Role | Font | Size | Line-height | Tracking | Other |
|---|---|---|---|---|---|
| H1 (hero) | serif 400 | `clamp(46px, 7.2vw, 92px)` | 1.02 | -0.015em | margin-bottom 40px |
| H2 (section) | serif 400 | `clamp(34px, 4vw, 48px)` | 1.1 | -0.01em | some have `max-width: 12ch` (see §4) |
| Body | sans 400 | 18px | 1.6 | 0 | paragraphs `max-width: 60ch`, `text-wrap: pretty` |
| List item label | sans 500 | 18px | 1.6 | 0 | |
| Header nav | sans 400 | 17px | 1.6 | 0 | |
| Team eyebrow (H2) | sans 400 | 15px | 1.5 | 0.16em | uppercase, `max-width: 26ch` |
| Team lead | serif 400 | `clamp(20px, 1.8vw, 24px)` | 1.5 | 0 | `max-width: 36ch` |
| Team CTA | sans 400 | 13px | (1.6) | 0.2em | uppercase, padding-bottom 6px, 1px bottom border ink |
| Footer | sans 400 | 14px | 1.6 | 0 | colour `--ink-60` |

## 4. Page structure and exact layout

Every block is a centered container: `max-width: 1228px; margin: 0 auto; padding-inline: var(--gutter)`.

**Two-column pattern** (used by Über uns, Tätigkeit, Werte, Kontakt):
`display:flex; flex-wrap:wrap; gap:32px 64px;` left column `flex: 1 1 300px` (holds H2), right column `flex: 1.6 1 420px`. It collapses to one column naturally when there's not enough width; do not replace this with fixed breakpoints, because the wrap point is part of the design (wraps below ~860px container width).

**Definition-list rows** (Tätigkeit, Werte): right column has `border-bottom: 1px solid var(--rule)`; each row `display:flex; flex-wrap:wrap; gap:4px 32px; padding:22px 0; border-top:1px solid var(--rule)`; label `flex:1 1 160px; font-weight:500`; text `<p> flex:2.2 1 280px; max-width:60ch`. Use semantic `<dl>`/`<dt>`/`<dd>` or a list, styled identically.

**Divider**: a block with `padding-top: var(--section-y)` containing a 1px line `background: var(--rule)`.

Sections in order (ids are the anchor targets, keep them):

1. **Header** (sticky, see §6). Logo left, nav right (`gap: 8px 28px`, 17px). Container padding `32px var(--gutter)`. Logo `<img>` height 60px, width auto (224px). Nav order: Über uns, Tätigkeit, Werte, Team, Kontakt.
2. **Hero** `padding: var(--section-y) var(--gutter) 96px`. H1 "Immobilien mit Bestand." Below: grid `repeat(auto-fit, minmax(min(100%, 320px), 1fr)); align-items:end; justify-items:start; gap:32px 48px` with the intro paragraph (`max-width:40ch`) and the CTA "In Kontakt treten →" (`inline-flex; gap:10px; padding-bottom:4px; border-bottom:1px solid currentColor; no underline`). Render the arrow as an inline SVG (1em, stroke currentColor, ~1.25px) instead of the "→" glyph: the subset fonts do not contain U+2192, so the glyph falls back to a system font and looks different per OS. Match the arrow in `desktop-1440-fold.png`.
3. **Hero image** container with `<img>` `width:100%; aspect-ratio:16/9; object-fit:cover; background: var(--placeholder)`. Source `hero-illnau-*.{webp,jpg}`, alt "Foto Areal Illnau" (improve to something descriptive like "Illnau mit reformierter Kirche, Luftaufnahme" if you like). This is the LCP element: `priority`/`fetchpriority="high"`, no lazy loading, `sizes="(min-width:1228px) 1100px, calc(100vw - 2 * clamp(24px,5vw,64px))"`.
4. **#ueber-uns** padding `var(--section-y) var(--gutter) 0`. H2 "Ein&nbsp;Unternehmen aus Illnau." (`max-width:12ch`, keep the `&nbsp;`). Right column: flex column, `gap:24px; padding-top:6px`, two paragraphs.
5. Divider.
6. **#taetigkeit** padding `var(--section-y) var(--gutter) 0`. H2 "Was wir tun." Rows: Bewirtschaftung, Entwicklung.
7. Divider.
8. **#werte** padding `var(--section-y) var(--gutter)` (top and bottom). H2 "Wir denken in Generationen." (`max-width:12ch`). Rows: Kontinuität, Werterhalt, Verantwortung.
9. Divider **without** top padding (line directly below Werte).
10. **#team** padding `var(--section-y) var(--gutter)`. Flex wrap, `align-items:center; gap:56px clamp(48px,10vw,160px)`. Left `flex:1 1 320px`, column, `gap:36px`: eyebrow H2, serif lead, CTA "Kontakt aufnehmen" (`align-self:flex-start; margin-top:20px`). Right `flex:1.3 1 420px; aspect-ratio:5/4; position:relative; background: var(--placeholder)` with the team image absolutely filling it, `object-fit:cover`. Lazy-load.
11. **#kontakt** full-bleed `background: var(--ink); color: var(--bg)`. Inner container padding `var(--section-y) var(--gutter)`. Two-column pattern. H2 "A.W. Graf AG". Right column `gap:40px; padding-top:6px`: paragraph, then `<dl>` grid `minmax(80px,140px) minmax(0,1fr); gap:12px 32px`, `<dt>` colour `--on-dark-60`. Phone is `tel:+41523461377` and underlined.
12. **Footer** (on cream, inside the container) `padding: 28px var(--gutter) 36px; display:flex; flex-wrap:wrap; justify-content:space-between; gap:12px 32px; font-size:14px; color: var(--ink-60)`. Left copyright line, right links Impressum / Datenschutz (`gap:24px`, no underline).

All copy: take it verbatim from `reference/index.html`. Put it in one `content.ts` so the client can edit text in one place later.

## 5. Mobile (below 768px). These are the only deviations from the design file

The design file's header simply wraps on phones: logo on one line, nav on two more lines, 203px tall and sticky. That eats a quarter of the screen. Replace it as built in `reference/index.html` and shown in `mobile-390-fold.png` / `mobile-390-menu-open.png`:

- Breakpoint `max-width: 767px` (the desktop nav fits on one line from 768px, see `tablet-768-fold.png`).
- Header padding `20px 24px`, logo height 44px. Scrolled: padding `12px 24px`, logo 36px.
- Desktop link row hidden; a text button "Menü" (Inter 17px, no background/border, min 44×44px hit area) sits right. When open its label is "Schliessen". `aria-expanded`, `aria-controls`.
- Menu panel: `position:fixed` from the header's bottom edge to the bottom of the viewport, background `--bg`, padding `40px 24px calc(32px + env(safe-area-inset-bottom))`, fades in (opacity .25s). Links stacked, Newsreader 34px / 1.1, letter-spacing -0.01em, `padding:10px 0` each. Bottom: address and phone link in Inter 15px, `--ink-60`.
- While open: lock body scroll, close on link tap, on Escape, and on resize to ≥768px. Move focus into the panel on open and back to the button on close; trap Tab inside header + panel.
- Kontakt `<dl>` on mobile: columns `96px minmax(0,1fr)`, gap `12px 20px` (otherwise the address wraps).
- `scroll-margin-top` on sections so anchors don't land under the sticky header: 96px desktop, 72px mobile (or compute from the header height).

Everything else on mobile already works via the fluid `clamp()` values and flex wrapping. Do not add other breakpoints.

General mobile hygiene: no horizontal scroll at 320px; `viewport` meta `width=device-width, initial-scale=1` (no `maximum-scale`); tap targets ≥ 44px tall (extend hit areas with padding / negative margins rather than changing the visible layout, e.g. footer and nav links); `-webkit-tap-highlight-color: transparent`; text never below 13px; respect `prefers-reduced-motion` for smooth scroll and header transitions; test iOS Safari address bar collapse (no `100vh` layouts).

## 6. Interactions

**Header scroll state.** Header wrapper is `position:sticky; top:0; z-index:50; background: var(--bg); border-bottom:1px solid transparent; transition: border-color .3s ease`. After `scrollY > 40`: border becomes `--rule-header`, container padding 32px → 16px (vertical, desktop), logo height 60px → 44px, both with `transition: .3s ease` (padding and height). Mobile values in §5. Implement with a passive scroll listener or an IntersectionObserver on a 40px sentinel; toggle a class / data attribute, no re-render loops.

**Hover.** Links only thicken their underline to 2px. Bordered CTAs: keep it equally subtle (e.g. border stays 1px, no colour change). No other hover effects, no animations on scroll.

**Focus.** Visible `:focus-visible` outline: 2px solid currentColor, offset 4px. Never remove outlines.

## 7. Assets (`public/`)

| File | Use | Notes |
|---|---|---|
| `images/aw-graf-logo-dark.png` | Header logo | 896×240 (4× of 60px). PNG has transparent padding baked in (≈5% left/right, ≈11% top, ≈16% bottom). The design uses it like this, so keep it and don't crop, otherwise the visual size and alignment change. Width at 60px height = 224px. |
| `images/aw-graf-logo-white.png` | Not used in the design | Available for e.g. the dark Kontakt section or OG image. |
| `images/hero-illnau-{800,1200,1500}.{webp,jpg}` | Hero image | Source is 1500×1125 (4:3) shown cropped to 16:9, centered. |
| `images/team-{700,1000,1344}.{webp,jpg}` | Team image | Cropped to 5:4, centered. |
| `fonts/inter-latin-{400,500}-normal.woff2` | Inter | `font-display: swap`. |
| `fonts/newsreader-latin-opsz-normal.woff2` | Newsreader variable (wght 200–800, opsz) | Use weight 400. |

Preload the Newsreader file and Inter 400 (`next/font` does this). Use `size-adjust`/`adjustFontFallback` so the font swap doesn't shift the layout.

Favicon: not designed yet. Don't ship the Next.js default; add a simple placeholder (serif "AWG" in `--ink` on `--bg`) and flag it in the PR.

## 8. Placeholders and open content (do not invent)

- Team text: "[Vorname Name] und [Vorname Name]" stays as is.
- Kontakt E-Mail: "[Platzhalter]" stays as is. Once known, render as `mailto:` link styled like the phone.
- Impressum and Datenschutz: link to `/impressum` and `/datenschutz` as empty stub pages using the same header/footer and a single H1 + "Inhalt folgt." Swiss sites need both.
- Hero image alt text and team image alt text: see §4.

## 9. SEO and meta

- `<title>`: "A.W. Graf AG · Immobilien in Illnau". Meta description: the hero intro sentence.
- Open Graph: title, description, `og:image` = hero image 1200 wide, `og:locale` `de_CH`.
- JSON-LD `Organization` / `LocalBusiness`: name A.W. Graf AG, address Im Riet 7, 8308 Illnau, CH, telephone +41 52 346 13 77, foundingDate 1927.
- One H1 only. Section H2s as specified (the Team eyebrow is the section's H2).
- `theme-color` `#F6F3EC`.

## 10. Acceptance criteria

1. **Visual match.** Add a Playwright visual test that screenshots the built page full-page at 1440×900, 768×900 and 390×900 (deviceScaleFactor 1 for 1440/768, 2 for 390, fonts loaded, header unscrolled) and compares against `reference/screenshots/{desktop-1440,tablet-768,mobile-390}.png` with `maxDiffPixelRatio ≤ 0.01`. Also compare `mobile-390-menu-open.png` (viewport 390×844, menu opened) and the `*-header-scrolled.png` crops (scroll to 800px, clip top 140px desktop/tablet, 260px mobile). The arrow glyph in the hero CTA is allowed to differ slightly.
2. Spot-check measurements at 1440px: header 125px tall; logo 224×60 at x=170, y=32; H1 top at y=265; hero image 1100×619 at y=581; document height ≈ 4314px. At 390px: header 85px, logo 164×44, document height ≈ 4648px.
3. No horizontal overflow from 320px to 1920px (assert `scrollWidth === innerWidth` at 320, 360, 390, 414, 768, 1024, 1280, 1440, 1920).
4. Lighthouse mobile: Performance ≥ 95, Accessibility 100, Best Practices 100, SEO 100. CLS < 0.02.
5. Keyboard: every link and the menu button reachable, focus visible, menu closes with Escape.
6. Zero external requests at runtime (fonts and images self-hosted).

## 11. Don'ts

- Don't change copy, colours, spacing or font sizes "for consistency". The `clamp()` values are deliberate.
- Don't add a component library, icons package, animation library or CSS reset beyond `box-sizing` + `margin:0` on body.
- Don't swap the flex-wrap columns for a 12-column grid.
- Don't load Google Fonts from Google.
- Don't add sections (map, form, gallery) that aren't in the design.
