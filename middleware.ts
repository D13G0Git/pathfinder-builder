import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  
  try {
    // Crear un cliente de Supabase configurado para usar cookies
    const supabase = createMiddlewareClient({ req: request, res })

    // Verificar si el usuario está autenticado
    const {
      data: { session },
      error
    } = await supabase.auth.getSession()

    const user = session?.user

    // Rutas que requieren autenticación
    const protectedRoutes = ['/dashboard', '/characters', '/character-create', '/game', '/settings', '/adventures']
    
    // Rutas públicas que no requieren autenticación
    const publicRoutes = ['/', '/login', '/auth/callback']
    
    // Verificar si la ruta actual está protegida
    const isProtectedRoute = protectedRoutes.some(route => 
      request.nextUrl.pathname.startsWith(route)
    )

    // Verificar si es una ruta pública (excluyendo las protegidas)
    const isPublicRoute = publicRoutes.some(route => 
      request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route)
    ) && !isProtectedRoute

    // Si es una ruta protegida y el usuario no está autenticado, redirigir al login
    if (isProtectedRoute && !user) {
      const redirectUrl = new URL('/login', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Si el usuario está autenticado y está en la página de login, redirigir al dashboard
    if (user && request.nextUrl.pathname === '/login') {
      const redirectUrl = new URL('/dashboard', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Si el usuario está autenticado y está en la página principal, redirigir al dashboard
    if (user && request.nextUrl.pathname === '/') {
      const redirectUrl = new URL('/dashboard', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    return res
  } catch (error) {
    console.error('Error en middleware:', error)
    return res
  }
}

export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas de petición excepto las que empiecen con:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico (favicon)
     * - api (rutas de API)
     * - imágenes estáticas
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg).*)',
  ],
} 