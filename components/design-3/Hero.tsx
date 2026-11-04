import { designThree } from '@/content';
import theme from './theme.module.css';
import styles from './Hero.module.css';

const { hero } = designThree;

const srcSet = (ext: string) =>
  [800, 1200, 1500].map((w) => `/images/hero-illnau-${w}.${ext} ${w}w`).join(', ');

/* Stacked, the 4:3 photo is cropped by its fixed height, which then decides the rendered width. */
const sizes = '(max-width: 899px) max(100vw, clamp(587px, 100svh, 853px)), 100vw';

/* Tall phones show under 60% of the photo's width, so they get just that part: x 28-88% of the
   original. With object-position 70% that crop frames the picture exactly like the full photo. */
const phoneMedia = '(max-width: 480px) and (max-aspect-ratio: 3/5)';
const phoneSrcSet = '/images/hero-illnau-crop-600.webp 600w, /images/hero-illnau-crop-900.webp 900w';
const phoneSizes = 'clamp(352px, 60svh, 512px)';

export function Hero() {
  return (
    <section className={styles.hero} id="top">
      <div className={styles.photo}>
        <picture>
          <source media={phoneMedia} type="image/webp" srcSet={phoneSrcSet} sizes={phoneSizes} />
          <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
          <img
            className={`${theme.cover} ${styles.image}`}
            src="/images/hero-illnau-1200.jpg"
            srcSet={srcSet('jpg')}
            sizes={sizes}
            width={1500}
            height={1125}
            alt={hero.imageAlt}
            fetchPriority="high"
          />
        </picture>
      </div>
      <div className={styles.card}>
        <h1 className={`${theme.serif} ${styles.title}`}>{hero.title}</h1>
        <p className={styles.intro}>{hero.intro}</p>
        <a className={`hit ${styles.cta}`} href={hero.cta.href}>
          <span>{hero.cta.label}</span>
          {/* Drawn inline: the subset fonts have no arrow glyph, so it would differ per OS. */}
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
            <path d="M2 8h11.5M9 3.5 13.5 8 9 12.5" />
          </svg>
        </a>
      </div>
    </section>
  );
}
