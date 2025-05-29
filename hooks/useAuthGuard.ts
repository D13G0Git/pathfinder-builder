"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/supabase-provider"

export function useAuthGuard(redirectTo: string = "/login") {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Si ya terminó de cargar y no hay usuario, redirigir
    if (!isLoading && !user) {
      console.log("🛡️ [AuthGuard] Usuario no autenticado, redirigiendo a:", redirectTo)
      router.replace(redirectTo)
    }
  }, [user, isLoading, router, redirectTo])

  // Retornar el estado de autenticación
  return {
    user,
    isLoading,
    isAuthenticated: !!user && !isLoading
  }
} 