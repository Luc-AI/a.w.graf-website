import { designThree } from '@/content';
import theme from './theme.module.css';
import styles from './Taetigkeit.module.css';

const { taetigkeit } = designThree;

const srcSet = (ext: string) =>
  [800, 1200, 1800].map((w) => `/images/dorf-im-tal-${w}.${ext} ${w}w`).join(', ');

/* Below 1280 the card makes the section tall, so the height decides the rendered width. */
const sizes = '(max-width: 899px) 100vw, (max-width: 1280px) 1060px, calc(50vw + 280px)';

export function Taetigkeit() {
  return (
    <section className={styles.work} id="taetigkeit">
      <div className={styles.photo}>
        <picture>
          <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
          <img
            className={theme.cover}
            src="/images/dorf-im-tal-1200.jpg"
            srcSet={srcSet('jpg')}
            sizes={sizes}
            width={1800}
            height={1205}
            alt={taetigkeit.imageAlt}
            loading="lazy"
          />
        </picture>
      </div>
      <div className={styles.card}>
        <h2 className={`${theme.serif} ${styles.title}`}>{taetigkeit.title}</h2>
        {taetigkeit.rows.map((row) => (
          <div className={styles.item} key={row.label}>
            <b className={styles.label}>{row.label}</b>
            <span>{row.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
