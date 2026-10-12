import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  TrendingDown, AlertTriangle, MapPin, GraduationCap,
  Search, Eye, Brain, Target,
  ArrowRight, Users, Sparkles,
  Building2, TrendingUp, BookOpen, Network, CheckCircle
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Om oss – Rekryo',
  description: 'Hur Rekryo löser kompetensparadoxen på den svenska arbetsmarknaden med AI-driven jobbmatchning.',
}

const keyStats = [
  {
    value: '100 000+',
    label: 'arbetslösa akademiker i Sverige — högsta nivån på 20 år',
    source: 'Akademikernas a-kassa & Saco, 2025',
    color: 'from-orange-500 to-red-500',
    bg: 'from-orange-500/10 to-red-500/10',
    border: 'border-orange-500/20',
  },
  {
    value: '4,7%',
    label: 'akademikerarbetslöshet – högst på tio år, över pandeminivå',
    source: 'Akademikernas a-kassa, Arbetslöshetsrapporten 2025',
    color: 'from-red-500 to-rose-600',
    bg: 'from-red-500/10 to-rose-500/10',
    border: 'border-red-500/20',
  },
  {
    value: '61 000',
    label: 'personer saknas inom olika yrken enligt arbetsgivarna',
    source: 'SCB, Lediga jobb och rekryteringsbehov 2025',
    color: 'from-amber-500 to-orange-500',
    bg: 'from-amber-500/10 to-orange-500/10',
    border: 'border-amber-500/20',
  },
  {
    value: '93%',
    label: 'av företagen påverkas negativt av rekryteringssvårigheter',
    source: 'Svenskt Näringsliv, Rekryteringsenkäten 2025/2026',
    color: 'from-rose-500 to-pink-600',
    bg: 'from-rose-500/10 to-pink-500/10',
    border: 'border-rose-500/20',
  },
]

const deepStats = [
  { value: '27%', label: 'av alla inskrivna arbetslösa hos Arbetsförmedlingen är akademiker', source: 'Akademikernas a-kassa 2025' },
  { value: '57%', label: 'av arbetslösa akademiker bedöms ha svag konkurrensförmåga', source: 'Akademikernas a-kassa 2025' },
  { value: '18 700', label: 'arbetslösa akademiker i snitt per månad — 17% fler än rekordåret 2020', source: 'Akademikernas a-kassa 2025' },
  { value: '25%', label: 'av rekryteringsförsök misslyckas helt', source: 'Svenskt Näringsliv 2025/2026' },
  { value: '69%', label: 'av företag anger bristande yrkeserfarenhet som rekryteringshinder', source: 'Svenskt Näringsliv 2025/2026' },
  { value: '90,0%', label: 'sysselsättningsgrad bland akademiker — högre än totalbefolkningens 81,8%', source: 'Akademikernas a-kassa 2025' },
]

