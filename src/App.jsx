import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion'
import './App.css'

/**
 * Main App Component
 * Modern React implementation with performance optimizations
 */

// Constants
const CONSTANTS = {
  LOADING_DELAY: 300,
  PARTICLE_COUNT: 30,
  EVENT_ROTATION_INTERVAL: 5000,
  SCROLL_THRESHOLD: 50,
  OBSERVE_DELAY: 50,
  OBSERVE_TIMER_DELAY: 100
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function App() {
  // State management with proper typing
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [particles, setParticles] = useState([])
  const [activeSection, setActiveSection] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [openFolder, setOpenFolder] = useState(null)
  const [currentEventIndex, setCurrentEventIndex] = useState(0)
  
  // Event types for animated rotation - Real upcoming Chicago area events
  const eventTypes = [
    'the 312 Comedy Festival',
    'Lollapalooza',
    'a Cubs game at Wrigley Field',
    'a Bulls game at the United Center',
    'the Chicago Marathon',
    'the Taste of Chicago',
    'the Chicago Jazz Festival',
    'the Art Institute of Chicago',
    'the Chicago Blues Festival',
    'a White Sox game',
    'the Chicago Air and Water Show',
    'the Chicago Food Truck Festival',
    'the Chicago Beer Festival',
    'the Chicago Film Festival',
    'the Chicago Auto Show',
    'the Chicago Architecture Boat Tour'
  ]

  // Event-themed meeting phrases (witty, no "we met at")
  const getEventMeetingPhrase = (eventType) => {
    const phrases = {
      'the 312 Comedy Festival': 'Laughing so hard we almost missed the next act at the 312 Comedy Festival',
      'Lollapalooza': 'Dancing like no one was watching (but everyone was) at Lollapalooza',
      'a Cubs game at Wrigley Field': 'Cheering so loud we lost our voices at Wrigley Field',
      'a Bulls game at the United Center': 'Courtside seats, but we only had eyes for each other',
      'the Chicago Marathon': 'Crossing the finish line together, holding hands the whole way',
      'the Taste of Chicago': 'Sharing our favorite bites and discovering we had the same taste',
      'the Chicago Jazz Festival': 'Swaying to the music, lost in the moment and each other',
      'the Art Institute of Chicago': 'Getting lost in the galleries and finding each other',
      'the Chicago Blues Festival': 'Feeling the blues (but in a good way, we promise)',
      'a White Sox game': 'Rooting for the Sox, but really rooting for each other',
      'the Chicago Air and Water Show': 'Watching planes do tricks while we did our own',
      'the Chicago Food Truck Festival': 'Trying every food truck until we couldn\'t move',
      'the Chicago Beer Festival': 'Cheers-ing so much we lost count at the Chicago Beer Festival',
      'the Chicago Film Festival': 'Debating the plot twist for hours after the premiere',
      'the Chicago Auto Show': 'Test driving cars and our chemistry at the Chicago Auto Show',
      'the Chicago Architecture Boat Tour': 'Falling for the skyline (and accidentally for each other)'
    }
    return phrases[eventType] || eventType
  }
  
  // Refs for DOM elements
  const heroRef = useRef(null)
  const featureCardsRef = useRef([])
  const journeyStepsRef = useRef([])
  const differentiatorsRef = useRef([])
  const observerRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const mobileMenuToggleRef = useRef(null)
  const waitlistFormRef = useRef(null)

  // Smooth scroll handler with throttling
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrollableHeight = documentHeight - windowHeight
    const progress = scrollableHeight > 0 ? (currentScrollY / scrollableHeight) * 100 : 0
    
    setScrollY(currentScrollY)
    setIsScrolled(currentScrollY > CONSTANTS.SCROLL_THRESHOLD)
    setScrollProgress(progress)
    
    // Determine active section based on scroll position
    const sections = ['journey', 'mission', 'features', 'coming-soon']
    const scrollPosition = currentScrollY + windowHeight / 3
    
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = document.getElementById(sections[i])
      if (section && section.offsetTop <= scrollPosition) {
        setActiveSection(sections[i])
        break
      }
    }
  }, [])

  // Mouse move handler with throttling
  const handleMouseMove = useCallback((e) => {
    requestAnimationFrame(() => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    })
  }, [])


  // Smooth scroll to section
  const scrollToSection = useCallback((e, sectionId) => {
    e.preventDefault()
    setIsMobileMenuOpen(false) // Close mobile menu on navigation
    document.body.style.overflow = ''
    document.body.classList.remove('menu-open')
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }
  }, [])

  // Toggle mobile menu with focus management
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => {
      const newState = !prev
      // Prevent body scroll when menu is open
      if (newState) {
        document.body.style.overflow = 'hidden'
        document.body.classList.add('menu-open')
        // Focus management: move focus to menu when opened
        setTimeout(() => {
          if (mobileMenuRef.current) {
            const firstLink = mobileMenuRef.current.querySelector('a')
            if (firstLink) {
              firstLink.focus()
            }
          }
        }, 100)
      } else {
        document.body.style.overflow = ''
        document.body.classList.remove('menu-open')
        // Restore focus to toggle button when closed
        if (mobileMenuToggleRef.current) {
          mobileMenuToggleRef.current.focus()
        }
      }
      return newState
    })
  }, [])

  // Email validation handler
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

  // Handle email input change
  const handleEmailChange = useCallback((e) => {
    const value = e.target.value
    setEmail(value)
    if (emailError && value) {
      validateEmail(value)
    }
  }, [emailError, validateEmail])

  // Handle form submission
  const handleFormSubmit = useCallback(async (e) => {
    e.preventDefault()
    
    if (!validateEmail(email)) {
      return
    }

    setIsSubmitting(true)
    setEmailError('')
    setSubmitSuccess(false)

    try {
      // Validate URL before opening
      const waitlistUrl = 'https://forms.gle/your-waitlist-link'
      if (waitlistUrl && waitlistUrl.startsWith('http')) {
        // Simulate form submission delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Open external link
        window.open(waitlistUrl, '_blank', 'noopener,noreferrer')
        
        setSubmitSuccess(true)
        setEmail('')
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false)
        }, 5000)
      } else {
        setEmailError('Invalid form URL')
      }
    } catch (error) {
      console.warn('Error submitting form:', error)
      setEmailError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }, [email, validateEmail])

  // Close mobile menu when clicking outside or on escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      try {
        if (isMobileMenuOpen && !e.target.closest('.nav') && !e.target.closest('.mobile-menu-toggle')) {
          setIsMobileMenuOpen(false)
          document.body.style.overflow = ''
          document.body.classList.remove('menu-open')
        }
      } catch (error) {
        console.warn('Error handling click outside:', error)
      }
    }

    const handleEscape = (e) => {
      try {
        if (e.key === 'Escape' && isMobileMenuOpen) {
          setIsMobileMenuOpen(false)
          document.body.style.overflow = ''
          document.body.classList.remove('menu-open')
        }
      } catch (error) {
        console.warn('Error handling escape key:', error)
      }
    }

    if (isMobileMenuOpen) {
      try {
        document.addEventListener('click', handleClickOutside, { passive: true })
        document.addEventListener('keydown', handleEscape, { passive: true })
        document.body.style.overflow = 'hidden'
        document.body.classList.add('menu-open')
      } catch (error) {
        console.warn('Error setting up mobile menu listeners:', error)
      }
    } else {
      try {
        document.body.style.overflow = ''
        document.body.classList.remove('menu-open')
      } catch (error) {
        console.warn('Error cleaning up mobile menu:', error)
      }
    }

    return () => {
      try {
        document.removeEventListener('click', handleClickOutside)
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = ''
        document.body.classList.remove('menu-open')
      } catch (error) {
        console.warn('Error removing mobile menu listeners:', error)
      }
    }
  }, [isMobileMenuOpen])

  // Animated event type rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEventIndex((prevIndex) => (prevIndex + 1) % eventTypes.length)
    }, CONSTANTS.EVENT_ROTATION_INTERVAL)

    return () => clearInterval(interval)
  }, [eventTypes.length])


  // Intersection Observer setup with proper cleanup
  useEffect(() => {
    // Throttled scroll handler
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }

    let observer
    try {
      observer = new IntersectionObserver((entries) => {
        try {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !entry.target.classList.contains('animate-in')) {
              entry.target.classList.add('animate-in')
              // Unobserve after animation to improve performance
              if (observer) {
                observer.unobserve(entry.target)
              }
            }
          })
        } catch (error) {
          console.warn('Error in IntersectionObserver callback:', error)
        }
      }, observerOptions)
    } catch (error) {
      console.warn('Error creating IntersectionObserver:', error)
      observer = null
    }

    if (observer) {
      observerRef.current = observer
    }

    // Observe all elements with animate-on-scroll class
    const observeAllAnimatedElements = () => {
      try {
        if (!observer) return
        const animatedElements = document.querySelectorAll('.animate-on-scroll')
        animatedElements.forEach((el) => {
          try {
            if (el && !el.classList.contains('animate-in')) {
              // Check if element is already in viewport
              const rect = el.getBoundingClientRect()
              const isInViewport = rect.top < window.innerHeight && rect.bottom > 0
              if (isInViewport) {
                el.classList.add('animate-in')
              } else {
                observer.observe(el)
              }
            }
          } catch (error) {
            console.warn('Error observing element:', error)
          }
        })
      } catch (error) {
        console.warn('Error in observeAllAnimatedElements:', error)
      }
    }
    
    // Update differentiators refs array size
    if (differentiatorsRef.current.length < 10) {
      differentiatorsRef.current = [...differentiatorsRef.current, ...Array(10 - differentiatorsRef.current.length).fill(null)]
    }

    // Observe refs
    const allRefs = [
      ...featureCardsRef.current,
      ...journeyStepsRef.current,
      ...differentiatorsRef.current,
    ].filter(Boolean)

    if (observer) {
      allRefs.forEach((el) => {
        try {
          if (el) observer.observe(el)
        } catch (error) {
          console.warn('Error observing ref element:', error)
        }
      })
    }

    // Observe all animated elements after a short delay to ensure DOM is ready
    const observeTimer = setTimeout(() => {
      observeAllAnimatedElements()
    }, CONSTANTS.OBSERVE_TIMER_DELAY)

    // Also observe on window load as a fallback
    const handleLoad = () => {
      observeAllAnimatedElements()
    }
    window.addEventListener('load', handleLoad)

    // Event listeners
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // Initialize particle system
    const initParticles = () => {
      const newParticles = []
      for (let i = 0; i < CONSTANTS.PARTICLE_COUNT; i++) {
        newParticles.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 5,
          duration: 10 + Math.random() * 10
        })
      }
      setParticles(newParticles)
    }

    // Simulate loading completion
    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
      initParticles()
      // Observe elements after loading completes
      setTimeout(() => {
        observeAllAnimatedElements()
      }, CONSTANTS.OBSERVE_DELAY)
    }, CONSTANTS.LOADING_DELAY)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('load', handleLoad)
      if (observer) {
        observer.disconnect()
      }
      clearTimeout(loadingTimer)
      clearTimeout(observeTimer)
    }
  }, [handleScroll, handleMouseMove])

  // Memoized parallax styles for performance
  const parallaxStyle = useMemo(() => ({
    transform: `translateY(${scrollY * 0.3}px)`,
    opacity: 1 - Math.min(scrollY / 500, 0.5),
  }), [scrollY])

  const mouseParallaxStyle = useMemo(() => ({
    transform: `translate(${(mousePosition.x - 50) * 0.02}px, ${(mousePosition.y - 50) * 0.02}px)`,
  }), [mousePosition])

  // Header class based on scroll
  const headerClass = useMemo(() => 
    `header ${isScrolled ? 'scrolled' : ''}`, 
    [isScrolled]
  )

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading DatingPool...</p>
      </div>
    )
  }

  // Framer Motion page transition variants
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
      className="App"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      <header className={headerClass}>
        <div className="container">
          <div className="logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <h1 className="logo-text">DatingPool</h1>
          </div>
          <button 
            ref={mobileMenuToggleRef}
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="main-navigation"
          >
            <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
          <div 
            className={`mobile-menu-backdrop ${isMobileMenuOpen ? 'mobile-open' : ''}`}
            onClick={toggleMobileMenu}
            aria-hidden="true"
          ></div>
          <nav 
            ref={mobileMenuRef}
            id="main-navigation"
            className={`nav ${isMobileMenuOpen ? 'mobile-open' : ''}`} 
            role="navigation" 
            aria-label="Main navigation"
            aria-hidden={!isMobileMenuOpen}
          >
            <a 
              href="#journey" 
              className={`nav-link ${activeSection === 'journey' ? 'active' : ''}`}
              onClick={(e) => scrollToSection(e, 'journey')}
              aria-label="How it works"
            >
              How It Works
            </a>
            <a 
              href="#mission" 
              className={`nav-link ${activeSection === 'mission' ? 'active' : ''}`}
              onClick={(e) => scrollToSection(e, 'mission')}
              aria-label="Our Mission"
            >
              Our Mission
            </a>
            <a 
              href="#features" 
              className={`nav-link ${activeSection === 'features' ? 'active' : ''}`}
              onClick={(e) => scrollToSection(e, 'features')}
              aria-label="Features"
            >
              Features
            </a>
            <a 
              href="#coming-soon" 
              className={`nav-link nav-link-cta glow-primary ${activeSection === 'coming-soon' ? 'active' : ''}`}
              onClick={(e) => scrollToSection(e, 'coming-soon')}
              aria-label="Join waitlist"
            >
              Join Waitlist
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* Scroll Progress Indicator */}
        <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }}></div>
        
        <section className="hero" ref={heroRef} aria-label="Hero section">
          <div className="hero-background" style={parallaxStyle} aria-hidden="true"></div>
          <div className="particles-container" aria-hidden="true">
            {particles.map((particle, i) => (
              <div key={i} className="particle" style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`
              }}></div>
            ))}
          </div>
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title animate-fade-in shimmer-text">
                Find an Event You Love. Find Someone to Share It With.
              </h1>
              <p className="hero-subtitle animate-fade-in-delay">
                <strong>We're flipping the script. Find something you want to do, then find someone to go with. No more "where should we meet?"—the plan is built in.</strong>
              </p>
              <p className="hero-slogan animate-fade-in-delay">
                A dating app that actually works? Now that's the real event!
              </p>
            </div>
          </div>
        </section>

        <section id="journey" className="journey" aria-label="How it works">
          <div className="container">
            <h2 className="section-title animate-on-scroll">
              How It Works
            </h2>
            <p className="section-intro animate-on-scroll">
              No more swiping into the void. We've built a platform where every match has a built-in plan. Here's how it works:
            </p>
            <div className="journey-steps" role="list">
              <motion.article 
                className="journey-step interactive-card" 
                ref={(el) => (journeyStepsRef.current[0] = el)}
                style={mouseParallaxStyle}
                role="listitem"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="step-header">
                  <div className="step-visual">
                    <div className="step-number" aria-hidden="true">1</div>
                  </div>
                  <div className="step-icon" aria-hidden="true">🤖</div>
                </div>
                <div className="step-content">
                  <h3>AI-Powered Discovery</h3>
                  <p>
                    Our AI learns your interests and shows you events you'll love. Browse events and optionally purchase tickets all in one place. Every interaction makes your recommendations smarter.
                  </p>
                  <div className="step-you-get">
                    <strong>You Get:</strong>
                    <span>A personalized event feed with optional ticket purchasing that gets smarter with every use</span>
                  </div>
                </div>
              </motion.article>
              <motion.article 
                className="journey-step interactive-card" 
                ref={(el) => (journeyStepsRef.current[1] = el)}
                style={mouseParallaxStyle}
                role="listitem"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="step-header">
                  <div className="step-visual">
                    <div className="step-number" aria-hidden="true">2</div>
                  </div>
                  <div className="step-icon" aria-hidden="true">🏊</div>
                </div>
                <div className="step-content">
                  <h3>Join the Pool</h3>
                  <p>
                    Commit to an event—no ticket purchase required. Joining a pool filters for people serious about meeting up and signals your intent.
                  </p>
                  <div className="step-you-get">
                    <strong>You Get:</strong>
                    <span>Meet people at the same event, while helping our AI target better future events for you</span>
                  </div>
                </div>
              </motion.article>
              <motion.article 
                className="journey-step interactive-card" 
                ref={(el) => (journeyStepsRef.current[2] = el)}
                style={mouseParallaxStyle}
                role="listitem"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="step-header">
                  <div className="step-visual">
                    <div className="step-number" aria-hidden="true">3</div>
                  </div>
                  <div className="step-icon" aria-hidden="true">🎯</div>
                </div>
                <div className="step-content">
                  <h3>AI Matching</h3>
                  <p>
                    Our AI finds the best matches in each event pool using insights from thousands of successful connections.
                  </p>
                  <div className="step-you-get">
                    <strong>You Get:</strong>
                    <span>Compatible matches for every event, powered by real connection data</span>
                  </div>
                </div>
              </motion.article>
              <motion.article 
                className="journey-step journey-step-last interactive-card" 
                ref={(el) => (journeyStepsRef.current[3] = el)}
                style={mouseParallaxStyle}
                role="listitem"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="step-header">
                  <div className="step-visual">
                    <div className="step-number" aria-hidden="true">4</div>
                  </div>
                  <div className="step-icon" aria-hidden="true">💬</div>
                </div>
                <div className="step-content">
                  <h3>Organized Conversations</h3>
                  <p>
                    Chats are organized by event. No "what should we do?" The plan is built in.
                  </p>
                  <div className="step-you-get">
                    <strong>You Get:</strong>
                    <span>Clear conversations that lead to real meetups</span>
                  </div>
                </div>
              </motion.article>
            </div>
          </div>
        </section>

        <section id="mission" className="mission" aria-label="Our Mission">
          <div className="container">
            <div className="mission-content">
              <h2 className="section-title animate-on-scroll">
                Built for the Next Generation
              </h2>
              <p className="section-intro animate-on-scroll">
                We're reimagining how Gen Z and Millennials connect in real life.
              </p>
              <div className="event-type-box animate-on-scroll" aria-live="polite" aria-atomic="true">
                <h3 className="emoji-comparison-title animate-on-scroll">Tell Your Friends a Better Story</h3>
                <div className="emoji-comparison-container">
                  <motion.div 
                    className="emoji-comparison-item tinder-comparison"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="emoji-bubble-item">
                      <span className="emoji-character">👫</span>
                      <div className="speech-bubble tinder-bubble">
                        <span className="bubble-text">"We Met on Tinder!"</span>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="vs-divider"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    VS
                  </motion.div>
                  
                  <motion.div 
                    className="emoji-comparison-item event-comparison"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <div className="emoji-bubble-item">
                      <span className="emoji-character">👫</span>
                      <div className="speech-bubble event-bubble">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={currentEventIndex}
                            className="bubble-text event-type-rotating"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ 
                              duration: 0.5,
                              ease: [0.4, 0, 0.2, 1]
                            }}
                          >
                            "{getEventMeetingPhrase(eventTypes[currentEventIndex])}"
                          </motion.span>
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
              <div className="mission-text animate-on-scroll">
                <p>
                  <strong>Here's the thing:</strong> Traditional dating apps were built for a different era. They're designed to keep you swiping, 
                  not meeting. They profit from your time on the app, not your success off it. We saw the problem and decided to fix it.
                </p>
                <p>
                  We've all been there: swiping endlessly, conversations that go nowhere, dates that never happen. So we asked: <strong>What if dating apps actually led to dates?</strong>
                </p>
                <p>
                  That question became our mission. We're building DatingPool to be the dating app for the next generation—one that values 
                  real connections over endless scrolling, quality over quantity, and getting you off your phone and into real life.
                </p>
              </div>
              <div className="mission-location animate-on-scroll">
                <p>DatingPool is proudly headquartered in Austin, TX</p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="differentiators" aria-label="Features">
          <div className="container">
            <div className="features-header">
              <div className="section-badge animate-on-scroll">Why DatingPool Actually Works</div>
              <h2 className="section-title animate-on-scroll">
                Old Dating Apps Are Broken. We're Built for the Next Generation.
              </h2>
              <div className="problem-solution animate-on-scroll">
                <div className="problem-box">
                  <h3 className="problem-title">The Old Way ❌</h3>
                  <ul className="problem-list">
                    <li>Too many matches that go nowhere</li>
                    <li>Too many "where should we meet?" conversations that fizzle out</li>
                    <li>Too much time wasted</li>
                  </ul>
                </div>
                <div className="solution-box">
                  <h3 className="solution-title">The DatingPool Way ✅</h3>
                  <p className="solution-lead">
                    Find your vibe, then find your plus-one.
                  </p>
                  <p className="solution-description">
                    The best dates happen at events you want to attend. No ghosting when there's a concert to go to.
                  </p>
                  <div className="solution-benefits">
                    <span className="benefit-tag">Lower Pressure</span>
                    <span className="benefit-tag">Higher Success Rate</span>
                  </div>
                </div>
              </div>
              <div className="platform-vision animate-on-scroll">
                <p className="vision-text">
                  We connect <strong>event discovery</strong>, <strong>optional ticket purchasing</strong>, and <strong>dating</strong> in one seamless experience. 
                  Find events, optionally buy tickets, and connect with people—all in one place. Every interaction makes the platform smarter, 
                  giving you better matches and events over time. <strong>That's the future of dating.</strong>
                </p>
              </div>
            </div>
            <div className="differentiators-grid" role="list">
              <motion.article 
                className="differentiator-card feature-card-featured interactive-card animate-on-scroll" 
                ref={(el) => (differentiatorsRef.current[0] = el)}
                role="listitem"
                data-feature="planning"
                initial={{ opacity: 0, y: 30, rotateX: 0 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.02, y: -5, rotateX: 2, rotateY: 2 }}
                whileTap={{ scale: 0.98 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="card-top">
                  <div className="feature-icon-wrapper">
                    <div className="diff-icon" aria-hidden="true">✅</div>
                  </div>
                  <div className="stat-badge stat-badge-success">0 Planning Friction</div>
                </div>
                <div className="card-content">
                  <h3>Solves "What Next?"</h3>
                  <div className="visual-timeline">
                    <div className="timeline-item">
                      <span className="timeline-icon">🎪</span>
                      <span>Find Event</span>
                    </div>
                    <div className="timeline-arrow">→</div>
                    <div className="timeline-item">
                      <span className="timeline-icon">🏊</span>
                      <span>Join Pool</span>
                    </div>
                    <div className="timeline-arrow">→</div>
                    <div className="timeline-item">
                      <span className="timeline-icon">📍</span>
                      <span>Venue</span>
                    </div>
                    <div className="timeline-arrow">→</div>
                    <div className="timeline-item">
                      <span className="timeline-icon">⏰</span>
                      <span>Time</span>
                    </div>
                    <div className="timeline-arrow">→</div>
                    <div className="timeline-item">
                      <span className="timeline-icon">👋</span>
                      <span>Meet</span>
                    </div>
                  </div>
                  <p>
                    Tired of the endless "where should we meet?" back-and-forth? We've got you covered. Find events and join the pool—no ticket purchase required. 
                    Optionally purchase tickets if you want. The event is the date. The venue and time are set. 
                    Just pick a spot to meet up and you're ready to go.
                  </p>
                </div>
              </motion.article>
              <motion.article 
                className="differentiator-card interactive-card animate-on-scroll" 
                ref={(el) => (differentiatorsRef.current[1] = el)}
                role="listitem"
                data-feature="matching"
                initial={{ opacity: 0, y: 30, rotateX: 0 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.02, y: -5, rotateX: 2, rotateY: 2 }}
                whileTap={{ scale: 0.98 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="card-top">
                  <div className="feature-icon-wrapper">
                    <div className="diff-icon" aria-hidden="true">💬</div>
                  </div>
                  <div className="stat-badge stat-badge-blue">100% Built-in Icebreakers</div>
                </div>
                <div className="card-content">
                  <h3>Context-Driven Matching</h3>
                  <div className="visual-comparison">
                    <div className="comparison-bad">
                      <span className="comparison-label">Traditional</span>
                      <span className="comparison-text">"Hey"</span>
                    </div>
                    <div className="comparison-arrow-small">→</div>
                    <div className="comparison-good">
                      <span className="comparison-label">DatingPool</span>
                      <span className="comparison-text">"See you at the concert?"</span>
                    </div>
                  </div>
                  <p>
                    Every match comes with a built-in conversation starter. Instead of "hey," try "Are you excited for 
                    the headliner?" or "Which food truck are you hitting first?" Real conversations start with real interests.
                  </p>
                </div>
              </motion.article>
              <motion.article 
                className="differentiator-card interactive-card animate-on-scroll" 
                ref={(el) => (differentiatorsRef.current[2] = el)}
                role="listitem"
                data-feature="intent"
                initial={{ opacity: 0, y: 30, rotateX: 0 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.02, y: -5, rotateX: 2, rotateY: 2 }}
                whileTap={{ scale: 0.98 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="card-top">
                  <div className="feature-icon-wrapper">
                    <div className="diff-icon" aria-hidden="true">🎯</div>
                  </div>
                  <div className="stat-badge stat-badge-orange">3x Higher Intent</div>
                </div>
                <div className="card-content">
                  <h3>High-Intent Connections</h3>
                  <div className="intent-meter">
                    <div className="meter-label">Commitment Level</div>
                    <div className="meter-bar">
                      <div className="meter-fill" style={{ width: '95%' }}></div>
                    </div>
                    <div className="meter-value">95% Committed</div>
                  </div>
                  <p>
                    By joining an event pool, people are showing real intent. No more matching with serial swipers who never 
                    respond. Everyone in your pool has already committed to showing up. That's commitment you can count on.
                  </p>
                </div>
              </motion.article>
              <motion.article 
                className="differentiator-card interactive-card animate-on-scroll" 
                ref={(el) => (differentiatorsRef.current[3] = el)}
                role="listitem"
                data-feature="organization"
                initial={{ opacity: 0, y: 30, rotateX: 0 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.02, y: -5, rotateX: 2, rotateY: 2 }}
                whileTap={{ scale: 0.98 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="card-top">
                  <div className="feature-icon-wrapper">
                    <div className="diff-icon" aria-hidden="true">📁</div>
                  </div>
                  <div className="stat-badge stat-badge-purple">Zero Inbox Chaos</div>
                </div>
                <div className="card-content">
                  <h3>Organized Messaging</h3>
                  <div className="folder-structure">
                    <div 
                      className={`folder-item ${openFolder === 'pizza-workshop' ? 'active' : ''}`}
                      onClick={() => setOpenFolder(openFolder === 'pizza-workshop' ? null : 'pizza-workshop')}
                    >
                      <span className="folder-icon">📂</span>
                      <span>Pizza Making Workshop</span>
                      <span className="folder-arrow">{openFolder === 'pizza-workshop' ? '▼' : '▶'}</span>
                    </div>
                    {openFolder === 'pizza-workshop' && (
                      <div id="pizza-workshop-chats" className="chat-list" role="list">
                        <div className="chat-item" role="listitem">
                          <div className="chat-avatar" aria-hidden="true">👤</div>
                          <span className="chat-name">Sarah</span>
                        </div>
                        <div className="chat-item" role="listitem">
                          <div className="chat-avatar" aria-hidden="true">👤</div>
                          <span className="chat-name">Mike</span>
                        </div>
                        <div className="chat-item" role="listitem">
                          <div className="chat-avatar" aria-hidden="true">👤</div>
                          <span className="chat-name">Emma</span>
                        </div>
                        <div className="chat-item" role="listitem">
                          <div className="chat-avatar" aria-hidden="true">👤</div>
                          <span className="chat-name">Alex</span>
                        </div>
                      </div>
                    )}
                    <div 
                      className={`folder-item ${openFolder === 'running-club' ? 'active' : ''}`}
                      onClick={() => setOpenFolder(openFolder === 'running-club' ? null : 'running-club')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setOpenFolder(openFolder === 'running-club' ? null : 'running-club')
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-expanded={openFolder === 'running-club'}
                      aria-controls="running-club-chats"
                    >
                      <span className="folder-icon">📂</span>
                      <span>3Run2 Running Club</span>
                      <span className="folder-arrow">{openFolder === 'running-club' ? '▼' : '▶'}</span>
                    </div>
                    {openFolder === 'running-club' && (
                      <div id="running-club-chats" className="chat-list" role="list">
                        <div className="chat-item" role="listitem">
                          <div className="chat-avatar" aria-hidden="true">👤</div>
                          <span className="chat-name">Jordan</span>
                        </div>
                        <div className="chat-item" role="listitem">
                          <div className="chat-avatar" aria-hidden="true">👤</div>
                          <span className="chat-name">Taylor</span>
                        </div>
                        <div className="chat-item" role="listitem">
                          <div className="chat-avatar" aria-hidden="true">👤</div>
                          <span className="chat-name">Casey</span>
                        </div>
                      </div>
                    )}
                    <div 
                      className={`folder-item ${openFolder === 'tbox-crawl' ? 'active' : ''}`}
                      onClick={() => setOpenFolder(openFolder === 'tbox-crawl' ? null : 'tbox-crawl')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setOpenFolder(openFolder === 'tbox-crawl' ? null : 'tbox-crawl')
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-expanded={openFolder === 'tbox-crawl'}
                      aria-controls="tbox-crawl-chats"
                    >
                      <span className="folder-icon">📂</span>
                      <span>TBOX Christmas Bar Crawl</span>
                      <span className="folder-arrow">{openFolder === 'tbox-crawl' ? '▼' : '▶'}</span>
                    </div>
                    {openFolder === 'tbox-crawl' && (
                      <div id="tbox-crawl-chats" className="chat-list" role="list">
                        <div className="chat-item" role="listitem">
                          <div className="chat-avatar" aria-hidden="true">👤</div>
                          <span className="chat-name">Chris</span>
                        </div>
                        <div className="chat-item" role="listitem">
                          <div className="chat-avatar" aria-hidden="true">👤</div>
                          <span className="chat-name">Morgan</span>
                        </div>
                        <div className="chat-item" role="listitem">
                          <div className="chat-avatar" aria-hidden="true">👤</div>
                          <span className="chat-name">Riley</span>
                        </div>
                        <div className="chat-item" role="listitem">
                          <div className="chat-avatar" aria-hidden="true">👤</div>
                          <span className="chat-name">Sam</span>
                        </div>
                      </div>
                    )}
                    <div 
                      className={`folder-item ${openFolder === 'art-institute' ? 'active' : ''}`}
                      onClick={() => setOpenFolder(openFolder === 'art-institute' ? null : 'art-institute')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setOpenFolder(openFolder === 'art-institute' ? null : 'art-institute')
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-expanded={openFolder === 'art-institute'}
                      aria-controls="art-institute-chats"
                    >
                      <span className="folder-icon">📂</span>
                      <span>After Dark at the Art Institute</span>
                      <span className="folder-arrow">{openFolder === 'art-institute' ? '▼' : '▶'}</span>
                    </div>
                    {openFolder === 'art-institute' && (
                      <div id="art-institute-chats" className="chat-list" role="list">
                        <div className="chat-item" role="listitem">
                          <div className="chat-avatar" aria-hidden="true">👤</div>
                          <span className="chat-name">Drew</span>
                        </div>
                        <div className="chat-item" role="listitem">
                          <div className="chat-avatar" aria-hidden="true">👤</div>
                          <span className="chat-name">Jamie</span>
                        </div>
                        <div className="chat-item" role="listitem">
                          <div className="chat-avatar" aria-hidden="true">👤</div>
                          <span className="chat-name">Pat</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <p>
                    Your inbox is organized like a pro. All your conversations for Pizza Making Workshop are grouped together. 
                    All your 3Run2 Running Club matches are in their own folder. No more scrolling through endless chats trying 
                    to remember who's who or which event they're for.
                  </p>
                </div>
              </motion.article>
              <motion.article 
                className="differentiator-card interactive-card animate-on-scroll" 
                ref={(el) => (differentiatorsRef.current[4] = el)}
                role="listitem"
                data-feature="verification"
                initial={{ opacity: 0, y: 30, rotateX: 0 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ scale: 1.02, y: -5, rotateX: 2, rotateY: 2 }}
                whileTap={{ scale: 0.98 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="card-top">
                  <div className="feature-icon-wrapper">
                    <div className="diff-icon" aria-hidden="true">🛡️</div>
                  </div>
                  <div className="stat-badge stat-badge-green">100% Verified Profiles</div>
                </div>
                <div className="card-content">
                  <h3>Verified & Safe</h3>
                  <div className="verification-steps">
                    <div className="verification-step">
                      <span className="step-check">✓</span>
                      <span>Real-world validation</span>
                    </div>
                    <div className="verification-step">
                      <span className="step-check">✓</span>
                      <span>No fraud</span>
                    </div>
                    <div className="verification-step">
                      <span className="step-check">✓</span>
                      <span>Quality over quantity</span>
                    </div>
                  </div>
                  <p>
                    Every profile is verified through real-world events. No fake accounts, no catfishing, no bots. 
                    We're building a community of people doing things they love. Quality connections, not quantity matches.
                  </p>
                </div>
              </motion.article>
              <motion.article 
                className="differentiator-card interactive-card animate-on-scroll" 
                ref={(el) => (differentiatorsRef.current[5] = el)}
                role="listitem"
                data-feature="squading"
                initial={{ opacity: 0, y: 30, rotateX: 0 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ scale: 1.02, y: -5, rotateX: 2, rotateY: 2 }}
                whileTap={{ scale: 0.98 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="card-top">
                  <div className="feature-icon-wrapper">
                    <div className="diff-icon" aria-hidden="true">👥</div>
                  </div>
                  <div className="stat-badge stat-badge-yellow">Group Discounts</div>
                </div>
                <div className="card-content">
                  <h3>Squading Up</h3>
                  <div className="group-flow">
                    <div className="flow-item">
                      <span className="flow-icon">👤</span>
                      <span>You + Friends</span>
                    </div>
                    <div className="flow-arrow">→</div>
                    <div className="flow-item">
                      <span className="flow-icon">👥</span>
                      <span>Match Groups</span>
                    </div>
                    <div className="flow-arrow">→</div>
                    <div className="flow-item">
                      <span className="flow-icon">🎉</span>
                      <span>Event Together</span>
                    </div>
                  </div>
                  <p>
                    Going solo not your thing? No problem. Bring your friends and match with other groups at the event. 
                    Lower pressure, more fun, and you've got your crew for backup. <strong>Plus, get discounted group tickets when you squad up!</strong>
                  </p>
                </div>
              </motion.article>
              <motion.article 
                className="differentiator-card interactive-card animate-on-scroll" 
                ref={(el) => (differentiatorsRef.current[6] = el)}
                role="listitem"
                data-feature="tickets"
                initial={{ opacity: 0, y: 30, rotateX: 0 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.7 }}
                whileHover={{ scale: 1.02, y: -5, rotateX: 2, rotateY: 2 }}
                whileTap={{ scale: 0.98 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="card-top">
                  <div className="feature-icon-wrapper">
                    <div className="diff-icon" aria-hidden="true">🎫</div>
                  </div>
                  <div className="stat-badge stat-badge-blue">Integrated Tickets</div>
                </div>
                <div className="card-content">
                  <h3>Find & Purchase Tickets</h3>
                  <div className="visual-timeline">
                    <div className="timeline-item">
                      <span className="timeline-icon">🔍</span>
                      <span>Discover</span>
                    </div>
                    <div className="timeline-arrow">→</div>
                    <div className="timeline-item">
                      <span className="timeline-icon">🏊</span>
                      <span>Join Pool</span>
                    </div>
                    <div className="timeline-arrow">→</div>
                    <div className="timeline-item">
                      <span className="timeline-icon">🎫</span>
                      <span>Optional Tickets</span>
                    </div>
                  </div>
                  <p>
                    No need to switch between apps. Browse events and join the dating pool—ticket purchase is optional. 
                    Everything's seamlessly integrated. Purchase tickets if you want, or just join the pool to connect with others going to the same event.
                  </p>
                </div>
              </motion.article>
              <motion.article 
                className="differentiator-card interactive-card animate-on-scroll" 
                ref={(el) => (differentiatorsRef.current[7] = el)}
                role="listitem"
                data-feature="privacy"
                initial={{ opacity: 0, y: 30, rotateX: 0 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.8 }}
                whileHover={{ scale: 1.02, y: -5, rotateX: 2, rotateY: 2 }}
                whileTap={{ scale: 0.98 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="card-top">
                  <div className="feature-icon-wrapper">
                    <div className="diff-icon" aria-hidden="true">🔒</div>
                  </div>
                  <div className="stat-badge stat-badge-purple">Privacy Protected</div>
                </div>
                <div className="card-content">
                  <h3>Blocked User Detection</h3>
                  <div className="visual-comparison">
                    <div className="comparison-bad">
                      <span className="comparison-label">You</span>
                      <span className="comparison-text">⚠️ Blocked user in pool</span>
                    </div>
                    <div className="comparison-arrow-small">→</div>
                    <div className="comparison-good">
                      <span className="comparison-label">Them</span>
                      <span className="comparison-text">👁️ Can't see you</span>
                    </div>
                  </div>
                  <p>
                    We've got your back. If someone you've blocked joins the same event pool, you'll get a private notification. 
                    They won't know you're there, and you can choose to avoid that event or stay in the pool with full privacy. 
                    <strong>Your safety and comfort come first—no awkward encounters, no bad experiences.</strong>
                  </p>
                </div>
              </motion.article>
              <motion.article 
                className="differentiator-card interactive-card animate-on-scroll" 
                ref={(el) => (differentiatorsRef.current[8] = el)}
                role="listitem"
                data-feature="waitlisting"
                initial={{ opacity: 0, y: 30, rotateX: 0 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.9 }}
                whileHover={{ scale: 1.02, y: -5, rotateX: 2, rotateY: 2 }}
                whileTap={{ scale: 0.98 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="card-top">
                  <div className="feature-icon-wrapper">
                    <div className="diff-icon" aria-hidden="true">⚡</div>
                  </div>
                  <div className="stat-badge stat-badge-orange">Smart Matching</div>
                </div>
                <div className="card-content">
                  <h3>Intelligent Waitlisting</h3>
                  <div className="visual-timeline">
                    <div className="timeline-item">
                      <span className="timeline-icon">👤</span>
                      <span>Join Waitlist</span>
                    </div>
                    <div className="timeline-arrow">→</div>
                    <div className="timeline-item">
                      <span className="timeline-icon">🔍</span>
                      <span>AI Matches Criteria</span>
                    </div>
                    <div className="timeline-arrow">→</div>
                    <div className="timeline-item">
                      <span className="timeline-icon">🎯</span>
                      <span>Critical Mass</span>
                    </div>
                    <div className="timeline-arrow">→</div>
                    <div className="timeline-item">
                      <span className="timeline-icon">🏊</span>
                      <span>Pool Opens</span>
                    </div>
                  </div>
                  <p>
                    Skip the empty pools. Our AI intelligently waitlists you until enough compatible matches join. 
                    When your pool hits critical mass, it opens automatically—and you get <strong>quality matches from day one.</strong> 
                    No more lackluster experiences. No wasted time.
                  </p>
                </div>
              </motion.article>
              <motion.article 
                className="differentiator-card interactive-card animate-on-scroll" 
                ref={(el) => (differentiatorsRef.current[9] = el)}
                role="listitem"
                data-feature="coordination"
                initial={{ opacity: 0, y: 30, rotateX: 0 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 1.0 }}
                whileHover={{ scale: 1.02, y: -5, rotateX: 2, rotateY: 2 }}
                whileTap={{ scale: 0.98 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="card-top">
                  <div className="feature-icon-wrapper">
                    <div className="diff-icon" aria-hidden="true">📱</div>
                  </div>
                  <div className="stat-badge stat-badge-blue">Event Day Tools</div>
                </div>
                <div className="card-content">
                  <h3>Coordination Tools</h3>
                  <div className="visual-timeline">
                    <div className="timeline-item">
                      <span className="timeline-icon">💬</span>
                      <span>Chat</span>
                    </div>
                    <div className="timeline-arrow">→</div>
                    <div className="timeline-item">
                      <span className="timeline-icon">🎫</span>
                      <span>Both Buy Tickets</span>
                    </div>
                    <div className="timeline-arrow">→</div>
                    <div className="timeline-item">
                      <span className="timeline-icon">📅</span>
                      <span>Event Day</span>
                    </div>
                    <div className="timeline-arrow">→</div>
                    <div className="timeline-item">
                      <span className="timeline-icon">🔓</span>
                      <span>Tools Unlock</span>
                    </div>
                  </div>
                  <div className="coordination-tools-grid">
                    <div className="coordination-tool-item">
                      <span className="tool-icon">📞</span>
                      <span className="tool-name">Calls</span>
                    </div>
                    <div className="coordination-tool-item">
                      <span className="tool-icon">📹</span>
                      <span className="tool-name">Video</span>
                    </div>
                    <div className="coordination-tool-item">
                      <span className="tool-icon">📸</span>
                      <span className="tool-name">Photos</span>
                    </div>
                    <div className="coordination-tool-item">
                      <span className="tool-icon">📍</span>
                      <span className="tool-name">Location Sharing</span>
                    </div>
                    <div className="coordination-tool-item">
                      <span className="tool-icon">🛡️</span>
                      <span className="tool-name">Event Security</span>
                    </div>
                  </div>
                  <p>
                    When the event day arrives, unlock powerful coordination tools to make meeting up seamless. Make calls, 
                    video chat, share photos, and share your location—all within the app. <strong>If both of you purchase tickets 
                    in the chat, these features unlock instantly.</strong>
                  </p>
                  <p>
                    Plus, access event security features like emergency contacts, safe meeting spots, and real-time safety check-ins. 
                    No more "where are you?" texts. Just smooth coordination with built-in safety.
                  </p>
                </div>
              </motion.article>
            </div>
          </div>
        </section>


        <section id="coming-soon" className="cta" aria-label="Join waitlist">
          <div className="container">
            <div className="cta-content">
              <h2 className="cta-title animate-on-scroll">Join the Waitlist</h2>
              <p className="section-intro animate-on-scroll">
                Get early access and exclusive perks when we launch.
              </p>
              <p className="cta-subtitle animate-on-scroll">
                We're launching our pilot program in Austin, Houston, and Chicago first. Limited spots available—join now for priority access.
              </p>
              <form 
                ref={waitlistFormRef}
                className="waitlist-form animate-on-scroll" 
                onSubmit={handleFormSubmit}
                aria-live="polite"
                noValidate
              >
                <div className="waitlist-input-wrapper">
                  <motion.input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={() => validateEmail(email)}
                    className={`waitlist-input ${emailError ? 'error' : ''} ${submitSuccess ? 'success' : ''}`}
                    required
                    aria-label="Email address"
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? 'email-error' : submitSuccess ? 'submit-success' : undefined}
                    disabled={isSubmitting}
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                  {emailError && (
                    <div id="email-error" className="waitlist-error" role="alert" aria-live="assertive">
                      {emailError}
                    </div>
                  )}
                  {submitSuccess && (
                    <div id="submit-success" className="waitlist-success" role="alert" aria-live="polite">
                      Success! Check your email for next steps.
                    </div>
                  )}
                </div>
                <motion.button
                  type="submit"
                  className="waitlist-button glow-primary"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  aria-label="Join the DatingPool waitlist"
                  disabled={isSubmitting || !!emailError}
                  aria-busy={isSubmitting}
                >
                  <span>{isSubmitting ? 'Submitting...' : 'Join Waitlist'}</span>
                  {!isSubmitting && (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M7 3L14 10L7 17" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </motion.button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer" role="contentinfo">
        <div className="container">
          <div className="footer-content">
            <div className="footer-tagline">
              <h3>DatingPool</h3>
              <p>Real dates. Real people. Real places.</p>
            </div>
            <div className="footer-links">
              <a href="/partner" className="footer-link">
                Partner Portal
              </a>
            </div>
            <div className="footer-copyright">
              <p>Copyright © 2025 DatingPool LLC. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  )
}

export default App
