import { footer } from '@/content';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={`container ${styles.footer}`}>
      <span>{footer.copyright}</span>
      <div className={styles.links}>
        {footer.links.map((link) => (
          <a href={link.href} className={`hit ${styles.link}`} key={link.href}>
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
