/*
 * UTM attribution. The campaign a visitor arrived from is kept for the browser session and goes
 * to Analytics and, with the lead, to the form service.
 *
 * Campaign links are sometimes built with an email or a phone number in them, so a value that
 * looks like one is dropped, and the address sent to Analytics keeps campaign parameters only.
 */
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;
const AD_CLICK_KEYS = ['gclid', 'gbraid', 'wbraid'];
const STORAGE_KEY = 'vs-attribution';
const MAX_LENGTH = 150;

export type Attribution = Partial<Record<(typeof UTM_KEYS)[number], string>>;

const looksPersonal = (value: string) => value.includes('@') || /\d[\d\s-]{7,}\d/.test(value);

function cleanValue(raw: string | null): string | null {
  const value = raw?.trim();
  if (!value || value.length > MAX_LENGTH || looksPersonal(value)) return null;
  return value;
}

export function parseAttribution(search: string): Attribution {
  const params = new URLSearchParams(search);
  const found: Attribution = {};
  for (const key of UTM_KEYS) {
    const value = cleanValue(params.get(key));
    if (value) found[key] = value;
  }
  return found;
}

/** the page's address for Analytics: no hash, and no query parameters but the campaign's */
export function analyticsUrl(href: string): string {
  const url = new URL(href);
  const kept = new URLSearchParams();
  for (const key of [...UTM_KEYS, ...AD_CLICK_KEYS]) {
    const value = cleanValue(url.searchParams.get(key));
    if (value) kept.set(key, value);
  }
  url.search = kept.toString();
  url.hash = '';
  return url.href;
}

/** this visit's campaign, or the one this session started with; storage may be blocked */
export function getAttribution(search = window.location.search): Attribution {
  const fromUrl = parseAttribution(search);
  try {
    if (Object.keys(fromUrl).length > 0) {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fromUrl));
      return fromUrl;
    }
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Attribution) : {};
  } catch {
    return fromUrl;
  }
}
