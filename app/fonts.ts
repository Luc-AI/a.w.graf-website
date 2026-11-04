import localFont from 'next/font/local';

export const inter = localFont({
  src: [
    { path: '../public/fonts/inter-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/inter-latin-500-normal.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-inter',
  display: 'swap',
  adjustFontFallback: 'Arial',
});

/* Variable font with wght + opsz axes; opsz stays active via font-optical-sizing: auto. */
export const newsreader = localFont({
  src: '../public/fonts/newsreader-latin-opsz-normal.woff2',
  weight: '200 800',
  style: 'normal',
  variable: '--font-newsreader',
  display: 'swap',
  adjustFontFallback: 'Times New Roman',
});
