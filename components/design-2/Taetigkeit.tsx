import { designTwo } from '@/content';
import theme from './theme.module.css';
import styles from './Taetigkeit.module.css';

const { taetigkeit } = designTwo;

export function Taetigkeit() {
  return (
    <section className={styles.section} id="taetigkeit">
      <div className={styles.head}>
        <span className={theme.eyebrow}>{taetigkeit.eyebrow}</span>
        <h2 className={theme.h2}>{taetigkeit.title}</h2>
      </div>
      <div className={styles.tiles}>
        {taetigkeit.tiles.map((tile) => (
          <article className={styles.tile} key={tile.title}>
            <h3 className={styles.tileTitle}>{tile.title}</h3>
            <p className={styles.tileText}>{tile.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
