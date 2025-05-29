"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { User, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

// Crear un contexto para la autenticación
type AuthContextType = {
  user: User | null
  isLoading: boolean
  error: AuthError | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null
})

// Hook para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext)

// Proveedor de la autenticación
export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)

  useEffect(() => {
    console.log("🏠 [Provider] Inicializando proveedor de Supabase...")
    
    // Función para obtener la sesión actual con mejor manejo de errores
    const getInitialSession = async () => {
      try {
        setError(null)
        setIsLoading(true)
        
        // Intentar obtener la sesión actual
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          // Si es un error de sesión faltante, es normal en un reinicio
          if (sessionError.name === 'AuthSessionMissingError' || 
              sessionError.message?.includes('session_not_found') ||
              sessionError.message?.includes('Auth session missing')) {
            console.log("🏠 [Provider] No hay sesión activa - usuario no autenticado")
            setUser(null)
            setError(null)
          } else {
            console.error("🏠 [Provider] Error de sesión:", sessionError)
            setError(sessionError)
            setUser(null)
          }
        } else if (session?.user) {
          console.log("🏠 [Provider] Sesión inicial encontrada:", session.user.email)
          setUser(session.user)
          setError(null)
        } else {
          console.log("🏠 [Provider] No hay sesión activa")
          setUser(null)
          setError(null)
        }
      } catch (error: any) {
        console.error("🏠 [Provider] Error inesperado al obtener sesión:", error)
        // Solo establecer error si no es un error esperado de sesión faltante
        if (error.name !== 'AuthSessionMissingError' && 
            !error.message?.includes('session_not_found') &&
            !error.message?.includes('Auth session missing')) {
          setError(error)
        }
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🏠 [Provider] Cambio de estado de auth:", event)
        console.log("🏠 [Provider] Nueva sesión:", session ? `Usuario: ${session.user.email}` : "No existe")
        
        // Limpiar errores previos en cambios de estado
        setError(null)
        
        // Actualizar usuario solo si ha cambiado realmente
        const newUser = session?.user ?? null
        setUser(prevUser => {
          // Solo actualizar si el usuario realmente cambió
          if (prevUser?.id !== newUser?.id) {
            return newUser
          }
          return prevUser
        })
        
        // Asegurar que isLoading sea false después de cualquier cambio, pero solo si aún está en true
        setIsLoading(prevLoading => {
          if (prevLoading) {
            return false
          }
          return prevLoading
        })
        
        // Log para debugging
        if (event === 'SIGNED_IN' && newUser) {
          console.log("✅ [Provider] Usuario autenticado exitosamente:", newUser.email)
        } else if (event === 'SIGNED_OUT') {
          console.log("🚪 [Provider] Usuario cerró sesión")
        } else if (event === 'TOKEN_REFRESHED') {
          console.log("🔄 [Provider] Token renovado para:", newUser?.email)
        }
      }
    )

    return () => {
      console.log("🏠 [Provider] Limpiando suscripción...")
      subscription.unsubscribe()
    }
  }, []) // Remover supabase.auth de dependencias para evitar re-renders

  return (
    <AuthContext.Provider value={{ user, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  )
} 