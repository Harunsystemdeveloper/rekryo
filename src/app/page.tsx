import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ParadoxStats } from '@/components/paradox-stats'
import { DemoMatcher } from '@/components/demo-matcher'
import { ScrollReveal } from '@/components/scroll-reveal'
import { AnimatedHeroWidget } from '@/components/animated-hero-widget'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Target, Users, TrendingUp, Shield,
  ArrowRight, CheckCircle, Zap, Sparkles,
  FileText, BarChart3, MessageSquare, AlertTriangle,
  Building2, TrendingDown
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
  { step: '01', title: 'Skapa konto', desc: 'Registrera dig gratis som jobbsökare eller rekryterare på under en minut.' },
  { step: '02', title: 'Ladda upp CV / skapa annons', desc: 'AI analyserar ditt CV eller din jobbannons och extraherar nyckelkompetenser.' },
  { step: '03', title: 'Få AI-matchning', desc: 'Se ditt matchningspoäng, kompetensgap och personaliserade intervjufrågor direkt.' },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* ── Hero — mörkt varumärkesband, inte ett krämfärgat kort med en blå knapp ── */}
      <section className="relative min-h-[90vh] flex items-center px-6 pt-24 pb-16 overflow-hidden hero-dark">
        <div className="absolute inset-0 -z-20 dot-grid-light opacity-60" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-white/10 blur-3xl -z-10 pointer-events-none" />

        <div className="mx-auto max-w-6xl w-full">
          <div className="grid lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-16 items-center">

            {/* Left: Text */}
            <div className="flex flex-col items-start animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Badge variant="secondary" className="mb-6 gap-1.5 px-4 py-1.5 text-xs font-medium border border-white/20 bg-white/10 text-white backdrop-blur-sm">
                <Sparkles className="h-3 w-3 accent-mark" />
                AI-driven rekrytering · Alla branscher · Svenska arbetsmarknaden
              </Badge>

              <h1 className="font-heading text-5xl sm:text-6xl lg:text-[4.25rem] font-semibold tracking-tight leading-[1.05] mb-6 text-white">
                Kompetensen finns.{' '}
                <span className="gradient-text-light italic">Matchningen</span>
                {' '}är trasig.
              </h1>

              <p className="text-base sm:text-lg text-white/70 leading-relaxed mb-8 max-w-lg">
                <strong className="text-white">76% av svenska arbetsgivare</strong> hittar inte rätt kompetens — nästan dubbelt så många som för tio år sedan.
                Samtidigt tjänar <strong className="text-white">var fjärde nyexaminerad akademiker</strong> under studiemedelsnivån månader efter sin examen.{' '}
                Det är inte ett kompetensproblem. Det är ett <strong className="text-white">matchningsproblem</strong> — och vi löser det med AI.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Button size="lg" variant="secondary" asChild className="text-base px-8 h-12 shadow-xl shadow-black/20">
                  <Link href="/register">
                    Kom igång gratis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-base px-8 h-12 border-white/25 text-white bg-transparent hover:bg-white/10 hover:text-white">
                  <Link href="#problemet">
                    Se problemet i siffror
                  </Link>
                </Button>
              </div>

              <Link href="#demo" className="inline-flex items-center gap-1.5 text-sm font-semibold accent-mark hover:underline mb-8">
                <Zap className="h-3.5 w-3.5" />
                Testa gratis demo — inget konto krävs
              </Link>

              <div className="flex flex-wrap items-center gap-5 text-sm text-white/60">
                {[
                  { label: 'Gratis att börja', color: 'text-white' },
                  { label: 'Inget kreditkort krävs', color: 'accent-mark' },
                  { label: 'GDPR-säkert', color: 'text-emerald-400' },
                ].map(({ label: item, color }) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <CheckCircle className={`h-3.5 w-3.5 ${color}`} />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Image + product demo */}
            <div className="relative hidden lg:flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">

              {/* Matching illustration with floating stat cards */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 aspect-[16/9] border border-border/60">
                <Image
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop"
                  alt="Team som samarbetar runt bärbara datorer"
                  fill
                  priority
                  sizes="(max-width: 1024px) 0px, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-background/92 via-background/72 to-primary/25 dark:from-background/94 dark:via-background/78 dark:to-primary/20" />
                <div className="absolute inset-0 dot-grid opacity-25" />

                {/* CV → match → job illustration */}
                <div className="absolute inset-0 flex items-center justify-center gap-4 px-8">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-16 w-16 rounded-2xl bg-card border border-border shadow-lg flex items-center justify-center">
                      <FileText className="h-7 w-7 text-primary" />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">CV</span>
                  </div>

                  <div className="flex-1 max-w-20 h-px bg-gradient-to-r from-primary/60 to-primary" />

                  <div className="h-20 w-20 rounded-2xl gradient-primary shadow-xl glow-primary flex items-center justify-center float-animation">
                    <Target className="h-9 w-9 text-white" />
                  </div>

                  <div className="flex-1 max-w-20 h-px bg-gradient-to-r from-primary to-primary/60" />

                  <div className="flex flex-col items-center gap-2">
                    <div className="h-16 w-16 rounded-2xl bg-card border border-border shadow-lg flex items-center justify-center">
                      <Building2 className="h-7 w-7 text-primary" />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Jobb</span>
                  </div>
                </div>

                {/* Floating: paradoxen i ett kort, inte två — mindre brus, samma poäng */}
                <div className="absolute top-4 left-4 right-4 rounded-xl border border-border/60 bg-card/95 backdrop-blur-md p-3.5 shadow-xl flex items-center gap-4">
                  <div className="flex-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Kompetensbrist</span>
                    <p className="text-2xl font-black text-destructive leading-none mt-1">76%</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">av svenska företag · ManpowerGroup</p>
                  </div>
                  <div className="w-px h-10 bg-border" />
                  <div className="flex-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Nyexaminerade</span>
                    <p className="text-2xl font-black accent-mark leading-none mt-1">1 av 4</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">under studiemedel · Saco</p>
                  </div>
                </div>
              </div>

              {/* Animated product demo */}
              <AnimatedHeroWidget />

            </div>
          </div>
        </div>
      </section>


      {/* ── Ticker tape ── */}
      <div className="border-y border-border/50 bg-muted/30 py-3 overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="ticker-track text-xs font-medium text-muted-foreground select-none">
          {[
            { label: 'Företag med kompetensbrist', value: '76%', up: true },
            { label: 'Nyexaminerade under studiemedelsnivån', value: '1 av 4', up: true },
            { label: 'Mindre bolag med svårt att rekrytera', value: '50%', up: true },
            { label: 'Rekryteringar som misslyckas', value: '25%', up: true },
            { label: 'Företag drabbade negativt', value: '93%', up: true },
            { label: 'Expansioner som uteblir', value: '33%', up: true },
            { label: 'Nyexaminerade utan a-kassa', value: '7 av 8', up: true },
            { label: 'Bristande yrkeserfarenhet som hinder', value: '69%', up: true },
            { label: 'Kompetensbrist dubbelt mot för 10 år sedan', value: '2×', up: true },
            // Duplicate for seamless loop
            { label: 'Företag med kompetensbrist', value: '76%', up: true },
            { label: 'Nyexaminerade under studiemedelsnivån', value: '1 av 4', up: true },
            { label: 'Mindre bolag med svårt att rekrytera', value: '50%', up: true },
            { label: 'Rekryteringar som misslyckas', value: '25%', up: true },
            { label: 'Företag drabbade negativt', value: '93%', up: true },
            { label: 'Expansioner som uteblir', value: '33%', up: true },
            { label: 'Nyexaminerade utan a-kassa', value: '7 av 8', up: true },
            { label: 'Bristande yrkeserfarenhet som hinder', value: '69%', up: true },
            { label: 'Kompetensbrist dubbelt mot för 10 år sedan', value: '2×', up: true },
          ].map((item, i) => (
            <span key={i} className="flex items-center gap-2 whitespace-nowrap">
              <span className={`font-bold ${item.up ? 'text-red-500' : 'text-emerald-500'}`}>
                {item.up ? '▼' : '▲'} {item.value}
              </span>
              <span>{item.label}</span>
              <span className="opacity-30">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Paradoxen ── */}
      <section id="problemet" className="py-24 px-6 relative overflow-hidden border-t border-border/60">
        <div className="absolute inset-0 bg-muted/25 -z-10" />
        <div className="absolute inset-0 dot-grid opacity-25 -z-10" />
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-4 border-red-500/30 text-red-500 bg-red-500/5">Kompetensparadoxen</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">En paradox som kostar Sverige miljarder</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Varför är tusentals akademiker arbetslösa medan företag desperat söker kompetens?
            </p>
          </div>

          {/* Animated ticker stats */}
          <ScrollReveal className="mb-12">
            <ParadoxStats />
          </ScrollReveal>

          {/* Two-column tension */}
          <div className="grid lg:grid-cols-2 gap-5 mb-10">
            <div className="panel border-red-500/25 bg-red-500/[0.03] p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-lg bg-red-500/12 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                </div>
                <h3 className="text-base font-bold text-red-600 dark:text-red-400">På jobbsökarsidan</h3>
              </div>
              <ul className="space-y-2.5">
                {[
                  'Var fjärde nyexaminerad akademiker tjänar under studiemedelsnivån 4 månader efter examen',
                  'Bara 1 av 8 nyexaminerade uppfyller inkomstkravet för a-kassa',
                  'Nyexaminerade hamnar i ett ekonomiskt mellanrum — utan studiemedel och utan a-kassa',
                  '"Ett enormt stort slöseri när studenter som investerat flera år i sina utbildningar inte lyckas komma i arbete" — Colin Andersson, Saco studentråd',
                  'Hög arbetslöshet bland akademiker trots att arbetsgivare skriker efter kompetens',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="panel border-amber-500/25 bg-amber-500/[0.03] p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-lg bg-amber-500/12 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="text-base font-bold text-amber-600 dark:text-amber-400">På arbetsgivarsidan</h3>
              </div>
              <ul className="space-y-2.5">
                {[
                  '58% av arbetsgivare upplevde problem vid sitt senaste rekryteringsförsök',
                  '60% anger bristande erfarenhet eller fel utbildning som rekryteringshinder',
                  '56% av beslutsfattare ser att regeringens politik bidragit lite eller inget till bättre matchning',
                  '67% av Unionens medlemmar har lågt förtroende för regeringens arbetsmarknadspolitik',
                  'Grundproblemet: matchning — de arbetslösas kompetens möter inte arbetsgivarnas krav',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Conclusion */}
          <div className="panel border-primary/25 bg-primary/[0.04] px-8 py-6 text-center max-w-2xl mx-auto">
            <p className="text-base font-medium leading-relaxed">
              <span className="gradient-text font-bold">Slutsats:</span>{' '}
              Det finns tillräckligt med kompetens i Sverige. Systemet för att matcha den är trasigt.
              {' '}<strong className="text-foreground">Rekryo löser det med AI.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ── Photo banner: humaniserar lösningen mellan problem och produkt ── */}
      <section className="relative overflow-hidden border-t border-border/60 min-h-[26rem] flex items-center px-6 py-20">
        <Image
          src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1920&auto=format&fit=crop"
          alt="Team på ett svenskt kontor som delar kompetens"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/35 dark:from-background dark:via-background/90 dark:to-background/45" />
        <div className="absolute inset-0 dot-grid opacity-10" />

        <div className="relative mx-auto max-w-5xl w-full">
          <ScrollReveal>
            <div className="max-w-lg">
              <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-background/60 backdrop-blur-sm">Rätt kompetens finns redan</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">
                Sverige har kompetensen. Vi ser till att den <span className="gradient-text">hittar rätt.</span>
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                Bakom varje ouppfylld tjänst finns en person med precis rätt bakgrund — som aldrig sågs.
                Rekryo kopplar samman dem med AI, inte gissningar.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 px-6 border-t border-border/60">
        <div className="mx-auto max-w-3xl">
          <ScrollReveal>
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">Hur det fungerar</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Tre steg till din nästa möjlighet</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-primary/60 via-primary/20 to-transparent hidden sm:block" />
            <div className="space-y-6">
              {steps.map((s, i) => (
                <div key={s.step} className="flex gap-6 items-start group relative">
                  <div className="flex-shrink-0 h-16 w-16 rounded-xl gradient-primary flex flex-col items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-105 group-hover:shadow-primary/40 transition-all duration-200 z-10">
                    <span className="text-white/60 text-[10px] font-bold leading-none">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-white font-bold text-sm leading-none mt-0.5">{s.title.split(' ')[0]}</span>
                  </div>
                  <div className="pt-3 flex-1">
                    <h3 className="text-lg font-semibold mb-1.5">{s.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </ScrollReveal>
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
