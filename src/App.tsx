import { useCallback, useEffect, useRef, useState } from 'react';
import { ContactDialog } from './components/ContactDialog';
import { DemoVideo } from './components/DemoVideo';
import { Pilot, Steps } from './components/Features';
import { Chevron, Logo, Sparks, Swoosh } from './components/Marks';
import { Menu } from './components/Menu';
import { track, type CtaLocation } from './lib/analytics';
import { armReveals } from './lib/motion';

export function App() {
  const [formOpen, setFormOpen] = useState(false);
  const closeForm = useCallback(() => setFormOpen(false), []);
  const lastTrigger = useRef<HTMLElement | null>(null);

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
          <div className="hero-text">
            <h1 id="headline" className="headline">
              הסופר שלכם,
              <br />
              בתלת־ממד.
            </h1>
            <Swoosh />
            <p className="lede">חוויית קנייה וירטואלית בסופר תלת־ממדי, שמקרבת את חוויית הסניף — לכל מסך.</p>
            <button type="button" className="cta cta-hero" onClick={openForm('hero')}>
              לתיאום הדגמה
              <Chevron />
            </button>
          </div>
          <DemoVideo />
        </section>
        <Steps />
        <Pilot onDemo={openForm('pilot')} />
        <div className="wrap">
          <section className="closing" aria-labelledby="closing-title">
            <h2 id="closing-title" className="reveal">
              <Sparks />
              בואו ניכנס לחנות
            </h2>
            <button type="button" className="cta" onClick={openForm('closing')}>
              לתיאום הדגמה
            </button>
          </section>
        </div>
      </main>

      <footer className="footer wrap">
        <div className="footer-brand">
          <Logo />
          <p>חנות וירטואלית בתלת־ממד לקמעונאי המזון בישראל</p>
        </div>
        <p className="footer-note">
          המוצרים והמותגים בסרטון מוצגים להמחשה בלבד, ואין בהם כדי להעיד על שיתוף פעולה עם רשת או יצרן כלשהם.
        </p>
      </footer>

      <ContactDialog open={formOpen} onClose={closeForm} returnFocusTo={lastTrigger} />
    </>
  );
}
