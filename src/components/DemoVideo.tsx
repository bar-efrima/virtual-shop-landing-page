/*
 * The store window: a silent clip from the real store on hover, and on request the full film with sound.
 * The film downloads only when the visitor presses play, and pressing is what allows the sound.
 */
import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import { track } from '../lib/analytics';
import { media } from '../lib/config';
import { HoverVideo } from './HoverVideo';

const TITLE = 'סיור בסופרמרקט התלת־ממדי';

export function DemoVideo({ playRef }: { playRef: MutableRefObject<(() => void) | null> }) {
  const filmRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const trackedStart = useRef(false);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);

  const onPlay = () => {
    setStarted(true);
    if (trackedStart.current) return;
    trackedStart.current = true;
    track({ name: 'video_start', params: { video_title: TITLE } });
  };

  const play = () => {
    setFailed(false);
    filmRef.current?.play().catch(() => setFailed(true));
  };

  useEffect(() => {
    playRef.current = () => {
      sectionRef.current?.scrollIntoView({ block: 'center' });
      play();
    };
    return () => {
      playRef.current = null;
    };
  }, [playRef]);

  return (
    <section ref={sectionRef} className="film wrap" aria-label="סרטון הדגמה">
      <figure className={`window${started ? ' is-playing' : ''}`}>
        <div className="window-bar" aria-hidden="true">
          <i />
          <i />
          <i />
          <span>הסופר שלכם</span>
        </div>
        <div className="window-screen" dir="ltr" data-hover-play>
          <HoverVideo name="hero" phone tap={false} paused={started} label="מעבר ירקות בחנות התלת־ממדית, כפי שנראה מהעגלה" />
          <video
            ref={filmRef}
            className="window-film"
            src={media.video}
            preload="none"
            playsInline
            controls={started}
            width={1280}
            height={720}
            tabIndex={started ? undefined : -1}
            aria-hidden={started ? undefined : true}
            aria-label={`${TITLE}: נכנסים לחנות, בוחרים ירקות, מחפשים מוצר, עוברים לסופר טבעוני וממשיכים לעמוד הרכישה.`}
            onPlay={onPlay}
            onError={() => setFailed(true)}
          >
            <track kind="captions" src={media.captions} srcLang="he" label="עברית" />
          </video>
          {!started && (
            <button type="button" className="play" onClick={play} aria-label="הפעלת סרטון ההדגמה, עם קול">
              <span dir="rtl">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
                </svg>
                צפו בסיור · 1:00
              </span>
            </button>
          )}
        </div>
      </figure>
      {failed && (
        <p className="screen-error" role="alert">
          לא הצלחנו להפעיל את הסרטון. כדאי לרענן את הדף ולנסות שוב.
        </p>
      )}
    </section>
  );
}
