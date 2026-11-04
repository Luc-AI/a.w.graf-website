import { designTwo } from '@/content';
import theme from './theme.module.css';
import styles from './UeberUns.module.css';

const { ueberUns } = designTwo;

export function UeberUns() {
  return (
    <section className={styles.section} id="ueber-uns">
      <span className={theme.eyebrow}>{ueberUns.eyebrow}</span>
      <h2 className={theme.h2}>{ueberUns.title}</h2>
      <p className={styles.text}>{ueberUns.text}</p>
      <a className={`hit ${styles.cta}`} href={ueberUns.cta.href}>
        <span>{ueberUns.cta.label}</span>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
          <path d="M2 8h11.5M9 3.5 13.5 8 9 12.5" />
        </svg>
      </a>
    </section>
  );
}
