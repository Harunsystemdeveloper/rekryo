'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
  FileText, Bookmark, TrendingUp, ArrowRight,
  MapPin, Star, Sparkles
} from 'lucide-react'

import { RecommendedJobCard, type DashboardJob } from '@/components/dashboard/recommended-job-card'
import { ProfileStrengthCard, getProfileStrength } from '@/components/dashboard/profile-strength-card'
import { EmptyActivityIllustration, EmptyApplicationsIllustration, EmptyGapsIllustration } from '@/components/illustrations/empty-states'
import type { Profile, CvProfile, Application } from '@/types/database'

interface JobRelation {
  title: string
  location: string | null
  company_profiles?: { company_name: string }[] | { company_name: string } | null
}


interface Props {
  profile: Profile
  cvProfile: CvProfile | null
  applications: (Application & { job?: JobRelation | null })[]
  savedJobsCount: number
  recommendedJobs?: DashboardJob[]
  latestJobs?: DashboardJob[]
}

// Statusfärger från designsystemet i stället för fem olika Tailwind-paletter
const statusColors: Record<string, string> = {
  pending: 'bg-muted text-muted-foreground',
  reviewed: 'bg-primary/10 text-primary',
  shortlisted: 'bg-mint/15 text-mint-foreground',
  accepted: 'bg-mint/20 text-mint-foreground font-semibold',
  rejected: 'bg-destructive/10 text-destructive',
}

const statusLabels: Record<string, string> = {
  pending: 'Väntar', reviewed: 'Granskad', shortlisted: 'Shortlistad',
  accepted: 'Accepterad', rejected: 'Avvisad',
}

