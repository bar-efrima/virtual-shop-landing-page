/*
 * Writes the rendered page into dist/index.html, so the headline and the video frame paint
 * before any JavaScript runs. React then hydrates this markup in the browser.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadEnv } from 'vite';

const root = path.resolve(import.meta.dirname, '..');
const htmlPath = path.join(root, 'dist/index.html');
const ssrDir = path.join(root, '.ssr');

const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);

// share cards need absolute addresses, so these tags exist only when the public address is known
const siteUrl = process.env.VITE_SITE_URL || loadEnv('production', root).VITE_SITE_URL;
const shareTags = siteUrl
  ? [
      `<link rel="canonical" href="${siteUrl}" />`,
      `<meta property="og:url" content="${siteUrl}" />`,
      `<meta property="og:image" content="${new URL('og.jpg', siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`)}" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
    ].join('\n    ')
  : '';

const html = fs
  .readFileSync(htmlPath, 'utf8')
  .replace('<!--share-tags-->', shareTags)
  .replace('<!--app-->', () => render());
fs.writeFileSync(htmlPath, html);
fs.rmSync(ssrDir, { recursive: true, force: true });
console.log(`prerendered ${path.relative(root, htmlPath)} (${(html.length / 1024).toFixed(1)} kB)`);
