/*
 * A silent clip from the real store. It never starts by itself: it plays while the mouse is over
 * the nearest [data-hover-play] element, or on tap where there is no mouse, and nothing downloads
 * before that. With reduced motion or data saving on, hovering leaves the poster in place.
 */
import { useEffect, useRef } from 'react';
import { media } from '../lib/config';

interface Props {
  name: string;
  /** a separate crop for narrow screens */
  phone?: boolean;
  /** what the clip shows */
  label: string;
  /** a tap plays and pauses it; off where a tap already does something else */
  tap?: boolean;
  paused?: boolean;
}

export function HoverVideo({ name, phone = false, label, tap = true, paused = false }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    const target = video?.closest<HTMLElement>('[data-hover-play]');
    if (!video || !target) return;
    video.muted = true;
    if (paused) {
      video.pause();
      return;
    }
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const still = saveData || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lastPointer = 'mouse';

    const play = () => void video.play().catch(() => {});
    const onDown = (e: PointerEvent) => {
      lastPointer = e.pointerType;
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && !still) play();
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') video.pause();
    };
    const onClick = () => {
      if (!tap || lastPointer === 'mouse') return;
      if (video.paused) play();
      else video.pause();
    };
    const onPlaying = () => target.setAttribute('data-playing', '');
    const onStopped = () => target.removeAttribute('data-playing');

    target.addEventListener('pointerdown', onDown);
    target.addEventListener('pointerenter', onEnter);
    target.addEventListener('pointerleave', onLeave);
    target.addEventListener('click', onClick);
    video.addEventListener('play', onPlaying);
    video.addEventListener('pause', onStopped);
    return () => {
      target.removeEventListener('pointerdown', onDown);
      target.removeEventListener('pointerenter', onEnter);
      target.removeEventListener('pointerleave', onLeave);
      target.removeEventListener('click', onClick);
      video.removeEventListener('play', onPlaying);
      video.removeEventListener('pause', onStopped);
      video.pause();
    };
  }, [paused, tap]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={media.clipPoster(name)}
      width={960}
      height={540}
      aria-label={label}
    >
      {phone && <source media="(max-width: 620px)" src={media.clip(`${name}-phone`)} type="video/mp4" />}
      <source src={media.clip(name)} type="video/mp4" />
    </video>
  );
}
