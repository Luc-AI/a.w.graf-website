'use client';

import { useEffect, useRef, useState } from 'react';
import { contactDetails, designThree } from '@/content';
import { Logo } from '../Logo';
import styles from './Header.module.css';

const { nav, top } = designThree;

export function Header() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const button = buttonRef.current!;
    const menu = menuRef.current!;
    const focusable = [button, ...menu.querySelectorAll('a')];

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      } else if (event.key === 'Tab') {
        event.preventDefault();
        const index = focusable.indexOf(document.activeElement as HTMLAnchorElement);
        const step = event.shiftKey ? -1 : 1;
        focusable[(index + step + focusable.length) % focusable.length].focus();
      }
    }

    /* The button only exists on phones, so a menu left open would have no way to close. */
    const desktop = window.matchMedia('(min-width: 768px)');
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', closeOnDesktop);
    focusable[1].focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', closeOnDesktop);
      button.focus({ preventScroll: true });
    };
  }, [open]);

  const lastLink = nav.links.length - 1;

  return (
    <>
      <header className={`${styles.header} ${open ? styles.headerOpen : ''}`}>
        <div className={styles.bar}>
          <a className={`hit ${styles.logo}`} href={top.href} aria-label={top.label}>
            <Logo tone="white" alt="" />
          </a>
          <nav className={styles.nav} aria-label={nav.label}>
            {nav.links.map((link, index) => (
              <a
                className={index === lastLink ? styles.boxed : undefined}
                href={link.href}
                key={link.href}
              >
                {link.label}
              </a>
            ))}
            <button
              ref={buttonRef}
              className={`${styles.menuButton} ${styles.boxed}`}
              type="button"
              aria-expanded={open}
              aria-controls="menu"
              onClick={() => setOpen(!open)}
            >
              {open ? nav.menuClose : nav.menuOpen}
            </button>
          </nav>
        </div>
      </header>

      <div
        ref={menuRef}
        className={`${styles.menu} ${open ? styles.menuVisible : ''}`}
        id="menu"
        role="dialog"
        aria-modal="true"
        aria-label={nav.menuOpen}
      >
        <ul className={styles.menuList}>
          {nav.links.map((link) => (
            <li key={link.href}>
              <a className={styles.menuLink} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.meta}>
          <span>{contactDetails.address}</span>
          <a className="hit" href={contactDetails.phoneHref} onClick={() => setOpen(false)}>
            {contactDetails.phoneDisplay}
          </a>
        </div>
      </div>
    </>
  );
}
