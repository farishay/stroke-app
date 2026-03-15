/**
 * Footer Component
 * Site footer with logo (links to homepage) and page links.
 */

import styles from './Footer.module.css'

export default function Footer({ navigate }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        {/* Top row */}
        <div className={styles.topRow}>

          {/* Logo — clicks to homepage */}
          <button className={styles.brand} onClick={() => navigate('gallery')}>
            <div className={styles.brandIcon}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M3 21c3-3 5-7 8-10s6-4 10-6" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className={styles.brandName}>
              Strok<em className={styles.brandAccent}>ē</em>
            </span>
          </button>

          {/* Page links */}
          <nav className={styles.links}>
            <h4 className={styles.linksTitle}>Pages</h4>
            {[
              ['gallery',     'Gallery'],
              ['create',      'Create'],
              ['my-sketches', 'My Work'],
            ].map(([path, label]) => (
              <button key={path} className={styles.link} onClick={() => navigate(path)}>
                <svg width="8" height="8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
                {label}
              </button>
            ))}
          </nav>

        </div>

        {/* Bottom row */}
        <div className={styles.bottomRow}>
          <span>&copy; 2025 Strokē. All rights reserved.</span>
          <div className={styles.legal}>
            <a href="#" className={styles.legalLink}>Privacy</a>
            <a href="#" className={styles.legalLink}>Terms</a>
          </div>
        </div>

      </div>
    </footer>
  )
}
