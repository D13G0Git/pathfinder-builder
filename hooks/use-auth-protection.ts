"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/supabase-provider'
import { toast } from 'sonner'

export function useAuthProtection() {
  const { user, isLoading, error } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Si está cargando, esperar
    if (isLoading) return

    // Si hay un error crítico de autenticación, mostrar mensaje y redirigir
    if (error && error.name !== 'AuthSessionMissingError') {
      console.error('🔒 [Auth Protection] Error de autenticación:', error)
      toast.error("Error de autenticación", {
        description: "Ha ocurrido un problema con tu sesión. Por favor, inicia sesión nuevamente."
      })
      router.push('/login')
      return
    }

    // Si no hay usuario y ya terminó de cargar, redirigir al login
    if (!user && !isLoading) {
      console.log('🔒 [Auth Protection] Usuario no autenticado, redirigiendo al login')
      toast.info("Acceso denegado", {
        description: "Necesitas iniciar sesión para acceder a esta página."
      })
      router.push('/login')
      return
    }

    // Si hay usuario, está todo bien
    if (user) {
      console.log('🔒 [Auth Protection] Usuario autenticado:', user.email)
    }
  }, [user, isLoading, error, router])

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user && !isLoading
  }
} 