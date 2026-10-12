'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Loader2, Mail, Lock, Eye, EyeOff, Briefcase, ShieldCheck } from 'lucide-react'
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

export function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    const supabase = createClient()
    let { error } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password })

    if (error?.message?.toLowerCase().includes('email not confirmed')) {
      await fetch('/api/auth/confirm-email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      })
      const retry = await supabase.auth.signInWithPassword({ email: data.email, password: data.password })
      error = retry.error
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
    <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-3 duration-700">
      {/* Logo + header */}
      <div className="flex flex-col items-center mb-8 gap-3">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-lg shadow-primary/30">
          <div className="absolute inset-0 rounded-2xl gradient-primary blur-lg opacity-50 -z-10" />
          <Briefcase className="h-7 w-7 text-white" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Välkommen tillbaka</h1>
          <p className="text-sm text-muted-foreground mt-1">Logga in på ditt Rekryo-konto</p>
        </div>
      </div>

      {/* Card */}
      <div className="relative rounded-2xl border border-border bg-card shadow-xl shadow-black/5 p-8 space-y-5 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/8 blur-3xl pointer-events-none" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative">
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email">E-postadress</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="email"
                type="email"
                placeholder="du@exempel.se"
                className="h-11 pl-9 transition-shadow focus-visible:ring-2 focus-visible:ring-primary/30"
                {...register('email')}
              />
            </div>
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Lösenord</Label>
              <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                Glömt lösenord?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="h-11 pl-9 pr-10 transition-shadow focus-visible:ring-2 focus-visible:ring-primary/30"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
            className="w-full h-11 gradient-primary text-white font-semibold shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40 transition-shadow"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Logga in
          </Button>
        </form>

        <div className="relative flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-1">
          <ShieldCheck className="h-3 w-3 text-emerald-500" />
          Krypterad inloggning · GDPR-säkert
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Inget konto?{' '}
        <Link href="/register" className="text-primary font-semibold hover:underline">
          Registrera dig gratis
        </Link>
      </p>
    </div>
  )
}
