import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence, useReducedMotion } from 'framer-motion'
import { CoverFlowCarousel } from './CoverFlowCarousel'
import { Icon } from './Icons'
import './App.css'

const poolVideoSrc = new URL('../pool.mp4', import.meta.url).href
const pool2VideoSrc = new URL('../pool2.mp4', import.meta.url).href
const pool3VideoSrc = new URL('../pool3.mp4', import.meta.url).href
const pool4VideoSrc = new URL('../pool4.mp4', import.meta.url).href
const pool5VideoSrc = new URL('../pool5.mp4', import.meta.url).href
const homeVideoSrc = new URL('../home.mp4', import.meta.url).href

const HERO_CAROUSEL_SOURCES = [pool5VideoSrc, pool3VideoSrc]
const HERO_SECOND_VIDEO_MAX_MS = 11000

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
  const [featureCardIndex, setFeatureCardIndex] = useState(0)
  const [journeyCardIndex, setJourneyCardIndex] = useState(0)
  const [featuresVideoReady, setFeaturesVideoReady] = useState(false)
  const [heroPhase, setHeroPhase] = useState('home')
  const [heroCarouselIndex, setHeroCarouselIndex] = useState(0)
  const [heroActiveSlot, setHeroActiveSlot] = useState(0)
  const [heroTransitioning, setHeroTransitioning] = useState(false)
  const [heroNextSource, setHeroNextSource] = useState(null)
  const [heroTextPinned, setHeroTextPinned] = useState(false)
  const heroVideoRef0 = useRef(null)
  const heroVideoRef1 = useRef(null)
  const heroSecondVideoTimerRef = useRef(null)

  const prefersReducedMotion = useReducedMotion()
  const [isNarrow, setIsNarrow] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const update = () => setIsNarrow(window.innerWidth <= 768)
    update()
    mq.addEventListener('change', update)
    window.addEventListener('resize', update)
    return () => {
      mq.removeEventListener('change', update)
      window.removeEventListener('resize', update)
    }
  }, [])
  const reduceCardMotion = prefersReducedMotion || isNarrow
  const cardMotionProps = useMemo(
    () => (reduceCardMotion ? {} : { whileHover: { scale: 1.02, y: -2 }, whileTap: { scale: 0.99 } }),
    [reduceCardMotion]
  )

  const { ref: featuresSectionRef, inView: featuresInView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const { ref: journeyInViewRef, inView: journeyInView } = useInView({
    threshold: 0.05,
    triggerOnce: true,
    rootMargin: '80px'
  })

  useEffect(() => {
    if (featuresInView && !featuresVideoReady) setFeaturesVideoReady(true)
  }, [featuresInView, featuresVideoReady])

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

  // Event-themed meeting phrases — romantic, flirty, witty (no "we met at")
  const getEventMeetingPhrase = (eventType) => {
    const phrases = {
      'the 312 Comedy Festival': 'Couldn\'t stop laughing—at the acts and at each other',
      'Lollapalooza': 'Dancing like nobody was watching. (Everybody was. We didn\'t care.)',
      'a Cubs game at Wrigley Field': 'We came for the game. Stayed for the seventh-inning stretch—and each other.',
      'a Bulls game at the United Center': 'Courtside seats, but we only had eyes for each other',
      'the Chicago Marathon': 'Crossed the finish line together. Started something we\'re still running with.',
      'the Taste of Chicago': 'Shared every bite. Realized we had the same taste in food—and in people.',
      'the Chicago Jazz Festival': 'Swaying to the same song, lost in the crowd and in each other',
      'the Art Institute of Chicago': 'Got lost in the galleries. Found each other in the Impressionists.',
      'the Chicago Blues Festival': 'Feeling the blues in the best way—slow, close, and a little bit sweet',
      'a White Sox game': 'Rooting for the Sox. Secretly rooting for the night to never end.',
      'the Chicago Air and Water Show': 'Watched the sky. Then couldn\'t look away from each other.',
      'the Chicago Food Truck Festival': 'Ate our way through the trucks. Saved the best for last—us.',
      'the Chicago Beer Festival': 'Raised a glass to good beer. Then to good timing.',
      'the Chicago Film Festival': 'Debated the ending for hours. Ours was just getting started.',
      'the Chicago Auto Show': 'Came for the cars. Left talking about the ride home—together.',
      'the Chicago Architecture Boat Tour': 'Fell for the skyline. Then for the person next to me.'
    }
    return phrases[eventType] || eventType
  }
  
  // Refs for DOM elements
  const heroRef = useRef(null)
  const heroPendingTransitionRef = useRef(null)
  const featureCardsRef = useRef([])
  const journeySectionRef = useRef(null)
  const differentiatorsRef = useRef([])
  const observerRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const mobileMenuToggleRef = useRef(null)
  const waitlistFormRef = useRef(null)

  // Hero transition: single source of truth (Material deceleration, ~600ms for video crossfade)
  const HERO_TRANSITION_DURATION_MS = 600
  const HERO_EASE = [0, 0, 0.2, 1] // Material Design deceleration (ease-out)
  const HERO_REVEAL_DURATION = 0.45
  const HERO_REVEAL_STAGGER = 0.08

  const getHeroNextPhaseAndIndex = useCallback((phase, index) => {
    if (phase === 'home') return { nextPhase: 'carousel', nextIndex: 0 }
    if (index < HERO_CAROUSEL_SOURCES.length - 1) return { nextPhase: 'carousel', nextIndex: index + 1 }
    return { nextPhase: 'home', nextIndex: 0 }
  }, [])

  const getHeroSource = useCallback((phase, index) => {
    return phase === 'home' ? homeVideoSrc : HERO_CAROUSEL_SOURCES[index]
  }, [])

  const clearHeroSecondVideoTimer = useCallback(() => {
    if (heroSecondVideoTimerRef.current) {
      clearTimeout(heroSecondVideoTimerRef.current)
      heroSecondVideoTimerRef.current = null
    }
  }, [])

  const handleHeroVideoEnded = useCallback(() => {
    clearHeroSecondVideoTimer()
    const { nextPhase, nextIndex } = getHeroNextPhaseAndIndex(heroPhase, heroCarouselIndex)
    const nextSrc = getHeroSource(nextPhase, nextIndex)
    const nextSlot = 1 - heroActiveSlot
    heroPendingTransitionRef.current = { nextPhase, nextIndex, nextSlot }
    setHeroNextSource(nextSrc)
  }, [heroPhase, heroCarouselIndex, heroActiveSlot, getHeroNextPhaseAndIndex, getHeroSource, clearHeroSecondVideoTimer])

  const handleHeroVideoCanPlay = useCallback((slot) => {
    const pending = heroPendingTransitionRef.current
    if (!pending || pending.nextSlot !== slot) return
    const el = slot === 0 ? heroVideoRef0.current : heroVideoRef1.current
    if (el) {
      el.play().catch(() => {})
      setHeroTransitioning(true)
      const durationMs = prefersReducedMotion ? 150 : HERO_TRANSITION_DURATION_MS
      setTimeout(() => {
        clearHeroSecondVideoTimer()
        setHeroPhase(pending.nextPhase)
        setHeroCarouselIndex(pending.nextIndex)
        setHeroActiveSlot(pending.nextSlot)
        setHeroNextSource(null)
        setHeroTransitioning(false)
        heroPendingTransitionRef.current = null
        if (pending.nextPhase === 'home') {
          setHeroTextPinned(true)
        }
        if (pending.nextPhase === 'carousel' && pending.nextIndex === 1) {
          heroSecondVideoTimerRef.current = setTimeout(() => {
            heroSecondVideoTimerRef.current = null
            handleHeroVideoEnded()
          }, HERO_SECOND_VIDEO_MAX_MS)
        }
      }, durationMs)
    }
  }, [handleHeroVideoEnded, prefersReducedMotion, clearHeroSecondVideoTimer])

  const heroLineTransition = useMemo(() => ({
    duration: prefersReducedMotion ? 0.2 : HERO_TRANSITION_DURATION_MS / 1000,
    ease: HERO_EASE
  }), [prefersReducedMotion])

  const heroRevealTransition = useMemo(() => ({
    duration: prefersReducedMotion ? 0.2 : HERO_REVEAL_DURATION,
    ease: HERO_EASE,
    stagger: prefersReducedMotion ? 0 : HERO_REVEAL_STAGGER
  }), [prefersReducedMotion])

  useEffect(() => () => clearHeroSecondVideoTimer(), [clearHeroSecondVideoTimer])

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
    // Return focus to toggle so aria-hidden on nav doesn't hide focused element
    if (mobileMenuToggleRef.current) {
      mobileMenuToggleRef.current.focus()
    }
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

  // Restore body scroll on unmount (prevents stuck scroll when navigating away with menu open)
  useEffect(() => {
    return () => {
      document.body.style.overflow = ''
      document.body.classList.remove('menu-open')
    }
  }, [])

  // Skip link: scroll to main and move focus for keyboard/screen reader
  const handleSkipClick = useCallback((e) => {
    const main = document.getElementById('main-content')
    if (main) {
      e.preventDefault()
      main.scrollIntoView({ behavior: 'smooth', block: 'start' })
      main.focus({ preventScroll: true })
    }
  }, [])

  // Focus trap when mobile menu is open: keep Tab/Shift+Tab within menu
  useEffect(() => {
    if (!isMobileMenuOpen || !mobileMenuRef.current) return
    const nav = mobileMenuRef.current
    const getFocusables = () => Array.from(nav.querySelectorAll('a[href], button')).filter(el => !el.hasAttribute('disabled') && el.tabIndex !== -1)
    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return
      const focusables = getFocusables()
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement
      if (e.shiftKey) {
        if (active === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    nav.addEventListener('keydown', handleKeyDown)
    return () => nav.removeEventListener('keydown', handleKeyDown)
  }, [isMobileMenuOpen])

  // Close mobile menu when clicking outside or on escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      try {
        if (isMobileMenuOpen && !e.target.closest('.nav') && !e.target.closest('.mobile-menu-toggle')) {
          setIsMobileMenuOpen(false)
          document.body.style.overflow = ''
          document.body.classList.remove('menu-open')
          if (mobileMenuToggleRef.current) {
            mobileMenuToggleRef.current.focus()
          }
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
          if (mobileMenuToggleRef.current) {
            mobileMenuToggleRef.current.focus()
          }
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
    
    // Observe refs (feature cards are in Cover Flow carousel, not observed)
    const allRefs = [
      ...featureCardsRef.current,
      journeySectionRef.current,
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

  // Framer Motion: app shell and loading overlay (exit animation when done)
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  }

  const pageTransition = { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }

  const heroVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.08,
        delayChildren: prefersReducedMotion ? 0 : 0.15
      }
    }
  }

  const heroItemVariants = {
    initial: prefersReducedMotion ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      className="App"
      initial="initial"
      animate="animate"
      variants={pageVariants}
      transition={pageTransition}
    >
      <a href="#main-content" className="skip-link" onClick={handleSkipClick}>
        Skip to main content
      </a>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            className="loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.28, ease: 'easeInOut' }}
            aria-live="polite"
            aria-busy="true"
          >
            <div className="loading-spinner" aria-hidden="true" />
            <p>Loading DatingPool...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <header className={headerClass}>
        <div className="container">
          <button
            type="button"
            className="logo logo-button"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            aria-label="DatingPool home"
          >
            <h1 className="logo-text">DatingPool</h1>
          </button>
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
            <Link to="/contact" className="nav-link" onClick={() => setIsMobileMenuOpen(false)} aria-label="Contact">
              Contact
            </Link>
            <Link to="/privacy-policy" className="nav-link" onClick={() => setIsMobileMenuOpen(false)} aria-label="Privacy Policy">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="nav-link" onClick={() => setIsMobileMenuOpen(false)} aria-label="Terms of Service">
              Terms of Service
            </Link>
            <a 
              href="#coming-soon" 
              className={`nav-link nav-link-cta ${activeSection === 'coming-soon' ? 'active' : ''}`}
              onClick={(e) => scrollToSection(e, 'coming-soon')}
              aria-label="Join waitlist"
            >
              Join Waitlist
            </a>
          </nav>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        {/* Scroll Progress Indicator */}
        <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }}></div>
        
        <section className="hero" ref={heroRef} aria-label="Hero section">
          <div className="hero-video-wrap" aria-hidden="true">
            {[0, 1].map((slot) => {
              const isVisible = (slot === heroActiveSlot && !heroTransitioning) || (slot !== heroActiveSlot && heroTransitioning)
              const src = slot === heroActiveSlot ? getHeroSource(heroPhase, heroCarouselIndex) : heroNextSource
              return (
                <div
                  key={slot}
                  className={`hero-video-layer ${isVisible ? 'hero-video-layer-visible' : 'hero-video-layer-hidden'}`}
                  aria-hidden={!isVisible}
                >
                  <video
                    ref={slot === 0 ? heroVideoRef0 : heroVideoRef1}
                    className="hero-video"
                    src={src || undefined}
                    autoPlay={slot === heroActiveSlot}
                    loop={false}
                    muted
                    playsInline
                    preload="auto"
                    onEnded={slot === heroActiveSlot ? handleHeroVideoEnded : undefined}
                    onCanPlayThrough={() => handleHeroVideoCanPlay(slot)}
                  />
                </div>
              )
            })}
            <div className="hero-video-overlay" />
          </div>
          <div className="hero-background" style={parallaxStyle} aria-hidden="true" />
          <div className="particles-container" aria-hidden="true">
            {particles.map((particle, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  animationDelay: `${particle.delay}s`,
                  animationDuration: `${particle.duration}s`
                }}
              />
            ))}
          </div>
          <div className="container">
            <motion.div
              className="hero-content"
              variants={heroVariants}
              initial="initial"
              animate="animate"
            >
              {!heroTextPinned ? (
                <div className="hero-text-single" aria-live="polite">
                  <motion.h1
                    className="hero-title hero-line-slot"
                    initial={false}
                    animate={{
                      opacity: heroPhase === 'home' ? 1 : 0,
                      filter: heroPhase === 'home' || prefersReducedMotion ? 'blur(0px)' : 'blur(6px)',
                      pointerEvents: heroPhase === 'home' ? 'auto' : 'none'
                    }}
                    transition={heroLineTransition}
                    aria-hidden={heroPhase !== 'home'}
                  >
                    Find an Event You Love. Find Someone to Share It With.
                  </motion.h1>
                  <motion.p
                    className="hero-subtitle hero-line-slot"
                    initial={false}
                    animate={{
                      opacity: heroPhase === 'carousel' && heroCarouselIndex === 0 ? 1 : 0,
                      filter: (heroPhase === 'carousel' && heroCarouselIndex === 0) || prefersReducedMotion ? 'blur(0px)' : 'blur(6px)',
                      pointerEvents: heroPhase === 'carousel' && heroCarouselIndex === 0 ? 'auto' : 'none'
                    }}
                    transition={heroLineTransition}
                    aria-hidden={!(heroPhase === 'carousel' && heroCarouselIndex === 0)}
                  >
                    <strong>We're flipping the script. Find something you want to do, then find someone you want to do it with. No more "where should we meet?"—the plan is built in.</strong>
                  </motion.p>
                  <motion.p
                    className="hero-slogan hero-line-slot"
                    initial={false}
                    animate={{
                      opacity: heroPhase === 'carousel' && heroCarouselIndex === 1 ? 1 : 0,
                      filter: (heroPhase === 'carousel' && heroCarouselIndex === 1) || prefersReducedMotion ? 'blur(0px)' : 'blur(6px)',
                      pointerEvents: heroPhase === 'carousel' && heroCarouselIndex === 1 ? 'auto' : 'none'
                    }}
                    transition={heroLineTransition}
                    aria-hidden={!(heroPhase === 'carousel' && heroCarouselIndex === 1)}
                  >
                    A dating app that actually works? Now that's the real event!
                  </motion.p>
                </div>
              ) : (
                <div className="hero-text-all" key="hero-all-text">
                  <motion.h1
                    className="hero-title"
                    initial={{ opacity: 0, filter: 'blur(0px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: heroRevealTransition.duration, ease: heroRevealTransition.ease }}
                  >
                    Find an Event You Love. Find Someone to Share It With.
                  </motion.h1>
                  <motion.p
                    className="hero-subtitle"
                    initial={{ opacity: 0, filter: 'blur(0px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: heroRevealTransition.duration, delay: heroRevealTransition.stagger, ease: heroRevealTransition.ease }}
                  >
                    <strong>We're flipping the script. Find something you want to do, then find someone you want to do it with. No more "where should we meet?"—the plan is built in.</strong>
                  </motion.p>
                  <motion.p
                    className="hero-slogan"
                    initial={{ opacity: 0, filter: 'blur(0px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: heroRevealTransition.duration, delay: heroRevealTransition.stagger * 2, ease: heroRevealTransition.ease }}
                  >
                    A dating app that actually works? Now that's the real event!
                  </motion.p>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        <section id="journey" className="journey" aria-label="How it works" ref={(el) => { journeySectionRef.current = el; journeyInViewRef(el); }}>
          <div className="journey-video-wrap" aria-hidden="true">
            <video
              className="journey-video"
              src={journeyInView ? poolVideoSrc : undefined}
              autoPlay
              loop
              muted
              playsInline
              preload="none"
            />
            <div className="journey-video-overlay" />
          </div>
          <div className="container journey-content">
            <h2 className="journey-title section-title animate-on-scroll">
              How it works
            </h2>
            <p className="journey-intro section-intro animate-on-scroll">
              Four steps from "nothing to do" to a real date at a real place.
            </p>
            <p className="journey-carousel-intro animate-on-scroll">Swipe to see each step.</p>
            <CoverFlowCarousel
              activeIndex={journeyCardIndex}
              setActiveIndex={setJourneyCardIndex}
              ariaLabel="How it works steps"
              slideLabel="step"
            >
              <motion.article className="journey-card differentiator-card interactive-card" role="listitem" data-step="1" {...cardMotionProps}>
                <div className="card-top">
                  <div className="feature-icon-wrapper">
                    <div className="diff-icon" aria-hidden="true"><Icon name="bot" className="diff-icon-svg" /></div>
                  </div>
                  <div className="stat-badge stat-badge-blue">Step 1</div>
                </div>
                <div className="card-content">
                  <h3>Discover events you'll love</h3>
                  <p>Tell us what you're into. We surface events you actually want to go to—and you can grab tickets if you want.</p>
                  <div className="step-you-get">
                    <strong>You get:</strong>
                    <span>A smarter feed. No more "there's nothing to do."</span>
                  </div>
                </div>
              </motion.article>
              <motion.article className="journey-card differentiator-card interactive-card" role="listitem" data-step="2" {...cardMotionProps}>
                <div className="card-top">
                  <div className="feature-icon-wrapper">
                    <div className="diff-icon" aria-hidden="true"><Icon name="waves" className="diff-icon-svg" /></div>
                  </div>
                  <div className="stat-badge stat-badge-blue">Step 2</div>
                </div>
                <div className="card-content">
                  <h3>Join the pool</h3>
                  <p>Like an event? Join the pool. No ticket required—just the intent to show up. Everyone in the pool is going.</p>
                  <div className="step-you-get">
                    <strong>You get:</strong>
                    <span>People who said "I'm in," not "maybe." Better odds.</span>
                  </div>
                </div>
              </motion.article>
              <motion.article className="journey-card differentiator-card interactive-card" role="listitem" data-step="3" {...cardMotionProps}>
                <div className="card-top">
                  <div className="feature-icon-wrapper">
                    <div className="diff-icon" aria-hidden="true"><Icon name="target" className="diff-icon-svg" /></div>
                  </div>
                  <div className="stat-badge stat-badge-blue">Step 3</div>
                </div>
                <div className="card-content">
                  <h3>Get matched</h3>
                  <p>We match you with people in your pool who fit. Real compatibility, same event—no endless swiping.</p>
                  <div className="step-you-get">
                    <strong>You get:</strong>
                    <span>Dates who are already going. The icebreaker writes itself.</span>
                  </div>
                </div>
              </motion.article>
              <motion.article className="journey-card differentiator-card interactive-card" role="listitem" data-step="4" {...cardMotionProps}>
                <div className="card-top">
                  <div className="feature-icon-wrapper">
                    <div className="diff-icon" aria-hidden="true"><Icon name="message" className="diff-icon-svg" /></div>
                  </div>
                  <div className="stat-badge stat-badge-blue">Step 4</div>
                </div>
                <div className="card-content">
                  <h3>Chat, then meet</h3>
                  <p>Conversations live under the event. You're already going to the same thing—just pick a spot and show up.</p>
                  <div className="step-you-get">
                    <strong>You get:</strong>
                    <span>Conversations that become real meetups.</span>
                  </div>
                </div>
              </motion.article>
            </CoverFlowCarousel>
          </div>
        </section>

        <section id="mission" className="mission" aria-label="Our Mission">
          <div className="mission-video-wrap" aria-hidden="true">
            <video
              className="mission-video"
              src={pool5VideoSrc}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            />
            <div className="mission-video-overlay" />
          </div>
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
                      <span className="emoji-character"><Icon name="usersTwo" className="icon-emoji" /></span>
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
                      <span className="emoji-character"><Icon name="usersTwo" className="icon-emoji" /></span>
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
            </div>
          </div>
        </section>

        <section id="features" className="differentiators" aria-label="Features" ref={featuresSectionRef}>
          <div className={`differentiators-video-wrap ${!featuresVideoReady ? 'differentiators-video-placeholder' : ''}`} aria-hidden="true">
            {featuresVideoReady && (
              <video
                className="differentiators-video"
                src={pool2VideoSrc}
                autoPlay
                loop
                muted
                playsInline
              />
            )}
            <div className="differentiators-video-overlay" />
          </div>
          <div className="container differentiators-content">
            <div className="features-header">
              <div className="section-badge animate-on-scroll">Why DatingPool Works</div>
              <h2 className="section-title animate-on-scroll">
                Dating that leads somewhere.
              </h2>
              <div className="problem-solution animate-on-scroll">
                <div className="problem-box">
                  <h3 className="problem-title">The old way <Icon name="xCircle" className="icon-inline" /></h3>
                  <ul className="problem-list">
                    <li>Matches that go nowhere</li>
                    <li>"Where should we meet?" on repeat</li>
                    <li>Time wasted</li>
                  </ul>
                </div>
                <div className="solution-box">
                  <h3 className="solution-title">The DatingPool way <Icon name="checkCircle" className="icon-inline" /></h3>
                  <p className="solution-lead">Find someone to go with.</p>
                  <p className="solution-description">Best dates happen at events you already want to attend.</p>
                  <div className="solution-benefits">
                    <span className="benefit-tag">Lower pressure</span>
                    <span className="benefit-tag">Higher success rate</span>
                  </div>
                </div>
              </div>
              <p className="features-carousel-intro animate-on-scroll">Swipe to see what makes us different.</p>
            </div>
            <CoverFlowCarousel activeIndex={featureCardIndex} setActiveIndex={setFeatureCardIndex}>
              <motion.article 
                className="differentiator-card feature-card-featured interactive-card" 
                role="listitem"
                data-feature="planning"
                {...cardMotionProps}
              >
                <div className="card-top">
                  <div className="feature-icon-wrapper">
                    <div className="diff-icon" aria-hidden="true"><Icon name="checkCircle" className="diff-icon-svg" /></div>
                  </div>
                  <div className="stat-badge stat-badge-success">0 Planning Friction</div>
                </div>
                <div className="card-content">
                  <h3>No more "where should we meet?"</h3>
                  <div className="visual-timeline">
                    <div className="timeline-item">
                      <span className="timeline-icon"><Icon name="calendar" className="timeline-icon-svg" /></span>
                      <span>Find event</span>
                    </div>
                    <div className="timeline-arrow">→</div>
                    <div className="timeline-item">
                      <span className="timeline-icon"><Icon name="waves" className="timeline-icon-svg" /></span>
                      <span>Join pool</span>
                    </div>
                    <div className="timeline-arrow">→</div>
                    <div className="timeline-item">
                      <span className="timeline-icon"><Icon name="mapPin" className="timeline-icon-svg" /></span>
                      <span>Venue + time set</span>
                    </div>
                    <div className="timeline-arrow">→</div>
                    <div className="timeline-item">
                      <span className="timeline-icon"><Icon name="hand" className="timeline-icon-svg" /></span>
                      <span>Meet</span>
                    </div>
                  </div>
                  <p>Find events, join the pool (no ticket required), and show up. The event is the date.</p>
                </div>
              </motion.article>
              <motion.article 
                className="differentiator-card interactive-card" 
                role="listitem"
                data-feature="matching"
                {...cardMotionProps}
              >
                <div className="card-top">
                  <div className="feature-icon-wrapper">
                    <div className="diff-icon" aria-hidden="true"><Icon name="message" className="diff-icon-svg" /></div>
                  </div>
                  <div className="stat-badge stat-badge-blue">100% Built-in Icebreakers</div>
                </div>
                <div className="card-content">
                  <h3>Built-in icebreakers</h3>
                  <div className="visual-comparison">
                    <div className="comparison-bad">
                      <span className="comparison-label">Elsewhere</span>
                      <span className="comparison-text">"Hey"</span>
                    </div>
                    <div className="comparison-arrow-small">→</div>
                    <div className="comparison-good">
                      <span className="comparison-label">Here</span>
                      <span className="comparison-text">"See you at the concert?"</span>
                    </div>
                  </div>
                  <p>Every match shares an event. Real conversation starters, not openers from nowhere.</p>
                </div>
              </motion.article>
              <motion.article 
                className="differentiator-card interactive-card" 
                role="listitem"
                data-feature="intent"
                {...cardMotionProps}
              >
                <div className="card-top">
                  <div className="feature-icon-wrapper">
                    <div className="diff-icon" aria-hidden="true"><Icon name="target" className="diff-icon-svg" /></div>
                  </div>
                  <div className="stat-badge stat-badge-orange">3x Higher Intent</div>
                </div>
                <div className="card-content">
                  <h3>People who show up</h3>
                  <div className="intent-meter">
                    <div className="meter-label">Intent</div>
                    <div className="meter-bar">
                      <div className="meter-fill" style={{ width: '95%' }}></div>
                    </div>
                    <div className="meter-value">95% committed to the event</div>
                  </div>
                  <p>Joining a pool means intent. No serial swipers—everyone's planning to be there.</p>
                </div>
              </motion.article>
              <motion.article 
                className="differentiator-card interactive-card" 
                role="listitem"
                data-feature="organization"
                {...cardMotionProps}
              >
                <div className="card-top">
                  <div className="feature-icon-wrapper">
                    <div className="diff-icon" aria-hidden="true"><Icon name="folderOpen" className="diff-icon-svg" /></div>
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
                      <span className="folder-icon"><Icon name="folder" className="folder-icon-svg" /></span>
                      <span>Pizza Making Workshop</span>
                      <span className="folder-arrow">{openFolder === 'pizza-workshop' ? <Icon name="chevronDown" className="folder-arrow-svg" /> : <Icon name="chevronRight" className="folder-arrow-svg" />}</span>
                    </div>
                    {openFolder === 'pizza-workshop' && (
                      <div id="pizza-workshop-chats" className="chat-list" role="list">
                        <div className="chat-item" role="listitem">
                          <div className="chat-avatar" aria-hidden="true"><Icon name="user" className="chat-avatar-svg" /></div>
                          <span className="chat-name">Sarah</span>
                        </div>
                        <div className="chat-item" role="listitem">
                          <div className="chat-avatar" aria-hidden="true"><Icon name="user" className="chat-avatar-svg" /></div>
                          <span className="chat-name">Mike</span>
                        </div>
                        <div className="chat-item" role="listitem">
                          <div className="chat-avatar" aria-hidden="true"><Icon name="user" className="chat-avatar-svg" /></div>
                          <span className="chat-name">Emma</span>
                        </div>
                        <div className="chat-item" role="listitem">
                          <div className="chat-avatar" aria-hidden="true"><Icon name="user" className="chat-avatar-svg" /></div>
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
                      <span className="folder-icon"><Icon name="folder" className="folder-icon-svg" /></span>
                      <span>3Run2 Running Club</span>
                      <span className="folder-arrow">{openFolder === 'running-club' ? <Icon name="chevronDown" className="folder-arrow-svg" /> : <Icon name="chevronRight" className="folder-arrow-svg" />}</span>
                    </div>
                    {openFolder === 'running-club' && (
                      <div id="running-club-chats" className="chat-list" role="list">
                        <div className="chat-item" role="listitem">
                          <div className="chat-avatar" aria-hidden="true"><Icon name="user" className="chat-avatar-svg" /></div>
                          <span className="chat-name">Jordan</span>
                        </div>
                        <div className="chat-item" role="listitem">
                          <div className="chat-avatar" aria-hidden="true"><Icon name="user" className="chat-avatar-svg" /></div>
                          <span className="chat-name">Taylor</span>
                        </div>
                        <div className="chat-item" role="listitem">
                          <div className="chat-avatar" aria-hidden="true"><Icon name="user" className="chat-avatar-svg" /></div>
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
                      <span className="folder-icon"><Icon name="folder" className="folder-icon-svg" /></span>
                      <span>TBOX Christmas Bar Crawl</span>
                      <span className="folder-arrow">{openFolder === 'tbox-crawl' ? <Icon name="chevronDown" className="folder-arrow-svg" /> : <Icon name="chevronRight" className="folder-arrow-svg" />}</span>
                    </div>
                    {openFolder === 'tbox-crawl' && (
                      <div id="tbox-crawl-chats" className="chat-list" role="list">
                        <div className="chat-item" role="listitem">
                          <div className="chat-avatar" aria-hidden="true"><Icon name="user" className="chat-avatar-svg" /></div>
                          <span className="chat-name">Chris</span>
                        </div>
                        <div className="chat-item" role="listitem">
                          <div className="chat-avatar" aria-hidden="true"><Icon name="user" className="chat-avatar-svg" /></div>
                          <span className="chat-name">Morgan</span>
                        </div>
                        <div className="chat-item" role="listitem">
                          <div className="chat-avatar" aria-hidden="true"><Icon name="user" className="chat-avatar-svg" /></div>
                          <span className="chat-name">Riley</span>
                        </div>
                        <div className="chat-item" role="listitem">
                          <div className="chat-avatar" aria-hidden="true"><Icon name="user" className="chat-avatar-svg" /></div>
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
                      <span className="folder-icon"><Icon name="folder" className="folder-icon-svg" /></span>
                      <span>After Dark at the Art Institute</span>
                      <span className="folder-arrow">{openFolder === 'art-institute' ? <Icon name="chevronDown" className="folder-arrow-svg" /> : <Icon name="chevronRight" className="folder-arrow-svg" />}</span>
                    </div>
                    {openFolder === 'art-institute' && (
                      <div id="art-institute-chats" className="chat-list" role="list">
                        <div className="chat-item" role="listitem">
                          <div className="chat-avatar" aria-hidden="true"><Icon name="user" className="chat-avatar-svg" /></div>
                          <span className="chat-name">Drew</span>
                        </div>
                        <div className="chat-item" role="listitem">
                          <div className="chat-avatar" aria-hidden="true"><Icon name="user" className="chat-avatar-svg" /></div>
                          <span className="chat-name">Jamie</span>
                        </div>
                        <div className="chat-item" role="listitem">
                          <div className="chat-avatar" aria-hidden="true"><Icon name="user" className="chat-avatar-svg" /></div>
                          <span className="chat-name">Pat</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <p>Chats live under the event. One folder per event—no more "who was that?" scrolling.</p>
                </div>
              </motion.article>
              <motion.article 
                className="differentiator-card interactive-card" 
                role="listitem"
                data-feature="verification"
                {...cardMotionProps}
              >
                <div className="card-top">
                  <div className="feature-icon-wrapper">
                    <div className="diff-icon" aria-hidden="true"><Icon name="shield" className="diff-icon-svg" /></div>
                  </div>
                  <div className="stat-badge stat-badge-green">100% Verified Profiles</div>
                </div>
                <div className="card-content">
                  <h3>Verified & safe</h3>
                  <div className="verification-steps">
                    <div className="verification-step">
                      <span className="step-check"><Icon name="check" className="step-check-svg" /></span>
                      <span>Real-world validation</span>
                    </div>
                    <div className="verification-step">
                      <span className="step-check"><Icon name="check" className="step-check-svg" /></span>
                      <span>No bots, no catfishing</span>
                    </div>
                    <div className="verification-step">
                      <span className="step-check"><Icon name="check" className="step-check-svg" /></span>
                      <span>Quality over quantity</span>
                    </div>
                  </div>
                  <p>Profiles tied to real events. Real people, real plans.</p>
                </div>
              </motion.article>
              <motion.article 
                className="differentiator-card interactive-card" 
                role="listitem"
                data-feature="squading"
                {...cardMotionProps}
              >
                <div className="card-top">
                  <div className="feature-icon-wrapper">
                    <div className="diff-icon" aria-hidden="true"><Icon name="users" className="diff-icon-svg" /></div>
                  </div>
                  <div className="stat-badge stat-badge-yellow">Group Discounts</div>
                </div>
                <div className="card-content">
                  <h3>Squading Up</h3>
                  <div className="group-flow">
                    <div className="flow-item">
                      <span className="flow-icon"><Icon name="user" className="flow-icon-svg" /></span>
                      <span>You + Friends</span>
                    </div>
                    <div className="flow-arrow">→</div>
                    <div className="flow-item">
                      <span className="flow-icon"><Icon name="users" className="flow-icon-svg" /></span>
                      <span>Match Groups</span>
                    </div>
                    <div className="flow-arrow">→</div>
                    <div className="flow-item">
                      <span className="flow-icon"><Icon name="sparkles" className="flow-icon-svg" /></span>
                      <span>Event Together</span>
                    </div>
                  </div>
                  <p>Bring friends, match with other groups. Lower pressure, more fun—and group ticket discounts.</p>
                </div>
              </motion.article>
              <motion.article 
                className="differentiator-card interactive-card" 
                role="listitem"
                data-feature="tickets"
                {...cardMotionProps}
              >
                <div className="card-top">
                  <div className="feature-icon-wrapper">
                    <div className="diff-icon" aria-hidden="true"><Icon name="ticket" className="diff-icon-svg" /></div>
                  </div>
                  <div className="stat-badge stat-badge-blue">Integrated Tickets</div>
                </div>
                <div className="card-content">
                  <h3>Tickets in one place</h3>
                  <div className="visual-timeline">
                    <div className="timeline-item">
                      <span className="timeline-icon"><Icon name="search" className="timeline-icon-svg" /></span>
                      <span>Discover</span>
                    </div>
                    <div className="timeline-arrow">→</div>
                    <div className="timeline-item">
                      <span className="timeline-icon"><Icon name="waves" className="timeline-icon-svg" /></span>
                      <span>Join pool</span>
                    </div>
                    <div className="timeline-arrow">→</div>
                    <div className="timeline-item">
                      <span className="timeline-icon"><Icon name="ticket" className="timeline-icon-svg" /></span>
                      <span>Optional tickets</span>
                    </div>
                  </div>
                  <p>Discover, join the pool, and buy tickets if you want—all in one app.</p>
                </div>
              </motion.article>
              <motion.article 
                className="differentiator-card interactive-card" 
                role="listitem"
                data-feature="privacy"
                {...cardMotionProps}
              >
                <div className="card-top">
                  <div className="feature-icon-wrapper">
                    <div className="diff-icon" aria-hidden="true"><Icon name="lock" className="diff-icon-svg" /></div>
                  </div>
                  <div className="stat-badge stat-badge-purple">Privacy Protected</div>
                </div>
                <div className="card-content">
                  <h3>Blocked users can't see you</h3>
                  <div className="visual-comparison">
                    <div className="comparison-bad">
                      <span className="comparison-label">You</span>
                      <span className="comparison-text"><Icon name="alert" className="icon-inline" /> Blocked user in pool</span>
                    </div>
                    <div className="comparison-arrow-small">→</div>
                    <div className="comparison-good">
                      <span className="comparison-label">Them</span>
                      <span className="comparison-text"><Icon name="eye" className="icon-inline" /> Can't see you</span>
                    </div>
                  </div>
                  <p>If someone you've blocked is in the same pool, you're notified. They never see you. Your call whether to stay or skip the event.</p>
                </div>
              </motion.article>
              <motion.article 
                className="differentiator-card interactive-card" 
                role="listitem"
                data-feature="waitlisting"
                {...cardMotionProps}
              >
                <div className="card-top">
                  <div className="feature-icon-wrapper">
                    <div className="diff-icon" aria-hidden="true"><Icon name="zap" className="diff-icon-svg" /></div>
                  </div>
                  <div className="stat-badge stat-badge-orange">Smart Matching</div>
                </div>
                <div className="card-content">
                  <h3>Waitlist until it's worth it</h3>
                  <div className="visual-timeline">
                    <div className="timeline-item">
                      <span className="timeline-icon"><Icon name="user" className="timeline-icon-svg" /></span>
                      <span>Join waitlist</span>
                    </div>
                    <div className="timeline-arrow">→</div>
                    <div className="timeline-item">
                      <span className="timeline-icon"><Icon name="search" className="timeline-icon-svg" /></span>
                      <span>AI matches</span>
                    </div>
                    <div className="timeline-arrow">→</div>
                    <div className="timeline-item">
                      <span className="timeline-icon">🎯</span>
                      <span>Critical mass</span>
                    </div>
                    <div className="timeline-arrow">→</div>
                    <div className="timeline-item">
                      <span className="timeline-icon"><Icon name="waves" className="timeline-icon-svg" /></span>
                      <span>Pool opens</span>
                    </div>
                  </div>
                  <p>We waitlist until enough compatible people join. Then the pool opens—quality matches from day one.</p>
                </div>
              </motion.article>
              <motion.article 
                className="differentiator-card interactive-card" 
                role="listitem"
                data-feature="coordination"
                {...cardMotionProps}
              >
                <div className="card-top">
                  <div className="feature-icon-wrapper">
                    <div className="diff-icon" aria-hidden="true"><Icon name="smartphone" className="diff-icon-svg" /></div>
                  </div>
                  <div className="stat-badge stat-badge-blue">Event Day Tools</div>
                </div>
                <div className="card-content">
                  <h3>Event-day tools</h3>
                  <p className="coordination-push">
                    <strong>Once you both have tickets</strong>—chat, calls, location & safety unlock in one place.
                  </p>
                  <div className="visual-timeline coordination-timeline" aria-label="How tools unlock">
                    <div className="timeline-item">
                      <span className="timeline-icon" aria-hidden="true"><Icon name="message" className="timeline-icon-svg" /></span>
                      <span>Chat</span>
                    </div>
                    <div className="timeline-arrow" aria-hidden="true">→</div>
                    <div className="timeline-item">
                      <span className="timeline-icon" aria-hidden="true"><Icon name="ticket" className="timeline-icon-svg" /></span>
                      <span>Buy Tickets</span>
                    </div>
                    <div className="timeline-arrow" aria-hidden="true">→</div>
                    <div className="timeline-item">
                      <span className="timeline-icon" aria-hidden="true"><Icon name="calendar" className="timeline-icon-svg" /></span>
                      <span>Event Day</span>
                    </div>
                    <div className="timeline-arrow" aria-hidden="true">→</div>
                    <div className="timeline-item">
                      <span className="timeline-icon" aria-hidden="true"><Icon name="unlock" className="timeline-icon-svg" /></span>
                      <span>Unlock</span>
                    </div>
                  </div>
                  <div className="coordination-tools-grid">
                    <div className="coordination-tool-item">
                      <span className="tool-icon" aria-hidden="true"><Icon name="phone" className="tool-icon-svg" /></span>
                      <span className="tool-name">Calls</span>
                    </div>
                    <div className="coordination-tool-item">
                      <span className="tool-icon" aria-hidden="true"><Icon name="video" className="tool-icon-svg" /></span>
                      <span className="tool-name">Video</span>
                    </div>
                    <div className="coordination-tool-item">
                      <span className="tool-icon" aria-hidden="true"><Icon name="camera" className="tool-icon-svg" /></span>
                      <span className="tool-name">Photos</span>
                    </div>
                    <div className="coordination-tool-item">
                      <span className="tool-icon" aria-hidden="true"><Icon name="mapPin" className="tool-icon-svg" /></span>
                      <span className="tool-name">Location</span>
                    </div>
                    <div className="coordination-tool-item">
                      <span className="tool-icon" aria-hidden="true"><Icon name="shield" className="tool-icon-svg" /></span>
                      <span className="tool-name">Safety</span>
                    </div>
                  </div>
                  <p className="coordination-note">
                    Emergency contacts, safe meet-up spots, and real-time check-ins—no more &ldquo;where are you?&rdquo; texts.
                  </p>
                </div>
              </motion.article>
            </CoverFlowCarousel>
          </div>
        </section>


        <section id="coming-soon" className="cta" aria-label="Join waitlist">
          <div className="cta-video-wrap" aria-hidden="true">
            <video
              className="cta-video"
              src={pool3VideoSrc}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            />
            <div className="cta-video-overlay" />
          </div>
          <div className="container cta-container">
            <div className="cta-content">
              <h2 className="cta-title animate-on-scroll">Get In the Pool First</h2>
              <p className="cta-intro animate-on-scroll">
                Be the first to know when we launch—early access and exclusive perks are waiting.
              </p>
              <p className="cta-subtitle animate-on-scroll">
                We're piloting in Austin, Houston, and Chicago. Limited spots—join now for priority access when we go live.
              </p>
              <form 
                ref={waitlistFormRef}
                className="waitlist-form animate-on-scroll" 
                onSubmit={handleFormSubmit}
                aria-live="polite"
                noValidate
              >
                <div className="waitlist-input-wrapper">
                  <label htmlFor="waitlist-email" className="waitlist-label">
                    Email address
                  </label>
                  <motion.input
                    id="waitlist-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={() => validateEmail(email)}
                    className={`waitlist-input ${emailError ? 'error' : ''} ${submitSuccess ? 'success' : ''}`}
                    required
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
                  className="waitlist-button"
                  {...cardMotionProps}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  aria-label="Join the DatingPool waitlist"
                  disabled={isSubmitting || !!emailError}
                  aria-busy={isSubmitting}
                >
                  <span>{isSubmitting ? 'Submitting...' : 'Join the Waitlist'}</span>
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
              <Link to="/partner" className="footer-link partner-portal-link" aria-hidden="true">
                Partner Portal
              </Link>
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
