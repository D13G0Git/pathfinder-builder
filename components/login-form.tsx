"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, Sparkles } from "lucide-react"
import { supabase } from '@/lib/supabase'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LoginForm() {
  const [activeTab, setActiveTab] = useState("login")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loginEmail, setLoginEmail] = useState<string>('')
  const [loginPassword, setLoginPassword] = useState<string>('')
  const [registerEmail, setRegisterEmail] = useState<string>('')
  const [registerPassword, setRegisterPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlError = urlParams.get('error')
    
    if (urlError) {
      let errorMessage = 'Error en la autenticación'
      
      switch (urlError) {
        case 'callback_error':
          errorMessage = 'Error en el proceso de autenticación. Intenta de nuevo.'
          break
        case 'invalid_callback':
          errorMessage = 'Callback de autenticación inválido. Por favor, inicia sesión de nuevo.'
          break
        case 'access_denied':
          errorMessage = 'Acceso denegado. Verifica tus permisos.'
          break
        default:
          errorMessage = `Error: ${urlError}`
      }
      
      setError(errorMessage)
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Timeout de seguridad para evitar estados de carga infinita
    const timeoutId = setTimeout(() => {
      console.warn("⚠️ [Login] Timeout de autenticación - reseteando estado")
      setIsLoading(false)
      setError("La autenticación está tomando demasiado tiempo. Intenta de nuevo.")
    }, 10000) // 10 segundos

    try {
      if (!loginEmail || !loginPassword) {
        throw new Error("Por favor, completa todos los campos")
      }
      
      console.log("🔐 [Login] Iniciando autenticación...")
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      })

      if (error) throw error
      if (!data.user) throw new Error("No se recibió información del usuario")
      
      console.log("✅ [Login] Autenticación exitosa para:", data.user.email)
      
      // Verificar inmediatamente que la sesión esté activa
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !sessionData.session) {
        console.error("❌ [Login] Error verificando sesión:", sessionError)
        throw new Error("No se pudo establecer la sesión. Intenta de nuevo.")
      }
      
      console.log("🔗 [Login] Sesión verificada exitosamente")
      
      // Limpiar el timeout ya que la autenticación fue exitosa
      clearTimeout(timeoutId)
      
      console.log("🏠 [Login] Redirigiendo al dashboard...")
      
      // Dar un momento para que las cookies se establezcan en el navegador
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Resetear el estado de loading antes de la redirección
      setIsLoading(false)
      
      // Forzar actualización del middleware y redireccionar
      window.location.href = '/dashboard'
      
    } catch (error: any) {
      // Limpiar el timeout en caso de error
      clearTimeout(timeoutId)
      
      let errorMessage = "Error al iniciar sesión"
      
      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Credenciales incorrectas. Verifica tu email y contraseña."
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage = "Por favor, confirma tu email antes de iniciar sesión."
      } else if (error.message?.includes("Too many requests")) {
        errorMessage = "Demasiados intentos. Intenta de nuevo más tarde."
      } else if (error.message) {
        errorMessage = error.message
      }
      
      console.error("❌ [Login] Error de autenticación:", error)
      setError(errorMessage)
      setIsLoading(false)
    }
  }

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
      
      const { data, error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      })

      if (error) throw error
      
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

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setError(null)
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in-50 duration-500">
      {/* Header elegante */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center shadow-lg">
          <Shield className="h-10 w-10 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Pathfinder Builder
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Tu portal hacia aventuras épicas
          </p>
        </div>
      </div>

      {/* Card principal con glassmorphism */}
      <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
        <CardContent className="p-8">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
              <TabsTrigger 
                value="login" 
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Iniciar Sesión</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="register"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Registrarse</span>
                </div>
              </TabsTrigger>
            </TabsList>
            
            {error && (
              <Alert 
                className={`border-0 ${
                  error.includes("exitoso") 
                    ? "bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300" 
                    : "bg-gray-100 dark:bg-gray-800/20 text-gray-800 dark:text-gray-200"
                } animate-in slide-in-from-top-2 duration-300`}
              >
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            )}
            
            <TabsContent value="login" className="space-y-0">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Correo electrónico
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-gray-600 dark:group-focus-within:text-gray-300 transition-colors" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="tu@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        disabled={isLoading}
                        className="pl-11 h-12 border-gray-200 dark:border-gray-700 focus:border-gray-600 dark:focus:border-gray-400 transition-colors rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Contraseña
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-gray-600 dark:group-focus-within:text-gray-300 transition-colors" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Tu contraseña"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        disabled={isLoading}
                        className="pl-11 pr-11 h-12 border-gray-200 dark:border-gray-700 focus:border-gray-600 dark:focus:border-gray-400 transition-colors rounded-lg"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-gray-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Iniciando sesión...</span>
                    </div>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-0">
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Correo electrónico
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-gray-600 dark:group-focus-within:text-gray-300 transition-colors" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="tu@email.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        disabled={isLoading}
                        className="pl-11 h-12 border-gray-200 dark:border-gray-700 focus:border-gray-600 dark:focus:border-gray-400 transition-colors rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Contraseña
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-gray-600 dark:group-focus-within:text-gray-300 transition-colors" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mínimo 6 caracteres"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        disabled={isLoading}
                        className="pl-11 pr-11 h-12 border-gray-200 dark:border-gray-700 focus:border-gray-600 dark:focus:border-gray-400 transition-colors rounded-lg"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Creando cuenta...</span>
                    </div>
                  ) : (
                    "Crear Cuenta"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Footer elegante */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Al registrarte, aceptas nuestros términos de servicio</p>
        <p className="mt-1">© 2024 Pathfinder Adventure. Todos los derechos reservados.</p>
      </div>
    </div>
  )
}
