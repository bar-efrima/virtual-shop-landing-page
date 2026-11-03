import { describe, expect, it } from 'vitest';
import { analyticsUrl, parseAttribution } from './attribution';

describe('parseAttribution', () => {
  it('reads the UTM parameters and ignores the rest', () => {
    expect(parseAttribution('?utm_source=linkedin&utm_campaign=q4&foo=bar')).toEqual({
      utm_source: 'linkedin',
      utm_campaign: 'q4',
    });
  });
  it('drops values that look like personal data', () => {
    expect(parseAttribution('?utm_term=noa@company.co.il&utm_content=050-123-4567&utm_source=mail')).toEqual({
      utm_source: 'mail',
    });
  });
});

describe('analyticsUrl', () => {
  it('keeps campaign parameters only', () => {
    expect(analyticsUrl('https://x.test/shop/?utm_source=a&email=noa@company.co.il&name=noa&gclid=abc#top')).toBe(
      'https://x.test/shop/?utm_source=a&gclid=abc',
    );
  });
  it('removes personal data hidden in a UTM value', () => {
    expect(analyticsUrl('https://x.test/?utm_term=noa@company.co.il')).toBe('https://x.test/');
  });
});
