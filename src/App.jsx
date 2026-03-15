import { useState } from 'react'

import Nav        from './components/Nav.jsx'
import Footer     from './components/Footer.jsx'
import Gallery    from './pages/Gallery.jsx'
import CreatePage from './pages/CreatePage.jsx'
import MySketches from './pages/MySketches.jsx'
import Detail     from './pages/Detail.jsx'

export default function App() {
  // ── Global State ──────────────────────────────────────
  const [page,      setPage]      = useState('gallery')
  const [sketches,  setSketches]  = useState([])
  const [editingId, setEditingId] = useState(null)
  const [detailId,  setDetailId]  = useState(null)
  const [filter,    setFilter]    = useState('all')

  // ── Navigation ────────────────────────────────────────
  const navigate = (p, opts = {}) => {
    if (p === 'edit'   && opts.id) setEditingId(opts.id)
    if (p === 'detail' && opts.id) setDetailId(opts.id)
    if (p !== 'edit')              setEditingId(null)
    setPage(p)
    window.scrollTo(0, 0)
  }

  // ── Sketch Actions ────────────────────────────────────
  const saveSketch = (data) => {
    if (editingId) {
      setSketches(prev => prev.map(s => s.id === editingId ? { ...s, ...data } : s))
      setEditingId(null)
    } else {
      const newSketch = {
        id:      's' + Date.now(),
        created: new Date().toISOString().split('T')[0],
        likes:   0,
        ...data,
      }
      setSketches(prev => [newSketch, ...prev])
    }
    navigate('my-sketches')
  }

  const deleteSketch = (id) => {
    if (!confirm('Delete this sketch permanently?')) return
    setSketches(prev => prev.filter(s => s.id !== id))
    navigate('my-sketches')
  }

  const likeSketch = (id) =>
    setSketches(prev => prev.map(s => s.id === id ? { ...s, likes: (s.likes || 0) + 1 } : s))

  const updateMeta = (id, title, animal) =>
    setSketches(prev => prev.map(s => s.id === id ? { ...s, title, animal } : s))

  // ── Derived Data ──────────────────────────────────────
  const editSketch   = sketches.find(s => s.id === editingId) || null
  const detailSketch = sketches.find(s => s.id === detailId)  || null
  const filtered     = filter === 'all' ? sketches : sketches.filter(s => s.animal === filter)

  // ── Render ────────────────────────────────────────────
  return (
    <div className="app-wrapper">
      <Nav page={page} navigate={navigate} />

      <main className="app-main">
        {page === 'gallery'     && (
          <Gallery
            sketches={filtered}
            filter={filter}
            setFilter={setFilter}
            navigate={navigate}
            allCount={sketches.length}
          />
        )}
        {page === 'create' && (
          <CreatePage
            onSave={saveSketch}
            editSketch={null}
            navigate={navigate}
          />
        )}
        {page === 'edit' && (
          <CreatePage
            onSave={saveSketch}
            editSketch={editSketch}
            navigate={navigate}
          />
        )}
        {page === 'my-sketches' && (
          <MySketches
            sketches={sketches}
            navigate={navigate}
            onDelete={deleteSketch}
            onUpdateMeta={updateMeta}
          />
        )}
        {page === 'detail' && (
          <Detail
            sketch={detailSketch}
            navigate={navigate}
            onDelete={deleteSketch}
            onLike={likeSketch}
          />
        )}
      </main>

      <Footer navigate={navigate} />
    </div>
  )
}
