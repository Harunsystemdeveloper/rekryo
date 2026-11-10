import Link from 'next/link'
import { Briefcase, Brain, ClipboardCheck, ShieldCheck, Check } from 'lucide-react'

const RECRUITER_FEATURES = [
  { icon: Brain, text: 'AI rankar och motiverar varje kandidat på sekunder' },
  { icon: ClipboardCheck, text: 'Strukturerade intervjuutvärderingar, inte magkänsla' },
  { icon: ShieldCheck, text: 'Fairness-övervakning och full spårbarhet enligt EU AI Act' },
]

// Delas av inloggning, registrering, onboarding och lösenordsåterställning.
// Vänsterpanelen är alltid mörk (samma band som landningssidans hero). Högersidan följer
// temat, så formulärets text aldrig hamnar ljus på ljust eller mörk på mörkt.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* ── Vänster: varumärkespanel ── */}
      <aside className="hero-dark relative hidden w-[440px] flex-shrink-0 flex-col overflow-hidden border-r border-white/[0.06] p-10 lg:flex">
        <div className="absolute inset-0 dot-grid-light opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />

        <Link href="/" className="relative flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
            <Briefcase className="h-[18px] w-[18px] text-white" />
          </span>
          <span className="text-xl font-semibold text-white">Rekryo</span>
        </Link>

        <div className="relative my-auto pt-12">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#A99DFB]">Framtidens rekrytering</p>
          <h2 className="mb-5 text-[2.1rem] font-semibold leading-[1.15] tracking-tight text-white">
            Rätt person till rätt jobb, <span className="gradient-text-light">med förklarbar AI</span>
          </h2>
          <p className="max-w-[320px] text-[15px] leading-relaxed text-white/60">
            Rekryo analyserar kompetenser och erfarenhet för att skapa träffsäkra matchningar på den svenska arbetsmarknaden.
          </p>

          <ul className="mt-7 space-y-3">
            {RECRUITER_FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <span className="mt-px flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-white/[0.08] ring-1 ring-white/15">
                  <Icon className="h-3.5 w-3.5 text-[#C9C2FF]" />
                </span>
                <span className="pt-1 text-[13.5px] leading-snug text-white/80">{text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7 grid grid-cols-2 gap-3">
            {[
              { value: '61 000', label: 'Personer saknas i olika yrken' },
              { value: '76%', label: 'Av företagen har svårt att rekrytera' },
            ].map(s => (
              <div key={s.value} className="rounded-xl bg-white/[0.06] p-4 ring-1 ring-white/10">
                <p className="text-xl font-semibold tabular-nums text-white">{s.value}</p>
                <p className="mt-1 text-[11.5px] leading-snug text-white/55">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {['GDPR-säkert', 'EU AI Act-spårbart', '100% gratis'].map(t => (
              <span key={t} className="flex items-center gap-1.5 rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] font-medium text-white/70 ring-1 ring-white/10">
                <Check className="h-3 w-3 text-[#5EEAD4]" />
                {t}
              </span>
            ))}
          </div>
        </div>

        <p className="relative mt-auto text-xs text-white/30">
          © {new Date().getFullYear()} Rekryo · GDPR-säkert · Sverige
        </p>
      </aside>

      {/* ── Höger: formulär på temats bakgrund ── */}
      <div className="hero-mesh relative flex flex-1 flex-col">
        {/* Svag lila ton längs skarven så att panelerna hänger ihop */}
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-72 bg-gradient-to-r from-primary/[0.07] to-transparent lg:block" />

        <header className="border-b border-border px-6 py-5 lg:hidden">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="gradient-primary flex h-9 w-9 items-center justify-center rounded-xl">
              <Briefcase className="h-4 w-4 text-white" />
            </span>
            <span className="text-lg font-semibold">Rekryo</span>
          </Link>
        </header>

        <main className="relative flex flex-1 justify-center px-4 py-10 sm:px-6 lg:items-start lg:pt-[12vh] lg:pb-16">
          {children}
        </main>

        <footer className="px-4 py-4 text-center lg:hidden">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Rekryo · GDPR-säkert · Sverige</p>
        </footer>
      </div>
    </div>
  )
}
