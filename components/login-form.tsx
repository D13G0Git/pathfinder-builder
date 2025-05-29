"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield } from "lucide-react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LoginForm() {
  const [activeTab, setActiveTab] = useState("login")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loginEmail, setLoginEmail] = useState<string>('')
  const [loginPassword, setLoginPassword] = useState<string>('')
  const [registerEmail, setRegisterEmail] = useState<string>('')
  const [registerPassword, setRegisterPassword] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  
  // Usar el cliente correcto de Supabase para componentes
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Verificar si hay errores en la URL (del callback)
    const urlParams = new URLSearchParams(window.location.search)
    const urlError = urlParams.get('error')
    
    if (urlError) {
      let errorMessage = 'Error en la autenticación'
      
      switch (urlError) {
        case 'callback_error':
          errorMessage = 'Error en el proceso de autenticación. Intenta de nuevo.'
          break
        case 'access_denied':
          errorMessage = 'Acceso denegado. Verifica tus permisos.'
          break
        default:
          errorMessage = `Error: ${urlError}`
      }
      
      setError(errorMessage)
      
      // Limpiar la URL después de mostrar el error
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  // Función para iniciar sesión
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!loginEmail || !loginPassword) {
        throw new Error("Por favor, completa todos los campos")
      }
      
      // Iniciar sesión con email y contraseña
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      })

      if (error) {
        throw error
      }

      if (!data.user) {
        throw new Error("No se recibió información del usuario")
      }
      
      // Aguardar para que las cookies se establezcan
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Verificar sesión después del login
      const { data: sessionData } = await supabase.auth.getSession()
      
      if (sessionData.session) {
        // Forzar un refresh del router para que el middleware detecte la nueva sesión
        router.refresh()
        
        // Redirigir al dashboard
        setTimeout(() => {
          router.push("/dashboard")
        }, 500)
      } else {
        setError("No se pudo establecer la sesión. Intenta de nuevo.")
      }
      
    } catch (error: any) {
      let errorMessage = "Error al iniciar sesión"
      
      if (error.message) {
        errorMessage = error.message
      }
      
      // Mejorar mensajes de error para el usuario
      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Credenciales incorrectas. Verifica tu email y contraseña."
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage = "Por favor, confirma tu email antes de iniciar sesión."
      } else if (error.message?.includes("Too many requests")) {
        errorMessage = "Demasiados intentos. Intenta de nuevo más tarde."
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Función para registrar un nuevo usuario
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!registerEmail || !registerPassword) {
        throw new Error("Por favor, completa todos los campos")
      }

      if (registerPassword.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres")
      }
      
      // Registrar nuevo usuario con email y contraseña
      const { data, error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      })

      if (error) {
        throw error
      }
      
      // Mostrar mensaje de éxito
      setError("¡Registro exitoso! Revisa tu email para confirmar tu cuenta, luego inicia sesión.")
      setActiveTab("login")
      
    } catch (error: any) {
      let errorMessage = "Error al crear la cuenta"
      
      if (error.message?.includes("User already registered")) {
        errorMessage = "Este email ya está registrado. Intenta iniciar sesión."
      } else if (error.message?.includes("Password should be at least")) {
        errorMessage = "La contraseña debe tener al menos 6 caracteres."
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Cambiar entre pestañas (login/registro)
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setError(null)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Pathfinder Builder
          </CardTitle>
          <CardDescription className="text-center">
            Crea y administra tus personajes de Pathfinder
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>
            
            {error && (
              <Alert className="mt-4" variant={error.includes("exitoso") ? "default" : "destructive"}>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <TabsContent value="login" className="space-y-4 mt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Contraseña</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Tu contraseña"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4 mt-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Contraseña</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="text-center">
          <p className="text-sm text-muted-foreground">
            Al registrarte, aceptas nuestros términos de servicio
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
