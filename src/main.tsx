import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'

const isCapacitor = typeof window !== 'undefined' && ((window as any).__CAPACITOR__ || window.location.protocol === 'file:')
const Router = isCapacitor ? HashRouter : BrowserRouter

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router
      basename={isCapacitor ? undefined : '/cerveceria-burgos-recipes-app'}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <App />
    </Router>
  </StrictMode>,
)
