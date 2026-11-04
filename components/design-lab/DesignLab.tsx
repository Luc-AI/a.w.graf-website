'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  accents,
  backgrounds,
  bodyFonts,
  DEFAULTS,
  headingFonts,
  logos,
  STORAGE_KEY,
  type FontOption,
  type OptionGroup,
} from './options';
import styles from './DesignLab.module.css';

type State = Record<OptionGroup, string>;
const KEYS = Object.keys(DEFAULTS) as OptionGroup[];

function readFromDom(): State {
  const ds = document.documentElement.dataset;
  const next = { ...DEFAULTS };
  for (const k of KEYS) next[k] = ds[k] ?? DEFAULTS[k];
  return next;
}

function isLight(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const lum = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
  return lum > 160;
}

function Check({ light }: { light: boolean }) {
  return (
    <svg className={styles.check} data-light={light} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-6.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DesignLab() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<State>({ ...DEFAULTS });
  const [copied, setCopied] = useState(false);
  const fabRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    setState(readFromDom());
    setMounted(true);
  }, []);

  const dirty = KEYS.some((k) => state[k] !== DEFAULTS[k]);

  const persist = useCallback((next: State) => {
    const root = document.documentElement;
    const diff: Partial<State> = {};
    for (const k of KEYS) {
      if (next[k] === DEFAULTS[k]) root.removeAttribute(`data-${k}`);
      else {
        root.setAttribute(`data-${k}`, next[k]);
        diff[k] = next[k];
      }
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(diff));
    } catch {}
    try {
      const url = new URL(location.href);
      for (const k of KEYS) url.searchParams.delete(k);
      for (const k of KEYS) if (diff[k]) url.searchParams.set(k, diff[k]!);
      history.replaceState(history.state, '', url.pathname + url.search + url.hash);
    } catch {}
  }, []);

  const choose = (group: OptionGroup, id: string) => {
    const next = { ...state, [group]: id };
    setState(next);
    persist(next);
  };

  const reset = () => {
    const next = { ...DEFAULTS };
    setState(next);
    persist(next);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(location.href);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = location.href;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch {}
      ta.remove();
    }
    setCopied(true);
  };

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  // Focus management
  useEffect(() => {
    if (open) {
      closeRef.current?.focus({ preventScroll: true });
      wasOpen.current = true;
    } else if (wasOpen.current) {
      wasOpen.current = false;
      fabRef.current?.focus({ preventScroll: true });
    }
  }, [open]);

  // Escape + outside click + mobile scroll lock
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || fabRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    const mobile = window.matchMedia('(max-width: 767.98px)').matches;
    const prev = document.body.style.overflow;
    if (mobile) document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!mounted) return null;

  const chips = (group: 'heading' | 'body', list: FontOption[]) => (
    <div className={styles.chips} role="radiogroup" aria-labelledby={`lab-label-${group}`}>
      {list.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={state[group] === o.id}
          className={`${styles.chip} ${group === 'body' ? styles.chipBody : ''}`}
          data-active={state[group] === o.id}
          title={o.note}
          onClick={() => choose(group, o.id)}
          style={
            group === 'heading'
              ? {
                  fontFamily: o.family,
                  fontWeight: o.weight,
                  fontStretch: o.stretch,
                  textTransform: o.transform,
                  letterSpacing: o.tracking,
                }
              : { fontFamily: o.family }
          }
        >
          {o.label}
        </button>
      ))}
    </div>
  );

  const swatches = (group: 'accent' | 'bg', list: typeof accents) => (
    <div className={styles.swatches} role="radiogroup" aria-labelledby={`lab-label-${group}`}>
      {list.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={state[group] === o.id}
          aria-label={o.label}
          title={`${o.label} · ${o.note}`}
          className={styles.swatch}
          data-active={state[group] === o.id}
          style={{ backgroundColor: o.hex }}
          onClick={() => choose(group, o.id)}
        >
          {state[group] === o.id && <Check light={isLight(o.hex)} />}
        </button>
      ))}
    </div>
  );

  return (
    <div className={styles.root}>
      {open && <div className={styles.catcher} onClick={() => setOpen(false)} aria-hidden="true" />}

      <div
        ref={panelRef}
        className={styles.panel}
        data-open={open}
        role="dialog"
        aria-modal="false"
        aria-labelledby="lab-title"
        inert={!open}
      >
        <span className={styles.handle} aria-hidden="true" />
        <div className={styles.head}>
          <div className={styles.headRow}>
            <h2 id="lab-title" className={styles.title}>
              Gestaltung
            </h2>
            <button ref={closeRef} type="button" className={styles.close} onClick={() => setOpen(false)} aria-label="Schliessen">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <p className={styles.hint}>Antippen genügt, die Seite passt sich sofort an.</p>
        </div>

        <div className={styles.body}>
          <section className={styles.section}>
            <h3 className={styles.label} id="lab-label-logo">Logo</h3>
            <div className={styles.logos} role="radiogroup" aria-labelledby="lab-label-logo">
              {logos.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  role="radio"
                  aria-checked={state.logo === o.id}
                  className={styles.logoCard}
                  data-active={state.logo === o.id}
                  onClick={() => choose('logo', o.id)}
                >
                  <span className={styles.logoStage}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={o.dark} alt="" height={28} style={{ aspectRatio: String(o.ratio) }} />
                  </span>
                  <span className={styles.logoLabel}>{o.label}</span>
                  <span className={styles.logoNote}>{o.note}</span>
                </button>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.label} id="lab-label-heading">Titelschrift</h3>
            {chips('heading', headingFonts)}
          </section>

          <section className={styles.section}>
            <h3 className={styles.label} id="lab-label-body">Textschrift</h3>
            {chips('body', bodyFonts)}
          </section>

          <section className={styles.section}>
            <h3 className={styles.label} id="lab-label-accent">Akzentfarbe</h3>
            {swatches('accent', accents)}
          </section>

          <section className={styles.section}>
            <h3 className={styles.label} id="lab-label-bg">Hintergrund</h3>
            {swatches('bg', backgrounds)}
          </section>
        </div>

        <div className={styles.foot}>
          <button type="button" className={styles.reset} onClick={reset} disabled={!dirty}>
            Zurücksetzen
          </button>
          <button type="button" className={styles.copy} onClick={copy} aria-live="polite">
            {copied ? 'Kopiert' : 'Link kopieren'}
          </button>
        </div>
      </div>

      <button
        ref={fabRef}
        type="button"
        className={styles.fab}
        data-hidden-mobile={open}
        aria-label="Gestaltung anpassen"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M2.5 5h4.5M11 5h6.5M2.5 10h9M15 10h2.5M2.5 15h2M8 15h9.5" />
            <circle cx="9" cy="5" r="2" />
            <circle cx="13" cy="10" r="2" />
            <circle cx="6" cy="15" r="2" />
          </g>
        </svg>
        {dirty && <span className={styles.badge} aria-hidden="true" />}
      </button>
    </div>
  );
}
