/* The page's settings, read at build time (see .env.example). */
export const config = {
  gaMeasurementId: (import.meta.env.VITE_GA_MEASUREMENT_ID ?? '').trim(),
  formEndpoint: (import.meta.env.VITE_FORM_ENDPOINT ?? '').trim(),
};

export const media = {
  logo: './media/logo.webp',
  video: './media/demo.mp4',
  poster: './media/poster.webp',
  captions: './media/demo.he.vtt',
  clip: (name: string) => `./media/clips/${name}.mp4`,
  clipPoster: (name: string) => `./media/clips/${name}.webp`,
};
