import styles from './DefinitionRows.module.css';

type Row = { label: string; text: string };

export function DefinitionRows({ rows }: { rows: Row[] }) {
  return (
    <dl className={`two-col-body ${styles.list}`}>
      {rows.map((row) => (
        <div className={styles.row} key={row.label}>
          <dt className={styles.label}>{row.label}</dt>
          <dd className={`body-text ${styles.text}`}>{row.text}</dd>
        </div>
      ))}
    </dl>
  );
}
