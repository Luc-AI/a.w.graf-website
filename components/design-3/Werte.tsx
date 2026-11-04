import { designThree } from '@/content';
import theme from './theme.module.css';
import styles from './Werte.module.css';

const { werte } = designThree;

export function Werte() {
  return (
    <section className={`${theme.wrap} ${theme.cols} ${styles.values}`} id="werte">
      <h2 className={`${theme.serif} ${styles.title}`}>{werte.title}</h2>
      <ul className={styles.list}>
        {werte.rows.map((row) => (
          <li className={styles.row} key={row.label}>
            <b className={styles.label}>{row.label}</b>
            <span>{row.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
