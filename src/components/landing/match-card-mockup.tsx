import { Check, AlertTriangle, ShieldCheck, UserCheck, EyeOff, MapPin, Bell, ArrowRight } from 'lucide-react'

// Statisk produktmockup för heron. Den ligger alltid på det mörka hero-bandet, så färgerna
// är satta direkt i stället för via temat. Innehållet speglar den riktiga matchningen:
// samma fyra delpoäng som AI:n returnerar (src/lib/ai/claude.ts) och samma struktur med
// uppfyllda krav och kompetensgap. Företaget och kandidaterna är påhittade.

const SCORE = 87
const RADIUS = 34
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const categories = [
  { label: 'Kompetens', value: 92 },
  { label: 'Erfarenhet', value: 85 },
  { label: 'Utbildning', value: 80 },
  { label: 'Mjuka kompetenser', value: 76 },
]

const ranked = [
  { id: 'K-1042', score: 87 },
  { id: 'K-0981', score: 81 },
  { id: 'K-1107', score: 74 },
]

export function MatchCardMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[36rem]">
      {/* Huvudkortet */}
      <div className="relative rounded-2xl border border-white/10 bg-[#141B2D]/90 shadow-[0_30px_80px_-30px_rgb(0_0_0/80%)] backdrop-blur-xl">
        <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-4 py-2.5">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="ml-3 truncate text-[11px] text-white/40">rekryo.com/rekryterare/kandidater</span>
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

            <div className="relative flex-shrink-0" role="img" aria-label={`Matchningspoäng ${SCORE} av 100`}>
              <svg width="84" height="84" viewBox="0 0 84 84" className="-rotate-90">
                <circle cx="42" cy="42" r={RADIUS} fill="none" stroke="rgb(255 255 255 / 8%)" strokeWidth="7" />
                <circle
                  cx="42" cy="42" r={RADIUS} fill="none" stroke="url(#score-gradient)" strokeWidth="7" strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE} strokeDashoffset={CIRCUMFERENCE * (1 - SCORE / 100)}
                />
                <defs>
                  <linearGradient id="score-gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#8B7CF6" />
                    <stop offset="100%" stopColor="#2DD4AE" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-semibold tabular-nums leading-none text-white">{SCORE}</span>
                <span className="mt-0.5 text-[10px] text-white/45">av 100</span>
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#2DD4AE]/25 bg-[#2DD4AE]/10 px-2.5 py-1 text-xs font-medium text-[#5EEAD4]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2DD4AE]" />
            Stark matchning
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-3">
            {categories.map(c => (
              <div key={c.label}>
                <div className="mb-1.5 flex items-baseline justify-between text-xs">
                  <span className="text-white/60">{c.label}</span>
                  <span className="font-medium tabular-nums text-white">{c.value}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#8B7CF6]" style={{ width: `${c.value}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
            <p className="mb-3 text-xs font-semibold text-white/80">Varför denna matchning</p>
            <ul className="space-y-2.5 text-[13px] leading-snug">
              <li className="flex gap-2.5 text-white/75">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#2DD4AE]" aria-hidden />
                Uppfyller 5 av 6 krav: akutsjukvård, triage, läkemedelshantering, journalföring, teamarbete
              </li>
              <li className="flex gap-2.5 text-white/75">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#2DD4AE]" aria-hidden />
                4 års erfarenhet, tjänsten efterfrågar minst 3
              </li>
              <li className="flex gap-2.5 text-white/75">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" aria-hidden />
                Kompetensgap: erfarenhet av journalsystemet TakeCare
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { icon: ShieldCheck, label: 'Förklarbar bedömning' },
              { icon: UserCheck, label: 'Människa fattar beslutet' },
              { icon: EyeOff, label: 'Namn skickas inte till AI:n' },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[11px] text-white/55">
                <Icon className="h-3 w-3" aria-hidden />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Båda sidor av samma matchning: jobbsökarens notis till vänster, rekryterarens
          rangordnade lista till höger. De överlappar bara kortets nedre kant. */}
      <div className="relative z-10 -mt-4 hidden items-start justify-between gap-4 sm:-mx-6 sm:flex">
        <div className="w-64 rounded-xl border border-white/10 bg-[#0F1626]/95 p-3 shadow-2xl backdrop-blur-xl">
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-white/50">
            <Bell className="h-3 w-3 text-[#5EEAD4]" aria-hidden />
            Jobbsökaren · ny matchning
          </p>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#2DD4AE] text-sm font-semibold tabular-nums text-white">{SCORE}</span>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-white/85">Undersköterska · Nordvik Vård</p>
              <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#A99DFB]">Se varför du matchar <ArrowRight className="h-3 w-3" aria-hidden /></p>
            </div>
          </div>
        </div>

        <div className="w-60 rounded-xl border border-white/10 bg-[#0F1626]/95 p-3 shadow-2xl backdrop-blur-xl">
          <p className="mb-2 text-[11px] font-medium text-white/50">Rekryteraren · rangordnade sökande</p>
          <div className="space-y-1.5">
            {ranked.map((r, i) => (
              <div key={r.id} className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${i === 0 ? 'bg-[#6C5CE7]/15' : ''}`}>
                <span className="w-4 text-[11px] tabular-nums text-white/40">{i + 1}</span>
                <span className="flex-1 text-xs text-white/80">Kandidat {r.id}</span>
                <span className={`text-xs font-semibold tabular-nums ${i === 0 ? 'text-[#A99DFB]' : 'text-white/55'}`}>{r.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
