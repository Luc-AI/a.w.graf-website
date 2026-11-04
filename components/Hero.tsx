import { hero } from '@/content';
import { LabPhotos } from './LabPhotos';
import styles from './Hero.module.css';

const webpSrcSet =
  '/images/hero-illnau-640.webp 640w, /images/hero-illnau-800.webp 800w, /images/hero-illnau-1200.webp 1200w, /images/hero-illnau-1500.webp 1500w';
const imageSizes = '(min-width:1228px) 1100px, calc(100vw - 2 * clamp(24px,5vw,64px))';

export function Hero() {
  return (
    <>
      <section className={`container ${styles.hero}`}>
        <h1 className={styles.title}>{hero.title}</h1>
        <div className={styles.grid}>
          <p className={styles.intro}>{hero.intro}</p>
          <a href={hero.cta.href} className={`hit ${styles.cta}`}>
            <span>{hero.cta.label}</span>
            <svg
              className={styles.arrow}
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              aria-hidden="true"
            >
              <path d="M3 9h12M10.5 4.5 15 9l-4.5 4.5" />
            </svg>
          </a>
        </div>
      </section>
      <div className="container">
        <picture className={styles.picture}>
          <source
            type="image/webp"
            srcSet={webpSrcSet}
            sizes={imageSizes}
          />
          <img
            className={styles.image}
            src="/images/hero-illnau-1200.jpg"
            srcSet="/images/hero-illnau-640.jpg 640w, /images/hero-illnau-800.jpg 800w, /images/hero-illnau-1200.jpg 1200w, /images/hero-illnau-1500.jpg 1500w"
            sizes={imageSizes}
            width={1500}
            height={1125}
            alt={hero.imageAlt}
            fetchPriority="high"
            decoding="async"
            data-default-photo=""
          />
        </picture>
        <LabPhotos className={styles.image} />
      </div>
    </>
  );
}
