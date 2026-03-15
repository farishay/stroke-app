/**
 * Detail Page
 * Full view of a single sketch with like, edit, and delete actions.
 */

import { useEffect } from 'react'
import { animateDetail } from '../hooks/useAnimations.js'
import styles from './Detail.module.css'

export default function Detail({ sketch, navigate, onDelete, onLike }) {
  useEffect(() => {
    if (sketch) animateDetail()
  }, [sketch])
  if (!sketch) {
    return (
      <div className="empty-state" style={{ maxWidth: 600, margin: '4rem auto' }}>
        <p className="empty-title">Sketch not found</p>
        <p className="empty-subtitle">It may have been deleted</p>
        <button className="btn btn-primary" onClick={() => navigate('my-sketches')}>
          Back to Archive
        </button>
      </div>
    )
  }

  return (
    <div className={styles.page}>

      {/* Back button */}
      <button className={`${styles.backBtn} detail-back`} onClick={() => navigate('my-sketches')}>
        <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7"/>
        </svg>
        Archive
      </button>

      {/* Title row */}
      <div className={`${styles.titleRow} detail-title`}>
        <div>
          <h1 className={styles.title}>{sketch.title}</h1>
          <p className={`${styles.meta} detail-meta`}>
            By <strong>You</strong>
            <span className={styles.metaDot}>·</span>
            {sketch.animal}
            <span className={styles.metaDot}>·</span>
            {sketch.created}
          </p>
        </div>

        {/* Like button */}
        <button className={styles.likeBtn} onClick={() => onLike(sketch.id)}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
          {sketch.likes || 0}
        </button>
      </div>

      {/* Sketch preview */}
      <div className={`${styles.preview} detail-preview`}>
        <div className={styles.previewInner}>
          <svg width="100%" height="100%" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid meet">
            <path
              d={sketch.pathData}
              fill="none"
              stroke={sketch.strokeColor || '#1C1C1E'}
              strokeWidth={sketch.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Action buttons */}
      <div className={`${styles.actions} detail-actions`}>
        <button
          className="btn btn-outline"
          onClick={() => navigate('edit', { id: sketch.id })}
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
          </svg>
          Edit Drawing
        </button>

        <button
          className="btn btn-danger"
          onClick={() => onDelete(sketch.id)}
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
          Delete
        </button>
      </div>

    </div>
  )
}
