import React from 'react'

/**
 * SF-style outline icons (stroke-based, 24×24).
 * Use className for size (e.g. step-icon, diff-icon, timeline-icon).
 */
const size = 24
const stroke = 2
const defaultClassName = 'icon'

const icons = {
  bot: (
    <path strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" d="M12 4v2m0 12v2M4 12H2m20 0h-2M6.34 6.34L4.93 4.93m12.74 12.74l1.41-1.41M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" />
  ),
  waves: (
    <path strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" d="M2 12c2 0 4-3 6-3s4 3 6 3 4-3 6-3M2 17c2 0 4-3 6-3s4 3 6 3 4-3 6-3M2 7c2 0 4-3 6-3s4 3 6 3 4-3 6-3" />
  ),
  target: (
    <path strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
  ),
  message: (
    <path strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  ),
  usersTwo: (
    <path strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  ),
  checkCircle: (
    <path strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3" />
  ),
  xCircle: (
    <path strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM15 9l-6 6M9 9l6 6" />
  ),
  folder: (
    <path strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  ),
  user: (
    <path strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
  ),
  calendar: (
    <path strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" d="M8 2v4M16 2v4M21 10H3M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM15 14h.01M12 14h.01M9 14h.01" />
  ),
  mapPin: (
    <path strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
  ),
  clock: (
    <path strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2" />
  ),
  hand: (
    <path strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v0M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v6M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8" />
  ),
  folderOpen: (
    <path strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3l2 3h9a2 2 0 0 1 2 2zM2 10h20" />
  ),
  shield: (
    <path strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  ),
  check: (
    <path strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" d="M20 6L9 17l-5-5" />
  ),
  users: (
    <path strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  ),
  sparkles: (
    <path strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zM5 17l.75 2.25L8 20l-2.25.75L5 23l-.75-2.25L2 20l2.25-.75L5 17zM19 17l.75 2.25L22 20l-2.25.75L19 23l-.75-2.25L16 20l2.25-.75L19 17z" />
  ),
  ticket: (
    <path strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z" />
  ),
  search: (
    <path strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
  ),
  lock: (
    <path strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z" />
  ),
  zap: (
    <path strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  ),
  smartphone: (
    <path strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" d="M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM12 18h.01" />
  ),
  unlock: (
    <path strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" d="M8 11V7a4 4 0 1 1 8 0m-4 8v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2z" />
  ),
  phone: (
    <path strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  ),
  video: (
    <path strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" d="M23 7l-7 5 7 5V7zM16 5H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4" />
  ),
  camera: (
    <path strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
  ),
  alert: (
    <path strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3zM12 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
  ),
  eye: (
    <path strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
  ),
  chevronDown: (
    <path strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" d="M6 9l6 6 6-6" />
  ),
  chevronRight: (
    <path strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" d="M9 18l6-6-6-6" />
  ),
}

export function Icon({ name, className = defaultClassName, size: customSize, ...props }) {
  const path = icons[name]
  if (!path) return null
  const s = customSize ?? size
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={s}
      height={s}
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      {...props}
    >
      {path}
    </svg>
  )
}

export default Icon
