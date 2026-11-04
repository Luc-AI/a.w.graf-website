import type { Metadata } from 'next';
import { designTwo, site } from '@/content';
import styles from '../chooser.module.css';

export const metadata: Metadata = {
  title: `${designTwo.title} · ${site.name}`,
};

export default function DesignTwoPage() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>{designTwo.title}</h1>
      <p className={styles.body}>{designTwo.body}</p>
      <a href={designTwo.back.href} className={`hit ${styles.back}`}>
        {designTwo.back.label}
      </a>
    </main>
  );
}
