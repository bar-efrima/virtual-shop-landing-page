import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';
import { initAnalytics } from './lib/analytics';
import './styles.css';

initAnalytics();

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);
// the production build ships prerendered markup; the dev server doesn't
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
