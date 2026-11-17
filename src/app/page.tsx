import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ParadoxStats } from '@/components/paradox-stats'
import { DemoMatcher } from '@/components/demo-matcher'
import { ScrollReveal } from '@/components/scroll-reveal'
import { MatchCardMockup } from '@/components/landing/match-card-mockup'
import { SectionHeader } from '@/components/landing/section-header'
import { DualViewMockup } from '@/components/landing/dual-view-mockup'
import { TrustSection } from '@/components/landing/trust-section'
import { TrustBadges } from '@/components/landing/trust-badges'
import { Scribble } from '@/components/landing/scribble'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Target, Users, TrendingUp, Shield,
  ArrowRight, CheckCircle, Zap,
  FileText, BarChart3, MessageSquare,
  Building2, TrendingDown, Search, UserPlus, Upload, Briefcase
} from 'lucide-react'

// Två märkesfärger, inte en regnbåge: lila och mint växlar i ett medvetet mönster.
const brandTone = {
  primary: { accent: 'text-primary' },
  mint: { accent: 'text-mint-foreground' },
}

const features = [
  {
    icon: FileText,
    title: 'Läser ditt CV åt dig',
    description: 'Ladda upp CV:t en gång. Rekryo plockar ut kompetenser, erfarenhet och utbildning, så slipper du skriva samma sak i varje ansökan.',
    ...brandTone.primary,
  },
  {
    icon: Target,
    title: 'Ärliga matchningar',
    description: 'Varje jobb får ett poäng från 0 till 100 och en förklaring på vanlig svenska av varför.',
    ...brandTone.mint,
  },
  {
    icon: TrendingUp,
    title: 'Vad som saknas',
    description: 'Se vad som skiljer dig från drömjobbet och vad du kan göra för att komma närmare.',
    ...brandTone.primary,
  },
  {
    icon: Users,
    title: 'En lista du hinner läsa',
    description: 'Som rekryterare får du de sökande rangordnade med en kort sammanfattning, i stället för en hög med PDF:er.',
    ...brandTone.mint,
  },
  {
    icon: MessageSquare,
    title: 'Förberedd till intervjun',
    description: 'Öva på frågor som är troliga för just den rollen, utifrån annonsen och din bakgrund.',
    ...brandTone.primary,
  },
  {
    icon: Shield,
    title: 'Dina uppgifter stannar i EU',
    description: 'Allt lagras i Irland och hanteras enligt GDPR. Du kan när som helst ladda ner allt eller radera kontot.',
    ...brandTone.mint,
  },
]


const steps = [
  { step: '01', icon: UserPlus, title: 'Skapa konto', desc: 'Välj om du söker jobb eller anställer. Det tar under en minut och kostar ingenting.' },
  { step: '02', icon: FileText, title: 'Ladda upp CV eller annons', desc: 'Rekryo läser igenom det och plockar ut det som spelar roll: kompetenser, erfarenhet och krav.' },
  { step: '03', icon: Target, title: 'Se hur väl det passar', desc: 'Ett poäng från 0 till 100, med en förklaring av vad som stämmer, vad som saknas och vad du kan göra åt det.' },
]

