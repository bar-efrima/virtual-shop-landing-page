/* What a shopper can do in the store, how it fits the chain, and how to start. */
import type { MouseEvent } from 'react';
import { HoverVideo } from './HoverVideo';
import { Chevron } from './Marks';

const FEATURES = [
  {
    clip: 'browse',
    label: 'נסיעה עם העגלה במעבר בין מדפים מלאים',
    title: 'משוטטים בין המדפים',
    text: 'דוחפים עגלה בין המחלקות ובוחרים מוצרים ישירות מהמדף.',
  },
  {
    clip: 'search',
    label: 'הקלדת שם מוצר בחיפוש, העגלה נוסעת למדף והמוצר מסומן בצהוב',
    title: 'מחפשים ומגיעים ישר למוצר',
    text: 'מקלידים שם מוצר, והעגלה מובילה למדף ומסמנת אותו.',
  },
  {
    clip: 'basket',
    label: 'בחירת משקל של כמה ירקות מהמדף, וכל אחד נוחת בסל',
    title: 'ממלאים את העגלה',
    text: 'בוחרים כמות או משקל ורואים את המוצר נכנס לסל.',
  },
  {
    clip: 'deals',
    label: 'נסיעה לעבר לוח מבצעי השבוע בתוך החנות',
    title: 'מציגים מבצעים בתוך החנות',
    text: 'מבליטים מוצרים נבחרים בלוחות מבצעים ובקצות המעברים.',
  },
];

export function Features() {
  return (
    <section id="how" className="features wrap" aria-labelledby="features-title">
      <header className="section-head reveal">
        <h2 id="features-title">מה אפשר לעשות בחנות?</h2>
        <p>לא עוד רשימת מוצרים. חנות שנכנסים אליה.</p>
      </header>
      <ul className="features-grid">
        {FEATURES.map(feature => (
          <li key={feature.title} className="feature reveal" data-hover-play>
            <div className="feature-media" dir="ltr">
              <HoverVideo name={feature.clip} label={feature.label} />
            </div>
            <div className="feature-body">
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

const STORE_TYPES = ['טבעוני', 'צמחוני', 'ללא חלב', 'ללא בוטנים ואגוזים'];

export function CustomStore() {
  return (
    <section id="custom" className="split wrap" aria-labelledby="custom-title">
      <div className="split-text reveal">
        <h2 id="custom-title">סופר מותאם אישית</h2>
        <p>כל לקוח בוחר את הסופר שמתאים לו, והחנות משתנה בהתאם: על המדפים נשארים המוצרים שמתאימים לבחירה, והמחלקות מתחלפות.</p>
        <ul className="store-types">
          {STORE_TYPES.map(type => (
            <li key={type}>{type}</li>
          ))}
        </ul>
        <p className="split-example">למשל, בסופר הטבעוני מחלקת הבשר מתחלפת בתחליפי בשר.</p>
        <p className="split-fine">ההתאמה מבוססת על נתוני המוצרים בקטלוג.</p>
      </div>
      <div className="split-media reveal" data-hover-play>
        <div className="feature-media" dir="ltr">
          <HoverVideo name="diet" label="בחירת סופר טבעוני בחנות, והמעבר למחלקה של תחליפי בשר" />
        </div>
      </div>
    </section>
  );
}

export function ToCheckout() {
  return (
    <section id="checkout" className="split split-flip wrap" aria-labelledby="checkout-title">
      <div className="split-text reveal">
        <h2 id="checkout-title">מהעגלה ישירות לעמוד הרכישה באתר שלכם</h2>
        <p>הלקוח מסיים לקנות בחנות התלת־ממדית, והעגלה עוברת מלאה לעמוד הרכישה באתר של הרשת. הוא משלם אצלכם, כמו בכל קנייה.</p>
        <p className="split-fine">החיבור לאתר הרשת כפוף לבדיקה טכנית. עמוד הרכישה בסרטון הוא להמחשה.</p>
      </div>
      <div className="split-media reveal" data-hover-play>
        <div className="feature-media" dir="ltr">
          <HoverVideo name="checkout" label="פתיחת העגלה בחנות, והמעבר להמחשה של עמוד הרכישה באתר הרשת" />
        </div>
      </div>
    </section>
  );
}

const FIT = [
  {
    icon: 'M4 7h16M4 12h16M4 17h16M7 4v16M17 4v16',
    title: 'הקטלוג שלכם',
    text: 'המוצרים והמחירים של הרשת, על המדפים.',
  },
  {
    icon: 'M4 5h16v9H4zM12 14v6M8 20h8',
    title: 'המיתוג שלכם',
    text: 'השם והצבעים של הרשת, על השלטים ובחנות.',
  },
];

export function Fit() {
  return (
    <section id="fit" className="fit wrap" aria-labelledby="fit-title">
      <header className="section-head reveal">
        <h2 id="fit-title">החנות של הרשת שלכם</h2>
        <p>הלקוחות נכנסים לחנות שלכם, לא לחנות של מישהו אחר.</p>
      </header>
      <ul className="fit-list">
        {FIT.map(item => (
          <li key={item.title} className="reveal">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                d={item.icon}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

const STEPS = ['בוחרים קטגוריה או קמפיין', 'מתאימים את המדפים לקטלוג ולמיתוג שלכם', 'בודקים את החוויה עם הלקוחות שלכם'];

export function Pilot({ onDemo }: { onDemo: (e: MouseEvent<HTMLButtonElement>) => void }) {
  return (
    <div className="pilot-band">
      <section id="pilot" className="pilot wrap" aria-labelledby="pilot-title">
        <header className="section-head reveal">
          <h2 id="pilot-title">מתחילים במחלקה אחת</h2>
          <p>קודם בודקים בקטן. מרחיבים כשמוכנים.</p>
        </header>
        <ol className="pilot-steps reveal">
          {STEPS.map((step, k) => (
            <li key={step}>
              <span>{k + 1}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
        <div className="pilot-end reveal">
          <button type="button" className="cta cta-ink" onClick={onDemo}>
            לתיאום הדגמה
            <Chevron />
          </button>
          <p>החיבור לקופה של הרשת כפוף לבדיקה טכנית.</p>
        </div>
      </section>
    </div>
  );
}
