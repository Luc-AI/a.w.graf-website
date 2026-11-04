import { contactDetails as c, kontakt } from '@/content';
import styles from './Kontakt.module.css';

export function Kontakt() {
  return (
    <section id="kontakt" className={styles.kontakt}>
      <div className={`container ${styles.inner}`}>
        <div className="two-col">
          <div className="two-col-head">
            <h2 className="h2">{kontakt.title}</h2>
          </div>
          <div className={`two-col-body ${styles.body}`}>
            <p className={styles.intro}>{kontakt.intro}</p>
            <dl className={styles.details}>
              <dt>{kontakt.labels.address}</dt>
              <dd>{c.address}</dd>
              <dt>{kontakt.labels.phone}</dt>
              <dd>
                <a href={c.phoneHref} className={`hit ${styles.link}`}>
                  {c.phoneDisplay}
                </a>
              </dd>
              <dt>{kontakt.labels.email}</dt>
              <dd>
                {c.emailHref ? (
                  <a href={c.emailHref} className={`hit ${styles.link}`}>
                    {c.email}
                  </a>
                ) : (
                  c.email
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
