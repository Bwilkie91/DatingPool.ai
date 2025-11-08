import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import App from './App'
import PartnerSignIn from './PartnerSignIn'
import ErrorBoundary from './ErrorBoundary'
import './index.css'

function AnimatedRoutes() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<App />} />
        <Route path="/partner" element={<PartnerSignIn />} />
        <Route path="/partner/signin" element={<PartnerSignIn />} />
      </Routes>
    </AnimatePresence>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)

