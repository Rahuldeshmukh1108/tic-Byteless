'use client'

import { useEffect, useRef, useState } from 'react'
import { Send, Sparkles, Trash2, Robot, UserCircle } from 'lucide-react'

interface ChatMessage {
  role: 'user' | 'bot'
  text: string
}

export default function HydrochatPage() {
  const [inputText, setInputText] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const chatContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [chatMessages])

  const fetchHydroData = async () => {
    const question = inputText.trim()
    if (!question) return

    setError('')
    setLoading(true)

    const userMessage: ChatMessage = { role: 'user', text: question }
    setChatMessages((prev) => [...prev, userMessage])
    setInputText('')

    try {
      const res = await fetch('/api/hydrochat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question }),
      })

      if (!res.ok) throw new Error(`Unexpected status ${res.status}`)

      const data = await res.json()
      if (data.error) throw new Error(data.error)

      const botMessage: ChatMessage = {
        role: 'bot',
        text: data.message || 'No bot response.',
      }
      setChatMessages((prev) => [...prev, botMessage])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const resetChat = () => {
    setChatMessages([])
    setInputText('')
    setError('')
  }

  return (
    <div
      className="space-y-6 min-h-screen max-h-screen overflow-hidden"
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px), radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)',
        backgroundSize: '20px 20px, 20px 20px',
        backgroundPosition: '0 0, 10px 10px',
      }}
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground dark:text-slate-100 mb-2">HydroChat AI</h1>
        <p className="text-foreground/60 dark:text-slate-400">Ask for plant-specific nutrient thresholds and actuator values.</p>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="mx-auto max-w-4xl rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 shadow-lg overflow-hidden h-[calc(100vh-17rem)] md:h-[calc(100vh-15.5rem)]">
        <div className="flex h-full flex-col">
          <div ref={chatContainerRef} className="relative flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950/40" style={{ scrollbarWidth: 'thin', scrollbarColor: '#0EA5E9 #E2E8F0' }}>
            {chatMessages.length === 0 ? (
              <div className="py-16 text-center text-slate-500 dark:text-slate-400">
                No conversation yet. Ask a plant question below.
              </div>
            ) : (
              chatMessages.map((msg, index) => (
                <div key={`${msg.role}-${index}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-cyan-500/15 text-cyan-900 dark:bg-cyan-500/20 dark:text-cyan-50'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100'
                  }`}>
                    <div className="flex items-start gap-2">
                      <span className="mt-1 text-cyan-500">{msg.role === 'user' ? '👤' : '🤖'}</span>
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="relative border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/95 p-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <button
                  type="button"
                  onClick={resetChat}
                  aria-label="Clear chat"
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                >
                  <RefreshCcw size={16} />
                </button>
                <div className="pointer-events-none absolute left-14 top-1/2 h-6 w-px -translate-y-1/2 bg-slate-300 dark:bg-slate-700" />
                <input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      fetchHydroData()
                    }
                  }}
                  placeholder="   Type a plant name to get details..."
                  className="w-full min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-16 pr-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <button
                onClick={fetchHydroData}
                disabled={loading || !inputText.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
                {loading ? 'Thinking...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
