import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, animate, useSpring } from 'framer-motion'

/**
 * Enterprise Cover Flow: smooth spring, swipe/drag, magnetic snap,
 * responsive dimensions for all device sizes.
 */
const BREAKPOINTS = [
  { max: 380, width: 260, overlap: 80 },
  { max: 480, width: 280, overlap: 80 },
  { max: 768, width: 300, overlap: 60 },
  { max: 900, width: 340, overlap: 60 },
  { max: Infinity, width: 400, overlap: 80 },
]

function getConstants(viewportWidth) {
  const bp = BREAKPOINTS.find((b) => viewportWidth <= b.max) || BREAKPOINTS[BREAKPOINTS.length - 1]
  const CARD_WIDTH = bp.width
  const CARD_OVERLAP = bp.overlap
  const CARD_SPACING = CARD_WIDTH - CARD_OVERLAP
  const STEP = CARD_SPACING - CARD_OVERLAP
  return { CARD_WIDTH, CARD_OVERLAP, CARD_SPACING, STEP }
}

const ROTATION_DEG = 32
const CENTER_SCALE = 1.05
const SIDE_SCALE = 0.88
const SWIPE_THRESHOLD = 0.2

/* Snappy spring for responsive feel */
const SPRING = { type: 'spring', stiffness: 220, damping: 26 }

function trackOffsetForIndex(index, count, { STEP, CARD_WIDTH, CARD_OVERLAP }) {
  return index * STEP + CARD_WIDTH / 2 - CARD_OVERLAP / 2
}

const NARROW_BREAKPOINT = 768

function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  )
  useEffect(() => {
    let t
    const onResize = () => {
      if (t) clearTimeout(t)
      t = setTimeout(() => setWidth(window.innerWidth), 120)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      if (t) clearTimeout(t)
    }
  }, [])
  return width
}

/* On narrow/touch: flat 2D stack + quicker spring to reduce GPU cost and jank */
const FLAT_SPRING = { type: 'spring', stiffness: 320, damping: 32 }

