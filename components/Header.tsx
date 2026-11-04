'use client';

import { useEffect, useRef, useState } from 'react';
import { contactDetails, nav, site } from '@/content';
import { Logo } from './Logo';
import styles from './Header.module.css';

const SCROLL_THRESHOLD = 40;
const FOCUSABLE = 'a[href], button:not([disabled])';

function trapTab(event: KeyboardEvent, containers: (HTMLElement | null)[]) {
  const candidates = containers
    .flatMap((container) => [...(container?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])])
    .filter((el) => el.offsetParent !== null);
  const first = candidates[0];
  const last = candidates[candidates.length - 1];
  const active = document.activeElement as HTMLElement | null;
  if (event.shiftKey && (active === first || !active || !candidates.includes(active))) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && (active === last || !active || !candidates.includes(active))) {
    event.preventDefault();
    first?.focus();
  }
}

export function Header() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  /* Scroll state and panel offset are written straight to the DOM, so scrolling never re-renders. */
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const onScroll = () => {
      wrap.toggleAttribute('data-scrolled', window.scrollY > SCROLL_THRESHOLD);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* Tracks the header's bottom edge, including during its padding/height transition. */
    const observer = new ResizeObserver(() => {
      panelRef.current?.style.setProperty('--panel-top', `${wrap.offsetHeight}px`);
    });
    observer.observe(wrap);

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  /* Body lock and focus handover. */
  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    if (open) {
      panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus({ preventScroll: true });
    } else if (wasOpen.current) {
      buttonRef.current?.focus({ preventScroll: true });
    }
    wasOpen.current = open;
  }, [open]);

  /* While open: Escape closes, Tab stays inside header + panel, growing past the breakpoint closes. */
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      } else if (event.key === 'Tab') {
        trapTab(event, [wrapRef.current, panelRef.current]);
      }
    };
    const desktop = window.matchMedia('(min-width: 768px)');
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', onChange);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', onChange);
    };
  }, [open]);

  return (
    <>
      <div ref={wrapRef} className={styles.wrap}>
        <header className={`container ${styles.header}`}>
          <a href={nav.home.href} aria-label={nav.home.label} className={`hit ${styles.logoLink}`}>
            <Logo tone="dark" alt={site.logoAlt} className={styles.logo} />
          </a>
          <nav className={styles.desktopNav} aria-label={nav.label}>
            {nav.links.map((link) => (
              <a href={link.href} className={`hit ${styles.navLink}`} key={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <button
            ref={buttonRef}
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? nav.menuClose : nav.menuOpen}
          </button>
        </header>
      </div>
      <nav
        ref={panelRef}
        id="mobile-menu"
        className={styles.panel}
        data-open={open || undefined}
        aria-label={nav.label}
      >
        <ul className={styles.panelList}>
          {nav.links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={styles.panelLink} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.panelMeta}>
          <span>{contactDetails.address}</span>
          <a href={contactDetails.phoneHref} className={`hit ${styles.navLink}`}>
            {contactDetails.phoneDisplay}
          </a>
        </div>
      </nav>
    </>
  );
}