export function SeekerDashboard({ profile, cvProfile, applications, savedJobsCount, recommendedJobs = [], latestJobs = [] }: Props) {
  const profileStrength = getProfileStrength(profile, cvProfile)

  // Build chart data from applications per week
  const weekData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (5 - i) * 7)
    const week = d.toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' })
    const count = applications.filter(a => {
      const ad = new Date(a.created_at)
      const diff = (new Date().getTime() - ad.getTime()) / (1000 * 60 * 60 * 24 * 7)
      return diff >= (5 - i) && diff < (6 - i)
    }).length
    return { week, ansökningar: count }
  })

  const topApplications = applications
    .filter(a => a.match_score != null)
    .sort((a, b) => (b.match_score ?? 0) - (a.match_score ?? 0))
    .slice(0, 5)

  const missingSkills = applications
    .flatMap(a => a.skill_gaps ?? [])
    .reduce<Record<string, number>>((acc, skill) => {
      acc[skill] = (acc[skill] ?? 0) + 1
      return acc
    }, {})

  const topGaps = Object.entries(missingSkills)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  const firstName = profile.full_name?.split(' ')[0] ?? 'där'
  const hasCv = !!cvProfile?.skills?.length
  const jobsForYou = [...recommendedJobs, ...latestJobs].slice(0, 6)

  return (
    <div className="space-y-8">
      {/* Rubrik med en tydlig nästa åtgärd */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Hej, {firstName}!</h1>
          <p className="mt-1.5 text-muted-foreground">
            {hasCv ? 'Här är läget i din jobbsökning.' : 'Ladda upp ditt CV så ser du hur väl du matchar varje jobb.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/seeker/coach"><Sparkles className="mr-2 h-4 w-4" />AI-karriärcoach</Link>
          </Button>
          <Button asChild>
            <Link href={hasCv ? '/seeker/jobs' : '/seeker/profile'}>
              {hasCv ? 'Hitta jobb' : 'Ladda upp CV'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Nyckeltal */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: FileText, label: 'Ansökningar', value: applications.length, href: '/seeker/applications', tone: 'primary' as const },
          { icon: Star, label: 'Shortlistade', value: applications.filter(a => a.status === 'shortlisted').length, href: '/seeker/applications', tone: 'mint' as const },
          { icon: Bookmark, label: 'Sparade jobb', value: savedJobsCount, href: '/seeker/saved', tone: 'primary' as const },
          { icon: TrendingUp, label: 'Profilstyrka', value: `${profileStrength}%`, href: '/seeker/profile', tone: 'mint' as const },
        ].map(stat => (
          <Link
            key={stat.label}
            href={stat.href}
            className="panel panel-hover flex items-center gap-4 p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${stat.tone === 'primary' ? 'bg-primary/10 text-primary' : 'bg-mint/10 text-mint-foreground'}`}>
              <stat.icon className="h-5 w-5" aria-hidden />
            </span>
            <span>
              <span className="block text-2xl font-semibold leading-none tabular-nums">{stat.value}</span>
              <span className="mt-1 block text-sm text-muted-foreground">{stat.label}</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Huvudyta */}
        <div className="space-y-6 lg:col-span-2">
          {jobsForYou.length > 0 && (
            <section aria-labelledby="jobs-for-you">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <h2 id="jobs-for-you" className="flex items-center gap-2 text-lg font-semibold">
                    <Sparkles className="h-4 w-4 text-primary" aria-hidden />
                    {recommendedJobs.length > 0 ? 'Rekommenderade för dig' : 'Nya jobb att utforska'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {recommendedJobs.length > 0
                      ? 'Sorterade efter hur många av jobbets kompetenser du redan har'
                      : hasCv
                        ? 'Inga jobb matchar dina kompetenser exakt ännu, här är de senaste'
                        : 'Ladda upp ditt CV så räknar vi ut hur väl du matchar varje jobb'}
                  </p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/seeker/jobs">Alla jobb <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {jobsForYou.map(job => (
                  <RecommendedJobCard key={job.id} job={job} seekerSkills={cvProfile?.skills ?? null} />
                ))}
              </div>
            </section>
          )}

          <div className="panel p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold">Senaste ansökningar</h2>
                <p className="text-sm text-muted-foreground">Status och matchning för det du sökt</p>
              </div>
              {applications.length > 0 && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/seeker/applications">Se alla</Link>
                </Button>
              )}
            </div>
            {applications.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <EmptyApplicationsIllustration className="h-20 w-auto" />
                <div>
                  <p className="font-medium">Din första ansökan väntar</p>
                  <p className="mt-1 text-sm text-muted-foreground">Hitta ett jobb du gillar, så ser du status och matchning här.</p>
                </div>
                <Button size="sm" asChild>
                  <Link href="/seeker/jobs">Hitta jobb <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
                </Button>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {applications.slice(0, 5).map(app => (
                  <li key={app.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{app.job?.title ?? 'Okänt jobb'}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" aria-hidden />
                        {app.job?.location ?? 'Plats ej angiven'}
                      </p>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-3">
                      {app.match_score != null && (
                        <span className="text-sm font-semibold tabular-nums">{app.match_score}<span className="text-xs font-normal text-muted-foreground">/100</span></span>
                      )}
                      <span className={`rounded-full px-2.5 py-0.5 text-xs ${statusColors[app.status]}`}>
                        {statusLabels[app.status]}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="panel p-6">
            <div className="mb-4">
              <h2 className="text-base font-semibold">Ansökningsaktivitet</h2>
              <p className="text-sm text-muted-foreground">Ansökningar per vecka, senaste 6 veckorna</p>
            </div>
            {applications.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <EmptyActivityIllustration className="h-20 w-auto" />
                <p className="max-w-xs text-sm text-muted-foreground">
                  Här ser du hur många jobb du söker per vecka. Sök ditt första jobb så börjar kurvan växa.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={weekData} margin={{ left: -20, right: 8 }}>
                  <defs>
                    <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} allowDecimals={false} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: 'var(--popover)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--foreground)' }}
                    labelStyle={{ color: 'var(--muted-foreground)' }}
                  />
                  <Area type="monotone" dataKey="ansökningar" stroke="var(--chart-1)" fill="url(#colorApp)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Sidokolumn */}
        <div className="space-y-6">
          <ProfileStrengthCard profile={profile} cvProfile={cvProfile} />

          <div className="panel p-6">
            <div className="mb-4">
              <h2 className="text-base font-semibold">Vanligaste kompetensgap</h2>
              <p className="text-sm text-muted-foreground">Det som oftast saknas i dina ansökningar</p>
            </div>
            {topGaps.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <EmptyGapsIllustration className="h-20 w-auto" />
                <div>
                  <p className="font-medium">Se vad som skiljer dig från drömjobbet</p>
                  <p className="mt-1 text-sm text-muted-foreground">När du söker jobb visar vi vilka kompetenser som oftast saknas, så vet du vad som lönar sig att lära dig.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                {topGaps.map(([skill, count]) => (
                  <div key={skill}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span>{skill}</span>
                      <span className="text-xs text-muted-foreground">Saknas i {count} jobb</span>
                    </div>
                    <Progress value={Math.min((count / (topApplications.length || 1)) * 100, 100)} className="h-1.5" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="panel gradient-subtle p-6">
            <span className="gradient-primary mb-4 flex h-11 w-11 items-center justify-center rounded-xl shadow-lg shadow-primary/25">
              <Sparkles className="h-5 w-5 text-white" aria-hidden />
            </span>
            <h2 className="text-base font-semibold">Din AI-karriärcoach</h2>
            <p className="mt-1 mb-5 text-sm text-muted-foreground">Få råd om CV, jobb och intervjuer, anpassat efter din profil.</p>
            <Button variant="outline" asChild className="w-full">
              <Link href="/seeker/coach">Chatta med coachen <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
