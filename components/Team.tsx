import { team } from '@/content';
import styles from './Team.module.css';

const sizes =
  '(min-width:1228px) 557px, (min-width:925px) 44vw, calc(100vw - 2 * clamp(24px,5vw,64px))';

export function Team() {
  return (
    <section id="team" className={`container ${styles.team}`}>
      <div className={styles.layout}>
        <div className={styles.copy}>
          <h2 className={styles.eyebrow}>{team.eyebrow}</h2>
          <p className={styles.lead}>{team.lead}</p>
          <a href={team.cta.href} className={`hit ${styles.cta}`}>
            {team.cta.label}
          </a>
        </div>
        <div className={styles.media}>
          <picture>
            <source
              type="image/webp"
              srcSet="/images/team-700.webp 700w, /images/team-1000.webp 1000w, /images/team-1344.webp 1344w"
              sizes={sizes}
            />
            <img
              className={styles.image}
              src="/images/team-1000.jpg"
              srcSet="/images/team-700.jpg 700w, /images/team-1000.jpg 1000w, /images/team-1344.jpg 1344w"
              sizes={sizes}
              alt={team.imageAlt}
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>
      </div>
    </section>
  );
}
