# Design Lab (client preview tool)

A floating panel that lets the client try logo, heading font, body font, heading colour, accent colour and page background live on both designs. Each colour group also takes a custom colour (native picker or hex field). It also swaps the hero photo. Remove it for go-live by deleting the `<DesignLab />` mount and the two CSS imports in `app/layout.tsx`, plus `<LabPhotos />` and `data-default-photo` in both `Hero.tsx` files, `components/LabPhotos.tsx` and `public/images/lab`.

## How state flows

1. The panel (`DesignLab.tsx`, client component) writes the active choice of each group to `<html>` as data attributes: `data-logo`, `data-heading`, `data-body`, `data-title`, `data-accent`, `data-bg`, `data-image`. Missing attribute = default (see `DEFAULTS` in `options.ts`). A custom colour is stored as `data-<group>="custom"` plus the group's custom property (`colorVars` in `options.ts`) set inline on `<html>`, e.g. `style="--accent: #004225"`.
2. A tiny inline script in `app/layout.tsx` (`init-script.ts`) restores the attributes from the URL query (`?logo=a&heading=fraunces&body=dm-sans&title=forest&accent=forest&bg=bone`; a custom colour travels as its hex, `accent=%23004225`) or `localStorage` before first paint, so there is no flash.
3. `app/design-lab.css` maps every attribute value to CSS custom properties. This file is the only place that knows the option ids.
4. The site only consumes CSS custom properties. It never knows about the panel.

## Custom properties the site consumes

Defined on `:root` in `app/globals.css` (Design 1) and inherited by Design 2 (`components/design-2/theme.module.css` must not redefine them):

| Property | Default | Used for |
|---|---|---|
| `--font-serif` | Newsreader stack | all headings / display text |
| `--font-sans` | Inter stack | body, nav, UI |
| `--bg` | `#f6f3ec` | page + header background |
| `--accent` | `var(--ink)` | dark section backgrounds (Kontakt etc.), link hover underline colour, nav active state, anything that should carry the brand colour |

Heading colour: every heading rule has `color: var(--heading-color, currentColor)`. Containers on a dark background (`Kontakt`, Design 2 `darkBand` and menu, chooser hover) set `--heading-color: currentColor` so their headings keep the light text colour.

Heading-only modifiers. These are NOT defined on `:root`; every heading rule uses them with a fallback equal to its current value, e.g. `font-weight: var(--heading-weight, 400)`:

| Property | Fallback | Note |
|---|---|---|
| `--heading-weight` | the rule's current weight | |
| `--heading-stretch` | `100%` | Archivo Expanded uses 125% |
| `--heading-transform` | `none` | Archivo is set in capitals |
| `--heading-tracking` | the rule's current letter-spacing | |
| `--heading-scale` | `1` | multiply the font-size: `font-size: calc(clamp(...) * var(--heading-scale, 1))` |

## Logo

`components/Logo.tsx` renders every variant from `options.ts` as an `<img data-variant>` and shows only the active one via `html[data-logo="…"]` selectors in its CSS module. Props: `tone: 'dark' | 'white'`, `alt`, `className`. Variants have different aspect ratios, so size the logo by height, never by fixed width. A variant with `scale` (the stacked original with the house) is enlarged with a transform, so it overflows the header padding instead of growing the header.

## Hero photo

`components/LabPhotos.tsx` renders every photo from `options.ts` as a lazy, hidden `<img data-photo>`. Selectors in `app/design-lab.css` show the active one and hide the default (`img[data-default-photo]`). The photos come from Wikimedia Commons and are for the preview only: they show real buildings the company does not own, and each one requires the credit shown in the panel.

## Fonts

Self-hosted latin woff2 files in `public/fonts`, declared in `app/design-lab-fonts.css`. Browsers only download a face once text actually uses it, so the default page loads nothing extra.
