'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

// Spelar upp en produktmockup steg för steg, som en kort skärminspelning. Servern
// renderar slutläget, så sidan är komplett utan JavaScript och för den som valt minskad
// rörelse. I webbläsaren börjar mockupen från noll och spelas upp först när den syns.
// `times` är när varje steg börjar, i millisekunder från start, och måste vara en
// konstant: en ny array vid varje rendering startar om stegets timer.
export function usePlayback(times: number[], { loop = false, loopAfter = 0 } = {}) {
  const last = times.length
  const ref = useRef<HTMLDivElement>(null)
  const animated = useSyncExternalStore(
    subscribeMotion,
    () => !window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  )
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !animated) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [animated])

  // Ett steg i taget, så att paus och fortsättning börjar där uppspelningen stannade
  useEffect(() => {
    if (!animated || !playing || !visible) return
    if (current >= last) {
      if (!loop) return
      const t = setTimeout(() => setCurrent(0), loopAfter)
      return () => clearTimeout(t)
    }
    const wait = current === 0 ? times[0] : times[current] - times[current - 1]
    const t = setTimeout(() => setCurrent(s => s + 1), wait)
    return () => clearTimeout(t)
  }, [animated, playing, visible, current, last, loop, loopAfter, times])

  const toggle = useCallback(() => setPlaying(p => !p), [])

  return { ref, step: animated ? current : last, playing, animated, toggle }
}

// Räknar upp en siffra mot målet medan `active` är sant. Utan uppspelning visas
// slutvärdet direkt.
export function useCountUp(target: number, active: boolean, animated: boolean, duration = 1100) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!animated || !active) return
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      setValue(0)
    }
  }, [target, active, animated, duration])

  if (!animated) return target
  return active ? value : 0
}
