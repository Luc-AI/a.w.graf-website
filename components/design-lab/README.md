# Design Lab (client preview tool)

A floating panel that lets the client try logo, heading font, body font, accent colour and page background live on both designs. Remove it for go-live by deleting the `<DesignLab />` mount and the two CSS imports in `app/layout.tsx`.

## How state flows

1. The panel (`DesignLab.tsx`, client component) writes the active choice of each group to `<html>` as data attributes: `data-logo`, `data-heading`, `data-body`, `data-accent`, `data-bg`. Missing attribute = default (see `DEFAULTS` in `options.ts`).
2. A tiny inline script in `app/layout.tsx` (`init-script.ts`) restores the attributes from the URL query (`?logo=a&heading=fraunces&body=dm-sans&accent=forest&bg=bone`) or `localStorage` before first paint, so there is no flash.
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

Heading-only modifiers. These are NOT defined on `:root`; every heading rule uses them with a fallback equal to its current value, e.g. `font-weight: var(--heading-weight, 400)`:

| Property | Fallback | Note |
|---|---|---|
| `--heading-weight` | the rule's current weight | |
| `--heading-stretch` | `100%` | Archivo Expanded uses 125% |
| `--heading-transform` | `none` | Archivo is set in capitals |
| `--heading-tracking` | the rule's current letter-spacing | |
| `--heading-scale` | `1` | multiply the font-size: `font-size: calc(clamp(...) * var(--heading-scale, 1))` |

## Logo

`components/Logo.tsx` renders every variant from `options.ts` as an `<img data-variant>` and shows only the active one via `html[data-logo="…"]` selectors in its CSS module. Props: `tone: 'dark' | 'white'`, `alt`, `className`. Variants have different aspect ratios, so size the logo by height, never by fixed width.

## Fonts

Self-hosted latin woff2 files in `public/fonts`, declared in `app/design-lab-fonts.css`. Browsers only download a face once text actually uses it, so the default page loads nothing extra.
