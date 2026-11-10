'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Loader2, Mail, Lock, Eye, EyeOff, Briefcase, ShieldCheck, LockKeyhole, Server, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const schema = z.object({
  email: z.string().email('Ange en giltig e-postadress'),
  password: z.string().min(6, 'Lösenord måste vara minst 6 tecken'),
})
type FormData = z.infer<typeof schema>

export function LoginForm({ verificationFailed = false }: { verificationFailed?: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password })

    if (error?.code === 'email_not_confirmed') {
      toast.error('E-postadressen är inte bekräftad', { description: 'Klicka på länken i mejlet vi skickade när du registrerade dig.' })
      setLoading(false)
      return
    }

    if (error) {
      toast.error('Inloggning misslyckades', { description: 'Fel e-post eller lösenord.' })
      setLoading(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-3 duration-700">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_64px_-24px_rgb(11_17_32/28%)] dark:shadow-[0_24px_64px_-20px_rgb(0_0_0/70%)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        <div className="p-6 sm:p-10">
          <div className="mb-8 flex items-center gap-4">
            <span className="gradient-primary flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl shadow-lg shadow-primary/30">
              <Briefcase className="h-6 w-6 text-white" />
            </span>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Välkommen tillbaka</h1>
              <p className="mt-1 text-sm text-muted-foreground">Logga in på ditt Rekryo-konto</p>
            </div>
          </div>

          {verificationFailed && (
            <p role="alert" className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Bekräftelselänken är ogiltig eller har gått ut. Registrera dig igen för att få en ny länk.
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">E-postadress</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="du@exempel.se"
                  className="h-12 pl-10 text-[15px] transition-shadow focus-visible:ring-2 focus-visible:ring-primary/30"
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Lösenord</Label>
                <Link href="/forgot-password" className="rounded text-xs font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                  Glömt lösenord?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="h-12 pl-10 pr-11 text-[15px] transition-shadow focus-visible:ring-2 focus-visible:ring-primary/30"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
                  aria-label={showPassword ? 'Dölj lösenord' : 'Visa lösenord'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full bg-[#6C5CE7] text-base font-semibold text-white shadow-lg shadow-[#6C5CE7]/30 transition-all hover:bg-[#5B4BD8] hover:shadow-xl hover:shadow-[#6C5CE7]/35"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Logga in
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          <ul className="mt-7 flex flex-wrap items-center justify-center gap-2" aria-label="Säkerhet">
            {[
              { icon: LockKeyhole, label: 'Krypterad' },
              { icon: ShieldCheck, label: 'GDPR-säkert' },
              { icon: Server, label: 'Lagras inom EU' },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                <Icon className="h-3 w-3 text-mint-foreground" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-border bg-muted/40 px-6 py-5 text-center text-sm text-muted-foreground sm:px-10">
          Inget konto?{' '}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Registrera dig gratis
          </Link>
        </div>
      </div>
    </div>
  )
}
