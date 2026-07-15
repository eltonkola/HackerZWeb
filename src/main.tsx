import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppShell } from './AppShell.tsx'
import { routeFromLocation } from './routes.ts'

const initialRoute = routeFromLocation(window.location) ?? { type: 'feed', feed: 'top' }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppShell initialRoute={initialRoute} />
  </StrictMode>,
)

// Gated on prod: a service worker caching Vite's dev-server responses would
// fight HMR and serve stale modules.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
