import { designThree } from '@/content';
import theme from './theme.module.css';
import styles from './UeberUns.module.css';

const { ueberUns } = designThree;

export function UeberUns() {
  return (
    <section className={`${theme.wrap} ${theme.cols} ${styles.about}`} id="ueber-uns">
      <h2 className={`${theme.serif} ${styles.title}`}>{ueberUns.title}</h2>
      <div className={styles.text}>
        {ueberUns.paragraphs.map((paragraph) => (
          <p className={styles.paragraph} key={paragraph}>
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
