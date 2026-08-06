import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';
import App from './App.jsx';
import AuthProvider from './context/AuthProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1b1e18',
              color: '#f1f3ea',
              border: '1px solid rgba(255,138,61,.18)',
              borderRadius: '14px',
              boxShadow: '0 20px 55px rgba(0,0,0,.38)',
            },
            success: { iconTheme: { primary: '#ff8a3d', secondary: '#171910' } },
            error: { iconTheme: { primary: '#ff7474', secondary: '#171910' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
