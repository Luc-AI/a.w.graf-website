import { chooser } from '@/content';
import styles from './chooser.module.css';

export default function ChooserPage() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>{chooser.title}</h1>
      <div className={styles.options}>
        {chooser.options.map((option) => (
          <a href={option.href} className={styles.option} key={option.href}>
            {option.label}
          </a>
        ))}
      </div>
    </main>
  );
}
