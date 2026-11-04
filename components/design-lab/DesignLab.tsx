'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  accents,
  backgrounds,
  bodyFonts,
  colorVars,
  DEFAULTS,
  headingFonts,
  isCustomColor,
  logos,
  photos,
  STORAGE_KEY,
  titleColors,
  type ColorGroup,
  type ColorOption,
  type FontOption,
  type OptionGroup,
} from './options';
import styles from './DesignLab.module.css';

type State = Record<OptionGroup, string>;
const KEYS = Object.keys(DEFAULTS) as OptionGroup[];
const COLOR_LISTS: Record<ColorGroup, ColorOption[]> = { title: titleColors, accent: accents, bg: backgrounds };

function cssVarOf(group: OptionGroup): string | undefined {
  return (colorVars as Partial<Record<OptionGroup, string>>)[group];
}

function readFromDom(): State {
  const root = document.documentElement;
  const next = { ...DEFAULTS };
  for (const k of KEYS) {
    const v = root.dataset[k] ?? DEFAULTS[k];
    const cssVar = cssVarOf(k);
    if (v === 'custom' && cssVar) {
      const hex = root.style.getPropertyValue(cssVar).trim();
      next[k] = isCustomColor(hex) ? hex : DEFAULTS[k];
    } else next[k] = v;
  }
  return next;
}

function isLight(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const lum = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
  return lum > 160;
}

