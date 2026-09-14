import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) return supabaseResponse

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Varje skyddad sida gör redan sin egen `if (!user) redirect('/login')`-koll
  // server-side (verifierat för samtliga), så middlewaren ska inte blockera
  // anonyma besökare via en allowlist. Det gjorde tidigare två saker fel:
  // dels bouncade okända URL:er till /login istället för att visa en riktig
  // 404-sida, dels blockerade det avsiktligt publika dynamiska sidor
  // (enskilda jobbannonser, företagsprofiler) som ska fungera utan konto.
  if (!user) return supabaseResponse

  // Inloggad på login/register — skicka vidare till dashboard.
  if (['/login', '/register'].includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('user_type, onboarding_complete')
    .eq('id', user.id)
    .single()

  // Statiska marknadssidor ska gå att besöka även om onboarding inte är klar.
  const staticMarketingPages = ['/', '/about', '/pricing', '/privacy', '/terms', '/cookies']
  const isStaticMarketingPage = staticMarketingPages.includes(pathname)

  if (profile && !profile.onboarding_complete && pathname !== '/onboarding' && !isStaticMarketingPage) {
    return NextResponse.redirect(new URL('/onboarding', request.url))
  }

  if (pathname.startsWith('/recruiter') && profile?.user_type !== 'recruiter') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (pathname.startsWith('/seeker') && profile?.user_type !== 'job_seeker') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}
