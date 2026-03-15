/**
 * CreatePage
 * Full-screen canvas editor.
 * Handles both creating new sketches and editing existing ones.
 */

import { useState, useEffect, useRef } from 'react'
import { useCanvas } from '../hooks/useCanvas.js'
import { animateCreatePage } from '../hooks/useAnimations.js'
import AIPanel       from '../components/AIPanel.jsx'
import styles        from './CreatePage.module.css'

const STROKE_COLORS = [
  '#1C1C1E', '#2D4A1E', '#4A7A2E',
  '#8B4513', '#1D4ED8', '#B91C1C',
  '#7C3AED', '#D97706', '#64748B',
]

const STROKE_WEIGHTS = [1, 2, 3, 4, 6]

const TOOLBAR_TOOLS = [
  { id: 'pen',    label: 'Pen',   icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
  { id: 'eraser', label: 'Erase', icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' },
  { id: 'color',  label: 'Color', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
  { id: 'size',   label: 'Size',  icon: 'M12 7a5 5 0 100 10A5 5 0 0012 7zM12 2v2M12 20v2M2 12h2M20 12h2' },
  { id: 'meta',   label: 'Info',  icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
]

export default function CreatePage({ onSave, editSketch, navigate }) {
  // ── Drawing state ──────────────────────────────────────
  const canvasRef = useRef(null)
  const [strokeColor, setStrokeColor] = useState(editSketch?.strokeColor || '#1C1C1E')
  const [strokeWidth, setStrokeWidth] = useState(editSketch?.strokeWidth || 2)
  const [animal,      setAnimal]      = useState(editSketch?.animal      || 'abstract')
  const [title,       setTitle]       = useState(editSketch?.title       || '')
  const [isEraser,    setIsEraser]    = useState(false)
  const [activeTool,  setActiveTool]  = useState(null)
  const [aiOpen,      setAiOpen]      = useState(false)
  const [hasDrawn,    setHasDrawn]    = useState(false)

  const engine = useCanvas(canvasRef, strokeColor, strokeWidth)

  // ── Setup ──────────────────────────────────────────────
  useEffect(() => {
    engine.resize()
    animateCreatePage()
    window.addEventListener('resize', engine.resize)
    return () => window.removeEventListener('resize', engine.resize)
  }, [])

  // Load existing sketch paths in edit mode
  useEffect(() => {
    if (editSketch?._rawPaths) {
      setTimeout(() => {
        engine.loadPaths(editSketch._rawPaths)
        setHasDrawn(true)
      }, 200)
    }
  }, [editSketch])

  // ── Handlers ───────────────────────────────────────────
  const handleSave = () => {
    if (!engine.hasStrokes()) {
      alert('Canvas is empty — draw something first!')
      return
    }
    onSave({
      title:       title || 'Untitled Sketch',
      animal,
      pathData:    engine.pathsToSVG(),
      strokeWidth,
      strokeColor,
      _rawPaths:   engine.getPaths(),
    })
  }

  const handleToolSelect = (toolId) => {
    // Clicking active tool closes the panel
    if (activeTool === toolId) { setActiveTool(null); return }
    setActiveTool(toolId)
    const erasing = toolId === 'eraser'
    setIsEraser(erasing)
    engine.setEraser(erasing)
  }

  const handleEraserToggle = () => {
    const next = !isEraser
    setIsEraser(next)
    engine.setEraser(next)
  }

  const handleClear = () => {
    engine.clear()
    setHasDrawn(false)
  }

  // ── Render ─────────────────────────────────────────────
  return (
    <div className={styles.layout}>

      {/* ── Left Toolbar ── */}
      <aside className={`${styles.toolbar} toolbar`}>
        {TOOLBAR_TOOLS.map(({ id, label, icon }) => (
          <button
            key={id}
            title={label}
            onClick={() => handleToolSelect(id)}
            className={`${styles.toolBtn} ${activeTool === id ? styles.toolBtnActive : ''}`}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={icon}/>
            </svg>
            <span>{label}</span>
          </button>
        ))}

        <div className={styles.divider}/>

        <button title="Undo" onClick={engine.undo} className={styles.toolBtn}>
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
          </svg>
          <span>Undo</span>
        </button>

        <button title="AI Assistant" onClick={() => setAiOpen(true)} className={`${styles.toolBtn} ${styles.toolBtnAI}`}>
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
          </svg>
          <span>AI</span>
        </button>

        <div className={styles.spacer}/>
        <div className={styles.divider}/>

        <button title="Save" onClick={handleSave} className={`${styles.toolBtn} ${styles.toolBtnSave}`}>
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
          </svg>
          <span>Save</span>
        </button>

        <button title="Export PNG" onClick={engine.downloadPNG} className={styles.toolBtn}>
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          <span>Export</span>
        </button>
      </aside>

      {/* ── Props Panel ── */}
      {activeTool && !['pen', 'eraser'].includes(activeTool) && (
        <PropsPanel
          activeTool={activeTool}
          strokeColor={strokeColor}
          strokeWidth={strokeWidth}
          animal={animal}
          title={title}
          onColorChange={setStrokeColor}
          onWeightChange={setStrokeWidth}
          onAnimalChange={setAnimal}
          onTitleChange={setTitle}
          onClose={() => setActiveTool(null)}
          onSave={handleSave}
          onDownload={engine.downloadPNG}
          isEditMode={!!editSketch}
        />
      )}

      {/* ── Canvas Area ── */}
      <div className={`${styles.canvasArea} canvas-area`}>

        {/* Edit mode banner */}
        {editSketch && (
          <div className={styles.editBanner}>
            <svg width="12" height="12" fill="none" stroke="#9cc47a" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
            </svg>
            <span>Editing: {editSketch.title}</span>
            <button onClick={() => navigate('my-sketches')} className={styles.editBannerClose}>
              <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        )}

        {/* Canvas wrapper */}
        <div className={styles.canvasWrapper}>
          {!hasDrawn && (
            <div className={styles.drawPrompt}>
              <div className={styles.drawPromptIcon}>
                <svg className="pen-bounce" width="20" height="20" fill="none" stroke="var(--color-stone)" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                </svg>
              </div>
              <span className={styles.drawPromptText}>Begin your stroke here</span>
            </div>
          )}

          <canvas
            ref={canvasRef}
            className={styles.canvas}
            onMouseDown={e => { engine.startDraw(e); setHasDrawn(true) }}
            onMouseMove={engine.draw}
            onMouseUp={engine.endDraw}
            onMouseOut={engine.endDraw}
            onTouchStart={e => { engine.startDraw(e); setHasDrawn(true) }}
            onTouchMove={engine.draw}
            onTouchEnd={engine.endDraw}
          />
        </div>

        {/* Bottom action bar */}
        <div className={styles.bottomBar}>
          <BottomBarBtn label="Undo"   icon="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" onClick={engine.undo}/>
          <div className={styles.barDivider}/>
          <BottomBarBtn label={isEraser ? 'Pen' : 'Eraser'} icon="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" onClick={handleEraserToggle}/>
          <div className={styles.barDivider}/>
          <BottomBarBtn label="Clear"  icon="M6 18L18 6M6 6l12 12" onClick={handleClear} danger/>
          <div className={styles.barDivider}/>
          <BottomBarBtn label="Save"   icon="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" onClick={handleSave} accent/>
        </div>
      </div>

      {/* ── AI Panel ── */}
      <AIPanel
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        strokeCount={engine.strokeCount}
      />
    </div>
  )
}

/* ── Props Panel ──────────────────────────────────────────── */
function PropsPanel({ activeTool, strokeColor, strokeWidth, animal, title, onColorChange, onWeightChange, onAnimalChange, onTitleChange, onClose, onSave, onDownload, isEditMode }) {
  const panelTitle = { color: 'Ink Color', size: 'Stroke Size', meta: 'Artwork Info' }[activeTool]

  return (
    <div className={styles.propsPanel}>
      {/* Header */}
      <div className={styles.propsPanelHeader}>
        <span className={styles.propsPanelTitle}>{panelTitle}</span>
        <button className={styles.propsPanelClose} onClick={onClose}>
          <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className={styles.propsPanelContent}>
        {activeTool === 'color' && (
          <>
            <input
              type="color"
              value={strokeColor}
              onChange={e => onColorChange(e.target.value)}
              className={styles.colorPicker}
            />
            <div className={styles.colorSwatches}>
              {STROKE_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => onColorChange(color)}
                  className={styles.colorSwatch}
                  style={{
                    background:  color,
                    boxShadow:   strokeColor === color ? `0 0 0 2px #fff, 0 0 0 4px ${color}` : 'none',
                  }}
                />
              ))}
            </div>
          </>
        )}

        {activeTool === 'size' && (
          <div className={styles.weightRow}>
            {STROKE_WEIGHTS.map(w => (
              <button
                key={w}
                onClick={() => onWeightChange(w)}
                className={styles.weightDot}
                style={{
                  width:     5 + w * 4,
                  height:    5 + w * 4,
                  minWidth:  5 + w * 4,
                  opacity:   strokeWidth === w ? 1 : 0.3,
                  boxShadow: strokeWidth === w ? '0 0 0 2px #fff, 0 0 0 4px #1C1C1E' : 'none',
                }}
              />
            ))}
          </div>
        )}

        {activeTool === 'meta' && (
          <>
            <label className="form-label">Title</label>
            <input
              type="text"
              placeholder="Untitled Sketch"
              value={title}
              onChange={e => onTitleChange(e.target.value)}
              className={styles.titleInput}
            />
            <label className="form-label" style={{ marginTop: 16 }}>Category</label>
            <select
              value={animal}
              onChange={e => onAnimalChange(e.target.value)}
              className="form-select"
            >
              {['abstract','fox','cat','bird','elephant','deer','other'].map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </>
        )}
      </div>

      {/* Actions */}
      <div className={styles.propsPanelActions}>
        <button className={`btn btn-primary btn-full`} onClick={onSave}>
          {isEditMode ? 'Update Sketch' : 'Publish'}
        </button>
        <button className={`btn btn-ghost btn-full`} onClick={onDownload}>
          Download PNG
        </button>
      </div>
    </div>
  )
}

/* ── Bottom Bar Button ────────────────────────────────────── */
function BottomBarBtn({ label, icon, onClick, danger, accent }) {
  return (
    <button
      onClick={onClick}
      className={`${styles.barBtn} ${danger ? styles.barBtnDanger : ''} ${accent ? styles.barBtnAccent : ''}`}
    >
      <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon}/>
      </svg>
      {label}
    </button>
  )
}
