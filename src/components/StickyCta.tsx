/* The phone's demo button: shows once the hero's button has scrolled away, hides at the page's end. */
import { useEffect, useState, type MouseEvent } from 'react';
import { Chevron } from './Marks';

export function StickyCta({ onDemo }: { onDemo: (e: MouseEvent<HTMLButtonElement>) => void }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const hero = document.querySelector('.hero-actions');
    const end = document.querySelector('.closing');
    if (!hero || !end) return;
    let heroAbove = false;
    let endInView = false;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.target === hero) heroAbove = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        if (entry.target === end) endInView = entry.isIntersecting || entry.boundingClientRect.top < 0;
      }
      setShown(heroAbove && !endInView);
    });
    observer.observe(hero);
    observer.observe(end);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`sticky-cta${shown ? ' is-shown' : ''}`}>
      <button type="button" className="cta cta-ink" onClick={onDemo} tabIndex={shown ? undefined : -1}>
        לתיאום הדגמה
        <Chevron />
      </button>
    </div>
  );
}
