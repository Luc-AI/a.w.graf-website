import { designTwo } from '@/content';
import theme from './theme.module.css';
import styles from './Footer.module.css';

const { footer } = designTwo;

export function Footer() {
  return (
    <div className={theme.darkBand}>
      <footer className={`${theme.wrap} ${styles.footer}`}>
        <span>{footer.copyright}</span>
        <nav className={styles.links} aria-label={footer.label}>
          {footer.links.map((link) => (
            <a className="hit" href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </footer>
    </div>
  );
}
