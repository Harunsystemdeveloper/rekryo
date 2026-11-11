'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Send, Loader2, Sparkles, RotateCcw, Search, Copy, Check, FileText, Target, PenLine, MessagesSquare, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import type { Profile } from '@/types/database'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const STORAGE_KEY_PREFIX = 'rekryo:coach:'

const GREETING = (name: string) =>
  `Hej ${name}! Jag är din AI-karriärcoach på Rekryo.\n\nJag ser din profil, dina ansökningar och de aktiva jobben, så mina råd utgår från din situation. Dubbelkolla gärna det som är viktigt för dig.\n\nVad kan jag hjälpa dig med idag?`

const SUGGESTED = [
  { icon: FileText, title: 'Analysera mitt CV', prompt: 'Analysera mitt CV och ge förbättringstips' },
  { icon: Target, title: 'Vilket jobb passar mig bäst?', prompt: 'Vilket jobb passar mig bäst just nu, och vad saknar jag för att höja mitt matchningspoäng?' },
  { icon: PenLine, title: 'Skriv ett personligt brev', prompt: 'Hjälp mig skriva ett personligt brev' },
  { icon: MessagesSquare, title: 'Förbered mig för intervju', prompt: 'Hur förbereder jag mig för en intervju?' },
]

// Startvy innan första frågan: en hälsning och förslag som kort, i stället för en
// ensam välkomstbubbla och små länkar längst ner.
function WelcomeView({ firstName, disabled, onPick }: { firstName: string; disabled: boolean; onPick: (prompt: string) => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-2 py-10 text-center">
      <span className="gradient-primary mb-6 flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg shadow-primary/30">
        <Sparkles className="h-7 w-7 text-white" aria-hidden />
      </span>
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Hur kan jag hjälpa dig, {firstName}?</h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        Jag ser din profil, dina ansökningar och de aktiva jobben, så råden utgår från din situation.
      </p>
      <div className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
        {SUGGESTED.map(s => (
          <button
            key={s.title}
            type="button"
            disabled={disabled}
            onClick={() => onPick(s.prompt)}
            className="panel panel-hover flex items-start gap-3 p-4 text-left disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <s.icon className="h-4 w-4" aria-hidden />
            </span>
            <span>
              <span className="block text-sm font-medium">{s.title}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{s.prompt}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

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

function CoachAvatar() {
  return (
    <span className="gradient-primary mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg shadow-sm shadow-primary/30">
      <Sparkles className="h-3.5 w-3.5 text-white" aria-hidden />
    </span>
  )
}

// Coachens svar visas som ren text i full bredd (som i moderna AI-chattar), dina egna
// frågor som en diskret bubbla till höger.
function MessageBubble({ msg }: { msg: Message }) {
  if (msg.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-primary/10 px-4 py-2.5 text-[15px] leading-relaxed">
          <span className="sr-only">Du: </span>
          {msg.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      <CoachAvatar />
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-xs font-medium text-muted-foreground">Karriärcoach</p>
        <div className="prose-coach text-[15px] leading-relaxed">
          <ReactMarkdown>{msg.content}</ReactMarkdown>
        </div>
        {msg.content && <div className="mt-2"><CopyButton text={msg.content} /></div>}
      </div>
    </div>
  )
}

function ToolStatus({ labels }: { labels: string[] }) {
  if (labels.length === 0) return null
  return (
    <div className="flex gap-3">
      <CoachAvatar />
      <div className="flex flex-col gap-1.5 pt-0.5" aria-live="polite">
        {labels.map((label, i) => (
          <div key={i} className="flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs text-primary">
            <Search className="h-3 w-3 animate-pulse" aria-hidden />
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
      <CoachAvatar />
      <div className="flex h-7 items-center gap-1" role="status" aria-label="Coachen skriver">
        <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:0ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:300ms]" />
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
        // localStorage finns bara i webbläsaren, så sparad konversation kan först läsas
        // efter monteringen. Att läsa den vid första renderingen ger hydreringsfel.
        // eslint-disable-next-line react-hooks/set-state-in-effect
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

  // Textfältet växer med innehållet upp till en gräns, som i moderna chattar
  function autoResize(el: HTMLTextAreaElement) {
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }

  useEffect(() => {
    if (!input && textareaRef.current) textareaRef.current.style.height = 'auto'
  }, [input])

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
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col">

      {/* Rubrik: vad coachen har tillgång till och en tydlig knapp för ny konversation */}
      <div className="flex flex-shrink-0 items-center justify-between gap-4 border-b border-border pb-4">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 text-lg font-semibold">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden />
            AI-karriärcoach
          </h1>
          <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0 text-mint-foreground" aria-hidden />
            Ser din profil, dina ansökningar och aktiva jobb. Konversationen sparas bara i din webbläsare.
          </p>
        </div>
        {messages.length > 1 && (
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            Ny konversation
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-7 overflow-y-auto py-8">
        {messages.length <= 1 ? (
          <WelcomeView firstName={firstName} disabled={loading || streaming} onPick={sendMessage} />
        ) : messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}
        {streaming && <ToolStatus labels={activeTools} />}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Inmatning: kort med textfält som växer och skickknappen inuti */}
      <div className="flex-shrink-0 pb-1 pt-2">
        <div className="rounded-2xl border border-border bg-card shadow-[0_8px_24px_-12px_rgb(11_17_32/25%)] transition-colors focus-within:border-primary/50 dark:shadow-[0_8px_24px_-12px_rgb(0_0_0/60%)]">
          <label htmlFor="coach-input" className="sr-only">Skriv din fråga till karriärcoachen</label>
          <textarea
            id="coach-input"
            ref={textareaRef}
            placeholder="Fråga om ditt CV, jobb eller intervjuer"
            value={input}
            onChange={e => { setInput(e.target.value); autoResize(e.target) }}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={loading || streaming}
            className="block max-h-[200px] w-full resize-none bg-transparent px-4 pb-2 pt-3.5 text-[15px] leading-relaxed outline-none placeholder:text-muted-foreground disabled:opacity-60"
          />
          <div className="flex items-center justify-between gap-3 px-3 pb-3">
            <span className="pl-1 text-[11px] text-muted-foreground">Enter skickar · Shift+Enter ny rad</span>
            <Button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading || streaming}
              size="icon"
              className="h-9 w-9 rounded-xl"
              aria-label="Skicka"
            >
              {loading || streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <p className="pt-2 text-center text-xs text-muted-foreground">
          AI kan göra misstag. Kontrollera viktiga uppgifter innan du använder dem.
        </p>
      </div>
    </div>
  )
}
