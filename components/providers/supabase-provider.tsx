"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Crear un contexto para la autenticación
type AuthContextType = {
  user: any | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
})

// Hook para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext)

// Proveedor de la autenticación
export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Usar el cliente correcto de Supabase
  const supabase = createClientComponentClient()

  useEffect(() => {
    console.log("🏠 [Provider] Inicializando proveedor de Supabase...")
    
    // Obtener el usuario actual
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        console.log("🏠 [Provider] Usuario inicial:", user ? user.email : "No autenticado")
        setUser(user)
        setIsLoading(false)
      } catch (error) {
        console.error("🏠 [Provider] Error al obtener usuario:", error)
        setIsLoading(false)
      }
    }

    getUser()

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("🏠 [Provider] Cambio de estado de auth:", event)
        console.log("🏠 [Provider] Nueva sesión:", session ? "Existe" : "No existe")
        setUser(session?.user ?? null)
        setIsLoading(false)
      }
    )

    return () => {
      console.log("🏠 [Provider] Limpiando suscripción...")
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
} 