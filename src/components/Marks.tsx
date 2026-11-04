/* The logo and the small hand-drawn marks around the headings. */
import { media } from '../lib/config';

export function Logo() {
  return <img className="logo" src={media.logo} alt="Virtual-Shop" width={960} height={191} />;
}

export function Swoosh() {
  return (
    <svg className="swoosh" viewBox="0 0 320 24" aria-hidden="true" focusable="false">
      <defs>
        <filter id="marker-rough" x="-5%" y="-60%" width="110%" height="220%">
          <feTurbulence type="fractalNoise" baseFrequency=".035 .55" numOctaves="2" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="5" />
        </filter>
      </defs>
      {/* a real marker: rough edges, and darker where the second pass overlaps the first */}
      <g filter="url(#marker-rough)" fill="none" stroke="currentColor" strokeLinecap="round">
        <path d="M314 9C226 6 112 8 8 13" strokeWidth="10" opacity=".85" />
        <path d="M314 12C250 11 190 12 118 13" strokeWidth="7" opacity=".55" />
      </g>
    </svg>
  );
}

export function Check() {
  return (
    <svg className="check" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M5 12.5l4.5 4.5L19 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Sparks() {
  return (
    <svg className="sparks" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <path d="M26 4l6 11M9 11l11 8M4 29l13-1" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

export function Chevron() {
  return (
    <svg className="chevron" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M15 5l-7 7 7 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
