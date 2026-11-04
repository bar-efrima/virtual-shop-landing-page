/* The logo and the small hand-drawn marks around the headings. */
import { media } from '../lib/config';

export function Logo() {
  return <img className="logo" src={media.logo} alt="Virtual-Shop" width={960} height={191} />;
}

export function Swoosh() {
  return (
    <svg className="swoosh" viewBox="0 0 320 16" aria-hidden="true" focusable="false">
      <path d="M4 13C90 5 230 2 316 6" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
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
