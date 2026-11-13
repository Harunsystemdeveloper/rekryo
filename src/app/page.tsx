import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ParadoxStats } from '@/components/paradox-stats'
import { DemoMatcher } from '@/components/demo-matcher'
import { ScrollReveal } from '@/components/scroll-reveal'
import { MatchCardMockup } from '@/components/landing/match-card-mockup'
import { SectionHeader } from '@/components/landing/section-header'
import { DualViewMockup } from '@/components/landing/dual-view-mockup'
import { TrustSection } from '@/components/landing/trust-section'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Target, Users, TrendingUp, Shield,
  ArrowRight, CheckCircle, Zap, Sparkles,
  FileText, BarChart3, MessageSquare,
  Building2, TrendingDown, Search, ShieldCheck, UserCheck, UserPlus
} from 'lucide-react'

// Två märkesfärger, inte en regnbåge: lila och mint växlar i ett medvetet mönster.
const brandTone = {
  primary: { accent: 'text-primary', accentBg: 'bg-primary/10' },
  mint: { accent: 'text-mint-foreground', accentBg: 'bg-mint/10' },
}

const features = [
  {
    icon: FileText,
    title: 'AI-driven CV-analys',
    description: 'Claude AI läser ditt CV och extraherar kompetenser, erfarenhet och utbildning automatiskt.',
    ...brandTone.primary,
  },
  {
    icon: Target,
    title: 'Precisionsmatchning',
    description: 'Varje matchning får ett poäng 0–100 med förklaring av varför du passar för jobbet.',
    ...brandTone.mint,
  },
  {
    icon: TrendingUp,
    title: 'Kompetensgap-analys',
    description: 'Se exakt vilka kompetenser du saknar för drömjobbet och hur du kan fylla gapen.',
    ...brandTone.primary,
  },
  {
    icon: Users,
    title: 'Smart rekrytering',
    description: 'Rekryterare hittar rätt kandidater på minuter, inte månader – med AI-ranking.',
    ...brandTone.mint,
  },
  {
    icon: MessageSquare,
    title: 'Intervjuförberedelse',
    description: 'Få AI-genererade intervjufrågor baserade på jobbet och din profil.',
    ...brandTone.primary,
  },
  {
    icon: Shield,
    title: 'GDPR-säkert',
    description: 'Dina data lagras säkert inom EU (Irland) via Supabase och behandlas strikt enligt GDPR.',
    ...brandTone.mint,
  },
]


