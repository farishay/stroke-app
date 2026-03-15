/**
 * useCanvas Hook
 * Encapsulates all canvas drawing logic.
 * Returns methods to control drawing, erasing, undoing, etc.
 */

import { useRef, useCallback } from 'react'

/**
 * @param {React.RefObject} canvasRef - ref attached to <canvas>
 * @param {string} strokeColor        - current ink color
 * @param {number} strokeWidth        - current stroke thickness
 */
export function useCanvas(canvasRef, strokeColor, strokeWidth) {
  const pathsRef       = useRef([])   // saved strokes
  const currentPath    = useRef([])   // stroke in progress
  const isDrawing      = useRef(false)
  const isEraser       = useRef(false)
  const lastPos        = useRef({ x: 0, y: 0 })

  // ── Redraw all saved paths ──────────────────────────────
  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    pathsRef.current.forEach((path) => {
      if (path.points.length < 2) return
      ctx.beginPath()
      ctx.moveTo(path.points[0].x, path.points[0].y)
      path.points.slice(1).forEach(({ x, y }) => ctx.lineTo(x, y))
      ctx.strokeStyle = path.color
      ctx.lineWidth   = path.width
      ctx.lineCap     = 'round'
      ctx.lineJoin    = 'round'
      ctx.stroke()
    })
  }, [canvasRef])

  // ── Resize canvas to fill its container ────────────────
  const resize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width  = canvas.parentElement.clientWidth
    canvas.height = canvas.parentElement.clientHeight
    redraw()
  }, [canvasRef, redraw])

  // ── Get pointer position relative to canvas ────────────
  const getPosition = useCallback((e) => {
    const rect  = canvasRef.current.getBoundingClientRect()
    const touch = e.touches?.[0]
    return {
      x: (touch ? touch.clientX : e.clientX) - rect.left,
      y: (touch ? touch.clientY : e.clientY) - rect.top,
    }
  }, [canvasRef])

  // ── Drawing events ─────────────────────────────────────
  const startDraw = useCallback((e) => {
    isDrawing.current = true
    const pos = getPosition(e)
    lastPos.current = pos
    if (!isEraser.current) currentPath.current = [pos]
  }, [getPosition])

  const draw = useCallback((e) => {
    if (!isDrawing.current) return
    e.preventDefault()

    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    const pos    = getPosition(e)

    ctx.lineCap  = 'round'
    ctx.lineJoin = 'round'

    if (isEraser.current) {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.strokeStyle = 'rgba(0,0,0,1)'
      ctx.lineWidth   = strokeWidth * 5
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = strokeColor
      ctx.lineWidth   = strokeWidth
    }

    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()

    if (!isEraser.current) currentPath.current.push(pos)
    lastPos.current = pos
  }, [canvasRef, getPosition, strokeColor, strokeWidth])

  const endDraw = useCallback(() => {
    if (!isDrawing.current) return
    isDrawing.current = false

    if (!isEraser.current && currentPath.current.length > 1) {
      pathsRef.current = [
        ...pathsRef.current,
        { points: [...currentPath.current], color: strokeColor, width: strokeWidth },
      ]
    }
    currentPath.current = []
  }, [strokeColor, strokeWidth])

  // ── Canvas actions ─────────────────────────────────────
  const undo = useCallback(() => {
    pathsRef.current = pathsRef.current.slice(0, -1)
    redraw()
  }, [redraw])

  const clear = useCallback(() => {
    pathsRef.current = []
    redraw()
  }, [redraw])

  const setEraser = useCallback((value) => {
    isEraser.current = value
  }, [])

  // ── Load existing paths (for edit mode) ────────────────
  const loadPaths = useCallback((paths) => {
    pathsRef.current = [...paths]
    redraw()
  }, [redraw])

  // ── Export helpers ─────────────────────────────────────
  const hasStrokes  = ()  => pathsRef.current.length > 0
  const getPaths    = ()  => pathsRef.current
  const strokeCount = ()  => pathsRef.current.length

  const pathsToSVG = useCallback(() =>
    pathsRef.current.map((path) => {
      if (!path.points.length) return ''
      let d = `M${path.points[0].x.toFixed(1)},${path.points[0].y.toFixed(1)}`
      path.points.slice(1).forEach(({ x, y }) => { d += ` L${x.toFixed(1)},${y.toFixed(1)}` })
      return d
    }).join(' ')
  , [])

  const downloadPNG = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const tmp = document.createElement('canvas')
    tmp.width  = canvas.width
    tmp.height = canvas.height
    const ctx  = tmp.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, tmp.width, tmp.height)
    ctx.drawImage(canvas, 0, 0)
    const a = document.createElement('a')
    a.download = 'strokē-sketch.png'
    a.href = tmp.toDataURL()
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }, [canvasRef])

  return {
    // Events — attach to <canvas>
    startDraw,
    draw,
    endDraw,
    // Methods
    resize,
    undo,
    clear,
    setEraser,
    loadPaths,
    downloadPNG,
    // State getters
    hasStrokes,
    getPaths,
    strokeCount,
    pathsToSVG,
  }
}