export default function HomePage() {
  return (
    <div className="grain flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* ── Hero: budskap och två ingångar till vänster, produkten själv till höger ── */}
      <section className="relative overflow-hidden hero-band px-6 pt-20 pb-16 lg:pt-24 lg:pb-20">
        <div className="absolute inset-0 -z-10 hero-dots opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent dark:via-white/20" />

        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1fr_1.15fr] lg:gap-12">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <p className="mb-7 flex items-center gap-2.5 text-sm font-medium text-muted-foreground dark:text-white/60">
              <span className="h-2 w-2 rounded-full bg-mint shadow-[0_0_0_4px_rgb(0_184_148/15%)]" aria-hidden />
              Gjord för den svenska arbetsmarknaden
            </p>

            <h1 className="mb-7 text-balance text-5xl font-semibold leading-[1.06] tracking-[-0.03em] text-foreground sm:text-6xl lg:text-[3.3rem] xl:text-[3.75rem] dark:text-white">
              Kompetensen finns.{' '}
              <Scribble>Matchningen</Scribble>
              {' '}är trasig.
            </h1>

            <p className="mb-9 max-w-xl text-pretty text-lg leading-[1.7] text-foreground/75 sm:text-[1.2rem] dark:text-white/70">
              Rekryo läser ditt CV ungefär som en erfaren rekryterare skulle göra och säger ärligt
              hur väl du passar ett jobb, och vad som saknas. Den som anställer får samma förklaring
              och tar själv besluten.
            </p>

            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild className="h-12 bg-[#6C5CE7] px-7 text-base text-white shadow-lg shadow-[#6C5CE7]/30 hover:bg-[#5B4BD8]">
                <Link href="/register?roll=jobbsokare">
                  <Search className="mr-2 h-4 w-4" />
                  Jag söker jobb
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 border-border bg-card px-7 text-base text-foreground hover:bg-muted dark:border-white/20 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/10 dark:hover:text-white">
                <Link href="/register?roll=rekryterare">
                  <Users className="mr-2 h-4 w-4" />
                  Jag rekryterar
                </Link>
              </Button>
            </div>

            <Link href="#demo" className="mb-10 inline-flex items-center gap-1.5 rounded text-sm font-medium text-mint-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mint dark:text-[#5EEAD4] dark:focus-visible:outline-[#5EEAD4]">
              <Zap className="h-3.5 w-3.5" />
              Prova utan att skapa konto
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            {/* Paradoxen i två stora siffror, med källa */}
            <dl className="grid max-w-lg grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none">
                <dt className="sr-only">Arbetsgivare med kompetensbrist</dt>
                <dd className="text-4xl font-semibold tabular-nums tracking-tight text-foreground dark:text-white">76%</dd>
                <dd className="mt-2 text-sm leading-snug text-muted-foreground dark:text-white/60">av svenska arbetsgivare hittar inte rätt kompetens</dd>
                <dd className="mt-1 text-xs text-muted-foreground/70 dark:text-white/35">ManpowerGroup</dd>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none">
                <dt className="sr-only">Nyexaminerade under studiemedelsnivån</dt>
                <dd className="text-4xl font-semibold tabular-nums tracking-tight text-foreground dark:text-white">1 av 4</dd>
                <dd className="mt-2 text-sm leading-snug text-muted-foreground dark:text-white/60">nyexaminerade akademiker tjänar under studiemedelsnivån</dd>
                <dd className="mt-1 text-xs text-muted-foreground/70 dark:text-white/35">Saco</dd>
              </div>
            </dl>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200 lg:pl-4">
            <MatchCardMockup />
          </div>
        </div>

        <TrustBadges variant="adaptive" className="mx-auto mt-14 max-w-6xl justify-center lg:mt-16" />
      </section>

      {/* ── Paradoxen: samma problem sett från två håll ── */}
      <section id="problemet" className="scroll-mt-20 px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Kompetensparadoxen"
            title={<>Två sidor <span className="text-muted-foreground">som letar efter varandra</span></>}
            description="Nyexaminerade skickar ansökan efter ansökan utan att höra något. Samtidigt sitter arbetsgivare med tjänster de inte får tillsatta. Båda gör sitt bästa. Det är kopplingen mellan dem som inte fungerar."
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
                <h3 className="text-lg font-semibold">Den som söker jobb</h3>
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
              <blockquote className="relative mt-8 pl-8">
                <span className="absolute -top-3 left-0 text-5xl font-semibold leading-none text-primary/30" aria-hidden>&rdquo;</span>
                <p className="text-base leading-[1.65] text-foreground/85">
                  Ett enormt stort slöseri när studenter som investerat flera år i sina utbildningar inte lyckas komma i arbete.
                </p>
                <footer className="mt-2 text-sm text-muted-foreground">Colin Andersson, Saco studentråd</footer>
              </blockquote>
            </div>

            <div className="panel p-7 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Building2 className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold">Den som anställer</h3>
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
              Det finns tillräckligt med kompetens i Sverige. Det som saknas är ett bättre sätt att hitta den.{' '}
              <strong className="font-semibold text-foreground">Det är det vi bygger.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ── Övergång från problem till lösning: samma matchning sedd från båda håll ── */}
      <section className="hero-mesh px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <SectionHeader
              eyebrow="Samma matchning, två håll"
              title={<>Sverige har kompetensen. Vi ser till att den <Scribble tone="primary">hittar rätt.</Scribble></>}
              description="Jobbsökaren ser varför jobbet passar och vad som saknas. Rekryteraren ser samma bedömning, gjord utan att AI:n känner till kandidatens namn, och bestämmer själv vad som händer sedan."
            />
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <DualViewMockup />
          </ScrollReveal>
        </div>
      </section>

      {/* ── Så fungerar det: tre steg, vart och ett med ett litet utsnitt av produkten ── */}
      <section className="px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeader align="left" eyebrow="Så går det till" title={<>Tre steg, <span className="text-muted-foreground">och ungefär fem minuter</span></>} />

          <ol className="grid gap-6 md:grid-cols-3 md:items-start">
            {steps.map((s, i) => (
              <ScrollReveal key={s.step} delay={i * 100} className={['', 'md:mt-10', 'md:mt-5'][i]}>
                <li className="panel panel-hover flex h-full flex-col p-7">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <s.icon className="h-5 w-5" aria-hidden />
                    </div>
                    <span className="text-sm font-semibold tabular-nums text-muted-foreground/70">{s.step}</span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
                  <p className="mb-7 flex-1 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>

                  <div className="inset-surface rounded-lg border border-border bg-muted/50 p-3" aria-hidden>
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
      <section id="demo" className="section-alt relative scroll-mt-20 overflow-hidden px-6 py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-80 bg-[radial-gradient(60%_100%_at_50%_0%,rgb(108_92_231/14%),transparent)]" aria-hidden />
        <div className="relative mx-auto max-w-6xl">
          <ScrollReveal>
            <SectionHeader
              eyebrow="Prova själv"
              title="Testa med ett jobb du är nyfiken på"
              description="Du behöver inget konto. Skriv in ett jobb och några av dina kompetenser, så ser du på några sekunder hur väl de passar ihop."
            />
            <Tabs defaultValue="seeker" className="items-center">
              <TabsList className="mb-6">
                <TabsTrigger value="seeker" className="gap-1.5"><Zap className="h-3.5 w-3.5" /> Jag söker jobb</TabsTrigger>
                <TabsTrigger value="recruiter" className="gap-1.5"><BarChart3 className="h-3.5 w-3.5" /> Jag rekryterar</TabsTrigger>
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
      <section className="px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeader
                align="left"
                eyebrow="Vad Rekryo gör"
                title={<>Mindre gissande, <span className="text-muted-foreground">för båda sidor</span></>}
                description="Från första CV:t till intervjun, med samma tanke hela vägen: du ska alltid kunna se varför."
              />
            </div>
            <ul className="grid gap-x-10 sm:grid-cols-2">
              {features.map((f, i) => (
                <li key={f.title} className="border-t border-border py-7">
                  <ScrollReveal delay={(i % 2) * 80}>
                    <f.icon className={`mb-4 h-5 w-5 ${f.accent}`} aria-hidden />
                    <h3 className="mb-2 text-base font-semibold">{f.title}</h3>
                    <p className="text-sm leading-[1.7] text-muted-foreground">{f.description}</p>
                  </ScrollReveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Två perspektiv: samma designspråk, var sin produktvy ── */}
      <section className="section-alt px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="För båda sidor"
            title="En plattform, två perspektiv"
            description="Samma förklarade matchning, men olika frågor. Som jobbsökare vill du veta om du passar. Som rekryterare vill du veta vem som passar bäst."
          />

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Jobbsökare: lila genomgående */}
            <div className="panel panel-hover flex flex-col overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-primary via-primary/70 to-primary/10" aria-hidden />
              <div className="mockup-stage border-b border-border bg-muted/40 p-6 sm:p-8 lg:min-h-[24rem]" aria-hidden>
                <div className="mockup-card rounded-xl border border-border bg-card p-4 sm:p-5">
                  <p className="mb-4 text-xs font-medium text-muted-foreground">Dina bästa matchningar</p>
                  <div className="space-y-3.5">
                    {[
                      { title: 'Undersköterska, akutmottagning', company: 'Nordvik Vård AB · publicerad i dag', score: 87 },
                      { title: 'Vårdadministratör', company: 'Region Mälardalen · 3 dagar sedan', score: 74 },
                      { title: 'Kundtjänst, vårdguiden', company: 'Hälsolinjen · 1 vecka sedan', score: 61 },
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
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                    <Search className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Jobbsökare</p>
                    <h3 className="text-xl font-semibold">För dig som söker jobb</h3>
                  </div>
                </div>
                <p className="mb-6 text-muted-foreground">Se varför du passar innan du söker. Ladda upp ditt CV en gång, så får varje jobb en poäng, en motivering och en lista över vad du kan förbättra.</p>
                <ul className="mb-8 flex-1 space-y-3">
                  {['CV:t analyseras automatiskt på ungefär 30 sekunder', 'Poäng och motivering för varje jobb', 'Kompetensgap med konkreta förslag', 'Intervjufrågor för just den rollen'].map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle className="h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button asChild size="lg" className="h-11 w-full shadow-lg shadow-primary/25">
                  <Link href="/register?roll=jobbsokare"><Upload className="mr-2 h-4 w-4" aria-hidden />Ladda upp ditt CV</Link>
                </Button>
                <p className="mt-2.5 text-center text-xs text-muted-foreground">Gratis för jobbsökare, inget kort behövs</p>
              </div>
            </div>

            {/* Rekryterare: mint genomgående */}
            <div className="panel panel-hover flex flex-col overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-mint via-mint/70 to-mint/10" aria-hidden />
              <div className="mockup-stage border-b border-border bg-muted/40 p-6 sm:p-8 lg:min-h-[24rem]" aria-hidden>
                <div className="mockup-card rounded-xl border border-border bg-card p-4 sm:p-5">
                  <p className="mb-4 text-xs font-medium text-muted-foreground">Sökande · Undersköterska, akutmottagning</p>
                  <div className="space-y-2">
                    {[
                      { initials: 'AH', name: 'Amira Hassan', score: 87, status: 'Shortlistad', tone: 'bg-mint/15 text-mint-foreground', avatar: 'bg-primary/15 text-primary' },
                      { initials: 'JB', name: 'Jonas Berg', score: 81, status: 'Granskad', tone: 'bg-primary/10 text-primary', avatar: 'bg-mint/15 text-mint-foreground' },
                      { initials: 'LS', name: 'Linnea Sundqvist', score: 74, status: 'Ny', tone: 'bg-muted text-muted-foreground', avatar: 'bg-amber-500/15 text-amber-700 dark:text-amber-300' },
                    ].map((c, i) => (
                      <div key={c.initials} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${i === 0 ? 'bg-primary/[0.06] ring-1 ring-primary/20' : ''}`}>
                        <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${c.avatar}`}>{c.initials}</span>
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
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mint/10 text-mint-foreground ring-1 ring-mint/25">
                    <BarChart3 className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-mint-foreground">Rekryterare</p>
                    <h3 className="text-xl font-semibold">För dig som rekryterar</h3>
                  </div>
                </div>
                <p className="mb-6 text-muted-foreground">Gå från en hög ansökningar till en rangordnad lista. Varje kandidat får poäng, sammanfattning och kompetensgap, och du fattar beslutet.</p>
                <ul className="mb-8 flex-1 space-y-3">
                  {['Publicera en annons på några minuter', 'Alla sökande rangordnade 0–100 med motivering', 'Namnet döljs för AI:n vid bedömningen', 'Chatt, intervjubokning och rättviseuppföljning'].map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle className="h-4 w-4 flex-shrink-0 text-mint-foreground" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button asChild size="lg" className="h-11 w-full bg-mint text-[#13121C] shadow-lg shadow-mint/25 hover:bg-mint/90">
                  <Link href="/register?roll=rekryterare"><Briefcase className="mr-2 h-4 w-4" aria-hidden />Publicera en annons</Link>
                </Button>
                <p className="mt-2.5 text-center text-xs text-muted-foreground">Gratis att publicera och matcha</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustSection />

      {/* ── FAQ ── */}
      <section className="section-alt px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-2xl">
          <SectionHeader eyebrow="Vanliga frågor" title={<>Det här <span className="text-muted-foreground">brukar folk undra</span></>} />
          <Accordion className="space-y-3">
            {[
              {
                id: 'faq-1',
                q: 'Kostar det något att använda Rekryo?',
                a: 'Nej. Under betan är Rekryo helt gratis för både jobbsökare och rekryterare, och du behöver inget kort för att börja.',
              },
              {
                id: 'faq-2',
                q: 'Hur fungerar AI-matchningen?',
                a: 'Rekryo plockar ut kompetenser, erfarenhet och utbildning ur ditt CV och jämför dem med annonsen. Du får ett poäng från 0 till 100, men viktigare än siffran är förklaringen: vad som matchar, vad som saknas och vad du kan göra åt det. Själva AI-modellen heter Claude och kommer från Anthropic.',
              },
              {
                id: 'faq-3',
                q: 'Är mina uppgifter säkra?',
                a: 'Din profil och dina uppgifter lagras inom EU, i Irland, och hanteras enligt GDPR. CV:t skickas till AI-modellen bara för att göra matchningen, och Anthropic använder inte uppgifterna för att träna sina modeller.',
              },
              {
                id: 'faq-4',
                q: 'Kan rekryterare se mitt CV utan att jag sökt jobbet?',
                a: 'Nej. En rekryterare ser dig bara om du har sökt deras jobb, eller om du själv har valt att synas i talangpoolen.',
              },
              {
                id: 'faq-5',
                q: 'Hur laddar jag upp mitt CV?',
                a: 'När du har skapat ett konto laddar du upp CV:t som PDF eller textfil i din profil. Analysen startar av sig själv och tar ungefär en halv minut.',
              },
              {
                id: 'faq-6',
                q: 'Fungerar det för alla typer av jobb?',
                a: 'Ja. Rekryo är inte byggt för en viss bransch och fungerar lika bra för vård och handel som för teknik, ekonomi och kreativa yrken.',
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
              Det är gratis under betan. Välj hur du vill börja, så tar vi det därifrån.
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
