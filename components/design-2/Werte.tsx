import { designTwo } from '@/content';
import theme from './theme.module.css';
import styles from './Werte.module.css';

const { werte } = designTwo;

export function Werte() {
  return (
    <section className={styles.section} id="werte">
      <div className={styles.head}>
        <span className={theme.eyebrow}>{werte.eyebrow}</span>
        <h2 className={theme.h2}>{werte.title}</h2>
      </div>
      <ul className={styles.list}>
        {werte.items.map((item) => (
          <li className={styles.item} key={item.label}>
            <b className={styles.label}>{item.label}</b>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
