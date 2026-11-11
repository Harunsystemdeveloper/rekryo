'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogDescription
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Loader2, Download, Trash2, Shield, FileJson, AlertTriangle, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DemographicsConsentCard } from '@/components/settings/demographics-consent-card'
import { TalentPoolConsentCard } from '@/components/settings/talent-pool-consent'

export function PrivacySettingsClient() {
  const router = useRouter()
  const [exporting, setExporting] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleting, setDeleting] = useState(false)

  async function exportData() {
    setExporting(true)
    try {
      const res = await fetch('/api/gdpr/export')
      if (!res.ok) { toast.error('Export misslyckades'); return }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'rekryo-min-data.json'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Din data har laddats ner!')
    } catch {
      toast.error('Något gick fel')
    } finally {
      setExporting(false)
    }
  }

  async function deleteAccount() {
    if (deleteConfirm !== 'RADERA') return
    setDeleting(true)
    const res = await fetch('/api/gdpr/delete', { method: 'POST' })
    const data = await res.json()
    if (!res.ok) { toast.error(data.error); setDeleting(false); return }
    toast.success('Ditt konto har raderats')
    router.push('/')
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight">
          <Shield className="h-6 w-6 text-primary" aria-hidden />
          Integritet och GDPR
        </h1>
        <p className="mt-1.5 text-muted-foreground">
          Du bestämmer över din data. Här ser du dina rättigheter och kan använda dem direkt.
        </p>
        <nav aria-label="Avsnitt på sidan" className="mt-5 flex flex-wrap gap-2">
          {[
            { href: '#rights-heading', label: 'Rättigheter' },
            { href: '#talangpool', label: 'Talangpoolen' },
            { href: '#rattvisa', label: 'Rättvis rekrytering' },
            { href: '#export', label: 'Exportera' },
            { href: '#radera', label: 'Radera konto' },
          ].map(l => (
            <a key={l.href} href={l.href} className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary">
              {l.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Dina rättigheter: varje rättighet med status och en genväg till funktionen */}
      <section aria-labelledby="rights-heading">
        <h2 id="rights-heading" className="mb-4 flex scroll-mt-24 items-center gap-2 text-lg font-semibold">
          <Eye className="h-4 w-4 text-primary" aria-hidden />
          Dina rättigheter
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { right: 'Rätt till tillgång', article: 'Art. 15', desc: 'Få en kopia av all data vi lagrar om dig.', href: '#export', action: 'Exportera' },
            { right: 'Rätt till rättelse', article: 'Art. 16', desc: 'Ändra din profil och CV-data när som helst.', href: '/settings', action: 'Inställningar' },
            { right: 'Rätt till radering', article: 'Art. 17', desc: 'Radera ditt konto och all data som hör till det.', href: '#radera', action: 'Radera konto' },
            { right: 'Rätt till portabilitet', article: 'Art. 20', desc: 'Ladda ner din data i ett maskinläsbart format (JSON).', href: '#export', action: 'Ladda ner' },
          ].map(item => (
            <div key={item.right} className="panel flex flex-col p-5">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="rounded-full bg-mint/15 px-2.5 py-0.5 text-xs font-medium text-mint-foreground">Tillgänglig</span>
                <span className="text-xs text-muted-foreground">GDPR {item.article}</span>
              </div>
              <h3 className="text-sm font-semibold">{item.right}</h3>
              <p className="mb-3 mt-1 flex-1 text-sm text-muted-foreground">{item.desc}</p>
              <a href={item.href} className="w-fit rounded text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                {item.action} →
              </a>
            </div>
          ))}
        </div>
      </section>

      <div id="talangpool" className="scroll-mt-24">
        <TalentPoolConsentCard />
      </div>

      <div id="rattvisa" className="scroll-mt-24">
        <DemographicsConsentCard />
      </div>

      {/* Exportera data */}
      <Card id="export" className="scroll-mt-24">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileJson className="h-4 w-4 text-primary" />
            Exportera min data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Ladda ner en fullständig kopia av all data vi lagrar om dig: profil, CV, ansökningar, meddelanden och mer.
            Filen levereras i JSON-format.
          </p>
          <div className="rounded-lg bg-muted/50 border p-3 text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Inkluderar:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Profilinformation (namn, bio, plats)</li>
              <li>CV-data och AI-analys</li>
              <li>Alla ansökningar och status</li>
              <li>Sparade jobb</li>
              <li>Dina konversationer och de meddelanden du skickat</li>
              <li>Alla AI-beslut som berört dig, till exempel matchningspoäng och CV-analyser</li>
              <li>Frivilliga uppgifter för rättvis rekrytering, om du lämnat sådana</li>
              <li>Företagsprofil (för rekryterare)</li>
            </ul>
          </div>
          <Button onClick={exportData} disabled={exporting} variant="outline">
            {exporting
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Exporterar...</>
              : <><Download className="mr-2 h-4 w-4" />Ladda ner min data</>
            }
          </Button>
        </CardContent>
      </Card>

      {/* Radera konto */}
      <Card id="radera" className="scroll-mt-24 border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-destructive">
            <Trash2 className="h-4 w-4" />
            Radera konto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg bg-destructive/5 border border-destructive/20 p-3">
            <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
            <p className="text-sm text-destructive">
              <strong>Varning:</strong> Detta är en permanent åtgärd. All din data raderas omedelbart och kan inte återställas.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Att radera ditt konto innebär att din profil, CV, alla ansökningar, meddelanden och övrig data
            permanent tas bort från våra servrar.
          </p>
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Radera mitt konto
          </Button>
        </CardContent>
      </Card>

      {/* Bekräftelsedialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Bekräfta kontoborttagning
            </DialogTitle>
            <DialogDescription>
              Det här kan inte ångras. All din data raderas permanent.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm">
              Skriv <strong>RADERA</strong> för att bekräfta att du vill ta bort ditt konto:
            </p>
            <Input
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
              placeholder="RADERA"
              className="font-mono"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Avbryt</Button>
            <Button
              variant="destructive"
              onClick={deleteAccount}
              disabled={deleteConfirm !== 'RADERA' || deleting}
            >
              {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Radera permanent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
