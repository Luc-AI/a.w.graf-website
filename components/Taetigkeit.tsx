import { taetigkeit } from '@/content';
import { DefinitionRows } from './DefinitionRows';

export function Taetigkeit() {
  return (
    <section id="taetigkeit" className="container section-pad-top">
      <div className="two-col">
        <div className="two-col-head">
          <h2 className="h2">{taetigkeit.title}</h2>
        </div>
        <DefinitionRows rows={taetigkeit.rows} />
      </div>
    </section>
  );
}
