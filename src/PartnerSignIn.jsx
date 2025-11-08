import React, { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './App.css'

const PartnerSignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const validateEmail = useCallback((emailValue) => {
    if (!emailValue.trim()) {
      setEmailError('Email is required')
      return false
    }
    if (!EMAIL_REGEX.test(emailValue)) {
      setEmailError('Please enter a valid email address')
      return false
    }
    setEmailError('')
    return true
  }, [])

  const validatePassword = useCallback((passwordValue) => {
    if (!passwordValue.trim()) {
      setPasswordError('Password is required')
      return false
    }
    if (passwordValue.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      return false
    }
    setPasswordError('')
    return true
  }, [])

  const handleEmailChange = useCallback((e) => {
    const value = e.target.value
    setEmail(value)
    if (emailError) {
      validateEmail(value)
    }
  }, [emailError, validateEmail])

  const handlePasswordChange = useCallback((e) => {
    const value = e.target.value
    setPassword(value)
    if (passwordError) {
      validatePassword(value)
    }
  }, [passwordError, validatePassword])

  const handleFormSubmit = useCallback(async (e) => {
    e.preventDefault()
    
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)
    
    if (!isEmailValid || !isPasswordValid) {
      return
    }

    setIsSubmitting(true)
    setSubmitSuccess(false)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In a real app, you would make an API call here
      // const response = await fetch('/api/partner/signin', { ... })
      
      setSubmitSuccess(true)
      setEmail('')
      setPassword('')
      
      // Redirect to partner dashboard after successful sign in
      setTimeout(() => {
        // window.location.href = '/partner/dashboard'
        console.log('Redirecting to partner dashboard...')
      }, 2000)
    } catch (error) {
      console.error('Error signing in:', error)
      setEmailError('Invalid email or password. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }, [email, password, validateEmail, validatePassword])

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
  }

  return (
    <motion.div 
      className="partner-signin-page"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      <header className="partner-header">
        <div className="container">
          <Link to="/" className="partner-logo">
            <h1 className="logo-text">DatingPool</h1>
          </Link>
          <Link to="/" className="partner-back-link">
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="partner-signin-main">
        <div className="container">
          <div className="partner-signin-content">
            <div className="partner-signin-box">
              <h1 className="partner-signin-title">Partner Portal</h1>
              <p className="partner-signin-subtitle">
                Sign in to access your partner dashboard and manage your events.
              </p>

              <form 
                className="partner-signin-form" 
                onSubmit={handleFormSubmit}
                noValidate
              >
                <div className="partner-input-wrapper">
                  <label htmlFor="partner-email" className="partner-label">
                    Email Address
                  </label>
                  <motion.input
                    id="partner-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={() => validateEmail(email)}
                    className={`partner-input ${emailError ? 'error' : ''} ${submitSuccess ? 'success' : ''}`}
                    required
                    aria-label="Email address"
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? 'partner-email-error' : undefined}
                    disabled={isSubmitting}
                    whileFocus={{ scale: 1.02, borderColor: 'var(--color-primary)' }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                  {emailError && (
                    <div id="partner-email-error" className="partner-error" role="alert" aria-live="assertive">
                      {emailError}
                    </div>
                  )}
                </div>

                <div className="partner-input-wrapper">
                  <label htmlFor="partner-password" className="partner-label">
                    Password
                  </label>
                  <motion.input
                    id="partner-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={() => validatePassword(password)}
                    className={`partner-input ${passwordError ? 'error' : ''}`}
                    required
                    aria-label="Password"
                    aria-invalid={!!passwordError}
                    aria-describedby={passwordError ? 'partner-password-error' : undefined}
                    disabled={isSubmitting}
                    whileFocus={{ scale: 1.02, borderColor: 'var(--color-primary)' }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                  {passwordError && (
                    <div id="partner-password-error" className="partner-error" role="alert" aria-live="assertive">
                      {passwordError}
                    </div>
                  )}
                </div>

                {submitSuccess && (
                  <div className="partner-success" role="alert" aria-live="polite">
                    Sign in successful! Redirecting...
                  </div>
                )}

                <button
                  type="submit"
                  className="partner-signin-button glow-primary"
                  aria-label="Sign in to partner portal"
                  disabled={isSubmitting || !!emailError || !!passwordError}
                  aria-busy={isSubmitting}
                >
                  <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
                  {!isSubmitting && (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M7 3L14 10L7 17" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>

                <div className="partner-signin-footer">
                  <Link to="/partner/forgot-password" className="partner-link">
                    Forgot password?
                  </Link>
                  <span className="partner-divider">•</span>
                  <Link to="/partner/signup" className="partner-link">
                    Become a partner
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <footer className="partner-footer">
        <div className="container">
          <p className="partner-footer-text">
            Need help? <Link to="/partner/contact" className="partner-link">Contact support</Link>
          </p>
        </div>
      </footer>
    </motion.div>
  )
}

export default PartnerSignIn

