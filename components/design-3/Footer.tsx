import { designThree } from '@/content';
import styles from './Footer.module.css';

const { footer } = designThree;

export function Footer() {
  return (
    <footer className={styles.footer}>
      <span>{footer.copyright}</span>
      <nav className={styles.links} aria-label={footer.label}>
        {footer.links.map((link) => (
          <a className="hit" href={link.href} key={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
