'use client'

import { useState } from 'react'
import { StepBasicInfo } from './step-basic-info'
import { StepRoleDetails } from './step-role-details'
import { StepAvatar } from './step-avatar'
import { Check, UserRound, Sparkles, Building2, Camera } from 'lucide-react'
import type { Profile } from '@/types/database'

interface Props { profile: Profile }

export function OnboardingWizard({ profile }: Props) {
  const [step, setStep] = useState(1)
  const totalSteps = 3
  const isRecruiter = profile.user_type === 'recruiter'

  function next() {
    if (step < totalSteps) setStep(step + 1)
    else window.location.href = '/dashboard'
  }
  function back() {
    if (step > 1) setStep(step - 1)
  }

  const steps = [
    { label: 'Om dig', icon: UserRound },
    { label: isRecruiter ? 'Företag' : 'Kompetenser', icon: isRecruiter ? Building2 : Sparkles },
    { label: 'Profilbild', icon: Camera },
  ]

  return (
    <div className="w-full">
      {/* Stegindikator: ikon per steg och en förloppsrad */}
      <nav aria-label="Steg i kom igång" className="mb-8">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="font-medium">Steg {step} av {totalSteps}</span>
          <span className="text-muted-foreground">{steps[step - 1].label}</span>
        </div>
        <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden>
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-mint transition-[width] duration-500"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
        <ol className="grid grid-cols-3 gap-2">
          {steps.map((s, i) => {
            const num = i + 1
            const done = num < step
            const active = num === step
            return (
              <li
                key={s.label}
                aria-current={active ? 'step' : undefined}
                className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                  active ? 'border-primary/50 bg-primary/[0.06]' : 'border-border'
                }`}
              >
                <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${
                  done ? 'bg-mint/15 text-mint-foreground' : active ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
                }`}>
                  {done ? <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden /> : <s.icon className="h-4 w-4" aria-hidden />}
                </span>
                <span className={`hidden truncate font-medium sm:inline ${active ? 'text-foreground' : 'text-muted-foreground'}`}>{s.label}</span>
                <span className="sr-only">{done ? '(klart)' : active ? '(pågår)' : ''}</span>
              </li>
            )
          })}
        </ol>
      </nav>

      <div key={step} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {step === 1 && <StepBasicInfo profile={profile} onNext={next} />}
        {step === 2 && <StepRoleDetails profile={profile} onNext={next} onBack={back} />}
        {step === 3 && <StepAvatar profile={profile} onNext={next} onBack={back} />}
      </div>
    </div>
  )
}
