import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ParadoxStats } from '@/components/paradox-stats'
import { DemoMatcher } from '@/components/demo-matcher'
import { ScrollReveal } from '@/components/scroll-reveal'
import { MatchCardMockup } from '@/components/landing/match-card-mockup'
import { SectionHeader } from '@/components/landing/section-header'
import { MatchNetworkIllustration } from '@/components/illustrations/match-network'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Target, Users, TrendingUp, Shield,
  ArrowRight, CheckCircle, Zap, Sparkles,
  FileText, BarChart3, MessageSquare,
  Building2, TrendingDown, Search, ShieldCheck, UserCheck, UserPlus
} from 'lucide-react'

// Två märkesfärger, inte en regnbåge — växlar mellan primär (navy) och
// koppar-accent i ett medvetet rutmönster. Sex olika pastellfärger per kort
// är precis den "generiska AI-mall"-känslan vi designar bort.
const brandTone = {
  primary: { accent: 'text-primary', accentBg: 'bg-primary/10 border-primary/20' },
  copper: { accent: 'accent-mark', accentBg: 'bg-accent border-accent-foreground/15' },
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
    ...brandTone.copper,
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
    ...brandTone.copper,
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
    ...brandTone.copper,
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
      <section className="relative overflow-hidden hero-dark px-6 pt-28 pb-24 lg:pt-36 lg:pb-32">
        <div className="absolute inset-0 -z-10 dot-grid-light opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Badge variant="secondary" className="mb-7 gap-1.5 border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm">
              <Sparkles className="h-3 w-3 text-[#A99DFB]" />
              AI-matchning för den svenska arbetsmarknaden
            </Badge>

            <h1 className="mb-6 text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[3.4rem] xl:text-[3.75rem]">
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

            <Link href="#demo" className="mb-12 inline-flex items-center gap-1.5 rounded text-sm font-medium text-[#5EEAD4] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5EEAD4]">
              <Zap className="h-3.5 w-3.5" />
              Testa matchningen utan konto
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            {/* Paradoxen i två stora siffror, med källa */}
            <dl className="grid max-w-lg grid-cols-2 gap-6 border-t border-white/10 pt-8">
              <div>
                <dt className="sr-only">Arbetsgivare med kompetensbrist</dt>
                <dd className="text-4xl font-semibold tabular-nums tracking-tight text-white">76%</dd>
                <dd className="mt-2 text-sm leading-snug text-white/60">av svenska arbetsgivare hittar inte rätt kompetens</dd>
                <dd className="mt-1 text-xs text-white/35">ManpowerGroup</dd>
              </div>
              <div>
                <dt className="sr-only">Nyexaminerade under studiemedelsnivån</dt>
                <dd className="text-4xl font-semibold tabular-nums tracking-tight text-white">1 av 4</dd>
                <dd className="mt-2 text-sm leading-snug text-white/60">nyexaminerade akademiker tjänar under studiemedelsnivån</dd>
                <dd className="mt-1 text-xs text-white/35">Saco</dd>
              </div>
            </dl>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200 lg:pl-4">
            <MatchCardMockup />
            <div className="mt-16 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-white/45 sm:mt-14 lg:justify-end">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[#5EEAD4]" />GDPR, data lagras inom EU</span>
              <span className="flex items-center gap-1.5"><UserCheck className="h-3.5 w-3.5 text-[#5EEAD4]" />AI föreslår, människa beslutar</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Paradoxen: samma problem sett från två håll ── */}
      <section id="problemet" className="scroll-mt-20 border-t border-border px-6 py-28">
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

      {/* ── Övergång från problem till lösning, med illustration i stället för stockfoto ── */}
      <section className="border-t border-border hero-mesh px-6 py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <ScrollReveal>
            <SectionHeader
              align="left"
              eyebrow="Rätt kompetens finns redan"
              title={<>Sverige har kompetensen. Vi ser till att den <span className="gradient-text">hittar rätt.</span></>}
              description="Bakom varje otillsatt tjänst finns en person med rätt bakgrund som aldrig syntes. Rekryo jämför kompetenser, erfarenhet och krav, och visar varför en matchning håller."
            />
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <div className="panel p-6 sm:p-8">
              <MatchNetworkIllustration className="h-auto w-full" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Så fungerar det: tre steg, vart och ett med ett litet utsnitt av produkten ── */}
      <section className="border-t border-border px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeader eyebrow="Så fungerar det" title="Från CV till förklarad matchning i tre steg" />

          <ol className="grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <ScrollReveal key={s.step} delay={i * 100}>
                <li className="panel flex h-full flex-col p-7">
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
      <section id="demo" className="py-24 px-6 bg-muted/20 border-t border-border/60">
        <div className="mx-auto max-w-2xl">
          <ScrollReveal>
            <div className="text-center mb-10">
              <Badge variant="outline" className="mb-4 text-primary border-primary/30">Prova direkt</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold">Se AI-matchningen i realtid</h2>
              <p className="text-muted-foreground mt-3">
                Inga konton. Inga kortuppgifter. Få ett matchningspoäng på 10 sekunder.
              </p>
            </div>
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
      <section className="py-24 px-6 border-t border-border/60">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">Funktioner</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Allt du behöver för smart matchning</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Från CV-analys till intervjuförberedelse — Rekryo guidar dig hela vägen.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 80}>
                <div className="group panel panel-hover p-6 h-full">
                  <div className={`h-10 w-10 rounded-lg border flex items-center justify-center mb-5 ${f.accentBg}`}>
                    <f.icon className={`h-5 w-5 ${f.accent}`} />
                  </div>
                  <h3 className="font-semibold text-base mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── For seekers / recruiters ── */}
      <section className="py-24 px-6 border-t border-border/60">
        <div className="mx-auto max-w-5xl grid lg:grid-cols-2 gap-5">
          {/* Jobbsökare */}
          <div className="panel overflow-hidden flex flex-col">
            <div className="relative h-52 overflow-hidden flex-shrink-0 border-b border-border/60">
              <Image
                src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=1200&auto=format&fit=crop"
                alt="Jobbsökare i ett positivt samtal"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/10 dark:from-background dark:via-background/70 dark:to-background/15" />
              <div className="absolute inset-0 dot-grid opacity-15" />

              {/* Mini product mockup: CV-analys */}
              <div className="absolute inset-x-5 top-5 bottom-12 rounded-xl border border-border bg-card shadow-lg overflow-hidden flex flex-col">
                <div className="h-6 flex items-center gap-1.5 px-2.5 border-b border-border/50 bg-muted/40 flex-shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400/70" />
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-400/70" />
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400/70" />
                  <span className="ml-2 text-[9px] text-muted-foreground truncate">rekryo.com/cv-analys</span>
                </div>
                <div className="flex-1 p-3 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 shadow-sm">
                    <FileText className="h-4.5 w-4.5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[11px] font-semibold">CV.pdf</p>
                      <CheckCircle className="h-3 w-3 text-emerald-500" />
                    </div>
                    <p className="text-[9px] text-muted-foreground mb-1.5">Analyserad av AI · 12s</p>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 font-normal">Excel</Badge>
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 font-normal">Projektledning</Badge>
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 font-normal">+4</Badge>
                    </div>
                  </div>
                  <div className="flex flex-col items-center flex-shrink-0 pl-1">
                    <span className="text-lg font-bold text-primary leading-none">94%</span>
                    <span className="text-[8px] text-muted-foreground mt-1">Matchning</span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 left-6 flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center shadow-md">
                  <Zap className="h-4.5 w-4.5 text-white" />
                </div>
                <h3 className="text-xl font-bold">För jobbsökare</h3>
              </div>
            </div>
            <div className="p-8 flex flex-col flex-1">
              <p className="text-muted-foreground mb-6">Ladda upp ditt CV och få omedelbar AI-analys. Se hur väl du matchar varje jobb och exakt vad du behöver förbättra.</p>
              <ul className="space-y-2.5 mb-8 flex-1">
                {['AI analyserar ditt CV automatiskt', 'Se matchningspoäng per jobb', 'Identifiera kompetensgap', 'Förbered dig med AI-intervjufrågor'].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full">
                <Link href="/register">Hitta ditt drömjobb <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>

          {/* Rekryterare */}
          <div className="panel overflow-hidden flex flex-col">
            <div className="relative h-52 overflow-hidden flex-shrink-0 border-b border-border/60">
              <Image
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop"
                alt="Rekryterare som går igenom kandidatunderlag"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/10 dark:from-background dark:via-background/70 dark:to-background/15" />
              <div className="absolute inset-0 dot-grid opacity-15" />

              {/* Mini product mockup: rankad kandidatlista */}
              <div className="absolute inset-x-5 top-5 bottom-12 rounded-xl border border-border bg-card shadow-lg overflow-hidden flex flex-col">
                <div className="h-6 flex items-center gap-1.5 px-2.5 border-b border-border/50 bg-muted/40 flex-shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400/70" />
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-400/70" />
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400/70" />
                  <span className="ml-2 text-[9px] text-muted-foreground truncate">rekryo.com/rekryterare/kandidater</span>
                </div>
                <div className="flex-1 p-2 flex flex-col justify-center gap-1">
                  {[
                    { initials: 'AL', name: 'Anna L.', score: 96 },
                    { initials: 'ES', name: 'Erik S.', score: 88 },
                    { initials: 'MK', name: 'Maria K.', score: 74 },
                  ].map((c, i) => (
                    <div key={c.initials} className={`flex items-center gap-2 rounded-lg px-2 py-1 ${i === 0 ? 'bg-primary/5 border border-primary/20' : 'bg-muted/40'}`}>
                      <div className="h-5 w-5 rounded-full gradient-primary flex items-center justify-center text-[7px] font-bold text-white flex-shrink-0">
                        {c.initials}
                      </div>
                      <span className="text-[10px] font-medium flex-1 truncate">{c.name}</span>
                      <span className={`text-[10px] font-bold ${i === 0 ? 'text-primary' : 'text-muted-foreground'}`}>{c.score}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-4 left-6 flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center shadow-md">
                  <BarChart3 className="h-4.5 w-4.5 text-white" />
                </div>
                <h3 className="text-xl font-bold">För rekryterare</h3>
              </div>
            </div>
            <div className="p-8 flex flex-col flex-1">
              <p className="text-muted-foreground mb-6">Sluta gissa. Få en AI-rankad lista av kandidater med matchningspoäng, kompetensgap och personliga sammanfattningar.</p>
              <ul className="space-y-2.5 mb-8 flex-1">
                {['Publicera jobbannonser på minuter', 'AI rankar alla sökande 0–100', 'Se kandidatsammanfattningar direkt', 'Kommunicera via inbyggd chatt'].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="w-full">
                <Link href="/register">Rekrytera smartare <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-6 bg-muted/20 border-t border-border/60">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">Vanliga frågor</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Allt du behöver veta</h2>
            <p className="text-muted-foreground mt-3">Klicka på en fråga för att se svaret.</p>
          </div>
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
                a: 'All data lagras inom EU (Irland) via Supabase och behandlas strikt enligt GDPR. Ditt CV analyseras av Claude AI (Anthropic) enbart för matchning — Anthropic lagrar inte din data och använder den inte för att träna AI-modeller.',
              },
              {
                id: 'faq-4',
                q: 'Kan rekryterare se mitt CV utan att jag sökt jobbet?',
                a: 'Nej. Rekryterare ser bara kandidater som aktivt sökt deras jobb — eller som finns i talangpoolen och valt att vara synliga.',
              },
              {
                id: 'faq-5',
                q: 'Hur laddar jag upp mitt CV?',
                a: 'Du laddar upp PDF eller DOCX direkt i din profil efter registrering. AI-analysen körs automatiskt och tar ungefär 30 sekunder.',
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
                className="rounded-xl border border-border bg-card px-5 data-[state=open]:border-primary/40 transition-colors"
              >
                <AccordionTrigger className="text-sm font-semibold text-left hover:no-underline py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-3xl">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 gradient-primary" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,oklch(1_0_0/15%),transparent)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_80%_100%,oklch(0.60_0.25_295/30%),transparent)]" />
            <div className="absolute inset-0 dot-grid opacity-20" />
            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            <div className="relative px-8 py-16 text-center">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm mb-5 mx-auto ring-1 ring-white/20">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
                Redo att vara en del av lösningen?
              </h2>
              <p className="text-white/70 mb-8 text-base max-w-md mx-auto leading-relaxed">
                Gå med jobbsökare och rekryterare som väljer kompetens framför kontakter.
                Gratis att börja — inga kreditkort.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" variant="secondary" asChild className="px-8 h-12 shadow-xl shadow-black/20">
                  <Link href="/register">
                    Kom igång gratis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="ghost" asChild className="px-8 h-12 text-white hover:text-white hover:bg-white/15 border border-white/20">
                  <Link href="/login">Logga in</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
