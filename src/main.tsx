import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Get the theme from localStorage if available, otherwise check user preferences
const getInitialTheme = () => {
  const storedTheme = localStorage.getItem('theme')
  if (storedTheme) {
    return storedTheme
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Apply theme to document
const applyTheme = (theme: string) => {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

// Apply the initial theme
applyTheme(getInitialTheme())

// PWA Update Detection
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // Show update notification
    const updateNotification = document.createElement('div');
    updateNotification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #1a1a1a;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-family: Inter, sans-serif;
        text-align: center;
      ">
        App updated! Please refresh to see the latest version.
        <button onclick="window.location.reload()" style="
          margin-left: 12px;
          background: white;
          color: #1a1a1a;
          border: none;
          padding: 4px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
        ">Refresh</button>
      </div>
    `;
    document.body.appendChild(updateNotification);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (updateNotification.parentNode) {
        updateNotification.remove();
      }
    }, 10000);
  });
}

// Handle PWA display mode
const handlePWADisplayMode = () => {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isInWebAppiOS = (window.navigator as any).standalone === true;
  
  if (isStandalone || isInWebAppiOS) {
    document.body.classList.add('pwa-standalone');
    // Add extra padding for status bar on mobile
    document.documentElement.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top, 24px)');
  }
};

// Check display mode on load and when it changes
handlePWADisplayMode();
window.matchMedia('(display-mode: standalone)').addListener(handlePWADisplayMode);

const rootElement = document.getElementById("root")
if (!rootElement) throw new Error("Failed to find the root element")

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
