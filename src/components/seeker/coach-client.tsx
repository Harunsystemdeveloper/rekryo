'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, Loader2, Sparkles, RotateCcw, Search, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import type { Profile } from '@/types/database'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const STORAGE_KEY_PREFIX = 'rekryo:coach:'

const GREETING = (name: string) =>
  `Hej ${name}! 👋 Jag är din AI-karriärcoach på Rekryo.\n\nJag har tillgång till din profil, dina ansökningar och alla aktiva jobb — så jag kan ge dig personliga, exakta råd (inte gissningar).\n\nVad kan jag hjälpa dig med idag?`

const SUGGESTED = [
  'Analysera mitt CV och ge förbättringstips',
  'Vilket jobb passar mig bäst just nu?',
  'Hjälp mig skriva ett personligt brev',
  'Vad saknar jag för att höja mitt matchningspoäng?',
  'Hur förbereder jag mig för en intervju?',
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
      title="Kopiera svar"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? 'Kopierat' : 'Kopiera'}
    </button>
  )
}

function MessageBubble({ msg, userName }: { msg: Message; userName: string }) {
  const isUser = msg.role === 'user'
  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
        {isUser ? (
          <AvatarFallback className="gradient-primary text-white text-xs font-bold">{initials}</AvatarFallback>
        ) : (
          <AvatarFallback className="bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </AvatarFallback>
        )}
      </Avatar>
      <div className={`max-w-[80%] sm:max-w-[70%] space-y-1 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <p className="text-xs text-muted-foreground px-1">
          {isUser ? 'Du' : 'Karriärcoach'}
        </p>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'gradient-primary text-white rounded-tr-sm whitespace-pre-wrap'
            : 'bg-muted rounded-tl-sm'
        }`}>
          {isUser ? msg.content : (
            <div className="prose-coach">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          )}
        </div>
        {!isUser && msg.content && <CopyButton text={msg.content} />}
      </div>
    </div>
  )
}

function ToolStatus({ labels }: { labels: string[] }) {
  if (labels.length === 0) return null
  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
        <AvatarFallback className="bg-primary/10 text-primary">
          <Sparkles className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1.5">
        {labels.map((label, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-primary bg-primary/5 border border-primary/15 rounded-full px-3 py-1.5 w-fit">
            <Search className="h-3 w-3 animate-pulse" />
            {label}…
          </div>
        ))}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
        <AvatarFallback className="bg-primary/10 text-primary">
          <Sparkles className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col space-y-1">
        <p className="text-xs text-muted-foreground px-1">Karriärcoach</p>
        <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
          <div className="flex gap-1 items-center h-4">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
            <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
            <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function CoachClient({ profile }: { profile: Profile }) {
  const storageKey = `${STORAGE_KEY_PREFIX}${profile.id}`
  const firstName = profile.full_name?.split(' ')[0] ?? 'där'

  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: GREETING(firstName) }])
  const [restored, setRestored] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [activeTools, setActiveTools] = useState<string[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Restore a saved conversation once, on mount — keeps the chat alive across page refreshes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed: Message[] = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed)
      }
    } catch {
      // corrupted or inaccessible storage — start fresh silently
    }
    setRestored(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!restored) return
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages))
    } catch {
      // storage full or blocked — conversation just won't persist
    }
  }, [messages, restored, storageKey])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, activeTools])

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim()
    if (!content || loading || streaming) return

    setInput('')
    const userMessage: Message = { role: 'user', content }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setLoading(true)
    setActiveTools([])

    const apiMessages = newMessages
      .slice(1)
      .map(m => ({ role: m.role, content: m.content }))

    try {
      const res = await fetch('/api/ai/career-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Något gick fel' }))
        toast.error(err.error ?? 'Något gick fel')
        setLoading(false)
        return
      }

      setLoading(false)
      setStreaming(true)
      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })

          const events = buffer.split('\n\n')
          buffer = events.pop() ?? ''

          for (const raw of events) {
            const line = raw.trim()
            if (!line.startsWith('data:')) continue
            let evt: { type: string; delta?: string; tool?: string; label?: string; message?: string }
            try {
              evt = JSON.parse(line.slice(5).trim())
            } catch {
              continue
            }

            if (evt.type === 'text' && evt.delta) {
              setMessages(prev => {
                const updated = [...prev]
                const last = updated[updated.length - 1]
                if (last?.role === 'assistant') {
                  updated[updated.length - 1] = { ...last, content: last.content + evt.delta }
                }
                return updated
              })
            } else if (evt.type === 'tool_start' && evt.label) {
              setActiveTools(prev => [...prev, evt.label!])
            } else if (evt.type === 'tool_end') {
              setActiveTools(prev => prev.slice(0, -1))
            } else if (evt.type === 'error') {
              toast.error(evt.message ?? 'Något gick fel')
            }
          }
        }
      }
      setActiveTools([])
      setStreaming(false)
    } catch {
      toast.error('Kunde inte nå karriärcoachen. Kontrollera din anslutning.')
      setLoading(false)
      setStreaming(false)
      setActiveTools([])
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function reset() {
    const fresh: Message[] = [{ role: 'assistant', content: 'Hej igen! Ny konversation startad. Vad kan jag hjälpa dig med?' }]
    setMessages(fresh)
    try {
      localStorage.setItem(storageKey, JSON.stringify(fresh))
    } catch {
      // ignore
    }
  }

  const isTyping = loading || (streaming && activeTools.length === 0 && messages[messages.length - 1]?.content === '')

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">AI-karriärcoach</h1>
            <p className="text-xs text-muted-foreground">Har tillgång till din profil, ansökningar och alla aktiva jobb</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={reset} title="Ny konversation">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6 space-y-5">
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} userName={profile.full_name ?? 'Du'} />
        ))}
        {streaming && <ToolStatus labels={activeTools} />}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Suggested questions — only show at start */}
      {messages.length <= 1 && (
        <div className="pb-4 flex-shrink-0">
          <p className="text-xs text-muted-foreground mb-2 px-1">Föreslagna frågor:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED.map(q => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                disabled={loading || streaming}
                className="text-xs px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary hover:bg-primary/15 transition-colors disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 pt-4 border-t flex-shrink-0">
        <Textarea
          ref={textareaRef}
          placeholder="Skriv din fråga... (Enter för att skicka, Shift+Enter för ny rad)"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          className="resize-none flex-1 text-sm"
          disabled={loading || streaming}
        />
        <Button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading || streaming}
          size="icon"
          className="h-full px-4 flex-shrink-0"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground text-center pt-2">
        AI kan göra misstag. Verifiera viktiga beslut.
      </p>
    </div>
  )
}
