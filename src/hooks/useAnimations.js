/**
 * useAnimations Hook
 * All GSAP animations for the app in one place.
 * Uses setTimeout to ensure DOM is ready before animating.
 */

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ── Kill all running animations (call on page change) ── */
export function killAll() {
  ScrollTrigger.getAll().forEach(t => t.kill())
  gsap.killTweensOf('*')
}

/* ══════════════════════════════════════
   GALLERY PAGE ANIMATIONS
══════════════════════════════════════ */
export function animateGallery() {
  setTimeout(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

    if (document.querySelector('.hero-section')) {
      tl.fromTo('.hero-section', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out' }, 0)
    }
    if (document.querySelector('.hero-badge')) {
      tl.fromTo('.hero-badge', { y: -30, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'back.out(1.5)' }, 0.3)
    }
    if (document.querySelector('.hero-title')) {
      tl.fromTo('.hero-title', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'expo.out' }, 0.45)
    }
    if (document.querySelector('.hero-subtitle')) {
      tl.fromTo('.hero-subtitle', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, 0.65)
    }
    if (document.querySelector('.hero-desc')) {
      tl.fromTo('.hero-desc', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.8)
    }
    if (document.querySelector('.hero-cta')) {
      tl.fromTo('.hero-cta', { scale: 0.88, opacity: 0, y: 15 }, { scale: 1, opacity: 1, y: 0, duration: 0.85, ease: 'back.out(1.5)' }, 0.95)
    }
    if (document.querySelector('.hero-stat')) {
      tl.fromTo('.hero-stat', { y: 25, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.7 }, 1.05)
    }
    if (document.querySelector('.art-left')) {
      tl.fromTo('.art-left', { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }, 0.4)
    }
    if (document.querySelector('.art-right')) {
      tl.fromTo('.art-right', { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }, 0.5)
    }

    if (document.querySelector('.sketch-grid') && document.querySelector('.sketch-card')) {
      gsap.fromTo('.sketch-card',
        { y: 70, opacity: 0, scale: 0.97 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.9, stagger: 0.08, ease: 'power4.out',
          scrollTrigger: { trigger: '.sketch-grid', start: 'top 85%' }
        }
      )
    }

    if (document.querySelector('.hero-bg-lines')) {
      gsap.to('.hero-bg-lines', {
        yPercent: 35, ease: 'none',
        scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: true }
      })
    }

    if (document.querySelector('.art-left')) {
      gsap.to('.art-left',  { y: '-=14', repeat: -1, yoyo: true, duration: 4,   ease: 'sine.inOut', delay: 1.5 })
    }
    if (document.querySelector('.art-right')) {
      gsap.to('.art-right', { y: '+=11', repeat: -1, yoyo: true, duration: 5.5, ease: 'sine.inOut', delay: 2 })
    }

    const hero = document.querySelector('.hero-section')
    if (hero && window.innerWidth > 768) {
      hero.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth  - 0.5) * 20
        const y = (e.clientY / window.innerHeight - 0.5) * 20
        if (document.querySelector('.art-left'))      gsap.to('.art-left',      { x,      y,     duration: 0.9, ease: 'power2.out' })
        if (document.querySelector('.art-right'))     gsap.to('.art-right',     { x: -x,  y: -y, duration: 1.2, ease: 'power2.out' })
        if (document.querySelector('.hero-bg-lines')) gsap.to('.hero-bg-lines', { x: x * 0.3,    duration: 1.4, ease: 'power2.out' })
      })
    }

  }, 100)
}

/* ══════════════════════════════════════
   CREATE PAGE ANIMATIONS
══════════════════════════════════════ */
export function animateCreatePage() {
  setTimeout(() => {
    if (document.querySelector('.toolbar')) {
      gsap.fromTo('.toolbar', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power4.out' })
    }
    if (document.querySelector('.canvas-area')) {
      gsap.fromTo('.canvas-area', { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.1 })
    }
  }, 100)
}

/* ══════════════════════════════════════
   MY SKETCHES PAGE ANIMATIONS
══════════════════════════════════════ */
export function animateMySketches() {
  setTimeout(() => {
    if (document.querySelector('.section-header')) {
      gsap.fromTo('.section-header', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out' })
    }
    if (document.querySelector('.sketch-card')) {
      gsap.fromTo('.sketch-card', { y: 50, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.07, ease: 'power4.out', delay: 0.15 })
    }
  }, 100)
}

/* ══════════════════════════════════════
   DETAIL PAGE ANIMATIONS
══════════════════════════════════════ */
export function animateDetail() {
  setTimeout(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
    if (document.querySelector('.detail-back'))    tl.fromTo('.detail-back',    { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, 0)
    if (document.querySelector('.detail-title'))   tl.fromTo('.detail-title',   { y: 40,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.1)
    if (document.querySelector('.detail-meta'))    tl.fromTo('.detail-meta',    { y: 20,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.25)
    if (document.querySelector('.detail-preview')) tl.fromTo('.detail-preview', { y: 40,  opacity: 0, scale: 0.98 }, { y: 0, opacity: 1, scale: 1, duration: 0.9 }, 0.3)
    if (document.querySelector('.detail-actions')) tl.fromTo('.detail-actions', { y: 20,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.55)
  }, 100)
}

/* ══════════════════════════════════════
   CARD HOVER ANIMATIONS
══════════════════════════════════════ */
export function setupCardHovers() {
  setTimeout(() => {
    document.querySelectorAll('.sketch-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -6, scale: 1.015, duration: 0.4, ease: 'power2.out' })
      })
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, scale: 1, duration: 0.4, ease: 'power2.out' })
      })
    })
  }, 200)
}