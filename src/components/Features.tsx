/* How the store works in three steps, then the offer: start small with one department. */
import type { MouseEvent } from 'react';
import { Chevron } from './Marks';

const ICONS = {
  move: 'M12 3v18M3 12h18M12 3L9 6M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3',
  search: 'M16 16l5 5M18 10.5a7.5 7.5 0 1 1-15 0a7.5 7.5 0 0 1 15 0z',
  cart: 'M2.5 4H5l2.6 11.5a1.5 1.5 0 0 0 1.5 1.2h8.3a1.5 1.5 0 0 0 1.5-1.2L20.5 8H6M10 20.5h.01M17 20.5h.01',
};

const STEPS = [
  { icon: ICONS.move, title: 'משוטטים', text: 'נעים בחופשיות בסופר התלת־ממדי' },
  { icon: ICONS.search, title: 'מוצאים', text: 'מאתרים בקלות מוצרים ומחלקות' },
  { icon: ICONS.cart, title: 'אוספים', text: 'מוסיפים לסל במהלך הסיור' },
];

export function Steps() {
  return (
    <section id="how" className="steps wrap" aria-labelledby="steps-title">
      <h2 id="steps-title" className="steps-title">
        <span>איך זה עובד?</span>
      </h2>
      <ol className="steps-list">
        {STEPS.map(step => (
          <li key={step.title} className="reveal">
            <span className="step-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  d={step.icon}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Cubes() {
  const cube = 'M0-20L17-10V10L0 20L-17 10V-10ZM-17-10L0 0L17-10M0 0V20';
  return (
    <svg className="pilot-cubes" viewBox="0 0 104 92" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round">
        <path d={cube} transform="translate(32 68)" fill="#f7f5ef" />
        <path d={cube} transform="translate(72 68)" fill="#f7f5ef" />
        <path d={cube} transform="translate(52 34)" fill="#a8d03a" />
      </g>
    </svg>
  );
}

export function Pilot({ onDemo }: { onDemo: (e: MouseEvent<HTMLButtonElement>) => void }) {
  return (
    <section id="pilot" className="pilot wrap" aria-label="מתחילים במחלקה אחת">
      <div className="pilot-text only-wide reveal">
        <h2>מתחילים במחלקה אחת</h2>
        <p>פיילוט מהיר וממוקד, שמאפשר לראות את החנות שלכם בתלת־⁠ממד ולבדוק היתכנות לפני שמרחיבים.</p>
        <p>
          בהמשך, ניתן להרחיב לחנות מלאה ולכלול גם <mark>מתחמים לפי העדפות קנייה</mark> (אופציונלי), כמו טבעוני, צמחוני או
          ללא חלב.
        </p>
      </div>
      <div className="pilot-card only-narrow reveal">
        <div>
          <h2>
            מתחילים
            <br />
            במחלקה אחת
          </h2>
          <p>פיילוט מהיר שמדגים את הערך ובודק היתכנות.</p>
        </div>
        <Cubes />
      </div>
      <div className="pilot-image reveal">
        <img
          src="./media/stills/deals.webp"
          alt="לוח מבצעי השבוע בתוך החנות התלת־ממדית, כפי שנראה מהעגלה"
          width={960}
          height={540}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="pilot-row only-narrow reveal">
        <span className="pilot-row-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M4 10h16l-1.7 9a1.5 1.5 0 0 1-1.5 1.2H7.2a1.5 1.5 0 0 1-1.5-1.2L4 10zM8 10l3-6M16 10l-3-6M9.5 14v3M14.5 14v3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div>
          <h3>מתחמים לפי העדפות קנייה</h3>
          <p>בהמשך: מתחמים ללקוחות לפי העדפותיהם, כמו טבעוני, צמחוני או ללא חלב.</p>
        </div>
      </div>
      <button type="button" className="cta cta-ink pilot-cta only-narrow" onClick={onDemo}>
        לתיאום הדגמה
        <Chevron />
      </button>
    </section>
  );
}
