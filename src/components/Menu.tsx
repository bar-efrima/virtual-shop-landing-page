/* The phone menu: jumps to the page's sections, or opens the demo form. */
import { useEffect, useRef, useState, type MouseEvent } from 'react';

const LINKS = [
  { href: '#how', label: 'מה אפשר לעשות בחנות?' },
  { href: '#custom', label: 'סופר מותאם אישית' },
  { href: '#checkout', label: 'מהעגלה לעמוד הרכישה' },
  { href: '#pilot', label: 'מתחילים במחלקה אחת' },
];

export function Menu({ onDemo }: { onDemo: (e: MouseEvent<HTMLButtonElement>) => void }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="menu" ref={rootRef}>
      <button
        ref={toggleRef}
        type="button"
        className="menu-toggle"
        aria-label={open ? 'סגירת התפריט' : 'פתיחת התפריט'}
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen(!open)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            d={open ? 'M6 6l12 12M18 6L6 18' : 'M3 6h18M3 12h18M3 18h18'}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <nav id="site-menu" className="menu-panel" aria-label="תפריט" hidden={!open}>
        {LINKS.map(link => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
        <button
          type="button"
          className="cta cta-ink"
          onClick={e => {
            setOpen(false);
            onDemo(e);
          }}
        >
          לתיאום הדגמה
        </button>
      </nav>
    </div>
  );
}
