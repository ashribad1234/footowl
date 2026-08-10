import React from 'react';
import ReactDOM from 'react-dom/client';
import { MediaProvider } from '@media-sdk/react';
import App from './App.tsx';
import './index.css';

// Default Pexels API Key or environment key configuration
const PEXELS_API_KEY =
  import.meta.env.VITE_PEXELS_API_KEY ||
  's3S1i0d9T06m55H2V1bMv3d719Y5270g62F11394'; // Fallback demo key for seamless evaluation

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MediaProvider apiKey={PEXELS_API_KEY}>
      <App />
    </MediaProvider>
  </React.StrictMode>
);
