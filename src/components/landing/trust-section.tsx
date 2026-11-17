import { ShieldCheck, UserCheck, ScrollText, EyeOff, Scale, Download } from 'lucide-react'
import { SectionHeader } from '@/components/landing/section-header'
import { ScrollReveal } from '@/components/scroll-reveal'
import { AuditLogMockup } from '@/components/landing/audit-log-mockup'

// Varje punkt motsvarar något som faktiskt finns i koden, inte en ambition:
// delpoäng och motivering (match_breakdown), loggad överstyrning (override-score),
// beslutsloggen (ai_decision_logs), namn utanför AI-prompten, frivillig fairness-
// uppföljning och export/radering av data (gdpr-routerna).
const pillars = [
  {
    icon: ScrollText,
    title: 'Förklarad bedömning',
    text: 'Varje poäng delas upp i kompetens, erfarenhet, utbildning och mjuka kompetenser, med en motivering till varje del.',
    tag: 'AI-förordningen · transparens',
  },
  {
    icon: UserCheck,
    title: 'Människan beslutar',
    text: 'AI:n föreslår en rangordning, men rekryteraren fattar beslutet. Ett ändrat poäng kräver en motivering och loggas.',
    tag: 'AI-förordningen art. 14',
  },
  {
    icon: ShieldCheck,
    title: 'Varje AI-beslut loggas',
    text: 'Matchningar, CV-analyser och överstyrningar sparas i en granskningslogg som inte går att ändra i efterhand.',
    tag: 'AI-förordningen art. 12',
  },
  {
    icon: EyeOff,
    title: 'Namn skickas inte till AI:n',
    text: 'Vid matchning får modellen kompetenser och erfarenhet, aldrig namnet, så att kön eller ursprung inte påverkar poängen.',
    tag: 'Biashantering',
  },
  {
    icon: Scale,
    title: 'Uppföljning av rättvisa',
    text: 'Rekryterare kan se om poängen skiljer sig systematiskt mellan grupper, baserat på frivilliga och anonymiserade uppgifter.',
    tag: 'Fairness',
  },
  {
    icon: Download,
    title: 'Din data, ditt val',
    text: 'Exportera allt vi har om dig, inklusive AI-besluten, eller radera kontot helt. Talangpoolen kräver ditt samtycke.',
    tag: 'GDPR art. 7, 15 och 17',
  },
]

export function TrustSection() {
  return (
    <section className="px-6 py-20 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Därför kan du lita på det"
          title="AI som du kan granska"
          description="AI i rekrytering räknas som högrisk enligt EU:s AI-förordning, och det med rätta. Därför har vi byggt in förklaringar, mänsklig kontroll och spårbarhet från första början."
        />

        <ScrollReveal className="mb-6">
          <AuditLogMockup />
        </ScrollReveal>

        {/* En luftig lista i stället för sex likadana kort */}
        <ul className="grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p, i) => (
            <li key={p.title} className="border-t border-border py-7">
              <ScrollReveal delay={(i % 3) * 60}>
                <h3 className="mb-2 flex items-center gap-2 text-base font-semibold">
                  <p.icon className="h-4 w-4 flex-shrink-0 text-mint-foreground" aria-hidden />
                  {p.title}
                </h3>
                <p className="text-sm leading-[1.7] text-muted-foreground">{p.text}</p>
                <p className="mt-3 text-xs text-muted-foreground/80">{p.tag}</p>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
