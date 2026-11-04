import { designTwo } from '@/content';
import { SiteHeader } from './SiteHeader';
import styles from './Hero.module.css';

const { hero } = designTwo;

const srcSet = (ext: string) =>
  [800, 1200, 1500].map((w) => `/images/hero-illnau-${w}.${ext} ${w}w`).join(', ');

/* object-fit: cover at 4:3, so on tall viewports the height decides the rendered width.
   Phones deliberately get less than that: the LCP budget matters more than the extra sharpness. */
const sizes = '(max-width: 767px) 100vw, max(100vw, min(133.34svh, 1067px))';

export function Hero() {
  return (
    <header className={styles.hero} id="top">
      <picture>
        <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
        <img
          className={styles.image}
          src="/images/hero-illnau-1200.jpg"
          srcSet={srcSet('jpg')}
          sizes={sizes}
          width={1500}
          height={1125}
          alt={hero.imageAlt}
          fetchPriority="high"
        />
      </picture>
      <div className={styles.shade} />
      <div className={styles.inner}>
        <SiteHeader />
        <h1 className={styles.title}>
          {hero.titleLines[0]}
          <br />
          {hero.titleLines[1]}
        </h1>
      </div>
    </header>
  );
}
