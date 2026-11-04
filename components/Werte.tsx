import { werte } from '@/content';
import { DefinitionRows } from './DefinitionRows';
import styles from './Werte.module.css';

export function Werte() {
  return (
    <section id="werte" className={`container section-pad-top ${styles.werte}`}>
      <div className="two-col">
        <div className="two-col-head">
          <h2 className="h2 h2-narrow">{werte.title}</h2>
        </div>
        <DefinitionRows rows={werte.rows} />
      </div>
    </section>
  );
}
