import styles from './LegalStub.module.css';

export function LegalStub({ title, body }: { title: string; body: string }) {
  return (
    <section className={`container ${styles.stub}`}>
      <h1 className={styles.title}>{title}</h1>
      <p className="body-text">{body}</p>
    </section>
  );
}
