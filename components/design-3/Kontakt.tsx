import { contactDetails, designThree } from '@/content';
import { Footer } from './Footer';
import theme from './theme.module.css';
import styles from './Kontakt.module.css';

const { kontakt } = designThree;

export function Kontakt() {
  return (
    <div className={styles.band} id="kontakt">
      <div className={`${theme.wrap} ${styles.contact}`}>
        <section className={theme.cols} aria-label={kontakt.label}>
          <h2 className={`${theme.serif} ${styles.title}`}>{kontakt.title}</h2>
          <dl className={styles.details}>
            <dt>{kontakt.labels.address}</dt>
            <dd>{contactDetails.address}</dd>
            <dt>{kontakt.labels.phone}</dt>
            <dd>
              <a className="hit" href={contactDetails.phoneHref}>
                {contactDetails.phoneDisplay}
              </a>
            </dd>
            <dt>{kontakt.labels.email}</dt>
            <dd>
              {contactDetails.emailHref ? (
                <a className="hit" href={contactDetails.emailHref}>
                  {contactDetails.email}
                </a>
              ) : (
                contactDetails.email
              )}
            </dd>
          </dl>
        </section>
        <Footer />
      </div>
    </div>
  );
}
