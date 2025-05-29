import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const error = requestUrl.searchParams.get('error')

    if (error) {
      return NextResponse.redirect(new URL('/login?error=' + encodeURIComponent(error), request.url))
    }

    if (code) {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
      
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        return NextResponse.redirect(new URL('/login?error=callback_error', request.url))
      }
    } else {
      // No code or error - invalid callback
      return NextResponse.redirect(new URL('/login?error=invalid_callback', request.url))
    }

    // Redirigir al dashboard después de la autenticación exitosa
    return NextResponse.redirect(new URL('/dashboard', request.url))
    
  } catch (error) {
    console.error('Error en auth callback:', error)
    return NextResponse.redirect(new URL('/login?error=callback_error', request.url))
  }
} 