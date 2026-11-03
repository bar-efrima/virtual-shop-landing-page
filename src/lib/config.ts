/* The page's settings, read at build time (see .env.example). */
export const config = {
  gaMeasurementId: (import.meta.env.VITE_GA_MEASUREMENT_ID ?? '').trim(),
  formEndpoint: (import.meta.env.VITE_FORM_ENDPOINT ?? '').trim(),
};

export const media = {
  video: './media/demo.mp4',
  poster: './media/poster.webp',
  captions: './media/demo.he.vtt',
};
