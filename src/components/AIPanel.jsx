import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { sendMessage } from '../services/ai.js'
import styles from './AIPanel.module.css'

const QUICK_PROMPTS = [
  { label: 'Ideas',  prompt: 'Give me animal drawing ideas for minimalist single-stroke sketches', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
  { label: 'Review', prompt: 'Give honest feedback on my sketch', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
  { label: 'Tips',   prompt: 'How can I improve my minimalist single-stroke drawing technique?', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
  { label: 'Title',  prompt: 'Suggest a creative artistic title for my sketch', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z' },
]

export default function AIPanel({ open, onClose, strokeCount }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hi! Ask me for drawing ideas, honest feedback, or tips to improve your minimalist style." },
  ])
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef             = useRef(null)
  const isMobile              = window.innerWidth <= 640

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (message) => {
    if (!message.trim() || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: message }])
    setLoading(true)
    const reply = await sendMessage(message, strokeCount())
    setMessages(prev => [...prev, { role: 'ai', text: reply }])
    setLoading(false)
  }

  const panel = (
    <>
      {/* Overlay — both mobile and desktop */}
      {open && <div className={styles.overlay} onClick={onClose}/>}

      {/* Mobile — bottom sheet modal */}
      {isMobile ? (
        <div className={`${styles.modal} ${open ? styles.modalOpen : ''}`}>
          <div className={styles.modalHandle}/>
          <ModalContent
            styles={styles}
            messages={messages}
            loading={loading}
            input={input}
            setInput={setInput}
            send={send}
            onClose={onClose}
            bottomRef={bottomRef}
          />
        </div>
      ) : (
        /* Desktop — side panel */
        <aside className={`${styles.panel} ${open ? styles.panelOpen : ''}`}>
          <ModalContent
            styles={styles}
            messages={messages}
            loading={loading}
            input={input}
            setInput={setInput}
            send={send}
            onClose={onClose}
            bottomRef={bottomRef}
          />
        </aside>
      )}
    </>
  )

  return createPortal(panel, document.body)
}

function ModalContent({ styles, messages, loading, input, setInput, send, onClose, bottomRef }) {
  return (
    <>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#9cc47a" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#9cc47a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className={styles.headerTitle}>AI Assistant</p>
            <p className={styles.headerSubtitle}>Powered by Llama 3</p>
          </div>
        </div>
        <button className={styles.closeBtn} onClick={onClose}>
          <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* Quick Buttons */}
      <div className={styles.quickButtons}>
        {QUICK_PROMPTS.map(({ label, prompt, icon }) => (
          <button key={label} className={styles.quickBtn} onClick={() => send(prompt)}>
            <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon}/>
            </svg>
            {label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className={styles.messages}>
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'ai-message-user' : 'ai-message-bot'}>
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className={styles.typing}>
            <span className="typing-dot"/>
            <span className="typing-dot"/>
            <span className="typing-dot"/>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Input */}
      <div className={styles.inputArea}>
        <textarea
          className={styles.textarea}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask anything..."
          rows={2}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send(input)
            }
          }}
        />
        <button className={styles.sendBtn} onClick={() => send(input)}>
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </>
  )
}