/** Accepts "#abc", "abc", "#aabbcc", "aabbcc"; returns "#aabbcc" or null. */
function normalizeHex(input: string): string | null {
  const raw = input.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{3}$/.test(raw)) return `#${raw.split('').map((c) => c + c).join('')}`.toLowerCase();
  if (/^[0-9a-fA-F]{6}$/.test(raw)) return `#${raw}`.toLowerCase();
  return null;
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
  /** Last custom colour per group, so the custom swatch keeps its colour when a preset is picked. */
  const [custom, setCustom] = useState<Record<ColorGroup, string>>({ title: '#2e6b58', accent: '#2e6b58', bg: '#eef2ee' });
  /** What the hex field currently shows per group (may be an incomplete value while typing). */
  const [drafts, setDrafts] = useState<Partial<Record<ColorGroup, string>>>({});
  const [copied, setCopied] = useState(false);
  const fabRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    const s = readFromDom();
    setState(s);
    setCustom((c) => {
      const next = { ...c };
      for (const g of Object.keys(COLOR_LISTS) as ColorGroup[]) if (isCustomColor(s[g])) next[g] = s[g];
      return next;
    });
    setMounted(true);
  }, []);

  const dirty = KEYS.some((k) => state[k] !== DEFAULTS[k]);

  const persist = useCallback((next: State) => {
    const root = document.documentElement;
    const diff: Partial<State> = {};
    for (const k of KEYS) {
      const v = next[k];
      const cssVar = cssVarOf(k);
      if (cssVar) root.style.removeProperty(cssVar);
      if (v === DEFAULTS[k]) {
        root.removeAttribute(`data-${k}`);
        continue;
      }
      if (cssVar && isCustomColor(v)) {
        root.setAttribute(`data-${k}`, 'custom');
        root.style.setProperty(cssVar, v);
      } else root.setAttribute(`data-${k}`, v);
      diff[k] = v;
    }
    if (!root.getAttribute('style')) root.removeAttribute('style');
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

  const chooseCustom = (group: ColorGroup, hex: string) => {
    setCustom((c) => ({ ...c, [group]: hex }));
    setDrafts((d) => ({ ...d, [group]: undefined }));
    choose(group, hex);
  };

  const reset = () => {
    const next = { ...DEFAULTS };
    setState(next);
    setDrafts({});
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

  /** Hex of the active choice of a colour group, for the hint after the section title. */
  const activeHex = (group: ColorGroup) => {
    const v = state[group];
    if (isCustomColor(v)) return v.toUpperCase();
    return (COLOR_LISTS[group].find((o) => o.id === v)?.hex ?? '').toUpperCase();
  };

  const colorSection = (group: ColorGroup, title: string) => {
    const list = COLOR_LISTS[group];
    const isCustom = isCustomColor(state[group]);
    const customHex = custom[group];
    const draft = drafts[group] ?? (isCustom ? state[group].toUpperCase() : '');
    const draftValid = draft === '' || normalizeHex(draft) !== null;
    return (
      <section className={styles.section}>
        <h3 className={styles.label} id={`lab-label-${group}`}>
          {title}
          <span className={styles.labelHex} aria-label="Aktueller Farbwert">
            {activeHex(group)}
          </span>
        </h3>
        <div className={styles.swatches} role="radiogroup" aria-labelledby={`lab-label-${group}`}>
          {list.map((o) => (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={state[group] === o.id}
              aria-label={o.label}
              title={`${o.label} · ${o.hex} · ${o.note}`}
              className={styles.swatch}
              data-active={state[group] === o.id}
              style={{ backgroundColor: o.hex }}
              onClick={() => choose(group, o.id)}
            >
              {state[group] === o.id && <Check light={isLight(o.hex)} />}
            </button>
          ))}
          <label
            className={`${styles.swatch} ${styles.swatchCustom}`}
            data-active={isCustom}
            title="Eigene Farbe wählen"
            style={{ backgroundColor: customHex }}
          >
            <input
              type="color"
              className={styles.colorInput}
              value={customHex}
              aria-label="Eigene Farbe wählen"
              onChange={(e) => chooseCustom(group, e.target.value)}
            />
            {isCustom ? (
              <Check light={isLight(customHex)} />
            ) : (
              <svg className={styles.plus} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </label>
        </div>
        <div className={styles.customRow}>
          <span className={styles.customLabel}>Eigene Farbe</span>
          <input
            type="text"
            className={styles.hexInput}
            data-invalid={!draftValid}
            value={draft}
            placeholder="#004225"
            inputMode="text"
            autoComplete="off"
            spellCheck={false}
            maxLength={7}
            aria-label={`${title}: eigener Farbwert als Hex`}
            onChange={(e) => {
              const v = e.target.value;
              setDrafts((d) => ({ ...d, [group]: v }));
              const hex = normalizeHex(v);
              if (hex && v.replace(/^#/, '').length === 6) chooseCustom(group, hex);
            }}
            onBlur={() => {
              const hex = normalizeHex(draft);
              if (hex) chooseCustom(group, hex);
              else setDrafts((d) => ({ ...d, [group]: undefined }));
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
            }}
          />
        </div>
      </section>
    );
  };

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
                    <img
                      src={o.dark}
                      alt=""
                      height={28}
                      style={{ aspectRatio: String(o.ratio), height: o.scale ? 26 * o.scale : undefined }}
                    />
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

          {colorSection('title', 'Titelfarbe')}
          {colorSection('accent', 'Akzentfarbe')}
          {colorSection('bg', 'Hintergrund')}

          <section className={styles.section}>
            <h3 className={styles.label} id="lab-label-image">Titelbild</h3>
            <div className={styles.logos} role="radiogroup" aria-labelledby="lab-label-image">
              {photos.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  role="radio"
                  aria-checked={state.image === o.id}
                  className={styles.logoCard}
                  data-active={state.image === o.id}
                  onClick={() => choose('image', o.id)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className={styles.photoThumb} src={o.thumb} alt="" width={400} height={267} loading="lazy" />
                  <span className={styles.logoLabel}>{o.label}</span>
                  <span className={styles.logoNote}>{o.note}</span>
                </button>
              ))}
            </div>
            <p className={styles.credits}>
              Fotos:{' '}
              {photos
                .filter((o) => o.credit)
                .map((o, index) => (
                  <span key={o.id}>
                    {index > 0 && ' · '}
                    <a href={o.source} target="_blank" rel="noreferrer">
                      {o.credit}
                    </a>
                  </span>
                ))}
            </p>
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
