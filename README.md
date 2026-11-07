# Virtual-Shop landing page

A Hebrew, right-to-left landing page for Virtual-Shop. It uses Vite, React and TypeScript, and the
page is prerendered at build time. This folder is self-contained, so it can become its own
repository as it is.

## Run

Needs Node 20+ and pnpm 9.

```sh
pnpm install
cp .env.example .env.local   # then fill in the values
pnpm dev                     # http://localhost:5174
pnpm test
pnpm build && pnpm preview   # the production build
```

## Settings

All are set at build time: in `.env.local` locally, and as repository variables on GitHub.

| Variable                 | Purpose                                              | When empty                                  |
| ------------------------ | ---------------------------------------------------- | ------------------------------------------- |
| `VITE_FORM_ENDPOINT`     | where the form posts                                 | the form shows an error; the deploy refuses |
| `VITE_GA_MEASUREMENT_ID` | GA4 measurement ID (`G-…`)                           | Analytics stays off and no script is loaded |
| `VITE_SITE_URL`          | the public address, for the canonical and share tags | those tags are left out                     |

### Form service

The form sends a JSON `POST` from the browser. Any service works if it allows cross-origin requests
and answers 2xx with a JSON body. The field names follow [Formspree](https://formspree.io)
(`_subject`, `_gotcha`), so it works with a form's endpoint directly. If Formspree rejects
submissions, check that reCAPTCHA is turned off for the form, since it doesn't apply to JSON requests.

The body has `name`, `email`, `company`, `message`, and any `utm_*` values, so each lead arrives with
its campaign.

The page shows success only after a 2xx JSON response that doesn't state a failure (`ok: false`,
`success: false` or an `error` field). Any other response counts as failed, and what the visitor typed
stays in the form so they can retry.

**Test a real submission after every change of endpoint**, and check that it reaches the inbox.

## Analytics

| Event            | When                               | Parameters      |
| ---------------- | ---------------------------------- | --------------- |
| `page_view`      | on load (sent by gtag)             | `page_location` |
| `video_start`    | first play in a page view          | `video_title`   |
| `demo_cta_click` | a "לתיאום הדגמה" button is clicked | `cta_location`  |
| `generate_lead`  | only after a successful submission | `form_id`       |

Every event also carries the visit's `utm_*` values. To report on them per event, register them as
custom dimensions in GA4. Mark `generate_lead` as a key event.

Nothing typed into the form is sent to Analytics. The event types have no field for it, and the address
sent as `page_location` keeps only `utm_*` and ad click IDs. UTM values that look like an email address
or a phone number are dropped.

GA4's enhanced measurement can also send its own `form_start` and `form_submit` events. These describe
the form, not its contents, but `form_submit` fires on an attempt rather than a success, so count leads
with `generate_lead`.

## Publish on GitHub Pages

1. Make this folder the root of a new repository and push it to `main`.
2. In Settings → Pages, set Source to **GitHub Actions**.
3. In Settings → Secrets and variables → Actions → Variables, add the settings above.
4. Run the workflow, or push again. `.github/workflows/deploy.yml` tests, builds and publishes.

## The video

`public/media/demo.mp4` is a 63-second H.264 film: a three-second opening, then the store, with a Hebrew
voice-over, subtitles burned into the picture and a music bed. `public/media/demo.he.vtt` holds the same
lines as captions. The file downloads only when a visitor presses play.

The picture was recorded frame by frame from the real store with a one-off copy of the main project's
recorder (`apps/web/scripts/record-demo.mjs`), changed to show the scenes, titles and subtitles of the
approved script. The store's purchase page in the film is an illustration and is labelled as one. Keep
promised results, and any statement that checkout is already connected, out of the film.

`scripts/make_film_audio.py` rebuilds the sound and captions (its header has the steps). The voice is
"Itamar - Israeli Hebrew Narrator" from ElevenLabs (Eleven v3), one recording per line. The music is the
track "Confident Launch". Before publishing a new cut, check that both licences allow commercial use: an
ElevenLabs paid plan does, the free plan does not.

`public/media/clips` holds silent loops recorded from the real store with the main project's recorder, in a one-off copy
without captions. Each clip has a poster of the same name.

Fonts are self-hosted under the SIL Open Font License (see `src/assets/fonts`).
