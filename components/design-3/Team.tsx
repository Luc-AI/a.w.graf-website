import { designThree } from '@/content';
import theme from './theme.module.css';
import styles from './Team.module.css';

const { team } = designThree;

const srcSet = (ext: string) =>
  [700, 1000, 1344].map((w) => `/images/team-${w}.${ext} ${w}w`).join(', ');

const sizes = '(max-width: 899px) 100vw, (max-width: 1280px) 72vw, calc(50vw + 280px)';

export function Team() {
  return (
    <section className={styles.team} id="team">
      <div className={styles.photo}>
        <picture>
          <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
          <img
            className={theme.cover}
            src="/images/team-1000.jpg"
            srcSet={srcSet('jpg')}
            sizes={sizes}
            width={1344}
            height={1088}
            alt={team.imageAlt}
            loading="lazy"
          />
        </picture>
      </div>
      <div className={styles.card}>
        <h2 className={styles.eyebrow}>{team.eyebrow}</h2>
        <p className={styles.lead}>{team.lead}</p>
      </div>
    </section>
  );
}
