import { useCallback, useEffect, useRef, useState } from 'react';
import { ContactDialog } from './components/ContactDialog';
import { DemoVideo } from './components/DemoVideo';
import { Features } from './components/Features';
import { Cube, Logo } from './components/Marks';
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
      <div className="hero-band">
        <Cube className="float-cube float-cube-1" />
        <Cube className="float-cube float-cube-2" />
        <Cube className="float-cube float-cube-3" />
        <header className="hero wrap">
          <div className="brand">
            <Logo />
            <span dir="ltr">Virtual-Shop</span>
          </div>
          <h1 className="headline">
            הסופר שלכם,
            <br />
            חוויית קנייה ייחודית
          </h1>
          <p className="lede">סופרמרקט תלת־ממדי לרשתות מזון, שנכנסים אליו ישר מהדפדפן.</p>
          <button type="button" className="cta" onClick={openForm('hero')}>
            לתיאום הדגמה
          </button>
        </header>
      </div>

      <main>
        <DemoVideo />
        <Features />
        <section className="closing" aria-labelledby="closing-title">
          <div className="wrap">
            <h2 id="closing-title" className="reveal">
              בואו נראה לכם את החנות
            </h2>
            <button type="button" className="cta" onClick={openForm('closing')}>
              לתיאום הדגמה
            </button>
          </div>
        </section>
      </main>

      <footer className="footer wrap">
        <p>המוצרים והמותגים בסרטון מוצגים להמחשה בלבד, ואין בהם כדי להעיד על שיתוף פעולה עם רשת או יצרן כלשהם.</p>
      </footer>

      <ContactDialog open={formOpen} onClose={closeForm} returnFocusTo={lastTrigger} />
    </>
  );
}
