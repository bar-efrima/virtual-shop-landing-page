/*
 * Elements marked .reveal fade in the first time they come into view. The hiding is armed from
 * here (html.motion), so without script or with reduced motion everything just shows.
 */
export function armReveals(): () => void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    return () => {};
  }
  document.documentElement.classList.add('motion');
  const observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -6% 0px' },
  );
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  return () => observer.disconnect();
}
