/*
 * The product video. Nothing is downloaded until the visitor presses play, so the video file
 * doesn't weigh on the page. Pressing play is what starts the sound, so browsers allow it.
 */
import { useRef, useState } from 'react';
import { track } from '../lib/analytics';
import { media } from '../lib/config';

const TITLE = 'סיור בסופרמרקט התלת־ממדי';

export function DemoVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
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
    videoRef.current?.play().catch(() => setFailed(true));
  };

  return (
    <section className="film" aria-label="סרטון הדגמה">
      <figure className="screen" dir="ltr">
        <video
          ref={videoRef}
          src={media.video}
          poster={media.poster}
          preload="none"
          playsInline
          controls={started}
          width={1280}
          height={720}
          aria-label={`${TITLE}: נכנסים לחנות, נוסעים עם העגלה בין המעברים, מחפשים מוצר ומגיעים לקופה.`}
          onPlay={onPlay}
          onError={() => setFailed(true)}
        >
          <track kind="captions" src={media.captions} srcLang="he" label="עברית" />
        </video>
        {!started && (
          <button type="button" className="play" onClick={play} aria-label="הפעלת סרטון ההדגמה">
            <span>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
              </svg>
            </span>
          </button>
        )}
        {!started && (
          <div className="screen-bar" aria-hidden="true">
            <span>0:00 / 1:06</span>
            <i />
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5zM15.5 9a4 4 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </figure>
      {failed && (
        <p className="screen-error" role="alert">
          לא הצלחנו להפעיל את הסרטון. כדאי לרענן את הדף ולנסות שוב.
        </p>
      )}
    </section>
  );
}
