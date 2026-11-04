/*
 * Google Analytics 4, off unless a measurement ID is configured. The page view is sent by
 * gtag's `config` call; the only other events are the three below, and their parameters have no
 * field that could carry what a visitor typed into the form.
 */
import { analyticsUrl, getAttribution } from './attribution';
import { config } from './config';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type CtaLocation = 'header' | 'menu' | 'hero' | 'pilot' | 'closing';

type AnalyticsEvent =
  | { name: 'video_start'; params: { video_title: string } }
  | { name: 'demo_cta_click'; params: { cta_location: CtaLocation } }
  | { name: 'generate_lead'; params: { form_id: 'demo_request' } };

export function initAnalytics(): void {
  const id = config.gaMeasurementId;
  if (!/^G-[A-Z0-9]+$/i.test(id) || window.gtag) return;

  window.dataLayer = window.dataLayer ?? [];
  // gtag reads the `arguments` object itself: an array here is silently ignored
  window.gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', id, {
    page_location: analyticsUrl(window.location.href),
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    ...getAttribution(),
  });

  // calls made until now wait in dataLayer, so the script needn't compete with the first paint
  const load = () => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.append(script);
  };
  if (document.readyState === 'complete') load();
  else window.addEventListener('load', load, { once: true });
}

export function track({ name, params }: AnalyticsEvent): void {
  window.gtag?.('event', name, { ...params, ...getAttribution() });
}
