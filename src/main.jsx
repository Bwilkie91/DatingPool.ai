import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import App from './App'
import ErrorBoundary from './ErrorBoundary'
import './index.css'

const PartnerSignIn = lazy(() => import('./PartnerSignIn'))
const Contact = lazy(() => import('./Contact'))
const PrivacyPolicy = lazy(() => import('./PrivacyPolicy'))
const TermsOfService = lazy(() => import('./TermsOfService'))
const PlaceholderLayout = lazy(() => import('./PlaceholderLayout').then(m => ({ default: m.PlaceholderLayout })))

function PlaceholderFallback() {
  return (
    <div className="loading-screen" style={{ minHeight: '100dvh' }} aria-live="polite">
      <div className="loading-spinner" aria-hidden="true" />
      <p>Loading...</p>
    </div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<App />} />
        <Route path="/partner" element={<Suspense fallback={<PlaceholderFallback />}><PartnerSignIn /></Suspense>} />
        <Route path="/partner/signin" element={<Suspense fallback={<PlaceholderFallback />}><PartnerSignIn /></Suspense>} />
        <Route path="/partner/forgot-password" element={<Suspense fallback={<PlaceholderFallback />}><PlaceholderLayout title="Forgot password"><p className="placeholder-text">Password reset will be available here.</p></PlaceholderLayout></Suspense>} />
        <Route path="/partner/signup" element={<Suspense fallback={<PlaceholderFallback />}><PlaceholderLayout title="Become a partner"><p className="placeholder-text">Partner sign-up will be available here.</p></PlaceholderLayout></Suspense>} />
        <Route path="/contact" element={<Suspense fallback={<PlaceholderFallback />}><Contact /></Suspense>} />
        <Route path="/privacy-policy" element={<Suspense fallback={<PlaceholderFallback />}><PrivacyPolicy /></Suspense>} />
        <Route path="/terms-of-service" element={<Suspense fallback={<PlaceholderFallback />}><TermsOfService /></Suspense>} />
      </Routes>
    </AnimatePresence>
  )
}

// Match Vite base (e.g. /DatingPool.ai/ on GitHub Pages) so routes resolve correctly
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename={basename}>
        <AnimatedRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)

