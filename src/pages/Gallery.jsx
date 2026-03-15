import { useEffect } from 'react'
import { animateGallery, setupCardHovers } from '../hooks/useAnimations.js'
import styles from './Gallery.module.css'

const FILTER_OPTIONS = [
  { value: 'all',      label: 'All'      },
  { value: 'fox',      label: 'Fox'      },
  { value: 'cat',      label: 'Cat'      },
  { value: 'bird',     label: 'Bird'     },
  { value: 'elephant', label: 'Elephant' },
  { value: 'deer',     label: 'Deer'     },
  { value: 'abstract', label: 'Abstract' },
  { value: 'other',    label: 'Other'    },
]

export default function Gallery({ sketches, filter, setFilter, navigate, allCount }) {
  useEffect(() => {
    animateGallery()
    setupCardHovers()
  }, [])

  return (
    <div className={styles.page}>
      <HeroSection allCount={allCount} navigate={navigate}/>
      <FilterBar   filter={filter} setFilter={setFilter}/>
      <SketchGrid  sketches={sketches} navigate={navigate}/>
    </div>
  )
}

function HeroSection({ allCount, navigate }) {
  return (
    <div className={`${styles.hero} hero-section`}>

      <div className={styles.heroBg}/>
      <div className={styles.grain}/>
      <div className={styles.glowCenter}/>
      <div className={styles.glowBottom}/>

      <div className={`${styles.lineAccents} hero-bg-lines`}>
        <svg width="100%" height="100%" viewBox="0 0 1400 700" preserveAspectRatio="xMidYMid slice">
          <path d="M0,200 Q350,120 700,200 T1400,180" fill="none" stroke="#9cc47a" strokeWidth=".8" opacity=".06"
            strokeDasharray="2000" strokeDashoffset="2000" style={{ animation: 'drawStroke 6s ease forwards .2s' }}/>
          <path d="M0,350 Q350,270 700,350 T1400,330" fill="none" stroke="#c8ddb0" strokeWidth=".5" opacity=".04"
            strokeDasharray="2000" strokeDashoffset="2000" style={{ animation: 'drawStroke 7s ease forwards .5s' }}/>
          {[140,280,420,560,700,840,980,1120,1260].map(x => (
            <line key={x} x1={x} y1="0" x2={x} y2="700" stroke="#9cc47a" strokeWidth=".3" opacity=".02"/>
          ))}
          {[140,280,420,560].map(y => (
            <line key={y} x1="0" y1={y} x2="1400" y2={y} stroke="#9cc47a" strokeWidth=".3" opacity=".02"/>
          ))}
        </svg>
      </div>

      <div className={`${styles.artLeft} art-left`}>
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
          <path className="path-draw" d="M60,160 Q55,130 40,110 Q25,90 30,65 Q35,40 60,35 Q75,30 80,50 Q85,35 100,30 Q120,25 130,45 Q145,40 155,55 Q170,75 160,100 Q150,125 140,140 Q125,160 100,165 Q80,170 60,160Z"
            stroke="url(#fg)" strokeWidth="1" strokeLinecap="round"/>
          <path className="path-draw" d="M60,35 Q50,10 40,20 Q35,30 50,40" stroke="#c8ddb0" strokeWidth=".8" strokeLinecap="round" style={{ animationDelay: '.4s' }}/>
          <path className="path-draw" d="M130,45 Q140,15 150,20 Q158,32 145,48" stroke="#c8ddb0" strokeWidth=".8" strokeLinecap="round" style={{ animationDelay: '.8s' }}/>
          <defs>
            <linearGradient id="fg" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#e8f5d0"/>
              <stop offset="100%" stopColor="#6aaa3a"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className={`${styles.artRight} art-right`}>
        <svg width="140" height="210" viewBox="0 0 160 220" fill="none">
          <path className="path-draw" d="M80,30 Q85,10 90,20 Q95,35 88,50 Q100,45 115,50 Q130,55 120,65 Q108,68 95,60 Q90,80 85,100 Q88,130 82,160 Q78,185 75,200"
            stroke="url(#hg)" strokeWidth="1" strokeLinecap="round"/>
          <path className="path-draw" d="M82,160 Q60,170 45,165 Q35,160 40,150 Q50,145 65,155" stroke="#9cc47a" strokeWidth=".8" strokeLinecap="round" style={{ animationDelay: '.4s' }}/>
          <defs>
            <linearGradient id="hg" x1="0" y1="0" x2="0" y2="220" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#e8f5d0"/>
              <stop offset="100%" stopColor="#3d6428"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className={styles.heroContent}>
        <div className={styles.heroLeft}>

          <div className={`${styles.heroBadge} hero-badge`}>
            <span className={styles.badgeDot}/>
            Minimalist Digital Sketchbook
          </div>

          <div className={`${styles.heroHeadline} hero-title`}>
            <span className={styles.heroLine1}>One stroke.</span>
            <span className={styles.heroLine2}>
              <em className={styles.heroItalic}>Infinite</em>
            </span>
            <span className={styles.heroLine3}>expression.</span>
          </div>

          <p className={`${styles.heroDesc} hero-desc`}>
            Create minimalist line art with AI-powered guidance. No art degree needed — just your instinct and a single stroke.
          </p>

          <div className={`${styles.heroCTA} hero-cta`}>
            <button className={styles.heroBtnPrimary} onClick={() => navigate('create')}>
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
              </svg>
              Start Drawing
            </button>
            <button className={styles.heroBtnSecondary} onClick={() => navigate('my-sketches')}>
              View Archive
              <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

          <div className={styles.heroStats}>
            <div className={`${styles.heroStat} hero-stat`}>
              <span className={styles.heroStatValue}>{allCount || '0'}</span>
              <span className={styles.heroStatLabel}>Sketches</span>
            </div>
            <div className={styles.heroStatDivider}/>
            <div className={`${styles.heroStat} hero-stat`}>
              <span className={styles.heroStatValue}>AI</span>
              <span className={styles.heroStatLabel}>Assisted</span>
            </div>
            <div className={styles.heroStatDivider}/>
            <div className={`${styles.heroStat} hero-stat`}>
              <span className={styles.heroStatValue}>∞</span>
              <span className={styles.heroStatLabel}>Possibilities</span>
            </div>
          </div>

        </div>
      </div>

      <div className={styles.scrollHint}>
        <div className={styles.scrollDot}/>
        <span>Explore</span>
      </div>

    </div>
  )
}

