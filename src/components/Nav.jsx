/**
 * Nav Component
 */

import { useState } from 'react'
import styles from './Nav.module.css'

const NAV_LINKS = [
  { path: 'gallery',     label: 'Gallery'  },
  { path: 'create',      label: 'Create'   },
  { path: 'my-sketches', label: 'My Work'  },
]

export default function Nav({ page, navigate }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNav = (path) => {
    navigate(path)
    setMobileOpen(false)
  }

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.container}>

          {/* Logo */}
          <button className={styles.logo} onClick={() => handleNav('gallery')}>
            <div className={styles.logoIcon}>
              <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
                <path d="M6 26 C8 20 11 14 16 10 C21 6 26 5 28 6" stroke="url(#logoGrad)" strokeWidth="2" strokeLinecap="round"/>
                <path d="M6 26 C9 22 13 17 16 10" stroke="#9cc47a" strokeWidth="1.2" strokeLinecap="round" opacity=".6"/>
                <circle cx="16" cy="10" r="2" fill="#c8ddb0" opacity=".9"/>
                <circle cx="28" cy="6"  r="1.2" fill="#9cc47a" opacity=".7"/>
                <defs>
                  <linearGradient id="logoGrad" x1="6" y1="26" x2="28" y2="6" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#4A7A2E"/>
                    <stop offset="100%" stopColor="#c8ddb0"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className={styles.logoTextWrap}>
              <span className={styles.logoText}>
                Strok<em className={styles.logoAccent}>ē</em>
              </span>
              <span className={styles.logoTagline}>Digital Sketchbook</span>
            </div>
          </button>

          {/* Desktop Links */}
          <div className={styles.desktopLinks}>
            {NAV_LINKS.map(({ path, label }) => (
              <button
                key={path}
                onClick={() => handleNav(path)}
                className={`${styles.navLink} ${page === path ? styles.navLinkActive : ''}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button className={`${styles.ctaBtn} hide-mobile`} onClick={() => handleNav('create')}>
              <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
              </svg>
              New Sketch
            </button>
            <button className={`${styles.hamburger} show-mobile`} onClick={() => setMobileOpen(true)}>
              <span /><span /><span />
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <button className={styles.mobileClose} onClick={() => setMobileOpen(false)}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <div className={styles.mobileLogo}>
            Strok<em className={styles.logoAccent}>ē</em>
          </div>
          {NAV_LINKS.map(({ path, label }) => (
            <button key={path} className={styles.mobileLink} onClick={() => handleNav(path)}>
              {label}
            </button>
          ))}
          <button className={styles.mobileCtaBtn} onClick={() => handleNav('create')}>
            Start Drawing
          </button>
        </div>
      )}
    </>
  )
}