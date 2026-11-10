'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
  Briefcase, FileText, Bookmark, TrendingUp, ArrowRight,
  MapPin, Star, Sparkles
} from 'lucide-react'

import { RecommendedJobCard, type DashboardJob } from '@/components/dashboard/recommended-job-card'
import { ProfileStrengthCard, getProfileStrength } from '@/components/dashboard/profile-strength-card'
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

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  reviewed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  shortlisted: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  accepted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Hej, {profile.full_name?.split(' ')[0] ?? 'där'}!
        </h1>
        <p className="text-muted-foreground">Här är din jobbsökaröversikt.</p>
      </div>

      {/* Stats row — färgad ikon-chip i märkesfärgerna istället för en grå ikon
          i ett vitt kort, som annars är precis "generiskt admin-tema"-känslan. */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { icon: FileText, label: 'Ansökningar', value: applications.length, href: '/seeker/applications', tone: 'primary' as const },
          { icon: Star, label: 'Shortlistade', value: applications.filter(a => a.status === 'shortlisted').length, href: '/seeker/applications', tone: 'copper' as const },
          { icon: Bookmark, label: 'Sparade jobb', value: savedJobsCount, href: '/seeker/saved', tone: 'primary' as const },
          { icon: TrendingUp, label: 'Profilstyrka', value: `${profileStrength}%`, href: '/seeker/profile', tone: 'copper' as const },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="panel-hover hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`h-9 w-9 rounded-lg border flex items-center justify-center ${
                    stat.tone === 'primary' ? 'bg-primary/10 border-primary/20' : 'bg-accent border-accent-foreground/15'
                  }`}>
                    <stat.icon className={`h-4 w-4 ${stat.tone === 'primary' ? 'text-primary' : 'accent-mark'}`} />
                  </div>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <ProfileStrengthCard profile={profile} cvProfile={cvProfile} />

        {/* Application chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Ansökningsaktivitet</CardTitle>
            <CardDescription>Senaste 6 veckorna</CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
                Inga ansökningar ännu.{' '}
                <Link href="/seeker/jobs" className="text-primary ml-1 hover:underline">Bläddra bland jobb</Link>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={weekData}>
                  <defs>
                    <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="ansökningar" stroke="var(--chart-1)" fill="url(#colorApp)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Senaste ansökningar</CardTitle>
              <CardDescription>Dina {Math.min(5, applications.length)} senaste</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/seeker/applications">Se alla</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p>Inga ansökningar ännu</p>
                <Button size="sm" className="mt-3" asChild>
                  <Link href="/seeker/jobs">Hitta jobb</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.slice(0, 5).map((app) => (
                  <div key={app.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{app.job?.title ?? 'Okänt jobb'}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {app.job?.location ?? 'Plats ej angiven'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {app.match_score != null && (
                        <span className="text-xs font-medium text-primary">{app.match_score}%</span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[app.status]}`}>
                        {statusLabels[app.status]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skill gaps */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Vanligaste kompetensgap</CardTitle>
            <CardDescription>Kompetenser du ofta saknar i ansökningar</CardDescription>
          </CardHeader>
          <CardContent>
            {topGaps.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p>Inga gap identifierade ännu</p>
                <p className="text-xs mt-1">Sök på jobb för att se din matchning</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topGaps.map(([skill, count]) => (
                  <div key={skill} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{skill}</span>
                      <span className="text-muted-foreground text-xs">Saknas i {count} jobb</span>
                    </div>
                    <Progress value={Math.min((count / (topApplications.length || 1)) * 100, 100)} className="h-1.5" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Jobb för dig: matchade jobb först, sedan de senaste, så att listan aldrig är tom */}
      {(recommendedJobs.length > 0 || latestJobs.length > 0) && (
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
                  : cvProfile?.skills?.length
                    ? 'Inga jobb matchar dina kompetenser exakt ännu, här är de senaste'
                    : 'Ladda upp ditt CV så räknar vi ut hur väl du matchar varje jobb'}
              </p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/seeker/jobs">Alla jobb <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[...recommendedJobs, ...latestJobs].slice(0, 6).map(job => (
              <RecommendedJobCard key={job.id} job={job} seekerSkills={cvProfile?.skills ?? null} />
            ))}
          </div>
        </section>
      )}

      {/* Career coach CTA */}
      <Card className="border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/40">
        <CardContent className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25 flex-shrink-0">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-base">Din personliga AI-karriärcoach</p>
              <p className="text-muted-foreground text-sm">Få råd om CV, jobbtips och intervjuförberedelse — anpassat efter din profil.</p>
            </div>
          </div>
          <Button asChild className="flex-shrink-0">
            <Link href="/seeker/coach">
              Chatta med coachen <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Browse jobs CTA */}
      <Card className="gradient-primary text-white">
        <CardContent className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-lg">Redo att hitta nästa jobb?</p>
            <p className="text-white/80 text-sm">AI matchar dig mot hundratals jobb i realtid.</p>
          </div>
          <Button variant="secondary" asChild>
            <Link href="/seeker/jobs">
              Bläddra bland jobb <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
