import React from 'react'
import { Link } from 'react-router-dom'
import './App.css'

/**
 * Simple layout for placeholder pages (Contact, Privacy Policy, Terms of Service).
 * Header matches main app style; content area for placeholder text.
 */
export function PlaceholderLayout({ title, children }) {
  return (
    <div className="placeholder-page">
      <header className="header placeholder-header">
        <div className="container">
          <Link to="/" className="logo" aria-label="DatingPool home">
            <h1 className="logo-text">DatingPool</h1>
          </Link>
          <Link to="/" className="nav-link nav-link-back">
            Back to home
          </Link>
        </div>
      </header>
      <main className="placeholder-main">
        <div className="container">
          <h1 className="placeholder-title">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  )
}
