'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Users, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

// Delas mellan onboarding och integritetsinställningarna så att jobbsökaren alltid får
// exakt samma information innan samtycket ges (GDPR art. 7 + AI-förordningen art. 50).
export function TalentPoolConsentCheckbox({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}) {
  return (
    <div className="space-y-3">
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-muted/40 has-[:checked]:border-primary/50 has-[:checked]:bg-primary/[0.05] has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary disabled:cursor-not-allowed"
          checked={checked}
          disabled={disabled}
          onChange={e => onChange(e.target.checked)}
        />
        <span className="flex-1 text-sm">
          <span className="flex flex-wrap items-center gap-2 font-medium">
            Jag godkänner att synas i talangpoolen för rekryterare
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">Frivilligt · av som standard</span>
          </span>
          <span className="mt-1 block text-xs text-muted-foreground">
            Du kan ändra dig när som helst under Inställningar → Integritet & GDPR.
          </span>
        </span>
      </label>

      <div className="grid gap-3 rounded-xl border border-border bg-muted/30 p-4 text-xs sm:grid-cols-2">
        <div>
          <p className="mb-2 flex items-center gap-1.5 font-medium text-foreground">
            <Eye className="h-3.5 w-3.5 text-primary" aria-hidden />
            Det här ser rekryterare
          </p>
          <ul className="space-y-1.5 text-muted-foreground">
            <li>Inloggade rekryterare kan hitta dig även om du inte sökt deras jobb</li>
            <li>Namn, rubrik, ort, bio, webbplats, kompetenser, erfarenhet, utbildning och språk</li>
            <li>En <strong className="font-medium text-foreground">AI-genererad</strong> sammanfattning av ditt CV och hur väl dina kompetenser överlappar deras jobb</li>
            <li>Rekryterare kan kontakta dig med ett meddelande som kan vara AI-genererat</li>
          </ul>
        </div>
        <div>
          <p className="mb-2 flex items-center gap-1.5 font-medium text-foreground">
            <EyeOff className="h-3.5 w-3.5 text-mint-foreground" aria-hidden />
            Det här visas aldrig
          </p>
          <ul className="space-y-1.5 text-muted-foreground">
            <li>Själva CV-filen</li>
            <li>Dina kontaktuppgifter</li>
          </ul>
          <p className="mt-3 text-muted-foreground">
            Säger du nej syns du bara för rekryterare vars jobb du själv söker.
          </p>
        </div>
      </div>
    </div>
  )
}

export function TalentPoolConsentCard() {
  const [userType, setUserType] = useState<'job_seeker' | 'recruiter' | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [visible, setVisible] = useState(false)
  const [consentAt, setConsentAt] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const { data: profile } = await supabase.from('profiles').select('user_type').eq('id', user.id).single()
      setUserType(profile?.user_type ?? null)

      if (profile?.user_type === 'job_seeker') {
        const res = await fetch('/api/talent-pool/visibility')
        if (res.ok) {
          const data = await res.json()
          setVisible(data.visible)
          setConsentAt(data.consent_at)
        }
      }
      setLoading(false)
    }
    load()
  }, [])

  async function update(next: boolean) {
    setSaving(true)
    const res = await fetch('/api/talent-pool/visibility', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visible: next }),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) { toast.error('Kunde inte spara ditt val'); return }
    setVisible(data.visible)
    setConsentAt(data.consent_at)
    toast.success(next ? 'Du syns nu i talangpoolen' : 'Du är inte längre synlig i talangpoolen')
  }

  if (loading || userType !== 'job_seeker') return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Synlighet i talangpoolen
          {saving && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <TalentPoolConsentCheckbox checked={visible} onChange={update} disabled={saving} />
        {visible && consentAt && (
          <p className="text-xs text-muted-foreground">
            Samtycke lämnat {new Date(consentAt).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