const steps = [
  { step: '01', icon: UserPlus, title: 'Skapa konto', desc: 'Registrera dig gratis som jobbsökare eller rekryterare på under en minut.' },
  { step: '02', icon: FileText, title: 'Ladda upp CV eller annons', desc: 'AI läser ditt CV eller din jobbannons och plockar ut kompetenser, erfarenhet och krav.' },
  { step: '03', icon: Target, title: 'Få en förklarad matchning', desc: 'Se poäng 0–100, varför matchningen håller, vad som saknas och förslag på intervjufrågor.' },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* ── Hero: budskap och två ingångar till vänster, produkten själv till höger ── */}
      <section className="relative overflow-hidden hero-dark px-6 pt-24 pb-20 lg:pt-28 lg:pb-24">
        <div className="absolute inset-0 -z-10 dot-grid-light opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1fr_1.15fr] lg:gap-12">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Badge variant="secondary" className="mb-7 gap-1.5 border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm">
              <Sparkles className="h-3 w-3 text-[#A99DFB]" />
              AI-matchning för den svenska arbetsmarknaden
            </Badge>

            <h1 className="mb-6 text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[3.1rem] xl:text-[3.5rem]">
              Kompetensen finns.{' '}
              <span className="gradient-text-light">Matchningen</span>
              {' '}är trasig.
            </h1>

            <p className="mb-9 max-w-xl text-lg leading-relaxed text-white/65">
              Rekryo matchar CV och jobb med förklarbar AI. Varje matchning får ett poäng 0–100,
              en motivering och en lista över vad som saknas, för jobbsökare och rekryterare i alla branscher.
            </p>

            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild className="h-12 bg-[#6C5CE7] px-7 text-base text-white shadow-lg shadow-[#6C5CE7]/30 hover:bg-[#5B4BD8]">
                <Link href="/register?roll=jobbsokare">
                  <Search className="mr-2 h-4 w-4" />
                  Jag söker jobb
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 border-white/20 bg-white/[0.04] px-7 text-base text-white hover:bg-white/10 hover:text-white">
                <Link href="/register?roll=rekryterare">
                  <Users className="mr-2 h-4 w-4" />
                  Jag rekryterar
                </Link>
              </Button>
            </div>

            <Link href="#demo" className="mb-10 inline-flex items-center gap-1.5 rounded text-sm font-medium text-[#5EEAD4] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5EEAD4]">
              <Zap className="h-3.5 w-3.5" />
              Testa matchningen utan konto
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            {/* Paradoxen i två stora siffror, med källa */}
            <dl className="grid max-w-lg grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
                <dt className="sr-only">Arbetsgivare med kompetensbrist</dt>
                <dd className="text-4xl font-semibold tabular-nums tracking-tight text-white">76%</dd>
                <dd className="mt-2 text-sm leading-snug text-white/60">av svenska arbetsgivare hittar inte rätt kompetens</dd>
                <dd className="mt-1 text-xs text-white/35">ManpowerGroup</dd>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
                <dt className="sr-only">Nyexaminerade under studiemedelsnivån</dt>
                <dd className="text-4xl font-semibold tabular-nums tracking-tight text-white">1 av 4</dd>
                <dd className="mt-2 text-sm leading-snug text-white/60">nyexaminerade akademiker tjänar under studiemedelsnivån</dd>
                <dd className="mt-1 text-xs text-white/35">Saco</dd>
              </div>
            </dl>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200 lg:pl-4">
            <MatchCardMockup />
            <div className="mt-14 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-white/45 lg:mt-12 lg:justify-end">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[#5EEAD4]" />GDPR, data lagras inom EU</span>
              <span className="flex items-center gap-1.5"><UserCheck className="h-3.5 w-3.5 text-[#5EEAD4]" />AI föreslår, människa beslutar</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Paradoxen: samma problem sett från två håll ── */}
      <section id="problemet" className="scroll-mt-20 border-t border-border px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Kompetensparadoxen"
            title="En paradox som kostar Sverige miljarder"
            description="Akademiker står utan jobb samtidigt som arbetsgivare inte hittar kompetens. Det är inte ett kompetensproblem, det är ett matchningsproblem."
          />

          <ScrollReveal className="mb-6">
            <ParadoxStats />
          </ScrollReveal>

          <div className="mb-6 grid gap-6 lg:grid-cols-2">
            <div className="panel p-7 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <TrendingDown className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold">Jobbsökarna</h3>
              </div>
              <dl className="space-y-5">
                {[
                  { value: '1 av 4', text: 'nyexaminerade akademiker tjänar under studiemedelsnivån fyra månader efter examen' },
                  { value: '1 av 8', text: 'nyexaminerade uppfyller inkomstkravet för a-kassa, så många hamnar mellan studiemedel och a-kassa' },
                ].map(row => (
                  <div key={row.value} className="flex items-baseline gap-5">
                    <dt className="w-20 flex-shrink-0 text-2xl font-semibold tabular-nums tracking-tight">{row.value}</dt>
                    <dd className="text-sm leading-relaxed text-muted-foreground">{row.text}</dd>
                  </div>
                ))}
              </dl>
              <blockquote className="mt-7 border-l-2 border-primary/40 pl-4">
                <p className="text-sm italic leading-relaxed text-foreground/85">
                  &rdquo;Ett enormt stort slöseri när studenter som investerat flera år i sina utbildningar inte lyckas komma i arbete.&rdquo;
                </p>
                <footer className="mt-2 text-xs text-muted-foreground">Colin Andersson, Saco studentråd</footer>
              </blockquote>
            </div>

            <div className="panel p-7 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Building2 className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold">Arbetsgivarna</h3>
              </div>
              <dl className="space-y-5">
                {[
                  { value: '58%', text: 'av arbetsgivarna fick problem vid sitt senaste rekryteringsförsök' },
                  { value: '60%', text: 'anger bristande erfarenhet eller fel utbildning som rekryteringshinder' },
                  { value: '56%', text: 'av beslutsfattarna ser att politiken bidragit lite eller inget till bättre matchning' },
                  { value: '67%', text: 'av Unionens medlemmar har lågt förtroende för regeringens arbetsmarknadspolitik' },
                ].map(row => (
                  <div key={row.value} className="flex items-baseline gap-5">
                    <dt className="w-20 flex-shrink-0 text-2xl font-semibold tabular-nums tracking-tight">{row.value}</dt>
                    <dd className="text-sm leading-relaxed text-muted-foreground">{row.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="panel gradient-subtle mx-auto max-w-3xl px-8 py-7 text-center">
            <p className="text-lg leading-relaxed">
              Det finns tillräckligt med kompetens i Sverige. Systemet för att matcha den är trasigt.{' '}
              <strong className="font-semibold text-foreground">Rekryo löser det med förklarbar AI.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ── Övergång från problem till lösning: samma matchning sedd från båda håll ── */}
      <section className="border-t border-border hero-mesh px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <SectionHeader
              eyebrow="Rätt kompetens finns redan"
              title={<>Sverige har kompetensen. Vi ser till att den <span className="gradient-text">hittar rätt.</span></>}
              description="Samma matchning, förklarad för båda sidor. Jobbsökaren ser varför jobbet passar och vad som saknas. Rekryteraren ser samma poäng uppdelad, utan kandidatens namn, och fattar beslutet."
            />
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <DualViewMockup />
          </ScrollReveal>
        </div>
      </section>

      {/* ── Så fungerar det: tre steg, vart och ett med ett litet utsnitt av produkten ── */}
      <section className="border-t border-border px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeader eyebrow="Så fungerar det" title="Från CV till förklarad matchning i tre steg" />

          <ol className="grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <ScrollReveal key={s.step} delay={i * 100}>
                <li className="panel panel-hover flex h-full flex-col p-7">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <s.icon className="h-5 w-5" aria-hidden />
                    </div>
                    <span className="text-sm font-semibold tabular-nums text-muted-foreground/70">{s.step}</span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
                  <p className="mb-7 flex-1 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>

                  <div className="rounded-lg border border-border bg-muted/50 p-3" aria-hidden>
                    {i === 0 && (
                      <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                        <span className="rounded-md border border-primary/40 bg-primary/10 px-2 py-2 text-center text-primary">Jobbsökare</span>
                        <span className="rounded-md border border-border bg-card px-2 py-2 text-center text-muted-foreground">Rekryterare</span>
                      </div>
                    )}
                    {i === 1 && (
                      <div className="flex flex-wrap gap-1.5 text-xs">
                        {['Triage', 'Projektledning', 'Excel', 'Kundservice'].map(skill => (
                          <span key={skill} className="rounded-md bg-card px-2 py-1 text-foreground/80 ring-1 ring-border">{skill}</span>
                        ))}
                      </div>
                    )}
                    {i === 2 && (
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-semibold tabular-nums">87</span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                          <div className="h-full w-[87%] rounded-full bg-gradient-to-r from-primary to-mint" />
                        </div>
                        <span className="text-xs font-medium text-mint-foreground">Stark</span>
                      </div>
                    )}
                  </div>
                </li>
              </ScrollReveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Live Demo ── */}
      <section id="demo" className="section-alt scroll-mt-20 border-t border-border bg-muted/30 px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-2xl">
          <ScrollReveal>
            <SectionHeader
              eyebrow="Prova direkt"
              title="Se AI-matchningen i realtid"
              description="Inget konto och inga kortuppgifter. Skriv in ett jobb och några kompetenser och få ett matchningspoäng på några sekunder."
            />
            <Tabs defaultValue="seeker" className="items-center">
              <TabsList className="mb-6">
                <TabsTrigger value="seeker" className="gap-1.5"><Zap className="h-3.5 w-3.5" /> Prova som jobbsökare</TabsTrigger>
                <TabsTrigger value="recruiter" className="gap-1.5"><BarChart3 className="h-3.5 w-3.5" /> Prova som rekryterare</TabsTrigger>
              </TabsList>
              <TabsContent value="seeker" className="w-full">
                <DemoMatcher persona="seeker" />
              </TabsContent>
              <TabsContent value="recruiter" className="w-full">
                <DemoMatcher persona="recruiter" />
              </TabsContent>
            </Tabs>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-t border-border px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Funktioner"
            title="Allt du behöver för förklarad matchning"
            description="Från CV-analys till intervjuförberedelse, med samma förklarbara AI genom hela flödet."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 80}>
                <div className="panel panel-hover h-full p-7">
                  <div className={`mb-6 flex h-11 w-11 items-center justify-center rounded-xl ${f.accentBg}`}>
                    <f.icon className={`h-5 w-5 ${f.accent}`} aria-hidden />
                  </div>
                  <h3 className="mb-2 text-base font-semibold">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Två perspektiv: samma designspråk, var sin produktvy ── */}
      <section className="section-alt border-t border-border px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="För båda sidor"
            title="En plattform, två perspektiv"
            description="Jobbsökare ser hur de matchar och vad som saknas. Rekryterare får en rangordnad lista med motivering till varje poäng."
          />

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Jobbsökare */}
            <div className="panel flex flex-col overflow-hidden">
              <div className="mockup-stage border-b border-border bg-muted/40 p-6 sm:p-8 lg:min-h-[24rem]" aria-hidden>
                <div className="mockup-card rounded-xl border border-border bg-card p-4 sm:p-5">
                  <p className="mb-4 text-xs font-medium text-muted-foreground">Dina bästa matchningar</p>
                  <div className="space-y-3.5">
                    {[
                      { title: 'Undersköterska, akutmottagning', company: 'Nordvik Vård AB', score: 87 },
                      { title: 'Vårdadministratör', company: 'Region Mälardalen', score: 74 },
                      { title: 'Kundtjänst, vårdguiden', company: 'Hälsolinjen', score: 61 },
                    ].map((job, i) => (
                      <div key={job.title}>
                        <div className="mb-1.5 flex items-baseline justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{job.title}</p>
                            <p className="truncate text-xs text-muted-foreground">{job.company}</p>
                          </div>
                          <span className={`text-sm font-semibold tabular-nums ${i === 0 ? 'text-mint-foreground' : 'text-foreground/80'}`}>{job.score}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                          <div className={`h-full rounded-full ${i === 0 ? 'bg-gradient-to-r from-primary to-mint' : 'bg-primary/60'}`} style={{ width: `${job.score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
                    <TrendingUp className="h-3.5 w-3.5 text-amber-500" />
                    Saknas oftast: <span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 font-medium text-amber-700 dark:text-amber-400">TakeCare</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-7 sm:p-8">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Search className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="text-xl font-semibold">För jobbsökare</h3>
                </div>
                <p className="mb-6 text-muted-foreground">Ladda upp ditt CV och se direkt hur väl du matchar varje jobb, och exakt vad du kan förbättra.</p>
                <ul className="mb-8 flex-1 space-y-3">
                  {['AI analyserar ditt CV automatiskt', 'Matchningspoäng med motivering per jobb', 'Tydliga kompetensgap att jobba med', 'Intervjufrågor anpassade efter jobbet'].map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle className="h-4 w-4 flex-shrink-0 text-mint-foreground" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full">
                  <Link href="/register?roll=jobbsokare">Hitta ditt nästa jobb <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>

            {/* Rekryterare */}
            <div className="panel flex flex-col overflow-hidden">
              <div className="mockup-stage border-b border-border bg-muted/40 p-6 sm:p-8 lg:min-h-[24rem]" aria-hidden>
                <div className="mockup-card rounded-xl border border-border bg-card p-4 sm:p-5">
                  <p className="mb-4 text-xs font-medium text-muted-foreground">Sökande · Undersköterska, akutmottagning</p>
                  <div className="space-y-2">
                    {[
                      { initials: 'AL', name: 'Anna L.', score: 87, status: 'Shortlistad', tone: 'bg-mint/15 text-mint-foreground' },
                      { initials: 'ES', name: 'Erik S.', score: 81, status: 'Granskad', tone: 'bg-primary/10 text-primary' },
                      { initials: 'MK', name: 'Maria K.', score: 74, status: 'Ny', tone: 'bg-muted text-muted-foreground' },
                    ].map((c, i) => (
                      <div key={c.initials} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${i === 0 ? 'bg-primary/[0.06] ring-1 ring-primary/20' : ''}`}>
                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full gradient-primary text-[11px] font-semibold text-white">{c.initials}</span>
                        <span className="flex-1 truncate text-sm font-medium">{c.name}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${c.tone}`}>{c.status}</span>
                        <span className="w-7 text-right text-sm font-semibold tabular-nums">{c.score}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
                    <span className="font-medium text-foreground">AI-sammanfattning:</span> Stark inom akutsjukvård och triage. Saknar erfarenhet av TakeCare.
                  </p>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-7 sm:p-8">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint/10 text-mint-foreground">
                    <BarChart3 className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="text-xl font-semibold">För rekryterare</h3>
                </div>
                <p className="mb-6 text-muted-foreground">Sluta gissa. Få alla sökande rangordnade med poäng, kompetensgap och en sammanfattning, och fatta beslutet själv.</p>
                <ul className="mb-8 flex-1 space-y-3">
                  {['Publicera jobbannonser på minuter', 'AI rangordnar alla sökande 0–100', 'Sammanfattning och gap per kandidat', 'Inbyggd chatt och intervjubokning'].map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle className="h-4 w-4 flex-shrink-0 text-mint-foreground" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/register?roll=rekryterare">Rekrytera smartare <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustSection />

      {/* ── FAQ ── */}
      <section className="section-alt border-t border-border bg-muted/30 px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-2xl">
          <SectionHeader eyebrow="Vanliga frågor" title="Allt du behöver veta" />
          <Accordion className="space-y-3">
            {[
              {
                id: 'faq-1',
                q: 'Kostar det något att använda Rekryo?',
                a: 'Nej — plattformen är helt gratis för både jobbsökare och rekryterare. Inga dolda avgifter, inget kreditkort behövs.',
              },
              {
                id: 'faq-2',
                q: 'Hur fungerar AI-matchningen?',
                a: 'Claude AI (Anthropic) analyserar ditt CV och extraherar kompetenser, erfarenhetsnivå, utbildning och styrkor. Varje jobb får ett matchningspoäng 0–100. Du ser exakt vilka kompetenser som matchar, vad du saknar och konkreta rekommendationer — inte bara en siffra utan en fullständig analys.',
              },
              {
                id: 'faq-3',
                q: 'Är mina uppgifter säkra?',
                a: 'Din profil och dina uppgifter lagras inom EU (Irland) via Supabase och behandlas enligt GDPR. Ditt CV analyseras av Claude AI (Anthropic) enbart för matchningen, och Anthropic använder inte data som skickas via deras API för att träna sina AI-modeller.',
              },
              {
                id: 'faq-4',
                q: 'Kan rekryterare se mitt CV utan att jag sökt jobbet?',
                a: 'Nej. Rekryterare ser bara kandidater som aktivt sökt deras jobb — eller som finns i talangpoolen och valt att vara synliga.',
              },
              {
                id: 'faq-5',
                q: 'Hur laddar jag upp mitt CV?',
                a: 'Du laddar upp ditt CV som PDF eller textfil (TXT) i din profil efter registrering. AI-analysen körs automatiskt och tar ungefär 30 sekunder.',
              },
              {
                id: 'faq-6',
                q: 'Fungerar det för alla typer av jobb?',
                a: 'Ja — plattformen är branschoberoende och fungerar för allt från teknik och ekonomi till vård och kreativa yrken.',
              },
            ].map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="rounded-xl border border-border bg-card px-6 transition-colors hover:border-primary/30 data-[state=open]:border-primary/40"
              >
                <AccordionTrigger className="py-5 text-left text-base font-medium hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── Slut-CTA: samma mörka band och samma två ingångar som heron ── */}
      <section className="px-6 py-20 lg:py-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 hero-dark px-8 py-16 text-center sm:px-16 sm:py-20">
          <div className="absolute inset-0 dot-grid-light opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          <div className="relative">
            <h2 className="mx-auto mb-4 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Redo att matcha på kompetens i stället för kontakter?
            </h2>
            <p className="mx-auto mb-9 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
              Gratis att börja, inget kreditkort. Välj din väg in.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild className="h-12 bg-[#6C5CE7] px-7 text-base text-white shadow-lg shadow-[#6C5CE7]/30 hover:bg-[#5B4BD8]">
                <Link href="/register?roll=jobbsokare">
                  <Search className="mr-2 h-4 w-4" />
                  Jag söker jobb
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 border-white/20 bg-white/[0.04] px-7 text-base text-white hover:bg-white/10 hover:text-white">
                <Link href="/register?roll=rekryterare">
                  <Users className="mr-2 h-4 w-4" />
                  Jag rekryterar
                </Link>
              </Button>
            </div>
            <p className="mt-7 text-sm text-white/50">
              Har du redan ett konto?{' '}
              <Link href="/login" className="font-medium text-white/80 underline-offset-4 hover:underline">Logga in</Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