const causes = [
  {
    icon: MapPin,
    title: 'Geografisk obalans',
    description: 'Jobb koncentreras till storstäder medan kompetens finns i hela landet. Distansarbete har minskat gapet men inte eliminerat det – kulturella och strukturella hinder kvarstår.',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
  {
    icon: GraduationCap,
    title: 'Utbildningsmismatch',
    description: 'Högskolesystemet reagerar 4–7 år efter arbetsmarknadens signaler. Studenter utbildas för gårdagens jobb medan arbetsgivare söker morgondagens kompetenser.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Search,
    title: 'Nyckelordsbaserad rekrytering',
    description: 'ATS-system filtrerar ofta bort kvalificerade kandidater baserat på exakta titlar och nyckelord – inte faktisk förmåga. Rätt kandidater faller bort, felaktiga kallas in.',
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
  {
    icon: Eye,
    title: 'Informationsasymmetri',
    description: 'Kandidater vet inte vad arbetsgivare verkligen värdesätter. Rekryterare ser inte den fulla potentialen bakom standardiserade, stela CV-format.',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
  {
    icon: Network,
    title: 'Nätverksbias',
    description: 'Upp till 70% av tjänster tillsätts via nätverk och kontakter. Det stänger ute talangfulla kandidater utan rätt socialt kapital – oavsett kompetens.',
    source: 'LinkedIn, undersökning om nätverkets betydelse vid anställning',
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
  },
  {
    icon: BookOpen,
    title: 'Bristande kompetensdokumentation',
    description: 'Informella kompetenser, sidoprojekt och praktisk erfarenhet ryms inte i det traditionella CV:et. Enormt humankapital förblir osynligt för arbetsgivare.',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
]

const solution = [
  {
    step: '01',
    icon: Brain,
    title: 'Djup AI-analys av hela kandidatprofilen',
    description: 'Claude AI läser inte bara nyckelord – den förstår kontext, erfarenhetsmönster, transferabla kompetenser och potential. Hela profilen värderas, inte bara titlar.',
    color: 'from-violet-500 to-purple-600',
    accent: 'text-violet-500',
    accentBg: 'bg-violet-500/10',
  },
  {
    step: '02',
    icon: Target,
    title: 'Precisionsmatchning med förklaringar',
    description: 'Varje matchning ger ett poäng 0–100 med transparent motivering på svenska. Kandidaten och rekryteraren förstår exakt varför matchningen är stark eller svag.',
    color: 'from-blue-500 to-cyan-500',
    accent: 'text-blue-500',
    accentBg: 'bg-blue-500/10',
  },
  {
    step: '03',
    icon: TrendingUp,
    title: 'Kompetensgap-analys och karriärvägledning',
    description: 'Kandidaten ser exakt vilka kompetenser som saknas för drömjobbet och får konkreta förslag på hur dessa kan förvärvas – kurs, projekt eller erfarenhet.',
    color: 'from-emerald-500 to-teal-500',
    accent: 'text-emerald-500',
    accentBg: 'bg-emerald-500/10',
  },
  {
    step: '04',
    icon: Users,
    title: 'AI-rankad kandidatlista för rekryterare',
    description: 'Rekryteraren möter en rankad lista med AI-sammanfattningar, styrkor och kompetensgap per kandidat – inga manuella CV-högar, bara fokuserat beslutsunderlag.',
    color: 'from-rose-500 to-pink-500',
    accent: 'text-rose-500',
    accentBg: 'bg-rose-500/10',
  },
]

const values = [
  {
    icon: Brain,
    title: 'AI med transparens',
    description: 'Vi tror att AI-beslut måste vara förklaringsbara. Varje matchningspoäng kommer med motivering – inte en svart låda.',
  },
  {
    icon: Building2,
    title: 'Svensk arbetsmarknad',
    description: 'Plattformen är byggt för svenska förhållanden: språk, regelverk, arbetskultur och GDPR. Inga generiska globala lösningar.',
  },
  {
    icon: CheckCircle,
    title: 'Kompetens, inte kontakter',
    description: 'Vi demokratiserar rekryteringen. Din talang och dina kompetenser ska räknas – inte ditt nätverk eller din bakgrund.',
  },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative px-6 pt-24 pb-24 text-center overflow-hidden">
          <div className="absolute inset-0 -z-10 hero-mesh" />
          <div className="absolute inset-0 -z-20 dot-grid opacity-30" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-primary/6 blur-3xl -z-10 pointer-events-none" />

          <div className="mx-auto max-w-4xl">
            <Badge variant="secondary" className="mb-6 gap-1.5 px-4 py-1.5 text-xs font-medium border border-primary/20 bg-primary/5 text-primary animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Sparkles className="h-3 w-3" />
              Vårt uppdrag
            </Badge>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] animate-in fade-in slide-in-from-bottom-3 duration-700 delay-100">
              Vi löser{' '}
              <span className="gradient-text">kompetens&shy;paradoxen</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-3 duration-700 delay-200">
              Sverige har ett unikt strukturproblem: massarbetslöshet bland akademiker
              <em> samtidigt</em> som tusentals tjänster inte kan tillsättas.
              Det är inte ett kompetensproblem — det är ett <strong className="text-foreground">matchningsproblem</strong>.
              Rekryo löser det med AI.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center animate-in fade-in slide-in-from-bottom-3 duration-700 delay-300">
              <Button size="lg" asChild className="px-8 h-12 shadow-lg shadow-primary/30 glow-primary">
                <Link href="/register">Kom igång gratis <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="px-8 h-12">
                <Link href="#problemet">Läs om problemet</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Key stats strip ── */}
        <section id="problemet" className="py-20 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-muted/20 -z-10" />
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-14">
              <Badge variant="outline" className="mb-4 border-red-500/30 text-red-500 bg-red-500/5">Problemet i siffror</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold">En paradox som kostar Sverige miljarder</h2>
              <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
                Data från Svenskt Näringsliv, SCB, Saco och Akademikernas a-kassa målar en tydlig bild.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {keyStats.map((stat) => (
                <div
                  key={stat.value}
                  className={`relative rounded-2xl border ${stat.border} bg-gradient-to-br ${stat.bg} p-6 overflow-hidden group hover:scale-[1.02] transition-transform duration-200`}
                >
                  <div className={`absolute -top-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br ${stat.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
                  <p className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent leading-none mb-3`}>
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-foreground leading-snug mb-4">{stat.label}</p>
                  <p className="text-xs text-muted-foreground/70 font-medium border-t border-border/50 pt-3 mt-auto">{stat.source}</p>
                </div>
              ))}
            </div>

            {/* Deep stats row */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {deepStats.map((s) => (
                <div key={s.value} className="rounded-xl border border-border/50 bg-background p-4 text-center hover:border-border transition-colors">
                  <p className="text-xl font-bold gradient-text leading-none mb-1.5">{s.value}</p>
                  <p className="text-xs text-muted-foreground leading-snug">{s.label}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground/60 mt-4">
              Källor: Svenskt Näringsliv (Rekryteringsenkäten 2025/2026), SCB (Lediga jobb och rekryteringsbehov 2025), Saco och Akademikernas a-kassa (Arbetslöshetsrapporten 2025) — se källa per siffra ovan
            </p>
          </div>
        </section>

        {/* ── Paradox visualization ── */}
        <section className="py-20 px-6">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-14">
              <Badge variant="outline" className="mb-4 border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5">Paradoxen förklarad</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold">Hur kan det vara brist på kompetens när tusentals akademiker är arbetslösa?</h2>
            </div>

            {/* Two-column tension */}
            <div className="grid lg:grid-cols-2 gap-6 mb-14">
              <div className="rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/8 to-orange-500/8 p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-10 w-10 rounded-xl bg-red-500/15 flex items-center justify-center flex-shrink-0">
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  </div>
                  <h3 className="text-lg font-bold text-red-600 dark:text-red-400">På jobbsökarsidan</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    '100 000+ akademiker är arbetslösa — högsta nivån på 20 år',
                    '27% av alla inskrivna arbetslösa hos Arbetsförmedlingen är akademiker',
                    '57% av dem bedöms ha svag konkurrensförmåga på arbetsmarknaden',
                    'Traditionella CV:n fångar sällan hela kompetensbilden',
                    'ATS-system kan sortera bort rätt kandidater på nyckelord',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/8 to-yellow-500/8 p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-5 w-5 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-bold text-amber-600 dark:text-amber-400">På arbetsgivarsidan</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    '37% har tackat nej till affärer p.g.a. kompetensbrist',
                    '61 000 personer saknas inom olika yrken',
                    '25% av rekryteringsförsök misslyckas helt',
                    '69% anger bristande yrkeserfarenhet som hinder',
                    '93% påverkas negativt av rekryteringssvårigheter',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Arrow / conclusion */}
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
              <div className="rounded-2xl border border-border/60 bg-muted/30 px-8 py-6 max-w-2xl">
                <p className="text-base font-medium leading-relaxed">
                  <span className="gradient-text font-bold">Slutsats:</span>{' '}
                  Det finns tillräckligt med kompetens i Sverige. Systemet för att
                  hitta, matcha och validera den kompetensen är trasigt — inte kompetensen i sig.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Root causes ── */}
        <section className="py-20 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-muted/20 -z-10" />
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-14">
              <Badge variant="outline" className="mb-4 border-orange-500/30 text-orange-500 bg-orange-500/5">Grundorsakerna</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold">Varför uppstår matchningsproblemet?</h2>
              <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
                Sex strukturella hinder hindrar rätt kompetens från att möta rätt möjlighet.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {causes.map((cause) => (
                <div key={cause.title} className="rounded-2xl border border-border/50 bg-background p-6 group hover:border-border card-hover">
                  <div className={`h-11 w-11 rounded-xl ${cause.bg} flex items-center justify-center mb-4`}>
                    <cause.icon className={`h-5 w-5 ${cause.color}`} />
                  </div>
                  <h3 className="font-semibold text-base mb-2">{cause.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{cause.description}</p>
                  {'source' in cause && (
                    <p className="text-xs text-muted-foreground/70 font-medium border-t border-border/50 pt-3 mt-4">{cause.source}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Solution ── */}
        <section className="py-20 px-6">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-14">
              <Badge variant="outline" className="mb-4 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">Lösningen</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold">
                Hur Rekryo bryter paradoxen
              </h2>
              <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
                Istället för att matcha nyckelord mot nyckelord förstår Claude AI hela kandidatprofilen
                och jobbets verkliga krav — och förklarar varför.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {solution.map((s) => (
                <div key={s.step} className="relative rounded-2xl border border-border/50 bg-background p-7 overflow-hidden group hover:border-border/80 transition-colors">
                  {/* Background accent */}
                  <div className={`absolute top-0 right-0 h-32 w-32 rounded-full bg-gradient-to-br ${s.color} opacity-5 blur-2xl group-hover:opacity-10 transition-opacity`} />

                  <div className="flex items-start gap-4 mb-4">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <s.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <span className={`text-xs font-bold ${s.accent} uppercase tracking-widest`}>Steg {s.step}</span>
                      <h3 className="text-base font-semibold mt-0.5 leading-snug">{s.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>

            {/* Tech note */}
            <div className="mt-8 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-purple-500/5 p-6 flex gap-4 items-start">
              <div className="h-10 w-10 rounded-xl bg-violet-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Brain className="h-5 w-5 text-violet-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 mb-1">Drivet av Claude AI (Anthropic)</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Rekryo använder Anthropics Claude Sonnet — en av de mest kapabla AI-modellerna för textanalys och resonemang.
                  All analys sker server-side i Sverige, behandlas med GDPR-compliance och lagras aldrig av Anthropic för träning.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="py-20 px-6">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-14">
              <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5">Vad vi tror på</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold">Våra kärnvärden</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {values.map((v) => (
                <div key={v.title} className="text-center px-4">
                  <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-5 shadow-md shadow-primary/20">
                    <v.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-base mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 px-6">
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
                      Skapa konto gratis
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

      </main>
      <Footer />
    </div>
  )
}
