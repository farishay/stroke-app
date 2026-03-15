/**
 * MySketches Page
 * Shows all saved sketches with Edit, Rename, and Delete options.
 */

import { useState, useEffect } from 'react'
import { animateMySketches, setupCardHovers } from '../hooks/useAnimations.js'
import styles from './MySketches.module.css'

export default function MySketches({ sketches, navigate, onDelete, onUpdateMeta }) {
  useEffect(() => {
    animateMySketches()
    setupCardHovers()
  }, [sketches])
  const [renameId,    setRenameId]    = useState(null)
  const [renameTitle, setRenameTitle] = useState('')
  const [renameAnimal,setRenameAnimal]= useState('abstract')

  const openRename = (sketch) => {
    setRenameId(sketch.id)
    setRenameTitle(sketch.title)
    setRenameAnimal(sketch.animal)
  }

  const saveRename = () => {
    onUpdateMeta(renameId, renameTitle || 'Untitled', renameAnimal)
    setRenameId(null)
  }

  return (
    <div className="page-container">

      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title">Your Archive</h1>
          <p className="section-subtitle">{sketches.length} sketch{sketches.length !== 1 ? 'es' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('create')}>
          <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
          </svg>
          New Sketch
        </button>
      </div>

      {/* Empty state */}
      {!sketches.length ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="24" height="24" fill="none" stroke="var(--color-accent)" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
            </svg>
          </div>
          <p className="empty-title">Nothing here yet</p>
          <p className="empty-subtitle">Your saved sketches will appear here</p>
          <button className="btn btn-primary" onClick={() => navigate('create')}>Start Drawing</button>
        </div>
      ) : (
        <div className="sketch-grid">
          {sketches.map(sketch => (
            <SketchCard
              key={sketch.id}
              sketch={sketch}
              navigate={navigate}
              onDelete={onDelete}
              onRename={openRename}
            />
          ))}
        </div>
      )}

      {/* Rename Modal */}
      {renameId && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h2 className="modal-title">Rename Sketch</h2>
              <button className={styles.modalClose} onClick={() => setRenameId(null)}>
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="form-label">Title</label>
              <input
                className="form-input"
                value={renameTitle}
                onChange={e => setRenameTitle(e.target.value)}
                placeholder="Untitled Sketch"
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={renameAnimal}
                onChange={e => setRenameAnimal(e.target.value)}
              >
                {['abstract','fox','cat','bird','elephant','deer','other'].map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <button className="btn btn-primary btn-full" onClick={saveRename}>
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Sketch Card ──────────────────────────────────────────── */
function SketchCard({ sketch, navigate, onDelete, onRename }) {
  return (
    <div className="sketch-card">
      {/* Preview — clicks to detail */}
      <div className="card-preview" onClick={() => navigate('detail', { id: sketch.id })}>
        <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
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

      {/* Card body */}
      <div className="card-body">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
          <h3
            className="card-title"
            onClick={() => navigate('detail', { id: sketch.id })}
          >
            {sketch.title}
          </h3>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
            <CardIconBtn
              title="Edit Drawing"
              onClick={() => navigate('edit', { id: sketch.id })}
              icon="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              hoverColor="var(--color-accent-mid)"
              hoverBg="var(--color-accent-light)"
            />
            <CardIconBtn
              title="Rename"
              onClick={() => onRename(sketch)}
              icon="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              hoverColor="var(--color-accent-mid)"
              hoverBg="var(--color-accent-light)"
            />
            <CardIconBtn
              title="Delete"
              onClick={() => onDelete(sketch.id)}
              icon="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              hoverColor="#ef4444"
              hoverBg="#fef2f2"
              hoverBorder="#fca5a5"
            />
          </div>
        </div>

        <div className="card-footer">
          <span
            style={{
              padding:       '2px 8px',
              background:    'var(--color-bg)',
              border:        '1px solid var(--color-wheat)',
              borderRadius:  'var(--radius-pill)',
              textTransform: 'uppercase',
              letterSpacing: '.1em',
            }}
          >
            {sketch.animal}
          </span>
          <span>{sketch.created}</span>
        </div>
      </div>
    </div>
  )
}

/* ── Small icon button used inside cards ─────────────────── */
function CardIconBtn({ title, onClick, icon, hoverColor, hoverBg, hoverBorder = 'var(--color-wheat)' }) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        width:           28,
        height:          28,
        borderRadius:    7,
        border:          '1px solid transparent',
        background:      'transparent',
        cursor:          'pointer',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        color:           'var(--color-stone)',
        transition:      'all .2s',
      }}
      onMouseOver={e => {
        e.currentTarget.style.background   = hoverBg
        e.currentTarget.style.color        = hoverColor
        e.currentTarget.style.borderColor  = hoverBorder
      }}
      onMouseOut={e => {
        e.currentTarget.style.background   = 'transparent'
        e.currentTarget.style.color        = 'var(--color-stone)'
        e.currentTarget.style.borderColor  = 'transparent'
      }}
    >
      <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={icon}/>
      </svg>
    </button>
  )
}