export function CoverFlowCarousel({ children, activeIndex, setActiveIndex, ariaLabel = 'Feature carousel', slideLabel = 'feature' }) {
  const viewportWidth = useWindowWidth()
  const isNarrow = viewportWidth <= NARROW_BREAKPOINT
  const constants = useMemo(() => getConstants(viewportWidth), [viewportWidth])
  const { CARD_WIDTH, CARD_OVERLAP, CARD_SPACING, STEP } = constants
  const rotationDeg = isNarrow ? 0 : ROTATION_DEG
  const centerScale = isNarrow ? 1.02 : CENTER_SCALE
  const sideScale = isNarrow ? 0.94 : SIDE_SCALE
  const transition = isNarrow ? FLAT_SPRING : SPRING

  const cards = React.Children.toArray(children)
  const count = cards.length
  const trackWidth = (count - 1) * STEP + CARD_SPACING

  const isDragging = useRef(false)
  const startX = useRef(0)
  const pointerId = useRef(null)

  const baseOffsetMotion = useMotionValue(
    trackOffsetForIndex(activeIndex, count, constants)
  )
  const dragSpring = useSpring(0, { stiffness: 340, damping: 28 })

  useEffect(() => {
    const target = trackOffsetForIndex(activeIndex, count, constants)
    if (!isDragging.current) {
      animate(baseOffsetMotion, target, transition)
    } else {
      baseOffsetMotion.set(target)
    }
  }, [activeIndex, count, baseOffsetMotion, constants, transition])

  const goToIndex = useCallback(
    (index) => {
      const next = (index % count + count) % count
      setActiveIndex(next)
    },
    [setActiveIndex, count]
  )

  const goPrev = useCallback(() => goToIndex(activeIndex - 1), [activeIndex, goToIndex])
  const goNext = useCallback(() => goToIndex(activeIndex + 1), [activeIndex, goToIndex])

  useEffect(() => {
    const onKeyDown = (e) => {
      const target = e.target
      if (target?.closest('input') || target?.closest('textarea') || target?.closest('[contenteditable="true"]')) return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goPrev, goNext])

  const snapFromDrag = useCallback(() => {
    const drag = dragSpring.get()
    const threshold = CARD_WIDTH * SWIPE_THRESHOLD
    if (drag > threshold) goToIndex(activeIndex - 1)
    else if (drag < -threshold) goToIndex(activeIndex + 1)
    dragSpring.set(0)
  }, [activeIndex, goToIndex, dragSpring, CARD_WIDTH])

  const handlePointerDown = useCallback(
    (e) => {
      if (e.button !== 0 && e.type === 'mousedown') return
      isDragging.current = true
      pointerId.current = e.pointerId ?? e.touches?.[0]?.identifier
      startX.current = e.clientX ?? e.touches?.[0]?.clientX
      dragSpring.set(0)
    },
    [dragSpring]
  )

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDragging.current) return
      const id = e.pointerId ?? e.touches?.[0]?.identifier
      if (pointerId.current != null && id !== pointerId.current) return
      const x = e.clientX ?? e.touches?.[0]?.clientX
      dragSpring.set(x - startX.current)
    },
    [dragSpring]
  )

  const handlePointerUp = useCallback(
    (e) => {
      const isTouch = e.touches !== undefined
      const isOurPointer = isTouch ? !e.touches?.length : (e.pointerId == null || pointerId.current == null || e.pointerId === pointerId.current)
      if (!isOurPointer || !isDragging.current) return
      isDragging.current = false
      pointerId.current = null
      snapFromDrag()
    },
    [snapFromDrag]
  )

  const handlePointerLeave = useCallback(() => {
    if (!isDragging.current) return
    isDragging.current = false
    pointerId.current = null
    snapFromDrag()
  }, [snapFromDrag])

  useEffect(() => {
    const up = () => {
      if (!isDragging.current) return
      isDragging.current = false
      pointerId.current = null
      snapFromDrag()
    }
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [snapFromDrag])

  /* Center active card: shift track so the point at baseOffset aligns with viewport center */
  const trackTransform = useTransform(() => {
    const base = baseOffsetMotion.get()
    const drag = dragSpring.get()
    const x = trackWidth / 2 - base + drag
    return `translateX(${x}px)`
  })

  return (
    <div
      className="cover-flow cover-flow-ipod"
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        className="cover-flow-nav cover-flow-prev"
        onClick={(e) => { e.stopPropagation(); goPrev(); }}
        onPointerDown={(e) => e.stopPropagation()}
        aria-label={`Previous ${slideLabel}`}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div
        className="cover-flow-viewport"
        style={{
          maxWidth: 2 * CARD_SPACING,
          touchAction: 'none',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerLeave}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        onTouchCancel={handlePointerLeave}
      >
        <div className="cover-flow-floor" aria-hidden="true" />
        <div className="cover-flow-track-wrapper">
          <motion.div
            className="cover-flow-track"
            style={{
              width: trackWidth,
              transform: trackTransform,
              willChange: 'transform',
              backfaceVisibility: 'hidden',
            }}
          >
          {cards.map((card, i) => {
            const offset = i - activeIndex
            const isCenter = offset === 0
            const isRightEdge = offset >= 2
            const scale = isCenter ? centerScale : sideScale
            const rotateY = -offset * rotationDeg
            const translateZ = isCenter ? 48 : -Math.abs(offset) * 60

            return (
            <motion.div
                key={i}
                className={`cover-flow-card-wrap ${isCenter ? 'is-center' : ''}`}
                style={{
                  flex: `0 0 ${CARD_SPACING}px`,
                  width: CARD_SPACING,
                  marginRight: i < count - 1 ? -CARD_OVERLAP : 0,
                  transform: `rotateY(${rotateY}deg) scale(${scale}) translateZ(${translateZ}px)`,
                  transformStyle: 'preserve-3d',
                  zIndex: isCenter ? 20 : Math.max(0, 10 - Math.abs(offset)),
                  visibility: isRightEdge ? 'hidden' : 'visible',
                  pointerEvents: isRightEdge ? 'none' : undefined,
                }}
                transition={transition}
                onClick={() => !isCenter && goToIndex(i)}
                role="button"
                tabIndex={isCenter ? 0 : -1}
                aria-label={isCenter ? undefined : `Go to ${slideLabel} ${i + 1} of ${count}`}
                aria-current={isCenter ? 'true' : undefined}
              >
                <div className="cover-flow-card cover-flow-card-reflect">
                  {card}
                </div>
              </motion.div>
            )
          })}
          </motion.div>
        </div>
      </div>

      <button
        type="button"
        className="cover-flow-nav cover-flow-next"
        onClick={(e) => { e.stopPropagation(); goNext(); }}
        onPointerDown={(e) => e.stopPropagation()}
        aria-label={`Next ${slideLabel}`}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <div
        className="cover-flow-dots"
        role="tablist"
        aria-label={`${slideLabel} slides`}
      >
        {cards.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`Go to ${slideLabel} ${i + 1} of ${count}`}
            className={`cover-flow-dot ${i === activeIndex ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); goToIndex(i); }}
            onPointerDown={(e) => e.stopPropagation()}
          />
        ))}
      </div>
    </div>
  )
}
