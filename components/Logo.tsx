import { logos } from './design-lab/options';
import styles from './Logo.module.css';

const DEFAULT_ID = 'current';

/* Renders every logo variant; CSS shows the one picked in the Design Lab (html[data-logo]).
   Size it by height: the variants have different aspect ratios. */
export function Logo({
  tone,
  alt,
  className,
}: {
  tone: 'dark' | 'white';
  alt: string;
  className?: string;
}) {
  return (
    <span className={className ? `${styles.wrap} ${className}` : styles.wrap}>
      {logos.map((logo, index) => (
        <img
          key={logo.id}
          className={styles.img}
          src={logo[tone]}
          data-variant={logo.id}
          width={Math.round(logo.ratio * 240)}
          height={240}
          alt={index === 0 ? alt : ''}
          aria-hidden={index === 0 ? undefined : true}
          loading={logo.id === DEFAULT_ID ? undefined : 'lazy'}
        />
      ))}
    </span>
  );
}