function FilterBar({ filter, setFilter }) {
  return (
    <div className={styles.filterBar}>
      {FILTER_OPTIONS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setFilter(value)}
          className={`${styles.filterBtn} ${filter === value ? styles.filterBtnActive : ''}`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

function SketchGrid({ sketches, navigate }) {
  if (!sketches.length) {
    return (
      <div
        className="empty-state"
        onClick={() => navigate('create')}
        style={{ cursor: 'pointer' }}
        onMouseOver={e => e.currentTarget.style.borderColor = 'var(--color-accent)'}
        onMouseOut={e  => e.currentTarget.style.borderColor = 'var(--color-wheat)'}
      >
        <div className="empty-icon">
          <svg width="24" height="24" fill="none" stroke="var(--color-accent)" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
          </svg>
        </div>
        <p className="empty-title">Gallery awaits</p>
        <p className="empty-subtitle">Click anywhere to start drawing</p>
        <button className="btn btn-primary" style={{ marginTop: 16 }}
          onClick={e => { e.stopPropagation(); navigate('create') }}>
          Start Drawing
        </button>
      </div>
    )
  }

  return (
    <div className="sketch-grid">
      {sketches.map(sketch => (
        <SketchCard key={sketch.id} sketch={sketch} navigate={navigate}/>
      ))}
    </div>
  )
}

function SketchCard({ sketch, navigate }) {
  return (
    <div className="sketch-card" onClick={() => navigate('detail', { id: sketch.id })}>
      <div className="card-preview">
        <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
          <path d={sketch.pathData} fill="none" stroke={sketch.strokeColor || '#1C1C1E'} strokeWidth={sketch.strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="card-body">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
          <h3 className="card-title">{sketch.title}</h3>
          <span className="card-tag">{sketch.animal}</span>
        </div>
        <div className="card-footer">
          <span>By <strong style={{ color: 'var(--color-ink)' }}>You</strong></span>
          <span>{sketch.created}</span>
        </div>
      </div>
    </div>
  )
}