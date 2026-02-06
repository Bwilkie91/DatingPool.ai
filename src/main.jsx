import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import App from './App'
import PartnerSignIn from './PartnerSignIn'
import Contact from './Contact'
import PrivacyPolicy from './PrivacyPolicy'
import TermsOfService from './TermsOfService'
import ErrorBoundary from './ErrorBoundary'
import { PlaceholderLayout } from './PlaceholderLayout'
import './index.css'

function AnimatedRoutes() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<App />} />
        <Route path="/partner" element={<PartnerSignIn />} />
        <Route path="/partner/signin" element={<PartnerSignIn />} />
        <Route path="/partner/forgot-password" element={<PlaceholderLayout title="Forgot password"><p className="placeholder-text">Password reset will be available here.</p></PlaceholderLayout>} />
        <Route path="/partner/signup" element={<PlaceholderLayout title="Become a partner"><p className="placeholder-text">Partner sign-up will be available here.</p></PlaceholderLayout>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
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

