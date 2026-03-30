import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code  = searchParams.get('code')
  const error = searchParams.get('error')

  // OAuth provider sent back an error — just return home
  if (error) {
    return NextResponse.redirect(origin)
  }

  if (code) {
    // Build the redirect response first so we can write cookies onto it
    const response = NextResponse.redirect(origin)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL    ?? '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
      {
        cookies: {
          // Read PKCE verifier from the incoming request cookies
          getAll() { return request.cookies.getAll() },
          // Write the new session cookies directly onto the response
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      },
    )

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (!exchangeError) return response
  }

  return NextResponse.redirect(origin)
}
