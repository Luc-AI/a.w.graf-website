import { ueberUns } from '@/content';
import styles from './UeberUns.module.css';

export function UeberUns() {
  return (
    <section id="ueber-uns" className="container section-pad-top">
      <div className="two-col">
        <div className="two-col-head">
          <h2 className="h2 h2-narrow">{ueberUns.title}</h2>
        </div>
        <div className={`two-col-body ${styles.body}`}>
          {ueberUns.paragraphs.map((text) => (
            <p className="body-text" key={text}>
              {text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
