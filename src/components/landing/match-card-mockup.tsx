'use client'

import { Check, AlertTriangle, MapPin, Bell, ArrowRight, Lock, Star, CalendarPlus, SlidersHorizontal, EyeOff, Pause, Play } from 'lucide-react'
import { usePlayback, useCountUp, reveal } from '@/components/landing/use-playback'

// Produktmockup för heron, uppspelad som en kort skärminspelning: poängen räknas fram,
// skälen dyker upp, rekryteraren shortlistar och båda sidor får besked. Den ligger alltid på det mörka hero-bandet, så färgerna
// är satta direkt i stället för via temat. Innehållet speglar den riktiga matchningen:
// samma fyra delpoäng som AI:n returnerar (src/lib/ai/claude.ts) och samma struktur med
// uppfyllda krav och kompetensgap. Företaget och kandidaterna är påhittade. AI:n ser
// aldrig namnen, men rekryteraren gör det, så listan och anteckningen visar riktiga namn.

// När varje steg i inspelningen börjar (ms). Ligger utanför komponenten så att
// uppspelningens timer inte startar om när siffran räknas upp.
// 1 poäng och staplar, 2–4 skälen, 5 anteckningen, 6 muspekaren, 7 klicket,
// 8 shortlistad, 9 jobbsökarens notis, 10 rekryterarens lista
const TIMELINE = [500, 1900, 2400, 2900, 3900, 5000, 6100, 6500, 7300, 7900]

const SCORE = 87
const RADIUS = 34
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const categories = [
  { label: 'Kompetens', value: 92 },
  { label: 'Erfarenhet', value: 85 },
  { label: 'Utbildning', value: 80 },
  { label: 'Mjuka kompetenser', value: 76 },
]

// Varje kandidat får en egen dämpad avatarfärg, som i en riktig lista
const ranked = [
  { name: 'Amira Hassan', initials: 'AH', score: 87, avatar: 'bg-[#3A2F5C] text-[#CFC7FF]' },
  { name: 'Jonas Berg', initials: 'JB', score: 81, avatar: 'bg-[#2C4A42] text-[#A8E6D4]' },
  { name: 'Linnea Sundqvist', initials: 'LS', score: 74, avatar: 'bg-[#4A3A2C] text-[#F2D3B3]' },
]

