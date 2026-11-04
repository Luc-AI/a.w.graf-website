import { footer } from '@/content';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.band}>
      <div className="container">
        <div className={styles.footer}>
          <span>{footer.copyright}</span>
          <nav className={styles.links} aria-label={footer.label}>
            {footer.links.map((link) => (
              <a href={link.href} className={`hit ${styles.link}`} key={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
