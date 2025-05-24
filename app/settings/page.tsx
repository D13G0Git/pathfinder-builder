"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [volume, setVolume] = useState(70)
  const [mounted, setMounted] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [email, setEmail] = useState("")
  const [user, setUser] = useState<any>(null)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Cargar información del usuario autenticado
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        
        if (error) throw error
        
        if (data?.user) {
          setUser(data.user)
          setEmail(data.user.email || "")
        } else {
          // Si no hay usuario autenticado, redirigir al login
          router.push("/login")
        }
      } catch (error: any) {
        console.error("Error al cargar el usuario:", error)
        toast.error("Error", {
          description: "No se pudo cargar la información del usuario"
        })
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [router])

  // Evitar hidration mismatch
  useEffect(() => {
    setMounted(true)
    // Cargar volumen desde localStorage si existe
    const savedVolume = localStorage.getItem("app-volume")
    if (savedVolume) {
      setVolume(parseInt(savedVolume))
    }
  }, [])

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    localStorage.setItem("app-volume", newVolume.toString())
  }

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Error", {
        description: "Las contraseñas no coinciden",
      })
      return
    }

    if (newPassword.length < 8) {
      toast.error("Error", {
        description: "La contraseña debe tener al menos 8 caracteres",
      })
      return
    }

    if (!currentPassword) {
      toast.error("Error", {
        description: "Por favor ingresa tu contraseña actual",
      })
      return
    }

    setIsChangingPassword(true)

    try {
      // Verificar la contraseña actual intentando hacer signin
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: currentPassword
      })

      if (signInError) {
        toast.error("Error", {
          description: "La contraseña actual es incorrecta",
        })
        return
      }

      // Actualizar la contraseña en Supabase
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (updateError) throw updateError

      toast.success("Contraseña actualizada", {
        description: "Tu contraseña ha sido cambiada exitosamente",
      })
      
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setIsPasswordDialogOpen(false)

    } catch (error: any) {
      console.error("Error al cambiar la contraseña:", error)
      toast.error("Error", {
        description: error.message || "No se pudo cambiar la contraseña"
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleEmailChange = async () => {
    try {
      // Aquí iría la lógica real de cambio de email con Supabase
      const { error } = await supabase.auth.updateUser({
        email: email
      })

      if (error) throw error

      toast.success("Email actualizado", {
        description: "Tu dirección de email ha sido actualizada. Revisa tu correo para confirmar el cambio.",
      })
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "No se pudo actualizar el email"
      })
    }
  }

  const handleDeleteAccount = () => {
    // Aquí iría la lógica real de eliminación de cuenta
    toast.error("Cuenta eliminada", {
      description: "Tu cuenta ha sido eliminada permanentemente",
    })
  }

  const handleSaveSettings = () => {
    toast.success("Ajustes guardados", {
      description: "Tus preferencias han sido actualizadas correctamente.",
    })
  }

  if (!mounted || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-muted-foreground">Cargando...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Ajustes</h1>
        <p className="text-muted-foreground">Personaliza tu experiencia de juego y gestiona tu cuenta.</p>
        {user && (
          <p className="text-sm text-muted-foreground mt-2">
            Sesión iniciada como: <span className="font-medium">{user.email}</span>
          </p>
        )}
      </div>

      <div className="grid gap-6">
        {/* Configuraciones Principales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="mr-2">⚙️</span>
              Configuración Principal
            </CardTitle>
            <CardDescription>Ajusta los elementos básicos de la aplicación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Cambio de Tema */}
            <div className="flex items-center justify-between">
              <Label htmlFor="theme-toggle" className="flex flex-col gap-1">
                <span className="font-medium">Tema Oscuro</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Alterna entre modo claro y oscuro
                </span>
              </Label>
              <Switch
                id="theme-toggle"
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>

            {/* Control de Volumen */}
            <div className="space-y-3">
              <Label htmlFor="volume" className="flex flex-col gap-1">
                <span className="font-medium">Volumen de la Aplicación</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Controla el volumen general de sonidos y música
                </span>
              </Label>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>🔇 Silencio</span>
                  <span className="font-medium">{volume}%</span>
                  <span>🔊 Alto</span>
                </div>
                <Slider
                  id="volume"
                  min={0}
                  max={100}
                  step={1}
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información de Cuenta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="mr-2">👤</span>
              Información de Cuenta
            </CardTitle>
            <CardDescription>Gestiona tu cuenta y seguridad</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Dirección de Email</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  placeholder="tu@email.com"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleEmailChange}
                  disabled={!email || email === user?.email}
                >
                  Cambiar
                </Button>
              </div>
              {email && email !== user?.email && (
                <p className="text-xs text-muted-foreground">
                  El cambio de email requiere confirmación por correo electrónico.
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <Label>Contraseña</Label>
              <div className="flex items-center gap-2">
                <div className="flex-1 text-sm text-muted-foreground">••••••••••••</div>
                <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Cambiar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cambiar Contraseña</DialogTitle>
                      <DialogDescription>
                        Ingresa tu contraseña actual y la nueva contraseña.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Contraseña Actual</Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          disabled={isChangingPassword}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Nueva Contraseña</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          disabled={isChangingPassword}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          disabled={isChangingPassword}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsPasswordDialogOpen(false)}
                          disabled={isChangingPassword}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          onClick={handlePasswordChange}
                          disabled={isChangingPassword}
                        >
                          {isChangingPassword ? "Actualizando..." : "Actualizar Contraseña"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Usuario */}
            <div className="space-y-2">
              <Label>Nombre de Usuario</Label>
              <div className="flex items-center gap-2">
                <div className="flex-1 text-sm text-muted-foreground">
                  {user?.user_metadata?.username || user?.email?.split('@')[0] || "Usuario"}
                </div>
                <Button variant="outline" size="sm" disabled>
                  <span className="mr-1">🔒</span>
                  Bloqueado
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                El nombre de usuario no se puede cambiar una vez establecido.
              </p>
            </div>

            {/* Zona Peligrosa */}
            <div className="pt-4 border-t">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-destructive">Zona Peligrosa</h4>
                <p className="text-xs text-muted-foreground">
                  Estas acciones son permanentes e irreversibles.
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <span className="mr-1">⚠️</span>
                      Eliminar Cuenta
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>¿Estás seguro?</DialogTitle>
                      <DialogDescription>
                        Esta acción eliminará permanentemente tu cuenta y todos tus personajes.
                        Esta acción no se puede deshacer.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">
                        Cancelar
                      </Button>
                      <Button variant="destructive" onClick={handleDeleteAccount}>
                        Sí, Eliminar Cuenta
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Próximamente */}
        <Card className="border-dashed border-2">
          <CardHeader>
            <CardTitle className="flex items-center text-muted-foreground">
              <span className="mr-2">🚧</span>
              Próximamente
            </CardTitle>
            <CardDescription>Más opciones de personalización en desarrollo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="text-lg">🎨</div>
                <div>
                  <div className="font-medium text-sm">Temas Personalizados</div>
                  <div className="text-xs text-muted-foreground">Elige entre diferentes paletas de colores</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="text-lg">🔤</div>
                <div>
                  <div className="font-medium text-sm">Tamaño de Fuente</div>
                  <div className="text-xs text-muted-foreground">Ajusta el tamaño del texto para mejor legibilidad</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="text-lg">🌐</div>
                <div>
                  <div className="font-medium text-sm">Idiomas</div>
                  <div className="text-xs text-muted-foreground">Soporte para múltiples idiomas</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="text-lg">🎮</div>
                <div>
                  <div className="font-medium text-sm">Configuración de Juego</div>
                  <div className="text-xs text-muted-foreground">Dificultad, efectos especiales y más</div>
                </div>
              </div>
            </div>
            
            <div className="pt-2 text-center">
              <p className="text-sm text-muted-foreground">
                Estamos trabajando constantemente para mejorar tu experiencia.
                <br />
                ¡Mantente atento a las actualizaciones!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Botón de Guardar */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSaveSettings}
            className="bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 dark:from-gray-100 dark:to-white dark:hover:from-gray-200 dark:hover:to-gray-100 text-white dark:text-black"
          >
            <span className="mr-2">💾</span>
            Guardar Ajustes
          </Button>
        </div>
      </div>
    </div>
  )
}
