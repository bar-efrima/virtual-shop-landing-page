/* What's in the store: three highlights with a picture, then the rest as a short list. */
import { Cube } from './Marks';

const stillUrl = (name: string) => `./media/stills/${name}.webp`;

const HIGHLIGHTS = [
  { image: 'produce', title: 'מחלקות כמו בסניף', text: 'ארגזי ירקות במשקל, מקררים, מקפיאים, קופות וחניון.' },
  { image: 'cart', title: 'עגלה שמתמלאת', text: 'בוחרים כמות או משקל, והמוצר נוחת בסל מול העיניים.' },
  { image: 'deals', title: 'מבצעים ושטחי פרסום', text: 'לוחות מבצעים, קצות מעבר ומשטחים בתוך החנות.' },
];

const MORE = [
  { title: 'סופר שלם בגוף ראשון', text: 'נוסעים בין המעברים במקלדת, בעכבר או במגע.' },
  { title: 'אריזות מתמונות הקטלוג', text: 'מידול תלת מימדי של המוצרים שלכם.' },
  { title: 'חיפוש שמוביל למדף', text: 'מקלידים שם של מוצר, והעגלה נוסעת אליו לבד.' },
  { title: 'סופר בהתאמה אישית', text: 'טבעוני, צמחוני, ללא חלב או ללא בוטנים ואגוזים.' },
  { title: 'המיתוג שלכם', text: 'הקטלוג, הצבעים והשם של הרשת על השלטים והמדפים.' },
  { title: 'מהעגלה לקופה', text: 'הסל עובר מלא לחנות האונליין. החיבור כפוף לבדיקה טכנית.' },
];

export function Features() {
  return (
    <section className="features wrap" aria-labelledby="features-title">
      <h2 id="features-title" className="reveal">
        כל מה שאוהבים בסניף, בדפדפן
      </h2>
      <ul className="highlights">
        {HIGHLIGHTS.map(item => (
          <li key={item.title} className="reveal">
            <div className="highlight-image">
              <img src={stillUrl(item.image)} alt="" width={960} height={540} loading="lazy" decoding="async" />
            </div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </li>
        ))}
      </ul>
      <ul className="more">
        {MORE.map(item => (
          <li key={item.title} className="reveal">
            <Cube />
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
