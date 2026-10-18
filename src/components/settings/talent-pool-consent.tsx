'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Users } from 'lucide-react'
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
      <label className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/40 transition-colors has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 shrink-0 accent-primary cursor-pointer disabled:cursor-not-allowed"
          checked={checked}
          disabled={disabled}
          onChange={e => onChange(e.target.checked)}
        />
        <span className="text-sm">
          <span className="font-medium">Jag godkänner att synas i talangpoolen för rekryterare</span>
          <span className="block text-xs text-muted-foreground mt-0.5">
            Frivilligt. Du kan ändra dig när som helst under Inställningar → Integritet & GDPR.
          </span>
        </span>
      </label>
      <div className="rounded-lg bg-muted/50 border p-3 text-xs text-muted-foreground space-y-1.5">
        <p className="font-medium text-foreground">Vad innebär det?</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>Inloggade rekryterare kan hitta dig även om du inte sökt deras jobb</li>
          <li>De ser namn, rubrik, ort, bio, webbplats, kompetenser, erfarenhet, utbildning och språk</li>
          <li>De ser också en <strong>AI-genererad</strong> sammanfattning av ditt CV och hur väl dina kompetenser överlappar deras jobb</li>
          <li>Rekryterare kan kontakta dig med ett meddelande som kan vara AI-genererat</li>
          <li>Själva CV-filen och dina kontaktuppgifter visas aldrig</li>
          <li>Säger du nej syns du bara för rekryterare vars jobb du själv söker</li>
        </ul>
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
