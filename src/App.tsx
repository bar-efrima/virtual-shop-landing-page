import { useCallback, useEffect, useRef, useState } from 'react';
import { ContactDialog } from './components/ContactDialog';
import { DemoVideo } from './components/DemoVideo';
import { CustomStore, Features, Fit, Pilot, ToCheckout } from './components/Features';
import { Check, Chevron, Logo, Sparks, Swoosh } from './components/Marks';
import { Menu } from './components/Menu';
import { StickyCta } from './components/StickyCta';
import { track, type CtaLocation } from './lib/analytics';
import { armReveals } from './lib/motion';

const FACTS = ['במחשב ובנייד', 'הקטלוג והמיתוג שלכם', 'מהעגלה לעמוד הרכישה באתר שלכם'];

export function App() {
  const [formOpen, setFormOpen] = useState(false);
  const closeForm = useCallback(() => setFormOpen(false), []);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const playFilm = useRef<(() => void) | null>(null);

  useEffect(armReveals, []);

  const openForm = (location: CtaLocation) => (e: React.MouseEvent<HTMLButtonElement>) => {
    lastTrigger.current = e.currentTarget;
    track({ name: 'demo_cta_click', params: { cta_location: location } });
    setFormOpen(true);
  };

  return (
    <>
      <div className="site-header-line">
        <header className="site-header wrap">
          <Logo />
          <button type="button" className="cta cta-small" onClick={openForm('header')}>
            לתיאום הדגמה
          </button>
          <Menu onDemo={openForm('menu')} />
        </header>
      </div>

      <main>
        <section className="hero wrap" aria-labelledby="headline">
          <h1 id="headline" className="headline">
            הסופר שלכם,
            <br />
            בתלת־ממד.
          </h1>
          <Swoosh />
          <p className="lede">
            סופרמרקט תלת־ממדי שנפתח ישר מהדפדפן. הלקוחות נעים בין המדפים, מחפשים מוצרים וממלאים עגלה.
          </p>
          <div className="hero-actions">
            <button type="button" className="cta cta-ink" onClick={openForm('hero')}>
              לתיאום הדגמה
              <Chevron />
            </button>
            <button type="button" className="cta cta-ghost" onClick={() => playFilm.current?.()}>
              צפו בסיור · 1:00
            </button>
          </div>
          <ul className="facts">
            {FACTS.map(fact => (
              <li key={fact}>
                <Check />
                {fact}
              </li>
            ))}
          </ul>
        </section>
        <DemoVideo playRef={playFilm} />
        <Features />
        <CustomStore />
        <ToCheckout />
        <Fit />
        <Pilot onDemo={openForm('pilot')} />
        <div className="closing-wrap wrap">
          <section className="closing" aria-labelledby="closing-title">
            <h2 id="closing-title" className="reveal">
              <Sparks />
              בואו ניכנס לחנות
            </h2>
            <div className="closing-actions reveal">
              <button type="button" className="cta" onClick={openForm('closing')}>
                לתיאום הדגמה
              </button>
              <span>הדגמה אישית של 15 דקות</span>
            </div>
          </section>
        </div>
      </main>

      <footer className="footer wrap">
        <div className="footer-brand">
          <Logo />
          <p>חנות וירטואלית בתלת־ממד לקמעונאי המזון בישראל</p>
        </div>
        <p className="footer-note">
          המוצרים והמותגים בסרטון ובתמונות מוצגים להמחשה בלבד, ואין בהם כדי להעיד על שיתוף פעולה עם רשת או יצרן כלשהם.
        </p>
      </footer>

      <StickyCta onDemo={openForm('sticky')} />
      <ContactDialog open={formOpen} onClose={closeForm} returnFocusTo={lastTrigger} />
    </>
  );
}
