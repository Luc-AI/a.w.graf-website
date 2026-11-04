/**
 * Design Lab: the curated options the client can switch between.
 *
 * Contract (shared by the panel, the CSS mapping and the site components):
 * - The active choice of each group is stored as a data attribute on <html>:
 *   data-logo, data-heading, data-body, data-title, data-accent, data-bg, data-image. No attribute = default.
 * - `app/design-lab.css` maps each attribute value to CSS custom properties.
 * - Colour groups also accept a custom value: a `#rrggbb` string. It is stored as
 *   data-<group>="custom" plus the CSS custom property (see `colorVars`) set inline on <html>.
 * - The site consumes only CSS custom properties (see README in this folder).
 * - URL query params use the same keys (?logo=a&heading=fraunces&body=dm-sans&title=forest&accent=forest&bg=bone&image=m1;
 *   a custom colour is passed as its hex, e.g. accent=%23004225).
 */

export type OptionGroup = 'logo' | 'heading' | 'body' | 'title' | 'accent' | 'bg' | 'image';
export type ColorGroup = 'title' | 'accent' | 'bg';

/** The CSS custom property each colour group drives. */
export const colorVars: Record<ColorGroup, string> = {
  title: '--heading-color',
  accent: '--accent',
  bg: '--bg',
};

export const HEX_RE = /^#[0-9a-fA-F]{6}$/;
export const isCustomColor = (value: string) => HEX_RE.test(value);

export interface LogoOption {
  id: string;
  label: string;
  /** Short note shown under the label, e.g. the typeface. */
  note: string;
  /** Paths for the dark-on-light and white-on-dark versions. */
  dark: string;
  white: string;
  /** Intrinsic aspect ratio (width / height) for layout without jumps. */
  ratio: number;
  /** Visual enlargement for stacked marks that would be too small at the header height. */
  scale?: number;
}

export interface FontOption {
  id: string;
  label: string;
  note: string;
  /** Full font-family stack with fallbacks. */
  family: string;
  /** Extra CSS for headings, only where a face needs it. */
  weight?: number;
  stretch?: string;
  transform?: 'uppercase';
  tracking?: string;
  /** Multiplier applied to the heading sizes (wide faces need to be smaller). */
  scale?: number;
}

export interface ColorOption {
  id: string;
  label: string;
  hex: string;
  note: string;
}

export interface PhotoOption {
  id: string;
  label: string;
  note: string;
  /** Small preview shown on the card in the panel. */
  thumb: string;
  /** Path without width and extension; files exist as -400, -800 and -1400 .webp. Absent for the default. */
  base?: string;
  width?: number;
  height?: number;
  alt?: string;
  /** Licence credit shown in the panel. Absent for the company's own photo. */
  credit?: string;
  source?: string;
}

export const DEFAULTS: Record<OptionGroup, string> = {
  logo: 'current',
  heading: 'newsreader',
  body: 'inter',
  title: 'ink',
  accent: 'ink',
  bg: 'cream',
  image: 'current',
};

export const logos: LogoOption[] = [
  {
    id: 'current',
    label: 'Aktuell',
    note: 'Playfair Display',
    dark: '/images/aw-graf-logo-dark.png',
    white: '/images/aw-graf-logo-white.png',
    ratio: 896 / 240,
  },
  {
    id: 'a',
    label: 'Variante A',
    note: 'Cormorant SC',
    dark: '/images/logos/logo-a-dark.svg',
    white: '/images/logos/logo-a-white.svg',
    ratio: 449 / 101,
  },
  {
    id: 'b',
    label: 'Variante B',
    note: 'Spectral SC',
    dark: '/images/logos/logo-b-dark.svg',
    white: '/images/logos/logo-b-white.svg',
    ratio: 502 / 105,
  },
  {
    id: 'c',
    label: 'Variante C',
    note: 'Playfair Display SC',
    dark: '/images/logos/logo-c-dark.svg',
    white: '/images/logos/logo-c-white.svg',
    ratio: 465 / 100,
  },
  {
    id: 'd',
    label: 'Variante D',
    note: 'Alegreya SC',
    dark: '/images/logos/logo-d-dark.svg',
    white: '/images/logos/logo-d-white.svg',
    ratio: 433 / 101,
  },
  {
    id: 'original',
    label: 'Original',
    note: 'Nachbau des bisherigen Logos',
    dark: '/images/logos/logo-original-dark.svg',
    white: '/images/logos/logo-original-white.svg',
    ratio: 1235 / 303,
  },
  {
    id: 'wordmark',
    label: 'Schriftzug 1927',
    note: 'Bisheriger Schriftzug, Bilddatei',
    dark: '/images/logos/logo-wordmark-dark.png',
    white: '/images/logos/logo-wordmark-white.png',
    ratio: 1400 / 327,
  },
  {
    id: 'house',
    label: 'Original mit Haus',
    note: 'Bisheriges Logo, Bilddatei',
    dark: '/images/logos/logo-house-dark.png',
    white: '/images/logos/logo-house-white.png',
    ratio: 986 / 720,
    scale: 1.6,
  },
];

export const headingFonts: FontOption[] = [
  {
    id: 'newsreader',
    label: 'Newsreader',
    note: 'Aktuell',
    family: 'var(--font-newsreader), Georgia, serif',
  },
  {
    id: 'eb-garamond',
    label: 'EB Garamond',
    note: 'Klassisch, buchhaft',
    family: "'EB Garamond', Georgia, serif",
    weight: 500,
  },
  {
    id: 'cormorant-sc',
    label: 'Cormorant SC',
    note: 'Kapitälchen, wie graviert',
    family: "'Cormorant SC', Georgia, serif",
    weight: 600,
    scale: 1.06,
  },
  {
    id: 'playfair',
    label: 'Playfair Display',
    note: 'Kontrastreich, Magazin',
    family: "'Playfair Display', Georgia, serif",
  },
  {
    id: 'fraunces',
    label: 'Fraunces',
    note: 'Warm, modern',
    family: "'Fraunces', Georgia, serif",
  },
  {
    id: 'archivo',
    label: 'Archivo Expanded',
    note: 'Sachlich, wie Beschilderung',
    family: "'Archivo', system-ui, sans-serif",
    weight: 500,
    stretch: '125%',
    transform: 'uppercase',
    tracking: '0.04em',
    scale: 0.72,
  },
];

