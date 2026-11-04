import { designThree } from '@/content';
import { Logo } from '../Logo';
import { Footer } from './Footer';
import theme from './theme.module.css';
import styles from './LegalPage.module.css';

export function LegalPage({ title, body }: { title: string; body: string }) {
  return (
    <div className={styles.page}>
      <header className={`${theme.wrap} ${styles.header}`}>
        <a className={`hit ${styles.logo}`} href={designThree.home.href} aria-label={designThree.home.label}>
          <Logo tone="dark" alt="" />
        </a>
      </header>
      <main className={`${theme.wrap} ${styles.main}`}>
        <h1 className={`${theme.serif} ${styles.title}`}>{title}</h1>
        <p className={styles.body}>{body}</p>
      </main>
      <div className={styles.band}>
        <div className={`${theme.wrap} ${styles.footerWrap}`}>
          <Footer />
        </div>
      </div>
    </div>
  );
}