export function MatchCardMockup() {
  const { ref, step, playing, animated, toggle } = usePlayback(TIMELINE, { loop: true, loopAfter: 4200 })
  const score = useCountUp(SCORE, step >= 1, animated, 1200)
  const shortlisted = step >= 8

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[36rem]">
      {/* Huvudkortet */}
      <div aria-hidden className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#1C1B28]/90 shadow-[0_30px_80px_-30px_rgb(0_0_0/80%),inset_0_1px_0_rgb(255_255_255/6%)] backdrop-blur-xl">
        {/* Ljuskant upptill, som på ett riktigt glasfönster */}
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#A99DFB]/50 to-transparent" />
        <div className="flex items-center gap-1.5 border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]/70" />
          <span className="mx-auto flex items-center gap-1.5 rounded-md bg-white/[0.05] px-3 py-1 text-[11px] text-white/45">
            <Lock className="h-2.5 w-2.5" aria-hidden />rekryo.com/rekryterare/kandidater
          </span>
          <span className="w-10" />
        </div>
        <div className="flex items-center gap-5 border-b border-white/[0.06] px-5 text-xs sm:px-6">
          <span className="-mb-px border-b-2 border-[#8B7CF6] py-2.5 font-medium text-white">Kandidater <span className="ml-1 rounded bg-white/10 px-1.5 py-px text-[10px] tabular-nums text-white/70">24</span></span>
          <span className="py-2.5 text-white/45">Pipeline</span>
          <span className="py-2.5 text-white/45">AI-logg</span>
          <span className="ml-auto hidden items-center gap-1 py-2.5 text-[11px] text-white/40 sm:flex"><EyeOff className="h-3 w-3" aria-hidden />Namn dolda för AI:n</span>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wider text-white/45">Matchning mot tjänst</p>
              <h3 className="mt-1 text-lg font-semibold leading-snug text-white">Undersköterska, akutmottagning</h3>
              <p className="mt-1 flex items-center gap-1 text-sm text-white/55">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                Nordvik Vård AB · Uppsala
              </p>
            </div>

            <div className="relative flex-shrink-0">
              <svg width="84" height="84" viewBox="0 0 84 84" className="-rotate-90">
                <circle cx="42" cy="42" r={RADIUS} fill="none" stroke="rgb(255 255 255 / 8%)" strokeWidth="7" />
                <circle
                  cx="42" cy="42" r={RADIUS} fill="none" stroke="url(#score-gradient)" strokeWidth="7" strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE} strokeDashoffset={CIRCUMFERENCE * (1 - (step >= 1 ? SCORE : 0) / 100)}
                  className="transition-[stroke-dashoffset] duration-[1200ms] ease-out"
                />
                <defs>
                  <linearGradient id="score-gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#8B7CF6" />
                    <stop offset="100%" stopColor="#2DD4AE" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-semibold tabular-nums leading-none text-white">{score}</span>
                <span className="mt-0.5 text-[10px] text-white/45">av 100</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className={`inline-flex items-center gap-1.5 rounded-full border border-[#2DD4AE]/25 bg-[#2DD4AE]/10 px-2.5 py-1 text-xs font-medium text-[#5EEAD4] ${reveal(step >= 1)}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-[#2DD4AE]" />
              Stark matchning
            </div>
            <div className={`inline-flex items-center gap-1 rounded-full bg-[#6C5CE7]/20 px-2.5 py-1 text-xs font-medium text-[#CFC7FF] ${reveal(shortlisted)}`}>
              <Star className="h-3 w-3 fill-current" />Shortlistad av dig
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-3">
            {categories.map((c, i) => (
              <div key={c.label}>
                <div className="mb-1.5 flex items-baseline justify-between text-xs">
                  <span className="text-white/60">{c.label}</span>
                  <span className="font-medium tabular-nums text-white">{c.value}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#8B7CF6] transition-[width] duration-1000 ease-out"
                    style={{ width: step >= 1 ? `${c.value}%` : '0%', transitionDelay: `${i * 120}ms` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
            <p className="mb-3 flex items-center justify-between text-xs font-semibold text-white/80">
              Varför denna matchning
              <span className="font-normal text-white/35">Källa: CV och annons</span>
            </p>
            <ul className="space-y-2.5 text-[13px] leading-snug">
              <li className={`flex gap-2.5 text-white/75 ${reveal(step >= 2)}`}>
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#2DD4AE]" aria-hidden />
                Uppfyller 5 av 6 krav: akutsjukvård, triage, läkemedelshantering, journalföring, teamarbete
              </li>
              <li className={`flex gap-2.5 text-white/75 ${reveal(step >= 3)}`}>
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#2DD4AE]" aria-hidden />
                4 års erfarenhet, tjänsten efterfrågar minst 3
              </li>
              <li className={`flex gap-2.5 text-white/75 ${reveal(step >= 4)}`}>
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" aria-hidden />
                Kompetensgap: erfarenhet av journalsystemet TakeCare
              </li>
            </ul>
          </div>

          {/* Rekryterarens egen anteckning, det mänskliga lagret ovanpå AI:ns bedömning */}
          <div className={`-rotate-[0.6deg] rounded-lg border border-[#F2D3B3]/15 bg-[#F2D3B3]/[0.06] px-3.5 py-2.5 ${reveal(step >= 5)}`}>
            <p className="text-[11px] text-white/40">Din anteckning · i går 16:42</p>
            <p className="mt-1 text-[13px] leading-snug text-white/80">Ring Amira på tisdag. Fråga om TakeCare, hon har kört Cosmic och brukar lära sig nya system snabbt.</p>
          </div>

          {/* Åtgärder som i kandidatlistan: AI:n föreslår, rekryteraren agerar */}
          <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-4">
            <span className={`relative inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#6C5CE7] px-3 text-xs font-medium text-white shadow-[0_4px_14px_-4px_rgb(108_92_231/70%)] transition-transform duration-150 ${step === 7 ? 'scale-95' : ''}`}>
              <Star className={`h-3.5 w-3.5 ${shortlisted ? 'fill-current' : ''}`} aria-hidden />{shortlisted ? 'Shortlistad' : 'Shortlista'}
              {/* Muspekaren glider in och klickar: en människa fattar beslutet */}
              <svg
                className={`absolute -bottom-4 left-[70%] h-5 w-5 drop-shadow-[0_2px_3px_rgb(0_0_0/45%)] transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${step >= 6 ? 'translate-x-0 translate-y-0 opacity-100' : 'translate-x-24 translate-y-10 opacity-0'}`}
                viewBox="0 0 24 24" aria-hidden
              >
                <path d="M5 3.2 19 11.4l-6.3 1.5-3.1 5.9z" fill="#fff" stroke="#13121C" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-xs text-white/80">
              <CalendarPlus className="h-3.5 w-3.5" aria-hidden />Boka intervju
            </span>
            <span className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs text-white/55">
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />Justera poäng
            </span>
          </div>
        </div>
      </div>

      {/* Båda sidor av samma matchning: jobbsökarens notis till vänster, rekryterarens
          rangordnade lista till höger. De överlappar bara kortets nedre kant. */}
      <div aria-hidden className="relative z-10 -mt-4 hidden items-start justify-between gap-4 sm:-mx-6 sm:flex">
        <div className={`w-64 -rotate-[1.5deg] ${reveal(step >= 9)} rounded-xl border border-white/10 bg-[#171622]/95 p-3 shadow-[0_1px_2px_rgb(0_0_0/30%),0_8px_20px_-6px_rgb(0_0_0/40%),0_28px_56px_-20px_rgb(0_0_0/50%)] backdrop-blur-xl`}>
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-white/50">
            <Bell className="h-3 w-3 text-[#5EEAD4]" aria-hidden />
            Jobbsökaren · ny matchning
            <span className="ml-auto font-normal text-white/35">4 min</span>
          </p>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#2DD4AE] text-sm font-semibold tabular-nums text-white">{SCORE}</span>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-white/85">Undersköterska · Nordvik Vård</p>
              <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#A99DFB]">Se varför du matchar <ArrowRight className="h-3 w-3" aria-hidden /></p>
            </div>
          </div>
        </div>

        <div className={`mt-3 w-60 rotate-[1deg] ${reveal(step >= 10)} rounded-xl border border-white/10 bg-[#171622]/95 p-3 shadow-[0_1px_2px_rgb(0_0_0/30%),0_8px_20px_-6px_rgb(0_0_0/40%),0_28px_56px_-20px_rgb(0_0_0/50%)] backdrop-blur-xl`}>
          <p className="mb-2 text-[11px] font-medium text-white/50">Rekryteraren · rangordnade sökande</p>
          <div className="space-y-1.5">
            {ranked.map((r, i) => (
              <div key={r.name} className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${i === 0 ? 'bg-[#6C5CE7]/15' : ''}`}>
                <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[9px] font-semibold ${r.avatar}`}>{r.initials}</span>
                <span className="flex-1 truncate text-xs text-white/80">{r.name}</span>
                <span className={`text-xs font-semibold tabular-nums ${i === 0 ? 'text-[#A99DFB]' : 'text-white/55'}`}>{r.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bildtext och paus, som under en inbäddad film. Pausen krävs för rörelse som
          pågår längre än fem sekunder (WCAG 2.2.2). */}
      <div className="mt-6 flex items-center justify-between gap-4 sm:mt-8">
        <p className="text-sm text-muted-foreground dark:text-white/55">
          Så ser en matchning ut för rekryteraren. Namn och företag är påhittade.
        </p>
        {animated && (
          <button
            type="button"
            onClick={toggle}
            className="inline-flex h-8 flex-shrink-0 items-center gap-1.5 rounded-full border border-foreground/10 px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground dark:border-white/15 dark:text-white/60 dark:hover:text-white"
          >
            {playing ? <Pause className="h-3 w-3" aria-hidden /> : <Play className="h-3 w-3" aria-hidden />}
            {playing ? 'Pausa' : 'Spela'}
          </button>
        )}
      </div>
    </div>
  )
}
