import { contactDetails, designTwo, kontakt } from '@/content';
import theme from './theme.module.css';
import styles from './Team.module.css';

const { team } = designTwo;

const srcSet = (ext: string) =>
  [600, 900, 1088].map((w) => `/images/team-square-${w}.${ext} ${w}w`).join(', ');

const sizes = '(max-width: 899px) 100vw, min(50vw, 640px)';

export function Team() {
  return (
    <div className={theme.darkBand}>
      <section className={`${theme.wrap} ${styles.team}`} id="team">
        <picture className={styles.picture}>
          <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
          <img
            className={styles.image}
            src="/images/team-square-900.jpg"
            srcSet={srcSet('jpg')}
            sizes={sizes}
            width={1088}
            height={1088}
            alt={team.imageAlt}
            loading="lazy"
          />
        </picture>
        <div className={styles.text} id="kontakt">
          <div className={styles.intro}>
            <h2 className={`${theme.eyebrow} ${styles.eyebrow}`}>{team.eyebrow}</h2>
            <p className={styles.lead}>{team.lead}</p>
          </div>
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
        </div>
      </section>
    </div>
  );
}