export const bodyFonts: FontOption[] = [
  {
    id: 'inter',
    label: 'Inter',
    note: 'Aktuell',
    family: 'var(--font-inter), system-ui, sans-serif',
  },
  {
    id: 'hanken',
    label: 'Hanken Grotesk',
    note: 'Allrounder',
    family: "'Hanken Grotesk', system-ui, sans-serif",
  },
  {
    id: 'source-serif',
    label: 'Source Serif 4',
    note: 'Für längere Texte',
    family: "'Source Serif 4', Georgia, serif",
  },
  {
    id: 'dm-sans',
    label: 'DM Sans',
    note: 'Kompakt',
    family: "'DM Sans', system-ui, sans-serif",
  },
];

export const accents: ColorOption[] = [
  { id: 'ink', label: 'Ink', hex: '#171715', note: 'Aktuell' },
  { id: 'racing', label: 'Racing Green', hex: '#0A3D2E', note: 'Kit 1' },
  { id: 'forest', label: 'Forest', hex: '#004225', note: 'Kit 2 / 3' },
  { id: 'moss', label: 'Moss', hex: '#2E6B58', note: 'Kit 1' },
  { id: 'slate', label: 'Slate', hex: '#1F2933', note: 'Kit 3' },
  { id: 'deep-stone', label: 'Deep Stone', hex: '#6B624F', note: 'Kit 2' },
];

/** Heading colour. 'ink' = same as the text, so no property is set. */
export const titleColors: ColorOption[] = [
  { id: 'ink', label: 'Ink', hex: '#171715', note: 'Aktuell, wie der Text' },
  ...accents.filter((o) => o.id !== 'ink').map((o) => ({ ...o, note: `${o.note}, wie Akzent` })),
];

export const backgrounds: ColorOption[] = [
  { id: 'cream', label: 'Cream', hex: '#F6F3EC', note: 'Aktuell' },
  { id: 'bone', label: 'Bone', hex: '#F3F0E8', note: 'Kit 1' },
  { id: 'parchment', label: 'Parchment', hex: '#F3EFE7', note: 'Kit 2' },
  { id: 'greige', label: 'Greige', hex: '#E6E2D9', note: 'Kit 3' },
  { id: 'white', label: 'White', hex: '#FFFFFF', note: 'Kit 1 / 3' },
];

export const photos: PhotoOption[] = [
  {
    id: 'current',
    label: 'Aktuell',
    note: 'Illnau, Luftaufnahme',
    thumb: '/images/hero-illnau-640.webp',
  },
  {
    id: 'm1',
    label: 'Betonhaus',
    note: 'Thusis',
    thumb: '/images/lab/photo-m1-400.webp',
    base: '/images/lab/photo-m1',
    width: 1400,
    height: 933,
    alt: 'Modernes Betonhaus an einem Hang, dahinter ein Dorf und verschneite Berge',
    credit: 'Schaub Stierli Fotografie, CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Angela_Deuber_Architects_Private_House_Thusis.jpg',
  },
  {
    id: 'm2',
    label: 'Wohnbauten',
    note: 'Uster, Abendlicht',
    thumb: '/images/lab/photo-m2-400.webp',
    base: '/images/lab/photo-m2',
    width: 1400,
    height: 1007,
    alt: 'Moderne Wohnbauten mit Flachdach und beleuchteten Fenstern in der Abenddämmerung',
    credit: '-wuppertaler, CC BY 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:CH_Uster,_Hohfurenweg_005.jpg',
  },
  {
    id: 'm3',
    label: 'Glas und Metall',
    note: 'Wohnhaus im Grünen',
    thumb: '/images/lab/photo-m3-400.webp',
    base: '/images/lab/photo-m3',
    width: 1400,
    height: 1050,
    alt: 'Modernes Wohnhaus mit Metallgiebel und grosser Glasfront, davor ein bepflanzter Garten',
    credit: 'Willi Egli, CC BY-SA 4.0, zugeschnitten',
    source: 'https://commons.wikimedia.org/wiki/File:W-Egli_Hs-Gottschallk_038_Ausschn_teilw_entzerrt.jpg',
  },
  {
    id: 'm4',
    label: 'Holzhaus',
    note: 'Vrin',
    thumb: '/images/lab/photo-m4-400.webp',
    base: '/images/lab/photo-m4',
    width: 1400,
    height: 1039,
    alt: 'Holzhaus an einem grünen Hang in einem Bergdorf',
    credit: 'Adrian Michael, CC BY-SA 3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Vrin_Wohnhaus1.jpg',
  },
];

export const groups: Record<OptionGroup, { ids: string[] }> = {
  logo: { ids: logos.map((o) => o.id) },
  heading: { ids: headingFonts.map((o) => o.id) },
  body: { ids: bodyFonts.map((o) => o.id) },
  title: { ids: titleColors.map((o) => o.id) },
  accent: { ids: accents.map((o) => o.id) },
  bg: { ids: backgrounds.map((o) => o.id) },
  image: { ids: photos.map((o) => o.id) },
};

export const STORAGE_KEY = 'aw-graf-design-lab';
