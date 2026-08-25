import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import './i18n/i18n.js';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: '10px',
          background: '#1f2937',
          color: '#f9fafb',
          fontSize: '13px',
          fontFamily: 'Inter, sans-serif',
        },
        success: {
          iconTheme: { primary: '#6366f1', secondary: '#fff' },
        },
        error: {
          iconTheme: { primary: '#f87171', secondary: '#fff' },
        },
      }}
    />
  </StrictMode>
);
