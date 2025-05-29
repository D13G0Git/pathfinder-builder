import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  
  try {
    // Crear un cliente de Supabase configurado para usar cookies
    const supabase = createMiddlewareClient({ req: request, res })

    // Para rutas de login, permitir acceso directo sin verificar sesión
    if (request.nextUrl.pathname === '/login') {
      console.log('🔒 [Middleware] Acceso a /login permitido')
      return res
    }

    // Verificar si el usuario está autenticado con mejor manejo de errores
    const {
      data: { session },
      error
    } = await supabase.auth.getSession()

    // Debug básico
    console.log('🔒 [Middleware] Ruta:', request.nextUrl.pathname)
    console.log('🔒 [Middleware] Sesión encontrada:', !!session)
    console.log('🔒 [Middleware] Usuario:', session?.user?.email || 'ninguno')

    // Manejo mejorado de errores de sesión
    if (error) {
      console.log('🔒 [Middleware] Error en getSession:', error.message)
      if (error.name === 'AuthSessionMissingError' || 
          error.message?.includes('session_not_found') ||
          error.message?.includes('Auth session missing')) {
        console.log('🔒 [Middleware] No hay sesión activa, continuando como usuario no autenticado')
      } else {
        console.warn('🔒 [Middleware] Error de autenticación no crítico:', error.message)
      }
    }

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

    console.log('🔒 [Middleware] Es ruta protegida:', isProtectedRoute)
    console.log('🔒 [Middleware] Usuario autenticado:', !!user)

    // Si es una ruta protegida y el usuario no está autenticado, redirigir al login
    if (isProtectedRoute && !user) {
      console.log('🔒 [Middleware] Redirigiendo a login: ruta protegida sin autenticación')
      const redirectUrl = new URL('/login', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Si el usuario está autenticado y está en la página de login, redirigir al dashboard
    if (user && request.nextUrl.pathname === '/login') {
      console.log('🔒 [Middleware] Redirigiendo a dashboard: usuario ya autenticado')
      
      // Verificar si hay parámetros que indiquen una redirección reciente para evitar loops
      const isRecentLogin = request.nextUrl.searchParams.get('recent') === 'true'
      if (!isRecentLogin) {
        const redirectUrl = new URL('/dashboard', request.url)
        return NextResponse.redirect(redirectUrl)
      }
    }

    // Si el usuario está autenticado y está en la página principal, redirigir al dashboard
    if (user && request.nextUrl.pathname === '/') {
      console.log('🔒 [Middleware] Redirigiendo a dashboard: usuario en página principal')
      const redirectUrl = new URL('/dashboard', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    return res
  } catch (error) {
    console.error('🔒 [Middleware] Error inesperado en middleware:', error)
    // En caso de error inesperado, permitir continuar para evitar bloquear la aplicación
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