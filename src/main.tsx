
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

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

const rootElement = document.getElementById("root")
if (!rootElement) throw new Error("Failed to find the root element")
  
createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
